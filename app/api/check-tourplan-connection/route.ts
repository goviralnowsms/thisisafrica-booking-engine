import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const tourplanConfig = {
      apiUrl: process.env.TOURPLAN_API_URL,
      username: process.env.TOURPLAN_USERNAME,
      password: process.env.TOURPLAN_PASSWORD,
      agentId: process.env.TOURPLAN_AGENT_ID,
      proxyUrl: process.env.TOURPLAN_PROXY_URL,
      useProxy: process.env.USE_TOURPLAN_PROXY === "true",
    }

    // Check if required environment variables are present
    const requiredVars = ["TOURPLAN_API_URL", "TOURPLAN_USERNAME", "TOURPLAN_PASSWORD", "TOURPLAN_AGENT_ID"]
    const missingVars = requiredVars.filter((varName) => !process.env[varName])

    if (missingVars.length > 0) {
      return NextResponse.json(
        {
          success: false,
          status: "error",
          message: `Missing required environment variables: ${missingVars.join(", ")}`,
          config: {
            ...tourplanConfig,
            password: process.env.TOURPLAN_PASSWORD ? "[CONFIGURED]" : "[MISSING]",
          },
          missingVars,
        },
        { status: 400 },
      )
    }

    // Test basic connectivity (without making actual API call)
    const connectionTest = {
      success: true,
      status: "configured",
      message: "Tourplan configuration is present",
      config: {
        ...tourplanConfig,
        password: "[CONFIGURED]",
      },
      timestamp: new Date().toISOString(),
    }

    // Optionally test actual connection if requested
    const testConnection = request.nextUrl.searchParams.get("test") === "true"
    if (testConnection) {
      try {
        const targetUrl =
          tourplanConfig.useProxy && tourplanConfig.proxyUrl ? tourplanConfig.proxyUrl : tourplanConfig.apiUrl

        // Simple connectivity test to the API URL
        const response = await fetch(targetUrl!, {
          method: "HEAD",
          signal: AbortSignal.timeout(10000),
        })

        connectionTest.connectivity = {
          reachable: true,
          status: response.status,
          statusText: response.statusText,
          url: targetUrl,
        }
      } catch (error) {
        connectionTest.connectivity = {
          reachable: false,
          error: error instanceof Error ? error.message : "Unknown error",
          url: tourplanConfig.useProxy && tourplanConfig.proxyUrl ? tourplanConfig.proxyUrl : tourplanConfig.apiUrl,
        }
      }
    }

    return NextResponse.json(connectionTest)
  } catch (error) {
    console.error("Tourplan connection check failed:", error)
    return NextResponse.json(
      {
        success: false,
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
