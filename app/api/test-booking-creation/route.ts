import { NextResponse } from "next/server"
import { getTourplanAPI } from "@/lib/tourplan/core"

export async function POST(request: Request) {
  try {
    const { tourId, startDate, endDate, adults, children, customerDetails } = await request.json()

    console.log("Testing Tourplan booking creation with:", {
      tourId,
      startDate,
      endDate,
      adults,
      children,
      customerDetails
    })

    const tourplanAPI = getTourplanAPI()
    
    const response = await tourplanAPI.createBooking({
      tourId: tourId || "NBOGTARP001CKEKEE", // Use working tour code as default
      startDate: startDate || "2025-08-10", // Use Sunday date
      endDate: endDate || "2025-08-16", 
      adults: adults || 2,
      children: children || 0,
      customerDetails: customerDetails || {
        firstName: "Test",
        lastName: "Customer",
        email: "test@example.com",
        phone: "+61400000000"
      }
    })

    return NextResponse.json({
      success: response.success,
      bookingId: response.bookingId,
      bookingReference: response.bookingReference,
      data: response.data,
      error: response.error,
      rawResponse: response.rawResponse?.substring(0, 1000), // Limit response size
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("Test booking creation failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Test booking creation failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Tourplan booking creation test endpoint",
    endpoint: "POST /api/test-booking-creation",
    requiredFields: [
      "tourId (optional)",
      "startDate (optional)", 
      "endDate (optional)",
      "adults (optional)",
      "children (optional)",
      "customerDetails (optional)"
    ],
    example: {
      tourId: "NBOGTARP001CKEKEE",
      startDate: "2025-08-10",
      endDate: "2025-08-16",
      adults: 2,
      children: 0,
      customerDetails: {
        firstName: "Test",
        lastName: "Customer", 
        email: "test@example.com",
        phone: "+61400000000"
      }
    },
    workingTourCodes: [
      "NBOGTARP001CKEKEE (Keekorok)",
      "NBOGTARP001CKSE (Classic Kenya - Serena lodges)",
      "NBOGTARP001CKSO (Classic Kenya - Serena lodges)"
    ],
    notes: [
      "Use Sunday departure dates for Kenya tours",
      "NBOGTARP001CKEKEE is confirmed working",
      "Both OK and ?? statuses are considered successful"
    ]
  })
}