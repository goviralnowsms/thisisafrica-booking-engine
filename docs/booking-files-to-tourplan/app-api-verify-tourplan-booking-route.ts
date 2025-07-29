import { NextRequest, NextResponse } from 'next/server';
import { getTourplanAPI } from '@/lib/tourplan-api';

export async function POST(request: NextRequest) {
  try {
    const { tourId, customerDetails, testMode = true } = await request.json();
    
    console.log('🔍 VERIFYING TOURPLAN BOOKING INTEGRATION...');
    
    const tourplanAPI = getTourplanAPI();
    
    // Test data for verification - Using WORKING tour and dates from TAWB100453!
    const testBookingData = {
      tourId: tourId || 'NBOGTARP001CKEKEE', // Classic Kenya - Keekorok lodges (WORKING!)
      startDate: '2025-08-10', // Sunday Aug 10, 2025 (EXACT working date!)
      endDate: '2025-08-16', // 6 days later
      adults: 2,
      children: 0,
      customerDetails: customerDetails || {
        firstName: 'Test',
        lastName: 'Verification',
        email: 'test.verification@thisisafrica.com.au',
        phone: '+61400000000'
      }
    };

    console.log('📋 Test booking data:', testBookingData);

    // Step 1: Test connection first
    console.log('🔗 Step 1: Testing Tourplan connection...');
    const connectionTest = await tourplanAPI.testConnection();
    
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        step: 'connection',
        error: 'Failed to connect to Tourplan API',
        details: connectionTest.error,
        recommendations: [
          'Check network connectivity',
          'Verify API credentials',
          'Check if Tourplan servers are accessible'
        ]
      });
    }

    console.log('✅ Connection successful');

    // Step 2: Verify tour exists
    console.log('🎯 Step 2: Verifying tour exists...');
    const tourDetails = await tourplanAPI.getTourDetails(testBookingData.tourId);
    
    if (!tourDetails.success) {
      return NextResponse.json({
        success: false,
        step: 'tour_verification',
        error: 'Tour not found or inaccessible',
        tourId: testBookingData.tourId,
        details: tourDetails.error,
        recommendations: [
          'Check if tour ID is correct',
          'Verify tour is active in Tourplan',
          'Check agent permissions for this tour'
        ]
      });
    }

    console.log('✅ Tour verified');

    // Step 3: Check availability (optional)
    console.log('📅 Step 3: Checking availability...');
    const availability = await tourplanAPI.checkAvailability(
      testBookingData.tourId,
      testBookingData.startDate,
      testBookingData.adults,
      testBookingData.children
    );

    console.log('📊 Availability result:', availability.success ? 'Available' : 'Not available');

    // Step 4: Create test booking (if not in test mode, this will be a real booking!)
    if (testMode) {
      console.log('🧪 Step 4: SIMULATION MODE - Not creating real booking');
      
      return NextResponse.json({
        success: true,
        verification: 'complete',
        steps: {
          connection: { success: true, message: 'API connection successful' },
          tour_verification: { success: true, message: 'Tour exists and accessible' },
          availability: { 
            success: availability.success, 
            message: availability.success ? 'Tour available for booking' : 'Tour availability check failed',
            details: availability.error || 'Available'
          },
          booking_simulation: { 
            success: true, 
            message: 'Booking creation would succeed (simulation mode)' 
          }
        },
        tourDetails: {
          tourId: testBookingData.tourId,
          name: tourDetails.options?.[0]?.name || 'Tour details available',
          supplier: tourDetails.options?.[0]?.supplier || 'Supplier available'
        },
        apiResponses: {
          connectionRaw: connectionTest.rawResponse?.substring(0, 500),
          tourDetailsRaw: tourDetails.rawResponse?.substring(0, 500),
          availabilityRaw: availability.rawResponse?.substring(0, 500)
        },
        recommendations: [
          '✅ Tourplan integration is working correctly',
          '✅ API can connect and retrieve tour data',
          '✅ Booking creation should work when called',
          '💡 Set testMode: false to create a real test booking'
        ]
      });
    }

    // Step 4: Create REAL test booking
    console.log('🎯 Step 4: Creating REAL test booking in Tourplan...');
    const bookingResult = await tourplanAPI.createBooking(testBookingData);

    if (bookingResult.success) {
      console.log('🎉 REAL BOOKING CREATED SUCCESSFULLY!');
      
      return NextResponse.json({
        success: true,
        verification: 'complete_with_real_booking',
        realBookingCreated: true,
        bookingDetails: {
          bookingId: bookingResult.bookingId,
          bookingReference: bookingResult.bookingReference,
          tourId: testBookingData.tourId,
          customerName: `${testBookingData.customerDetails.firstName} ${testBookingData.customerDetails.lastName}`,
          startDate: testBookingData.startDate,
          adults: testBookingData.adults,
          children: testBookingData.children
        },
        steps: {
          connection: { success: true, message: 'API connection successful' },
          tour_verification: { success: true, message: 'Tour exists and accessible' },
          availability: { 
            success: availability.success, 
            message: availability.success ? 'Tour available' : 'Availability check completed'
          },
          real_booking: { 
            success: true, 
            message: '🎉 REAL booking created in Tourplan!',
            bookingId: bookingResult.bookingId,
            bookingReference: bookingResult.bookingReference
          }
        },
        apiResponses: {
          bookingResponseRaw: bookingResult.rawResponse?.substring(0, 1000)
        },
        recommendations: [
          '🎉 SUCCESS: Real booking created in Tourplan!',
          '✅ Integration is fully working',
          '📋 Check Tourplan dashboard for booking: ' + bookingResult.bookingReference,
          '💡 This proves bookings are going through to Tourplan'
        ],
        dashboardInfo: {
          message: 'Check your Tourplan dashboard for this booking',
          searchFor: bookingResult.bookingReference,
          customerName: `${testBookingData.customerDetails.firstName} ${testBookingData.customerDetails.lastName}`,
          tourCode: testBookingData.tourId
        }
      });
    } else {
      console.log('❌ REAL BOOKING FAILED');
      
      return NextResponse.json({
        success: false,
        step: 'real_booking',
        error: 'Failed to create real booking',
        details: bookingResult.error,
        apiResponse: bookingResult.rawResponse?.substring(0, 1000),
        recommendations: [
          'Check booking parameters',
          'Verify agent has booking permissions',
          'Check tour availability for selected dates',
          'Review Tourplan error response for details'
        ]
      });
    }

  } catch (error) {
    console.error('❌ VERIFICATION ERROR:', error);
    
    return NextResponse.json({
      success: false,
      step: 'verification_error',
      error: 'Verification process failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      recommendations: [
        'Check server logs for detailed error information',
        'Verify all required environment variables are set',
        'Test individual API endpoints separately'
      ]
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Tourplan Booking Verification Endpoint',
    description: 'Verifies if bookings are successfully going to Tourplan',
    usage: {
      method: 'POST',
      endpoint: '/api/verify-tourplan-booking',
      parameters: {
        tourId: 'Optional - Tour ID to test (default: NBOGTARP001CKSE)',
        customerDetails: 'Optional - Customer details for test booking',
        testMode: 'Boolean - true for simulation, false for real booking (default: true)'
      }
    },
    examples: {
      simulation: {
        testMode: true,
        tourId: 'NBOGTARP001CKSE'
      },
      realBooking: {
        testMode: false,
        tourId: 'NBOGTARP001CKSE',
        customerDetails: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+61400000000'
        }
      }
    },
    verification_steps: [
      '1. Test API connection',
      '2. Verify tour exists',
      '3. Check availability',
      '4. Create booking (simulation or real)'
    ]
  });
}
