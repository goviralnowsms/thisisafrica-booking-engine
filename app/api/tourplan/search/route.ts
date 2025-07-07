import { NextResponse } from "next/server"
import { TourplanAPI } from "@/lib/tourplan-api"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { destination, startDate, endDate, adults = 2, children = 0 } = body

    const tourplanAPI = new TourplanAPI()

    // Test search with real parameters
    const searchResult = await tourplanAPI.searchTours({
      destination: destination || "Cape Town",
      startDate: startDate || "2025-08-01",
      endDate: endDate || "2025-08-07",
      adults,
      children,
      serviceType: "Tour",
    })

    return NextResponse.json({
      success: true,
      message: "Tourplan search completed",
      search: {
        success: searchResult.success,
        error: searchResult.error,
        data: searchResult.data,
        rawResponse: searchResult.rawResponse,
      },
      request: {
        destination,
        startDate,
        endDate,
        adults,
        children,
      },
    })
  } catch (error) {
    console.error("Tourplan search failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Tourplan search failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
} 