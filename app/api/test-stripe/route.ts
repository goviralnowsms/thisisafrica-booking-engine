import { NextResponse } from "next/server"
import { stripeClient } from "@/lib/stripe-client"

export const runtime = "nodejs"

export async function GET() {
  try {
    // Test Stripe configuration
    const testData = {
      amount: 5000, // $50.00 in cents
      currency: "aud",
      description: "Test Payment - Safari Tour Deposit",
      customerEmail: "test@example.com",
      bookingReference: "TEST-" + Date.now(),
      successUrl: "https://example.com/success",
      cancelUrl: "https://example.com/cancel",
    }

    const result = await stripeClient.createPaymentSession(testData)

    return NextResponse.json({
      success: true,
      stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
      publishableKeyConfigured: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      testSessionCreated: result.success,
      sessionId: result.sessionId,
      error: result.error,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
      publishableKeyConfigured: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    })
  }
}
