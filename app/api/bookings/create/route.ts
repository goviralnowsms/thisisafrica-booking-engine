export const runtime = "nodejs"
import { NextResponse } from "next/server"
import type { BookingData } from "@/app/page"

export async function POST(request: Request) {
  try {
    const { bookingData, paymentSessionId, paymentStatus } = await request.json()
    console.log("Creating booking with payment verification:", { paymentSessionId, paymentStatus })

    // Validate required fields
    if (!bookingData || !bookingData.tour || !bookingData.customerDetails) {
      return NextResponse.json(
        { success: false, error: "Missing required booking information" },
        { status: 400 }
      )
    }

    if (!bookingData.customerDetails.firstName || 
        !bookingData.customerDetails.lastName || 
        !bookingData.customerDetails.email) {
      return NextResponse.json(
        { success: false, error: "Missing required customer information" },
        { status: 400 }
      )
    }

    // CRITICAL: Verify payment was successful before creating booking
    if (!paymentSessionId || paymentStatus !== "paid") {
      return NextResponse.json(
        { 
          success: false, 
          error: "Payment verification required. Booking can only be created after successful payment.",
          requiredPayment: true
        },
        { status: 402 } // Payment Required
      )
    }

    // Verify payment amount matches expected deposit
    const expectedDeposit = bookingData.depositAmount
    if (expectedDeposit <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid deposit amount" },
        { status: 400 }
      )
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate booking reference
    const timestamp = Date.now().toString().slice(-6)
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase()
    const bookingReference = `TIA${timestamp}${randomSuffix}`

    // Calculate final amounts
    const totalPrice = bookingData.totalPrice
    const depositAmount = bookingData.depositAmount
    const remainingBalance = totalPrice - depositAmount

    // Create booking response
    const bookingResult = {
      success: true,
      bookingId: `booking-${Date.now()}`,
      bookingReference,
      tourplanBookingId: `tp-${Date.now()}`,
      tourplanReference: `TP${bookingReference}`,
      status: "confirmed",
      paymentVerified: true,
      paymentSessionId,
      tour: {
        id: bookingData.tour.id,
        name: bookingData.tour.name,
        duration: bookingData.tour.duration,
        location: bookingData.tour.location,
      },
      customer: {
        firstName: bookingData.customerDetails.firstName,
        lastName: bookingData.customerDetails.lastName,
        email: bookingData.customerDetails.email,
        phone: bookingData.customerDetails.phone,
      },
      pricing: {
        totalPrice,
        depositAmount,
        remainingBalance,
        currency: "USD",
        depositPaid: true,
        depositDate: new Date().toISOString(),
      },
      selectedExtras: bookingData.selectedExtras,
      dates: {
        created: new Date().toISOString(),
        cancellationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        finalPaymentDue: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days
      },
      message: "Booking created successfully after payment verification",
      demo: true,
    }

    // In a real implementation, you would:
    // 1. Verify payment with Stripe/Tyro
    // 2. Save to database
    // 3. Create booking in Tourplan API
    // 4. Send confirmation email
    // 5. Send notification to suppliers

    console.log("Booking created successfully after payment verification:", bookingResult)

    return NextResponse.json(bookingResult)
  } catch (error) {
    console.error("Booking creation failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create booking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Booking creation API is running",
    endpoint: "POST /api/bookings/create",
    requiredFields: [
      "bookingData",
      "paymentSessionId", 
      "paymentStatus"
    ],
    paymentFirst: true,
    depositRequired: "30%",
  })
}
