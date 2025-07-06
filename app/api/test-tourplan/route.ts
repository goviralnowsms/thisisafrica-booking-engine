import { NextResponse } from "next/server"
import { searchTours, getOptionInfo } from "@/lib/tourplan-api"

export const runtime = "nodejs"

export async function GET() {
  try {
    console.log("Testing Tourplan API integration...")

    // Test search
    const searchResult = await searchTours({
      country: "Tanzania",
      destination: "Serengeti",
      tourLevel: "Moderate",
    })

    // Test option info
    const optionResult = await getOptionInfo("MOCK001")

    return NextResponse.json({
      success: true,
      message: "Tourplan API test completed",
      results: {
        search: {
          tours_found: searchResult.length,
          sample_tour: searchResult[0]?.name || "None",
        },
        option_info: {
          tour_name: optionResult?.name || "None",
          tour_id: optionResult?.id || "None",
        },
      },
      environment: {
        proxy_enabled: process.env.USE_TOURPLAN_PROXY === "true",
        proxy_url: process.env.TOURPLAN_PROXY_URL ? "Configured" : "Missing",
        api_url: process.env.TOURPLAN_API_URL ? "Configured" : "Missing",
      },
    })
  } catch (error) {
    console.error("Tourplan API test failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Tourplan API test failed",
        message: error instanceof Error ? error.message : "Unknown error",
        environment: {
          proxy_enabled: process.env.USE_TOURPLAN_PROXY === "true",
          proxy_url: process.env.TOURPLAN_PROXY_URL ? "Configured" : "Missing",
          api_url: process.env.TOURPLAN_API_URL ? "Configured" : "Missing",
        },
      },
      { status: 500 },
    )
  }
}
