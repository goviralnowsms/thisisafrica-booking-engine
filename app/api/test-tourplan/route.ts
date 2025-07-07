import { NextResponse } from "next/server"
import { TourplanAPI } from "@/lib/tourplan-api"

export const runtime = "nodejs"

export async function GET() {
  try {
    console.log("Testing Tourplan API integration...")

    const tourplanAPI = new TourplanAPI()

    // Test search
    const searchResult = await tourplanAPI.searchTours({
      destination: "Serengeti",
      startDate: "2025-08-01",
      endDate: "2025-08-07",
      adults: 2,
      children: 0,
    })

    // Test option info
    const optionResult = await tourplanAPI.getOptionInfo("MOCK001")

    return NextResponse.json({
      success: true,
      message: "Tourplan API test completed",
      results: {
        search: {
          success: searchResult.success,
          error: searchResult.error,
          data: searchResult.data,
        },
        option_info: {
          success: optionResult.success,
          error: optionResult.error,
          data: optionResult.data,
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
