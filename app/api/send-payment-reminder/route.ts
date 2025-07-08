import { NextResponse } from "next/server"
import { ResendEmailService } from "@/lib/resend-email-service"
import { db } from "@/lib/database"

export async function POST(request: Request) {
  try {
    const { bookingId, forceSend = false } = await request.json()

    // Get booking details from database
    const booking = await db.getBooking(bookingId)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Check if it's time to send the reminder (2 weeks before tour)
    const tourDate = new Date(booking.tour_date)
    const twoWeeksBefore = new Date(tourDate.getTime() - (14 * 24 * 60 * 60 * 1000))
    const now = new Date()

    // Only send if it's within the reminder window or if forced
    if (!forceSend && (now < twoWeeksBefore || now > tourDate)) {
      return NextResponse.json({
        success: false,
        message: "Payment reminder not due yet or tour has passed",
        tourDate: booking.tour_date,
        reminderDue: twoWeeksBefore.toISOString(),
        currentTime: now.toISOString()
      })
    }

    const emailService = new ResendEmailService()
    
    const emailData = {
      to: booking.customer_email,
      customerName: booking.customer_name,
      bookingReference: booking.booking_reference,
      tourName: booking.tour_id, // You might want to get actual tour name
      tourDate: booking.tour_date,
      totalAmount: booking.total_amount,
      remainingBalance: booking.total_amount * 0.7, // Assuming 30% deposit, 70% remaining
      dueDate: twoWeeksBefore.toISOString().split('T')[0],
      paymentUrl: `https://book.thisisafrica.com.au/payment/${booking.booking_reference}`
    }

    await emailService.sendPaymentReminderEmail(emailData)

    return NextResponse.json({
      success: true,
      message: "Payment reminder sent successfully via Resend",
      bookingReference: booking.booking_reference,
      customerEmail: booking.customer_email,
      tourDate: booking.tour_date,
      remainingBalance: emailData.remainingBalance
    })
  } catch (error) {
    console.error("Payment reminder error:", error)
    return NextResponse.json({ error: "Failed to send payment reminder" }, { status: 500 })
  }
}

// GET endpoint to check which bookings need payment reminders
export async function GET() {
  try {
    const now = new Date()
    const twoWeeksFromNow = new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000))
    
    // Get all bookings that need payment reminders
    const bookingsNeedingReminders = await db.getBookingsNeedingPaymentReminders(
      now.toISOString(),
      twoWeeksFromNow.toISOString()
    )

    return NextResponse.json({
      success: true,
      bookings: bookingsNeedingReminders,
      count: bookingsNeedingReminders.length,
      currentTime: now.toISOString(),
      twoWeeksFromNow: twoWeeksFromNow.toISOString()
    })
  } catch (error) {
    console.error("Error fetching bookings needing reminders:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}
