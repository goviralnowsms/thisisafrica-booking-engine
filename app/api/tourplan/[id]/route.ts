import { type NextRequest, NextResponse } from "next/server"
import * as TourPlanAPI from "@/lib/tourplan-api"

/**
 * API route for getting a specific booking
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bookingId = params.id
    const result = await TourPlanAPI.getBooking(bookingId)

    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("API error getting booking:", error)
    return NextResponse.json({ success: false, error: "Failed to get booking details" }, { status: 500 })
  }
}

/**
 * API route for updating a booking
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bookingId = params.id
    const body = await request.json()

    const result = await TourPlanAPI.updateBooking(bookingId, body)

    return NextResponse.json(result)
  } catch (error) {
    console.error("API error updating booking:", error)
    return NextResponse.json({ success: false, error: "Failed to update booking" }, { status: 500 })
  }
}

/**
 * API route for cancelling a booking
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bookingId = params.id
    const { reason } = await request.json()

    const result = await TourPlanAPI.cancelBooking(bookingId, reason || "No reason provided")

    return NextResponse.json(result)
  } catch (error) {
    console.error("API error cancelling booking:", error)
    return NextResponse.json({ success: false, error: "Failed to cancel booking" }, { status: 500 })
  }
}
