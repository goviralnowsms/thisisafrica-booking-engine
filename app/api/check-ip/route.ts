import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get client IP from various headers
    const forwarded = request.headers.get("x-forwarded-for")
    const realIp = request.headers.get("x-real-ip")
    const clientIp = forwarded?.split(",")[0] || realIp || "unknown"

    // Get server IP (EC2 instance IP)
    let serverIp = "unknown"
    let ec2Info = null

    try {
      const publicIpResponse = await fetch("http://169.254.169.254/latest/meta-data/public-ipv4", {
        signal: AbortSignal.timeout(2000),
      })

      if (publicIpResponse.ok) {
        serverIp = await publicIpResponse.text()
      }

      // Get additional EC2 metadata
      const instanceId = await fetch("http://169.254.169.254/latest/meta-data/instance-id", {
        signal: AbortSignal.timeout(2000),
      }).then((res) => res.text())

      const region = await fetch("http://169.254.169.254/latest/meta-data/placement/region", {
        signal: AbortSignal.timeout(2000),
      }).then((res) => res.text())

      const availabilityZone = await fetch("http://169.254.169.254/latest/meta-data/placement/availability-zone", {
        signal: AbortSignal.timeout(2000),
      }).then((res) => res.text())

      ec2Info = {
        instanceId,
        publicIp: serverIp,
        region,
        availabilityZone,
        isEC2: true,
      }
    } catch (error) {
      console.log("Could not fetch EC2 metadata:", error)
      ec2Info = { isEC2: false }
    }

    const ipInfo = {
      success: true,
      client_ip: clientIp,
      server_ip: serverIp,
      ec2_info: ec2Info,
      headers: {
        "x-forwarded-for": request.headers.get("x-forwarded-for"),
        "x-real-ip": request.headers.get("x-real-ip"),
        "user-agent": request.headers.get("user-agent"),
        host: request.headers.get("host"),
      },
      timestamp: new Date().toISOString(),
      recommendation: ec2Info?.isEC2
        ? `Whitelist this IP with Tourplan: ${serverIp}`
        : `Server IP for whitelisting: ${serverIp}`,
    }

    return NextResponse.json(ipInfo, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get IP information",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
