import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const { sessionId, bookingData } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    // Check if we have Stripe credentials for real verification
    const hasStripeKey = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== "your_stripe_secret_key"

    if (hasStripeKey) {
      // Real Stripe verification
      try {
        const { stripeClient } = await import("@/lib/stripe-client")
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
          demo: false,
        })
      } catch (stripeError) {
        console.error("Stripe verification failed:", stripeError)
        return NextResponse.json({ 
          error: "Payment verification failed",
          details: stripeError instanceof Error ? stripeError.message : "Unknown error"
        }, { status: 500 })
      }
    } else {
      // Demo mode - simulate successful payment verification
      console.log("Demo mode: Simulating payment verification for session:", sessionId)
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return NextResponse.json({
        success: true,
        status: "paid",
        bookingReference: `DEMO-${Date.now()}`,
        amountPaid: bookingData?.depositAmount || 0,
        currency: "usd",
        demo: true,
        message: "Demo payment verified successfully",
      })
    }
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
