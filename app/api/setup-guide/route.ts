import { NextResponse } from "next/server"
import { checkCurrentIP, getConnectionInstructions } from "@/lib/ip-checker"

export async function GET() {
  try {
    const ipCheck = await checkCurrentIP()
    const instructions = getConnectionInstructions(ipCheck)

    const setupGuide = {
      current_situation: {
        your_ip: ipCheck.currentIP,
        local_ip: ipCheck.localIP,
        whitelisted_ip: ipCheck.expectedIP,
        location: ipCheck.currentIP === ipCheck.localIP ? "local" : ipCheck.isEC2 ? "ec2" : "unknown",
        is_ready: ipCheck.isWhitelisted,
      },
      next_steps: instructions,
      scripts_available: [
        {
          name: "setup-ec2-security-group.sh",
          description: "Add your local IP to EC2 security group for SSH access",
          usage: "bash scripts/setup-ec2-security-group.sh",
        },
        {
          name: "connect-to-ec2.sh",
          description: "Helper to connect to your EC2 instance",
          usage: "bash scripts/connect-to-ec2.sh",
        },
        {
          name: "associate-elastic-ip.sh",
          description: "Associate the whitelisted IP with your EC2 instance",
          usage: "bash scripts/associate-elastic-ip.sh",
        },
      ],
      troubleshooting: {
        ssh_issues: [
          "Check that your key file has correct permissions: chmod 400 ~/.ssh/your-key.pem",
          "Verify your local IP is in the security group",
          "Make sure the instance is running",
        ],
        ip_issues: [
          "Verify the Elastic IP exists in AWS Console",
          "Check if the IP is associated with another instance",
          "Ensure you're in the correct AWS region",
        ],
        api_issues: [
          "Confirm you're making API calls from the whitelisted IP",
          "Check Tourplan credentials in environment variables",
          "Verify network connectivity to Tourplan servers",
        ],
      },
    }

    return NextResponse.json(setupGuide)
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to generate setup guide",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
