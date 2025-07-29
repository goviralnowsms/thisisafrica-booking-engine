import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createBooking } from '@/lib/tourplan';
import { 
  validateRequestBody, 
  successResponse, 
  errorResponse, 
  handleTourPlanError,
  dateSchema,
  roomConfigSchema 
} from '../utils';

// Create booking schema
const createBookingSchema = z.object({
  // Customer info
  customerName: z.string().min(1),
  email: z.string().email().optional(),
  mobile: z.string().optional(),
  
  // Booking type
  bookingType: z.enum(['booking', 'quote']).default('booking'),
  
  // Product info
  productCode: z.string().min(1),
  rateId: z.string().optional().default(''),
  dateFrom: dateSchema,
  dateTo: dateSchema.optional(),
  
  // Passengers
  adults: z.number().int().min(1).optional(),
  children: z.number().int().min(0).optional(),
  infants: z.number().int().min(0).optional(),
  
  // Room configs (for accommodation/cruises)
  roomConfigs: z.array(roomConfigSchema).optional(),
  
  // Additional info
  note: z.string().optional(),
});

// Add service to existing booking schema
const addServiceSchema = z.object({
  bookingId: z.string().min(1),
  productCode: z.string().min(1),
  rateId: z.string().min(1),
  dateFrom: dateSchema,
  dateTo: dateSchema.optional(),
  adults: z.number().int().min(1).optional(),
  children: z.number().int().min(0).optional(),
  infants: z.number().int().min(0).optional(),
  roomConfigs: z.array(roomConfigSchema).optional(),
  note: z.string().optional(),
});

// POST - Create new booking
export async function POST(request: NextRequest) {
  try {
    console.log('📝 Booking API called');
    
    // Log raw request body first
    const rawBody = await request.text();
    console.log('📝 Raw request body:', rawBody);
    
    // Parse it manually to check
    let parsedBody;
    try {
      parsedBody = JSON.parse(rawBody);
      console.log('📝 Parsed body:', parsedBody);
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return errorResponse('Invalid JSON in request body', 400);
    }
    
    // Create new request with parsed body for validation
    const testRequest = new Request(request.url, {
      method: 'POST',
      headers: request.headers,
      body: rawBody,
    });
    
    const validationResult = await validateRequestBody(testRequest, createBookingSchema);
    if (validationResult.error) {
      console.log('❌ Validation failed:', validationResult.error);
      return validationResult.error;
    }
    
    const data = validationResult.data;
    console.log('✅ Validated data:', data);
    
    // Use simplified service function
    console.log('🔄 Calling createBooking service...');
    const result = await createBooking({
      customerName: data.customerName,
      productCode: data.productCode,
      rateId: data.rateId,
      dateFrom: data.dateFrom,
      dateTo: data.dateTo,
      isQuote: data.bookingType === 'quote',
      email: data.email,
      mobile: data.mobile,
      adults: data.adults,
      children: data.children,
      infants: data.infants,
    });
    
    console.log('🎉 Booking result:', result);
    
    // Handle different TourPlan responses
    if (result.status === 'NO' || result.status === 'RQ' || result.status === 'WQ') {
      // NO = Declined, RQ = On Request, WQ = Website Quote (what we want!)
      console.log(`⚠️ TourPlan returned status: ${result.status} - handling as quote requiring manual confirmation`);
      
      // For quotes, we might still get a reference from TourPlan
      const tourplanRef = result.reference || result.bookingRef || null;
      const tourplanBookingId = result.bookingId || null;
      
      // Generate our own reference if TourPlan didn't provide one
      const bookingRef = tourplanRef || `TIA-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      // Create a booking record with manual confirmation requirement
      const quotedBooking = {
        bookingId: tourplanBookingId, // May have TourPlan ID even for quotes
        reference: bookingRef,
        tourplanReference: tourplanRef, // Keep TourPlan's reference if provided
        status: result.status === 'WQ' ? 'WEBSITE_QUOTE' : 'PENDING_CONFIRMATION',
        tourplanStatus: result.status, // Keep original TourPlan status
        totalCost: result.totalCost || 0,
        currency: result.currency || 'AUD',
        rateId: result.rateId,
        customerDetails: {
          name: data.customerName,
          email: data.email,
          mobile: data.mobile
        },
        productDetails: {
          code: data.productCode,
          dateFrom: data.dateFrom,
          dateTo: data.dateTo,
          adults: data.adults,
          children: data.children,
          infants: data.infants
        },
        requiresManualConfirmation: true,
        createdAt: new Date().toISOString(),
        message: result.status === 'WQ' 
          ? 'Quote created in TourPlan. Staff will confirm availability and finalize your booking within 48 hours.'
          : 'Booking requires manual confirmation. You will be contacted within 48 hours to confirm availability.',
        rawResponse: result.rawResponse
      };
      
      console.log('📝 Created quote/booking for manual confirmation:', {
        status: result.status,
        tourplanRef: tourplanRef,
        ourRef: bookingRef
      });
      
      return successResponse(quotedBooking, 201);
    }
    
    return successResponse(result, 201);
  } catch (error) {
    console.error('❌ Booking API error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return handleTourPlanError(error);
  }
}

// PUT - Add service to existing booking
export async function PUT(request: NextRequest) {
  try {
    const validationResult = await validateRequestBody(request, addServiceSchema);
    if (validationResult.error) return validationResult.error;
    
    const data = validationResult.data;
    const client = getTourPlanClient();
    
    const result = await client.addServiceToBooking(data.bookingId, {
      Opt: data.productCode,
      RateId: data.rateId,
      DateFrom: data.dateFrom,
      DateTo: data.dateTo,
      Adults: data.adults,
      Children: data.children,
      Infants: data.infants,
      RoomConfigs: data.roomConfigs,
      Note: data.note,
    });
    
    if (result.Error) {
      return errorResponse(
        'Failed to add service to booking',
        400,
        result.Error
      );
    }
    
    return successResponse({
      bookingId: result.BookingId,
      bookingRef: result.BookingRef,
      status: result.Status,
      totalCost: result.TotalCost,
      currency: result.Currency,
    });
  } catch (error) {
    return handleTourPlanError(error);
  }
}