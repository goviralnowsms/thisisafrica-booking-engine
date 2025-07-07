import { NextResponse } from "next/server"

export const runtime = "nodejs"

interface PaymentSessionRequest {
  amount: number
  currency: string
  description: string
  customerEmail: string
  bookingData?: any
}

export async function POST(request: Request) {
  try {
    const body: PaymentSessionRequest = await request.json()
    
    console.log("Creating payment session:", body)

    // Validate required fields
    if (!body.amount || !body.currency || !body.description || !body.customerEmail) {
      return NextResponse.json(
        { success: false, error: "Missing required payment information" },
        { status: 400 }
      )
    }

    // Check if Stripe is configured
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

    if (!stripeSecretKey || !stripePublishableKey) {
      // Demo mode - return mock payment session
      console.log("Stripe not configured, using demo mode")
      
      const demoSession = {
        success: true,
        url: `/payment/success?session_id=demo_${Date.now()}`,
        sessionId: `demo_${Date.now()}`,
        demo: true,
        message: "Demo payment session created",
      }

      return NextResponse.json(demoSession)
    }

    // Real Stripe integration
    try {
      const stripe = require('stripe')(stripeSecretKey)
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: body.currency.toLowerCase(),
              product_data: {
                name: body.description,
              },
              unit_amount: Math.round(body.amount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
        customer_email: body.customerEmail,
        metadata: {
          tourDescription: body.description,
        },
      })

      return NextResponse.json({
        success: true,
        url: session.url,
        sessionId: session.id,
        demo: false,
      })

    } catch (stripeError) {
      console.error("Stripe error:", stripeError)
      return NextResponse.json(
        { 
          success: false, 
          error: "Payment service unavailable",
          details: stripeError instanceof Error ? stripeError.message : "Unknown error"
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error("Payment session creation failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create payment session",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Payment session API is running",
    endpoint: "POST /api/create-payment-session",
    requiredFields: ["amount", "currency", "description", "customerEmail", "bookingReference"],
    supportedCurrencies: ["usd", "aud", "eur", "gbp"],
  })
}
