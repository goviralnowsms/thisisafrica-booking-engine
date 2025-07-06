import { type NextRequest, NextResponse } from "next/server"
import { stripeClient } from "@/lib/stripe-client"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency = "aud", description, customerEmail, bookingReference } = body

    if (!amount || !description || !customerEmail || !bookingReference) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000"

    const result = await stripeClient.createPaymentSession({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      description,
      customerEmail,
      bookingReference,
      successUrl: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/payment/cancel`,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      sessionId: result.sessionId,
      url: result.url,
    })
  } catch (error) {
    console.error("Payment session creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
