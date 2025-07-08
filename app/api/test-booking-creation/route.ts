import { NextResponse } from "next/server"
import { getTourplanAPI } from "@/lib/tourplan-api"

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
      tourId: tourId || "TEST_TOUR_001",
      startDate: startDate || "2024-07-01",
      endDate: endDate || "2024-07-03", 
      adults: adults || 2,
      children: children || 0,
      customerDetails: customerDetails || {
        firstName: "Test",
        lastName: "Customer",
        email: "test@example.com",
        phone: "+27123456789"
      }
    })

    return NextResponse.json({
      success: response.success,
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
      tourId: "TEST_TOUR_001",
      startDate: "2024-07-01",
      endDate: "2024-07-03",
      adults: 2,
      children: 0,
      customerDetails: {
        firstName: "Test",
        lastName: "Customer", 
        email: "test@example.com",
        phone: "+27123456789"
      }
    }
  })
} 