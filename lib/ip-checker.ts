/**
 * IP Checker utility for Tourplan booking engine
 * Helps verify that the correct whitelisted IP is being used
 */

export interface IPCheckResult {
  success: boolean
  currentIP: string
  expectedIP: string
  isWhitelisted: boolean
  isEC2: boolean
  localIP: string
  ec2Info?: {
    instanceId: string
    publicIP: string
    region: string
    availabilityZone: string
  }
  error?: string
}

export const WHITELISTED_IP = "13.210.224.119"
export const LOCAL_IP = "110.175.119.93"

export async function checkCurrentIP(): Promise<IPCheckResult> {
  try {
    // Try multiple IP checking services
    const ipSources = [
      "https://api.ipify.org",
      "https://httpbin.org/ip",
      "https://icanhazip.com",
      "https://ipinfo.io/ip",
    ]

    let currentIP = ""
    let isEC2 = false
    let ec2Info = undefined

    // Try external IP services
    for (const source of ipSources) {
      try {
        const response = await fetch(source, {
          signal: AbortSignal.timeout(5000),
        })

        if (source.includes("httpbin")) {
          const data = await response.json()
          currentIP = data.origin.split(",")[0].trim() // Handle multiple IPs
        } else {
          currentIP = (await response.text()).trim()
        }

        if (currentIP && currentIP.match(/^\d+\.\d+\.\d+\.\d+$/)) {
          break
        }
      } catch (error) {
        console.warn(`Failed to get IP from ${source}:`, error)
        continue
      }
    }

    // Try EC2 metadata if available (only works from within EC2)
    try {
      const metadataResponse = await fetch("http://169.254.169.254/latest/meta-data/public-ipv4", {
        signal: AbortSignal.timeout(2000),
      })

      if (metadataResponse.ok) {
        const ec2IP = await metadataResponse.text()
        isEC2 = true

        // Get additional EC2 info
        const [instanceId, region, az] = await Promise.all([
          fetch("http://169.254.169.254/latest/meta-data/instance-id", { signal: AbortSignal.timeout(2000) })
            .then((r) => r.text())
            .catch(() => "unknown"),
          fetch("http://169.254.169.254/latest/meta-data/placement/region", { signal: AbortSignal.timeout(2000) })
            .then((r) => r.text())
            .catch(() => "unknown"),
          fetch("http://169.254.169.254/latest/meta-data/placement/availability-zone", {
            signal: AbortSignal.timeout(2000),
          })
            .then((r) => r.text())
            .catch(() => "unknown"),
        ])

        ec2Info = {
          instanceId,
          publicIP: ec2IP,
          region,
          availabilityZone: az,
        }

        // Use EC2 IP as the authoritative source
        if (ec2IP && ec2IP.match(/^\d+\.\d+\.\d+\.\d+$/)) {
          currentIP = ec2IP
        }
      }
    } catch (error) {
      // Not on EC2 or metadata not accessible
      console.log("Not running on EC2 or metadata not accessible")
    }

    if (!currentIP) {
      return {
        success: false,
        currentIP: "",
        expectedIP: WHITELISTED_IP,
        localIP: LOCAL_IP,
        isWhitelisted: false,
        isEC2,
        error: "Could not determine current IP address",
      }
    }

    const isWhitelisted = currentIP === WHITELISTED_IP

    return {
      success: true,
      currentIP,
      expectedIP: WHITELISTED_IP,
      localIP: LOCAL_IP,
      isWhitelisted,
      isEC2,
      ec2Info,
    }
  } catch (error) {
    return {
      success: false,
      currentIP: "",
      expectedIP: WHITELISTED_IP,
      localIP: LOCAL_IP,
      isWhitelisted: false,
      isEC2: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function testTourplanConnection(): Promise<{
  success: boolean
  authenticated: boolean
  error?: string
  responseTime?: number
  ipUsed?: string
}> {
  const TOURPLAN_API_URL =
    process.env.TOURPLAN_API_URL || "https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi"
  const AGENT_ID = process.env.TOURPLAN_AGENT_ID || "SAMAGT"
  const PASSWORD = process.env.TOURPLAN_PASSWORD || "S@MAgt01"

  const xmlRequest = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
    <AgentInfoRequest>
        <AgentID>${AGENT_ID}</AgentID>
        <Password>${PASSWORD}</Password>
        <ReturnAccountInfo>Y</ReturnAccountInfo>
    </AgentInfoRequest>
</Request>`

  try {
    const startTime = Date.now()

    const response = await fetch(TOURPLAN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/xml",
        Accept: "application/xml",
        "User-Agent": "Tourplan-Booking-Engine/1.0",
      },
      body: xmlRequest,
      signal: AbortSignal.timeout(30000),
    })

    const responseTime = Date.now() - startTime
    const responseText = await response.text()

    // Try to determine which IP was used for the request
    const ipCheck = await checkCurrentIP()
    const ipUsed = ipCheck.success ? ipCheck.currentIP : "unknown"

    if (!response.ok) {
      return {
        success: false,
        authenticated: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        responseTime,
        ipUsed,
      }
    }

    if (responseText.includes("<ErrorReply>")) {
      const errorMatch = responseText.match(/<Error>(.*?)<\/Error>/)
      const errorMsg = errorMatch ? errorMatch[1] : "Unknown error"

      // Check for IP whitelist errors
      if (errorMsg.includes("IP") || errorMsg.includes("whitelist") || errorMsg.includes("access")) {
        return {
          success: true,
          authenticated: false,
          error: `IP Whitelist Error: ${errorMsg} (Your IP: ${ipUsed})`,
          responseTime,
          ipUsed,
        }
      }

      return {
        success: true,
        authenticated: false,
        error: errorMsg,
        responseTime,
        ipUsed,
      }
    }

    if (responseText.includes("<AgentInfoReply>")) {
      return {
        success: true,
        authenticated: true,
        responseTime,
        ipUsed,
      }
    }

    return {
      success: true,
      authenticated: false,
      error: "Unexpected response format",
      responseTime,
      ipUsed,
    }
  } catch (error) {
    const ipCheck = await checkCurrentIP()
    const ipUsed = ipCheck.success ? ipCheck.currentIP : "unknown"

    return {
      success: false,
      authenticated: false,
      error: error instanceof Error ? error.message : "Unknown error",
      ipUsed,
    }
  }
}

export function getIPRecommendations(ipCheck: IPCheckResult): string[] {
  const recommendations: string[] = []

  if (!ipCheck.success) {
    recommendations.push("❌ Fix network connectivity to determine current IP")
    return recommendations
  }

  if (!ipCheck.isWhitelisted) {
    recommendations.push(`❌ Current IP (${ipCheck.currentIP}) does not match whitelisted IP (${ipCheck.expectedIP})`)

    if (ipCheck.isEC2) {
      recommendations.push(`🔧 Associate Elastic IP ${ipCheck.expectedIP} with this EC2 instance`)
      recommendations.push("🔧 Check AWS Console → EC2 → Elastic IPs")
      recommendations.push(`🔧 Run: bash scripts/associate-elastic-ip.sh`)
    } else if (ipCheck.currentIP === ipCheck.localIP) {
      recommendations.push("🏠 You're connecting from your local machine")
      recommendations.push(`🔧 SSH into your EC2 instance with IP ${ipCheck.expectedIP}`)
      recommendations.push(`🔧 Update security group to allow SSH from ${ipCheck.localIP}`)
    } else {
      recommendations.push(`🔧 Contact Tourplan to whitelist your current IP: ${ipCheck.currentIP}`)
    }
  } else {
    recommendations.push("✅ IP is correctly whitelisted!")
  }

  // Add SSH recommendations if needed
  if (ipCheck.currentIP === ipCheck.localIP) {
    recommendations.push(`🔐 To SSH to your EC2 instance: ssh -i your-key.pem ubuntu@${ipCheck.expectedIP}`)
    recommendations.push(`🔐 Make sure security group allows SSH from ${ipCheck.localIP}`)
  }

  return recommendations
}

export function getConnectionInstructions(ipCheck: IPCheckResult): {
  title: string
  instructions: string[]
  commands: string[]
} {
  if (ipCheck.currentIP === ipCheck.localIP) {
    // User is on local machine
    return {
      title: "Connect to your EC2 instance",
      instructions: [
        "You're currently on your local machine",
        `Your local IP (${ipCheck.localIP}) is different from the whitelisted IP (${ipCheck.expectedIP})`,
        "You need to SSH into your EC2 instance to use the Tourplan API",
      ],
      commands: [
        `# Add your local IP to EC2 security group`,
        `bash scripts/setup-ec2-security-group.sh`,
        ``,
        `# Connect to your EC2 instance`,
        `ssh -i ~/.ssh/your-key.pem ubuntu@${ipCheck.expectedIP}`,
        ``,
        `# Or use the connection helper`,
        `bash scripts/connect-to-ec2.sh`,
      ],
    }
  } else if (ipCheck.isEC2 && !ipCheck.isWhitelisted) {
    // User is on EC2 but wrong IP
    return {
      title: "Associate the whitelisted IP",
      instructions: [
        "You're on an EC2 instance but it doesn't have the whitelisted IP",
        `Current IP: ${ipCheck.currentIP}`,
        `Required IP: ${ipCheck.expectedIP}`,
        "You need to associate the Elastic IP with this instance",
      ],
      commands: [
        `# Associate the whitelisted Elastic IP`,
        `bash scripts/associate-elastic-ip.sh`,
        ``,
        `# Verify the association`,
        `curl https://api.ipify.org`,
      ],
    }
  } else if (ipCheck.isEC2 && ipCheck.isWhitelisted) {
    // Perfect setup
    return {
      title: "Ready to use Tourplan API",
      instructions: [
        "✅ You're on the correct EC2 instance with the whitelisted IP",
        "✅ Ready to make Tourplan API calls",
      ],
      commands: [
        `# Test the Tourplan connection`,
        `curl -X GET http://localhost:3000/api/check-ip-status`,
        ``,
        `# Start the application`,
        `npm run dev`,
      ],
    }
  } else {
    // Unknown situation
    return {
      title: "Check your setup",
      instructions: ["Unable to determine your current setup", "Please check your network configuration"],
      commands: [
        `# Check your current IP`,
        `curl https://api.ipify.org`,
        ``,
        `# Run the IP status check`,
        `curl -X GET http://localhost:3000/api/check-ip-status`,
      ],
    }
  }
}
