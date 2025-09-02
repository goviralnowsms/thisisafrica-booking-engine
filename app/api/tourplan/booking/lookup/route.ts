import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleTourPlanError } from '../../utils';

// GET - Look up booking by booking reference and surname
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');
    const surname = searchParams.get('surname');
    
    if (!bookingId || !surname) {
      return errorResponse('Both booking ID and surname are required', 400);
    }
    
    console.log(`🔍 Looking up booking: ${bookingId} for surname: ${surname}`);
    
    // Use the full booking reference ID as provided
    console.log(`🔍 Using full BookingId: ${bookingId}`);
    
    // Check if bookingId is numeric (actual BookingId) or alphanumeric (Reference)
    const isNumeric = /^\d+$/.test(bookingId);
    
    let xmlRequest;
    if (isNumeric) {
      // Use GetBookingRequest for numeric BookingId
      xmlRequest = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <GetBookingRequest>
    <AgentID>${process.env.TOURPLAN_AGENT_ID || 'SAMAGT'}</AgentID>
    <Password>${process.env.TOURPLAN_PASSWORD || 'S@MAgt01'}</Password>
    <BookingId>${bookingId}</BookingId>
  </GetBookingRequest>
</Request>`;
    } else {
      // Use ListBookingsRequest for alphanumeric booking references
      // This allows searching by booking reference and surname
      xmlRequest = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <ListBookingsRequest>
    <AgentID>${process.env.TOURPLAN_AGENT_ID || 'SAMAGT'}</AgentID>
    <Password>${process.env.TOURPLAN_PASSWORD || 'S@MAgt01'}</Password>
    <Ref>${bookingId}</Ref>
    <NameContains>${surname}</NameContains>
  </ListBookingsRequest>
</Request>`;
    }

    console.log('📤 TourPlan XML Request:', xmlRequest);
    console.log(`🔍 Request type: ${isNumeric ? 'GetBookingRequest (numeric)' : 'ListBookingsRequest (reference)'}`);
    
    // Make request to TourPlan API
    const response = await fetch(process.env.TOURPLAN_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml',
        'User-Agent': 'This-is-Africa-Booking-System'
      },
      body: xmlRequest
    });

    if (!response.ok) {
      throw new Error(`TourPlan API responded with status: ${response.status}`);
    }

    const xmlResponse = await response.text();
    console.log('📥 TourPlan XML Response:', xmlResponse);
    
    // Check for XML parsing errors first
    if (xmlResponse.includes('<ErrorReply>')) {
      console.log('❌ TourPlan returned an error in XML response');
    }

    // Parse XML response using fast-xml-parser
    const { XMLParser } = require('fast-xml-parser');
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
      textNodeName: "text"
    });

    const parsedResponse = parser.parse(xmlResponse);
    console.log('📋 Parsed TourPlan Response:', JSON.stringify(parsedResponse, null, 2));
    
    // Check for TourPlan errors first
    if (parsedResponse.Reply?.ErrorReply) {
      const error = parsedResponse.Reply.ErrorReply.Error || parsedResponse.Reply.ErrorReply;
      console.log('❌ TourPlan API Error:', error);
      
      // Return specific error based on TourPlan's response
      let errorMessage = `TourPlan API Error: ${error}`;
      
      if (error.includes('1050') || error.includes('not found') || error.includes('does not exist')) {
        errorMessage = `Booking "${bookingId}" not found in TourPlan system. Please check:
        
• The booking reference is correct
• The booking is confirmed (not just a quote)
• Your surname matches the booking exactly

If you're still having issues, contact support at sales@thisisafrica.com.au`;
      }
      
      return errorResponse(errorMessage, 400);
    }

    // Check if booking exists - handle both GetBookingReply and ListBookingsReply
    const bookingReply = parsedResponse.Reply?.GetBookingReply || parsedResponse.Reply?.ListBookingsReply;
    
    if (!bookingReply) {
      // Better error message based on what type of ID was used
      const errorMsg = isNumeric 
        ? `Booking ID "${bookingId}" not found. Please verify the booking ID and try again.`
        : `Booking reference "${bookingId}" not found. This may be because:

• The booking reference may not be active in TourPlan's system yet
• The booking might still be in quote/pending status
• The reference format may not be supported

Please try:
1. Checking if you have a numeric Booking ID instead
2. Contacting our support team at sales@thisisafrica.com.au
3. Calling +61 2 9664 9187 for assistance`;
      
      return errorResponse(errorMsg, 404);
    }

    // Handle different response structures
    let booking;
    if (parsedResponse.Reply?.GetBookingReply) {
      // GetBookingReply response
      booking = bookingReply.Booking || bookingReply;
    } else if (parsedResponse.Reply?.ListBookingsReply) {
      // ListBookingsReply response - get first booking from list
      const bookings = bookingReply.Booking || bookingReply.Bookings?.Booking;
      if (!bookings || (Array.isArray(bookings) && bookings.length === 0)) {
        return errorResponse(`No bookings found for reference "${bookingId}" with surname "${surname}".`, 404);
      }
      booking = Array.isArray(bookings) ? bookings[0] : bookings;
    }
    
    // Check for TourPlan errors
    if (bookingReply?.ErrorMessage) {
      console.log('❌ TourPlan Error:', bookingReply.ErrorMessage);
      
      // Provide more specific error messages based on TourPlan error codes
      const errorMessage = bookingReply.ErrorMessage;
      if (errorMessage.includes('1050') || errorMessage.includes('not found')) {
        return errorResponse(
          `Booking reference "${bookingId}" could not be located as a confirmed booking. This may be because:
          
• The booking is still pending approval (quote status)
• The booking hasn't been confirmed yet by our team
• The booking reference may be for a quote rather than a confirmed booking

If you have a quote reference, please contact our team at sales@thisisafrica.com.au or +61 2 9664 9187 to confirm your booking.

For confirmed bookings, please ensure you're using the booking reference provided in your confirmation email.`, 
          404
        );
      }
      
      return errorResponse('Booking lookup failed. Please contact support for assistance.', 404);
    }
    
    if (!booking) {
      return errorResponse('No booking data found', 404);
    }
    
    // Verify surname matches (case-insensitive)
    const bookingName = booking.CustomerName || booking.Name || '';
    const nameMatch = bookingName.toLowerCase().includes(surname.toLowerCase());
    
    if (!nameMatch) {
      console.log(`❌ Name mismatch: '${bookingName}' does not contain '${surname}'`);
      return errorResponse('Invalid surname or booking ID combination', 403);
    }

    // Log all available booking fields for debugging
    console.log('🔍 All booking fields available:', Object.keys(booking));
    console.log('🔍 Raw booking object:', booking);
    
    // Check for passenger/traveler related fields
    const passengerFields = Object.keys(booking).filter(key => 
      key.toLowerCase().includes('pax') || 
      key.toLowerCase().includes('passenger') || 
      key.toLowerCase().includes('traveler') ||
      key.toLowerCase().includes('adult') ||
      key.toLowerCase().includes('people')
    );
    console.log('🔍 Passenger-related fields:', passengerFields);
    
    // Extract service/tour details from Services section
    let tourName = 'Tour Package';
    let tourDestination = 'Africa';
    let tourDuration = 'Multiple days';
    let travelDateFrom = '';
    let travelDateTo = '';
    
    // Check for Services or ServiceLines
    const services = booking.Services?.Service || booking.ServiceLines?.ServiceLine;
    if (services) {
      const firstService = Array.isArray(services) ? services[0] : services;
      if (firstService) {
        console.log('🎯 Service details found:', firstService);
        console.log('🔍 All service fields:', Object.keys(firstService));
        
        // Extract tour name
        tourName = firstService.Description || firstService.ProductDescription || firstService.ServiceDescription || firstService.OptDescription || 'Tour Package';
        
        // Extract destination - use LocationCode and tour description to infer location
        tourDestination = firstService.LocalityDescription || firstService.LocationDescription || firstService.Locality || firstService.Location || firstService.Destination;
        
        // If no explicit destination, infer from LocationCode and tour name
        if (!tourDestination || tourDestination === 'Africa') {
          const locationCode = firstService.LocationCode || '';
          
          // Map common location codes to destinations
          const locationMap = {
            'NBO': 'Kenya',
            'JNB': 'South Africa', 
            'CPT': 'Cape Town',
            'BOT': 'Botswana',
            'VFA': 'Victoria Falls',
            'LUN': 'Zambia'
          };
          
          tourDestination = locationMap[locationCode] || 'Africa';
          
          // For tours mentioning specific places, extract from tour name
          if (tourName.toLowerCase().includes('kenya')) {
            tourDestination = 'Kenya';
          } else if (tourName.toLowerCase().includes('cape town')) {
            tourDestination = 'Cape Town';
          } else if (tourName.toLowerCase().includes('pretoria')) {
            tourDestination = 'South Africa';
          }
        }
        
        // For Rail tours, the destination is often in the tour name itself (e.g., "Cape Town to Pretoria")
        if (tourName.includes(' to ')) {
          // Extract route from tour name
          const routeMatch = tourName.match(/([A-Za-z\s]+)\sto\s([A-Za-z\s]+)/);
          if (routeMatch) {
            tourDestination = `${routeMatch[1].trim()} to ${routeMatch[2].trim()}`;
          }
        }
        
        // Extract dates - check TourPlan-specific fields first
        travelDateFrom = firstService.Pickup_Date || firstService.Date || firstService.DateFrom || firstService.StartDate || firstService.TravelDate || '';
        travelDateTo = firstService.Dropoff_Date || firstService.DateTo || firstService.EndDate || '';
        
        // If DateTo is missing but we have Nights, calculate it
        if (travelDateFrom && !travelDateTo && firstService.Nights) {
          const nights = parseInt(firstService.Nights);
          if (nights > 0) {
            const startDate = new Date(travelDateFrom);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + nights);
            travelDateTo = endDate.toISOString().split('T')[0];
          }
        }
        
        // If still no DateTo, use DateFrom
        if (!travelDateTo) {
          travelDateTo = travelDateFrom;
        }
        
        // Calculate duration if dates are available
        if (travelDateFrom && travelDateTo) {
          const start = new Date(travelDateFrom);
          const end = new Date(travelDateTo);
          const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          tourDuration = days > 1 ? `${days} days` : '1 day';
        } else if (firstService.Nights) {
          const nights = parseInt(firstService.Nights);
          tourDuration = nights > 0 ? `${nights + 1} days / ${nights} nights` : 'Multiple days';
        }
      }
    }
    
    // Extract and format booking data
    const bookingData = {
      id: booking.BookingId || bookingId,
      reference: booking.Reference || booking.Ref || bookingId,
      customerName: booking.CustomerName || booking.Name || '',
      tourName: tourName,
      destination: tourDestination,
      supplier: booking.SupplierName || booking.Supplier || '',
      travelDate: travelDateFrom || booking.TravelDate || booking.DateFrom || booking.StartDate || '',
      travelDateTo: travelDateTo || booking.DateTo || booking.EndDate || '',
      duration: tourDuration,
      status: booking.Status || booking.BookingStatus || 'pending',
      totalAmount: booking.TotalAmount || booking.Amount || booking.TotalCost || booking.Price || 0,
      currency: booking.Currency || 'AUD',
      travelers: booking.Travelers || booking.Passengers || booking.PaxCount || booking.Adults || booking.Pax || booking.TotalPax || booking.PassengerCount || 1,
      bookingDate: booking.BookingDate || booking.DateCreated || booking.Created || '',
      // Add more potential fields
      bookingReference: booking.BookingReference || booking.Ref || booking.Reference,
      totalPrice: booking.TotalPrice || booking.TotalAmount || booking.Amount || 0,
      rawData: booking // Keep raw data for debugging
    };

    console.log('✅ Booking data extracted:', bookingData);

    return successResponse({
      success: true,
      booking: bookingData
    });
    
  } catch (error) {
    console.error(`❌ Error looking up booking:`, error);
    return handleTourPlanError(error);
  }
}