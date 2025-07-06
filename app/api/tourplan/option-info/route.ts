import { type NextRequest, NextResponse } from "next/server"
import { getOptionInfo } from "@/lib/tourplan-api"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const { tourId } = await request.json()

    if (!tourId) {
      return NextResponse.json(
        {
          success: false,
          error: "Tour ID is required",
        },
        { status: 400 },
      )
    }

    const tourInfo = await getOptionInfo(tourId)

    return NextResponse.json({
      success: true,
      tour: tourInfo,
    })
  } catch (error) {
    console.error("Option info API error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to get tour information",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Option info API is running",
    endpoint: "POST /api/tourplan/option-info",
  })
}
