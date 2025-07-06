export const runtime = "nodejs"
import { createClient } from "@supabase/supabase-js"
import { EmailService } from "@/lib/email-service"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export async function POST(request: Request) {
  try {
    const bookingData = await request.json()
    console.log("Creating booking:", bookingData)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate mock booking response
    const bookingReference = `TIA${Date.now().toString().slice(-6)}`

    const bookingResult = {
      success: true,
      bookingId: `booking-${Date.now()}`,
      bookingReference,
      tourplanBookingId: `tp-${Date.now()}`,
      tourplanReference: `TP${bookingReference}`,
      status: "confirmed",
      totalPrice: bookingData.totalPrice,
      currency: "USD",
      depositAmount: bookingData.depositAmount,
      cancellationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      message: "Booking created successfully in demo mode",
      demo: true,
    }

    // Send email notifications
    if (bookingData.customerEmail && bookingData.customerName) {
      const emailData = {
        customerEmail: bookingData.customerEmail,
        customerName: bookingData.customerName,
        bookingReference,
        tourName: bookingData.tourName || "African Safari Tour",
        startDate: bookingData.startDate || new Date().toISOString(),
        totalPrice: bookingData.totalPrice,
        depositAmount: bookingData.depositAmount,
        finalPaymentDue: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks from now
      }

      // Send confirmation email to customer
      await EmailService.sendBookingConfirmation(emailData)

      // Send notification to admin
      await EmailService.sendAdminNotification(emailData)
    }

    return Response.json(bookingResult)
  } catch (error) {
    console.error("Booking creation failed:", error)
    return Response.json(
      {
        error: "Failed to create booking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
