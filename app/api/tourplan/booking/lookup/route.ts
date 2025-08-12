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
      // Use BookingId for pure numeric values
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
      // TourPlan's GetBookingRequest only accepts numeric BookingIds, not alphanumeric references
      return errorResponse(
        `Unfortunately, TourPlan's booking lookup system only works with numeric Booking IDs, not booking references like "${bookingId}".

📋 **What this means:**
• Reference numbers (like ${bookingId}) cannot be used for online booking lookup
• Only internal numeric Booking IDs work with the automated system
• This is a limitation of TourPlan's API system

📞 **To access your booking details:**
• Call us at +61 2 9664 9187 during business hours
• Email us at sales@thisisafrica.com.au with your reference "${bookingId}"
• Our team can manually look up your booking and provide all details

We apologize for this limitation and are working to provide better self-service options in the future.`,
        400
      );
    }

    console.log('📤 TourPlan XML Request:', xmlRequest);
    
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

    // Check if booking exists
    if (!parsedResponse.Reply?.GetBookingReply) {
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

    const bookingReply = parsedResponse.Reply.GetBookingReply;
    const booking = bookingReply.Booking || bookingReply;
    
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
    
    // Extract and format booking data
    const bookingData = {
      id: booking.BookingId || bookingId,
      reference: booking.Reference || booking.Ref || bookingId,
      customerName: booking.CustomerName || booking.Name || '',
      tourName: booking.ProductDescription || booking.Description || booking.ServiceDescription || 'Tour Package',
      destination: booking.Location || booking.Locality || booking.Destination || 'Africa',
      supplier: booking.SupplierName || booking.Supplier || '',
      travelDate: booking.TravelDate || booking.DateFrom || booking.StartDate || '',
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