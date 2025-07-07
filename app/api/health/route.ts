import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "1.0.0",
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024),
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
      },
      services: {
        database: await checkDatabase(),
        tourplan: await checkTourplan(),
        stripe: await checkStripe(),
        email: await checkEmail(),
      },
      system: await checkSystem(),
    }

    // Determine overall health status
    const serviceStatuses = Object.values(health.services).map((service: any) => service.status)
    const hasUnhealthy = serviceStatuses.includes("unhealthy")
    const hasWarnings = serviceStatuses.includes("warning")

    if (hasUnhealthy) {
      health.status = "unhealthy"
    } else if (hasWarnings) {
      health.status = "degraded"
    }

    return NextResponse.json(health, {
      status: health.status === "healthy" ? 200 : 503,
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

async function checkDatabase() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
    const neonUrl = process.env.NEON_NEON_NEON_DATABASE_URL

    if (!supabaseUrl && !neonUrl) {
      return {
        status: "warning",
        message: "No database configuration found",
        configured: false,
      }
    }

    const dbInfo = {
      supabase: !!supabaseUrl,
      neon: !!neonUrl,
    }

    return {
      status: "healthy",
      message: "Database configuration present",
      configured: true,
      databases: dbInfo,
    }
  } catch (error) {
    return {
      status: "unhealthy",
      message: error instanceof Error ? error.message : "Database check failed",
      configured: false,
    }
  }
}

async function checkTourplan() {
  try {
    const requiredVars = ["TOURPLAN_API_URL", "TOURPLAN_USERNAME", "TOURPLAN_PASSWORD", "TOURPLAN_AGENT_ID"]
    const presentVars = requiredVars.filter((varName) => !!process.env[varName])
    const missingVars = requiredVars.filter((varName) => !process.env[varName])

    if (missingVars.length > 0) {
      return {
        status: "warning",
        message: `Tourplan configuration incomplete: missing ${missingVars.join(", ")}`,
        configured: false,
        present: presentVars,
        missing: missingVars,
      }
    }

    return {
      status: "healthy",
      message: "Tourplan configuration complete",
      configured: true,
      present: presentVars,
      proxy: {
        enabled: process.env.USE_TOURPLAN_PROXY === "true",
        url: process.env.TOURPLAN_PROXY_URL || null,
      },
    }
  } catch (error) {
    return {
      status: "unhealthy",
      message: error instanceof Error ? error.message : "Tourplan check failed",
      configured: false,
    }
  }
}

async function checkStripe() {
  try {
    const hasSecretKey = !!process.env.STRIPE_SECRET_KEY
    const hasPublishableKey = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

    if (!hasSecretKey && !hasPublishableKey) {
      return {
        status: "warning",
        message: "Stripe not configured",
        configured: false,
      }
    }

    if (!hasSecretKey || !hasPublishableKey) {
      return {
        status: "warning",
        message: "Stripe configuration incomplete",
        configured: false,
        secretKey: hasSecretKey,
        publishableKey: hasPublishableKey,
      }
    }

    return {
      status: "healthy",
      message: "Stripe configuration complete",
      configured: true,
    }
  } catch (error) {
    return {
      status: "unhealthy",
      message: error instanceof Error ? error.message : "Stripe check failed",
      configured: false,
    }
  }
}

async function checkEmail() {
  try {
    const hasResendKey = !!process.env.RESEND_API_KEY
    const hasEmailFrom = !!process.env.EMAIL_FROM

    const hasSmtpConfig = !!(
      process.env.EMAIL_HOST &&
      process.env.EMAIL_PORT &&
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASSWORD
    )

    if (!hasResendKey && !hasSmtpConfig) {
      return {
        status: "warning",
        message: "Email not configured",
        configured: false,
      }
    }

    const emailConfig = {
      resend: hasResendKey,
      smtp: hasSmtpConfig,
      fromAddress: hasEmailFrom,
    }

    return {
      status: "healthy",
      message: "Email configuration present",
      configured: true,
      config: emailConfig,
    }
  } catch (error) {
    return {
      status: "unhealthy",
      message: error instanceof Error ? error.message : "Email check failed",
      configured: false,
    }
  }
}

async function checkSystem() {
  try {
    let ec2Info = null
    try {
      const instanceId = await fetch("http://169.254.169.254/latest/meta-data/instance-id", {
        signal: AbortSignal.timeout(2000),
      }).then((res) => res.text())

      const publicIp = await fetch("http://169.254.169.254/latest/meta-data/public-ipv4", {
        signal: AbortSignal.timeout(2000),
      }).then((res) => res.text())

      const availabilityZone = await fetch("http://169.254.169.254/latest/meta-data/placement/availability-zone", {
        signal: AbortSignal.timeout(2000),
      }).then((res) => res.text())

      const instanceType = await fetch("http://169.254.169.254/latest/meta-data/instance-type", {
        signal: AbortSignal.timeout(2000),
      }).then((res) => res.text())

      ec2Info = {
        instanceId,
        publicIp,
        availabilityZone,
        instanceType,
        isEC2: true,
      }
    } catch (error) {
      ec2Info = { isEC2: false }
    }

    return {
      status: "healthy",
      platform: process.platform,
      nodeVersion: process.version,
      architecture: process.arch,
      ec2: ec2Info,
    }
  } catch (error) {
    return {
      status: "warning",
      message: error instanceof Error ? error.message : "System check failed",
    }
  }
}
