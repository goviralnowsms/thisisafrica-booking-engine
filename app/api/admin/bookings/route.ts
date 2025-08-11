import { NextRequest, NextResponse } from 'next/server'
import { parseStringPromise } from 'xml2js'

// Simple admin authentication check
function isValidAdminRequest(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  // In production, use proper JWT or session-based auth
  return authHeader === 'Bearer admin-token-tia2025'
}

async function fetchTourPlanBookings() {
  try {
    console.log('🔍 Fetching TAWB bookings from session storage...')
    
    // For now, we'll return mock TAWB bookings to demonstrate the functionality
    // In production, this could:
    // 1. Query specific TAWB booking IDs stored in a database
    // 2. Integrate with TourPlan's reporting API
    // 3. Store TAWB references when bookings are made and query them individually
    
    const mockTawbBookings = [
      {
        BookingId: 'TAWB100445',
        BookingReference: 'TAWB100445',
        CustomerName: 'John Smith',
        EmailAddress: 'john.smith@email.com',
        PhoneNumber: '+61 400 123 456',
        BookingDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        Status: 'Confirmed',
        TotalPrice: '299500', // $2995.00 in cents
        Services: {
          Service: {
            ServiceName: 'Classic Kenya Safari',
            ServiceCode: 'NBOGTARP001CKSE',
            SupplierName: 'Alpha Travel Kenya',
            Locality: 'Nairobi',
            DateFrom: '2025-09-15',
            Adults: 2,
            Children: 0,
            RoomType: 'TW'
          }
        },
        Comments: 'API booking confirmed'
      },
      {
        BookingId: 'TAWB100446',
        BookingReference: 'TAWB100446',
        CustomerName: 'Sarah Johnson',
        EmailAddress: 'sarah.j@email.com',
        PhoneNumber: '+61 422 555 789',
        BookingDate: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
        Status: 'Quote',
        TotalPrice: '459900', // $4599.00 in cents
        Services: {
          Service: {
            ServiceName: 'Victoria Falls Rail Journey',
            ServiceCode: 'VFARLROV001VFPRDX',
            SupplierName: 'Rovos Rail',
            Locality: 'Victoria Falls',
            DateFrom: '2025-10-20',
            Adults: 2,
            Children: 0,
            RoomType: 'DB'
          }
        },
        Comments: 'Quote pending customer confirmation'
      }
    ]

    console.log(`📋 Mock TAWB bookings: ${mockTawbBookings.length}`)
    return mockTawbBookings
  } catch (error) {
    console.error('❌ Error fetching TourPlan bookings:', error)
    return []
  }
}

function formatTourPlanBooking(booking: any) {
  try {
    const services = booking.Services?.Service
    const firstService = Array.isArray(services) ? services[0] : services
    
    return {
      id: booking.BookingId || booking.$.BookingId || 'unknown',
      reference: booking.BookingReference || booking.$.BookingReference || 'N/A',
      type: 'TAWB' as const,
      customerName: booking.CustomerName || 'Unknown Customer',
      email: booking.EmailAddress || booking.Email || '',
      phone: booking.PhoneNumber || booking.Phone || '',
      productName: firstService?.ServiceName || firstService?.Description || 'Unknown Product',
      productCode: firstService?.ServiceCode || firstService?.Code || 'N/A',
      productLocation: firstService?.Locality || 'Africa',
      dateFrom: firstService?.DateFrom || booking.TravelDate || '',
      totalAmount: booking.TotalPrice ? Math.round(parseFloat(booking.TotalPrice) / 100) : 0,
      currency: 'AUD',
      status: booking.Status === 'Confirmed' ? 'confirmed' as const : 
              booking.Status === 'Quote' ? 'quote' as const :
              booking.Status === 'Cancelled' ? 'cancelled' as const :
              'pending' as const,
      createdAt: booking.BookingDate || booking.CreatedDate || new Date().toISOString(),
      supplier: firstService?.SupplierName || '',
      adults: parseInt(firstService?.Adults) || 2,
      children: parseInt(firstService?.Children) || 0,
      roomType: firstService?.RoomType || '',
      notes: booking.Comments || booking.Notes || ''
    }
  } catch (error) {
    console.error('Error formatting TourPlan booking:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    if (!isValidAdminRequest(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🔐 Admin bookings request authenticated')
    
    // Fetch both TIA and TourPlan bookings
    const tourPlanBookings = await fetchTourPlanBookings()
    
    // Format TourPlan bookings
    const formattedTourPlanBookings = tourPlanBookings
      .map(formatTourPlanBooking)
      .filter(booking => booking !== null)

    console.log(`📊 Returning ${formattedTourPlanBookings.length} TourPlan bookings`)

    return NextResponse.json({
      success: true,
      data: {
        tourplanBookings: formattedTourPlanBookings,
        totalCount: formattedTourPlanBookings.length
      }
    })

  } catch (error) {
    console.error('❌ Admin bookings API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch bookings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}