import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export interface CreatePaymentSessionData {
  amount: number // in cents
  currency: string
  description: string
  customerEmail: string
  bookingReference: string
  successUrl: string
  cancelUrl: string
}

export interface PaymentSessionResult {
  success: boolean
  sessionId?: string
  url?: string
  error?: string
}

export class StripePaymentClient {
  async createPaymentSession(data: CreatePaymentSessionData): Promise<PaymentSessionResult> {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: data.currency,
              product_data: {
                name: data.description,
                description: `Booking Reference: ${data.bookingReference}`,
              },
              unit_amount: data.amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: data.successUrl,
        cancel_url: data.cancelUrl,
        customer_email: data.customerEmail,
        metadata: {
          bookingReference: data.bookingReference,
        },
      })

      return {
        success: true,
        sessionId: session.id,
        url: session.url!,
      }
    } catch (error) {
      console.error("Stripe payment session creation failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  async verifyPayment(sessionId: string) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId)

      return {
        success: true,
        status: session.payment_status,
        bookingReference: session.metadata?.bookingReference,
        amountPaid: session.amount_total,
        currency: session.currency,
      }
    } catch (error) {
      console.error("Stripe payment verification failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
}

export const stripeClient = new StripePaymentClient()
