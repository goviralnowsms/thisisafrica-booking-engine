import { type NextRequest, NextResponse } from "next/server"
import {
  checkCurrentIP,
  testTourplanConnection,
  getIPRecommendations,
  getConnectionInstructions,
} from "@/lib/ip-checker"

export async function GET(request: NextRequest) {
  try {
    console.log("Checking IP status...")

    // Check current IP
    const ipCheck = await checkCurrentIP()
    console.log("IP Check result:", ipCheck)

    // Test Tourplan connection
    const tourplanTest = await testTourplanConnection()
    console.log("Tourplan test result:", tourplanTest)

    // Get recommendations
    const recommendations = getIPRecommendations(ipCheck)
    const connectionInstructions = getConnectionInstructions(ipCheck)

    const result = {
      timestamp: new Date().toISOString(),
      ip_check: ipCheck,
      tourplan_test: tourplanTest,
      recommendations,
      connection_instructions: connectionInstructions,
      status: ipCheck.isWhitelisted && tourplanTest.authenticated ? "ready" : "needs_attention",
      summary: {
        current_ip: ipCheck.currentIP,
        expected_ip: ipCheck.expectedIP,
        local_ip: ipCheck.localIP,
        is_whitelisted: ipCheck.isWhitelisted,
        tourplan_working: tourplanTest.authenticated,
        is_ec2: ipCheck.isEC2,
        location: ipCheck.currentIP === ipCheck.localIP ? "local" : ipCheck.isEC2 ? "ec2" : "unknown",
      },
    }

    return NextResponse.json(result, {
      status: result.status === "ready" ? 200 : 206,
    })
  } catch (error) {
    console.error("IP status check failed:", error)

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        error: "Failed to check IP status",
        details: error instanceof Error ? error.message : "Unknown error",
        status: "error",
      },
      { status: 500 },
    )
  }
}
