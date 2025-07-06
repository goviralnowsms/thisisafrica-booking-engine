import { type NextRequest, NextResponse } from "next/server"
import { stripeClient } from "@/lib/stripe-client"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    const result = await stripeClient.verifyPayment(sessionId)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      status: result.status,
      bookingReference: result.bookingReference,
      amountPaid: result.amountPaid,
      currency: result.currency,
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
