import { type NextRequest, NextResponse } from "next/server"
import * as TourPlanAPI from "@/lib/tourplan-api"

/**
 * API route for searching tours
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const destination = searchParams.get("destination") || undefined
  const startDate = searchParams.get("startDate") || undefined
  const endDate = searchParams.get("endDate") || undefined
  const travelers = searchParams.get("travelers") ? Number.parseInt(searchParams.get("travelers")!) : undefined

  try {
    const result = await TourPlanAPI.searchTours({
      destination,
      startDate,
      endDate,
      travelers,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("API error searching tours:", error)
    return NextResponse.json({ success: false, error: "Failed to search tours" }, { status: 500 })
  }
}

/**
 * API route for creating a booking
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.customer || !body.itinerary) {
      return NextResponse.json({ success: false, error: "Missing required booking information" }, { status: 400 })
    }

    const result = await TourPlanAPI.createBooking(body)

    return NextResponse.json(result)
  } catch (error) {
    console.error("API error creating booking:", error)
    return NextResponse.json({ success: false, error: "Failed to create booking" }, { status: 500 })
  }
}
