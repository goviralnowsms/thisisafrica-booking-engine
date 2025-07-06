export const runtime = "nodejs"
import { EmailService } from "@/lib/email-service"
import { DatabaseService } from "@/lib/database"

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json()

    // Get booking details from database
    const booking = await DatabaseService.getBookingWithCustomer(bookingId)

    if (!booking) {
      return Response.json({ error: "Booking not found" }, { status: 404 })
    }

    const emailData = {
      customerEmail: booking.customer.email,
      customerName: `${booking.customer.first_name} ${booking.customer.last_name}`,
      bookingReference: booking.booking_reference,
      tourName: booking.tour_id, // You might want to get actual tour name
      startDate: booking.start_date,
      totalPrice: booking.total_price,
      depositAmount: booking.deposit_amount,
    }

    const sent = await EmailService.sendPaymentReminder(emailData)

    return Response.json({
      success: sent,
      message: sent ? "Payment reminder sent" : "Failed to send reminder",
    })
  } catch (error) {
    console.error("Payment reminder error:", error)
    return Response.json({ error: "Failed to send payment reminder" }, { status: 500 })
  }
}
