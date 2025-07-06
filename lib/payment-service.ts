import { getTourplanAPI } from "./tourplan-api"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export interface PaymentRequest {
  bookingId: string
  amount: number
  currency: string
  paymentType: "deposit" | "final" | "extra"
  paymentMethod: string
  customerEmail: string
}

export interface PaymentResult {
  success: boolean
  paymentId: string
  transactionId?: string
  error?: string
}

export class PaymentService {
  static async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResult> {
    try {
      // 1. Process payment with payment gateway (Stripe, PayPal, etc.)
      const paymentResult = await this.processWithPaymentGateway(paymentRequest)

      if (!paymentResult.success) {
        return paymentResult
      }

      // 2. Record payment in our database
      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .insert({
          booking_id: paymentRequest.bookingId,
          amount: paymentRequest.amount,
          payment_method: paymentRequest.paymentMethod,
          payment_provider: "stripe", // or whatever provider you use
          provider_transaction_id: paymentResult.transactionId,
          status: "paid",
          processed_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (paymentError) {
        console.error("Failed to record payment:", paymentError)
        // Payment succeeded but recording failed - handle this carefully
      }

      // 3. Update Tourplan with payment status
      const tourplanAPI = getTourplanAPI()
      const paymentUpdate = {
        bookingId: paymentRequest.bookingId,
        paymentType: paymentRequest.paymentType,
        amount: paymentRequest.amount,
        currency: paymentRequest.currency,
        paymentReference: paymentResult.transactionId || paymentResult.paymentId,
        paymentDate: new Date().toISOString(),
        paymentMethod: paymentRequest.paymentMethod,
      }

      const tourplanUpdated = await tourplanAPI.updatePaymentStatus(paymentUpdate)

      if (!tourplanUpdated) {
        console.error("Failed to update payment status in Tourplan")
        // Payment succeeded but Tourplan update failed - log for manual reconciliation
      }

      // 4. Update booking status in our database
      await supabase
        .from("bookings")
        .update({
          status: paymentRequest.paymentType === "deposit" ? "confirmed" : "completed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", paymentRequest.bookingId)

      return {
        success: true,
        paymentId: payment?.id || paymentResult.paymentId,
        transactionId: paymentResult.transactionId,
      }
    } catch (error) {
      console.error("Payment processing failed:", error)
      return {
        success: false,
        paymentId: "",
        error: error instanceof Error ? error.message : "Payment processing failed",
      }
    }
  }

  private static async processWithPaymentGateway(paymentRequest: PaymentRequest): Promise<PaymentResult> {
    // This would integrate with your chosen payment gateway
    // For now, returning a mock successful payment

    // Example Stripe integration:
    /*
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(paymentRequest.amount * 100), // Stripe uses cents
      currency: paymentRequest.currency.toLowerCase(),
      metadata: {
        bookingId: paymentRequest.bookingId,
        paymentType: paymentRequest.paymentType,
      },
    });
    
    return {
      success: true,
      paymentId: paymentIntent.id,
      transactionId: paymentIntent.id,
    };
    */

    // Mock implementation for now
    return {
      success: true,
      paymentId: `pay_${Date.now()}`,
      transactionId: `txn_${Date.now()}`,
    }
  }

  static async calculatePaymentSchedule(bookingId: string): Promise<{
    depositAmount: number
    finalAmount: number
    finalPaymentDue: string
    canAutomate: boolean
  }> {
    // Get booking details
    const { data: booking, error } = await supabase
      .from("bookings")
      .select(`
        *,
        tours!inner(*)
      `)
      .eq("id", bookingId)
      .single()

    if (error || !booking) {
      throw new Error("Booking not found")
    }

    const depositAmount = Math.round(booking.total_price * 0.3) // 30% deposit
    const finalAmount = booking.total_price - depositAmount

    // Calculate final payment due date (2-4 weeks before departure)
    const departureDate = new Date(booking.start_date)
    const finalPaymentDue = new Date(departureDate)
    finalPaymentDue.setDate(finalPaymentDue.getDate() - 21) // 3 weeks before

    // Check if we can automate reminders based on Tourplan cancellation rules
    const canAutomate = booking.tours?.cancellation_deadline ? true : false

    return {
      depositAmount,
      finalAmount,
      finalPaymentDue: finalPaymentDue.toISOString(),
      canAutomate,
    }
  }

  static async schedulePaymentReminder(bookingId: string): Promise<boolean> {
    try {
      const schedule = await this.calculatePaymentSchedule(bookingId)

      if (!schedule.canAutomate) {
        console.log(`Booking ${bookingId} requires manual payment reminder setup`)
        return false
      }

      // Schedule automated reminder (this would integrate with your email service)
      // For now, just log the reminder
      console.log(`Payment reminder scheduled for booking ${bookingId} on ${schedule.finalPaymentDue}`)

      return true
    } catch (error) {
      console.error("Failed to schedule payment reminder:", error)
      return false
    }
  }
}
