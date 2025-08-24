import { type NextRequest, NextResponse } from "next/server"
import { searchProducts, createBooking } from "@/lib/tourplan/services"

/**
 * API route for searching tours
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const destination = searchParams.get("destination") || undefined
  const classFilter = searchParams.get("class") || undefined
  const startDate = searchParams.get("startDate") || undefined
  const endDate = searchParams.get("endDate") || undefined
  const travelers = searchParams.get("travelers") ? Number.parseInt(searchParams.get("travelers")!) : undefined
  const adults = searchParams.get("adults") ? Number.parseInt(searchParams.get("adults")!) : undefined
  const children = searchParams.get("children") ? Number.parseInt(searchParams.get("children")!) : undefined

  console.log('📍 GET /api/tourplan - Search params:', {
    productType: searchParams.get("productType"),
    destination,
    class: classFilter,
    startDate,
    endDate,
    adults: adults || travelers,
    children
  });
  
  console.log('🚨 PACKAGES PAGE API ROUTE HIT!');

  try {
    const result = await searchProducts({
      productType: searchParams.get("productType") || 'Group Tours',
      destination,
      class: classFilter,
      dateFrom: startDate,
      dateTo: endDate,
      adults: adults || travelers,
      children: children,
    })

    return NextResponse.json({
      success: true,
      tours: result.products,
      totalResults: result.totalResults,
    })
  } catch (error) {
    console.error("API error searching tours:", error)
    return NextResponse.json({ success: false, error: "Failed to search tours" }, { status: 500 })
  }
}

/**
 * API route for creating a booking
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.customer || !body.itinerary) {
      return NextResponse.json({ success: false, error: "Missing required booking information" }, { status: 400 })
    }

    const result = await createBooking({
      customerName: body.customer.name,
      email: body.customer.email,
      mobile: body.customer.mobile,
      productCode: body.itinerary.tourId,
      rateId: body.itinerary.rateId || 'Default',
      dateFrom: body.itinerary.startDate,
      dateTo: body.itinerary.endDate,
      adults: body.itinerary.adults,
      children: body.itinerary.children,
      isQuote: false,
    })

    return NextResponse.json({
      success: true,
      ...result
    })
  } catch (error) {
    console.error("API error creating booking:", error)
    return NextResponse.json({ success: false, error: "Failed to create booking" }, { status: 500 })
  }
}
