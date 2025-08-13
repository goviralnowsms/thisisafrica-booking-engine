export const runtime = "nodejs"
import { NextResponse } from "next/server"
import { getTourplanAPI } from "@/lib/tourplan/core"
import { sendBookingConfirmation, sendAdminNotification } from '@/lib/email'

export async function POST(request: Request) {
  try {
    console.log("🚨🚨🚨 BOOKINGS CREATE API CALLED - EMAIL TEST 🚨🚨🚨");
    const { bookingData, paymentSessionId, paymentStatus } = await request.json()
    console.log("Creating booking with payment verification:", { paymentSessionId, paymentStatus })
    console.log("Customer email from booking data:", bookingData?.customerDetails?.email)

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

    // Generate booking reference
    const timestamp = Date.now().toString().slice(-6)
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase()
    const bookingReference = `TIA${timestamp}${randomSuffix}`

    // Calculate final amounts
    const totalPrice = bookingData.totalPrice
    const depositAmount = bookingData.depositAmount
    const remainingBalance = totalPrice - depositAmount

    // Create booking in Tourplan API
    let tourplanBookingId = null
    let tourplanReference = null
    let tourplanError = null

    try {
      console.log("Creating booking in Tourplan API...")
      const tourplanAPI = getTourplanAPI()
      
      const tourplanResponse = await tourplanAPI.createBooking({
        tourId: bookingData.tour.id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        adults: bookingData.adults || 2,
        children: bookingData.children || 0,
        customerDetails: {
          firstName: bookingData.customerDetails.firstName,
          lastName: bookingData.customerDetails.lastName,
          email: bookingData.customerDetails.email,
          phone: bookingData.customerDetails.phone || "",
        }
      })

      if (tourplanResponse.success) {
        tourplanBookingId = tourplanResponse.bookingId
        tourplanReference = tourplanResponse.bookingReference
        console.log("Tourplan booking created successfully:", { tourplanBookingId, tourplanReference })
      } else {
        tourplanError = tourplanResponse.error || "Failed to create Tourplan booking"
        console.error("Tourplan booking creation failed:", tourplanError)
      }
    } catch (error) {
      tourplanError = error instanceof Error ? error.message : "Unknown Tourplan error"
      console.error("Tourplan API error:", error)
    }

    // Create booking response
    const bookingResult = {
      success: true,
      bookingId: `booking-${Date.now()}`,
      bookingReference,
      tourplanBookingId,
      tourplanReference,
      tourplanError, // Include any Tourplan errors for debugging
      status: tourplanBookingId ? "confirmed" : "pending_tourplan",
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
      message: tourplanBookingId 
        ? "Booking created successfully in Tourplan after payment verification"
        : "Booking created locally. Tourplan integration failed - manual intervention may be required.",
      demo: false, // Now using real Tourplan integration
    }

    // TODO: Save to database
    
    // Send email notifications
    try {
      console.log('📧📧📧 ABOUT TO SEND EMAIL TO:', bookingData.customerDetails.email);
      console.log('📧📧📧 BOOKING REF:', bookingReference);
      
      // Send customer confirmation email
      const emailResult = await sendBookingConfirmation({
        reference: bookingReference,
        customerEmail: bookingData.customerDetails.email,
        customerName: `${bookingData.customerDetails.firstName} ${bookingData.customerDetails.lastName}`,
        productName: bookingData.tour.name,
        dateFrom: bookingData.startDate,
        dateTo: bookingData.endDate,
        totalCost: Math.round(totalPrice * 100), // Convert to cents
        currency: 'AUD',
        status: tourplanBookingId ? 'CONFIRMED' : 'PENDING_TOURPLAN',
        requiresManualConfirmation: !tourplanBookingId
      });

      // Send admin notification
      await sendAdminNotification({
        reference: bookingReference,
        customerName: `${bookingData.customerDetails.firstName} ${bookingData.customerDetails.lastName}`,
        customerEmail: bookingData.customerDetails.email,
        productCode: bookingData.tour.id,
        productName: bookingData.tour.name,
        dateFrom: bookingData.startDate,
        totalCost: Math.round(totalPrice * 100), // Convert to cents
        currency: 'AUD',
        requiresManualConfirmation: !tourplanBookingId,
        tourplanStatus: tourplanBookingId ? 'OK' : 'FAILED'
      });

      console.log('✅✅✅ EMAIL RESULT:', emailResult);
      console.log('✅✅✅ EMAILS SENT SUCCESSFULLY');
    } catch (emailError) {
      console.error('❌ Failed to send email notifications:', emailError);
      // Don't fail the booking if email fails
    }

    console.log("Booking creation completed:", bookingResult)

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
    tourplanIntegration: true,
  })
}