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
import { sendBookingConfirmation, sendAdminNotification } from '@/lib/email';

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
    
    const rawBody = await request.text();
    let parsedBody;
    try {
      parsedBody = JSON.parse(rawBody);
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
      return validationResult.error;
    }
    
    const data = validationResult.data;
    console.log('🔄 Creating booking for:', data.productCode);
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
    
    // Handle different TourPlan responses
    if (result.status === 'NO' || result.status === 'RQ' || result.status === 'WQ') {
      // NO = Declined, RQ = On Request, WQ = Website Quote (what we want!)
      console.log(`⚠️ TourPlan returned status: ${result.status} - handling as quote requiring manual confirmation`);
      
      // For quotes, we might still get a reference from TourPlan
      const tourplanRef = result.reference || result.bookingRef || null;
      const tourplanBookingId = result.bookingId || null;
      
      // Generate our own reference if TourPlan didn't provide one
      // Use product-specific prefixes for different product types
      const isCruise = data.productCode.includes('CRCHO') ||    // Chobe Princess codes (BBKCRCHO...)
                       data.productCode.includes('CRTVT') ||    // Zambezi Queen codes (BBKCRTVT...)  
                       data.productCode.includes('BBKCR') ||    // Botswana cruise codes
                       data.productCode.toLowerCase().includes('cruise');
                       
      const isRail = data.productCode.includes('RLROV') ||     // Rovos Rail codes
                     data.productCode.includes('RAIL') ||      // General rail codes
                     data.productCode.toLowerCase().includes('rail') ||
                     data.productCode.includes('BLUE') ||      // Blue Train codes
                     data.productCode.includes('PREMIER') ||   // Premier Classe codes
                     data.productCode.includes('VFARLROV') ||  // Victoria Falls rail
                     data.productCode.includes('CPTRLROV') ||  // Cape Town rail
                     data.productCode.includes('PRYRLROV');    // Pretoria rail
      
      let productPrefix = 'TIA';
      if (isCruise) {
        productPrefix = 'TIA-CRUISE';
      } else if (isRail) {
        productPrefix = 'TIA-RAIL';  
      }
      
      const bookingRef = tourplanRef || `${productPrefix}-${Date.now()}`;
      
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
          : `Your ${isCruise ? 'cruise' : isRail ? 'rail' : ''} booking has been received. Our team will contact you within 48 hours to confirm availability.`,
        rawResponse: result.rawResponse
      };
      
      console.log('📝 Manual confirmation booking created:', bookingRef);
      
      // Send email notifications
      try {
        // Send customer email
        await sendBookingConfirmation({
          reference: bookingRef,
          customerEmail: data.email || 'noreply@thisisafrica.com.au',
          customerName: data.customerName,
          productName: `${data.productCode} - ${isCruise ? 'Cruise' : isRail ? 'Rail Journey' : 'Tour'}`,
          dateFrom: data.dateFrom,
          dateTo: data.dateTo,
          totalCost: result.totalCost || 0,
          currency: result.currency || 'AUD',
          status: quotedBooking.status,
          requiresManualConfirmation: true
        });
        
        // Send admin notification
        await sendAdminNotification({
          reference: bookingRef,
          customerName: data.customerName,
          customerEmail: data.email || 'noreply@thisisafrica.com.au',
          productCode: data.productCode,
          productName: `${data.productCode} - ${isCruise ? 'Cruise' : isRail ? 'Rail Journey' : 'Tour'}`,
          dateFrom: data.dateFrom,
          totalCost: result.totalCost || 0,
          currency: result.currency || 'AUD',
          requiresManualConfirmation: true,
          tourplanStatus: result.status
        });
        
        console.log('✅ Email notifications sent');
      } catch (emailError) {
        console.error('⚠️ Failed to send email notifications:', emailError);
        // Don't fail the booking if email fails
      }
      
      return successResponse(quotedBooking, 201);
    }
    
    // For successful bookings (status OK or other success statuses)
    if (result.bookingId || result.reference) {
      try {
        // Send customer confirmation
        await sendBookingConfirmation({
          reference: result.reference || result.bookingRef || result.bookingId,
          customerEmail: data.email || 'noreply@thisisafrica.com.au',
          customerName: data.customerName,
          productName: data.productCode,
          dateFrom: data.dateFrom,
          dateTo: data.dateTo,
          totalCost: result.totalCost || 0,
          currency: result.currency || 'AUD',
          status: result.status || 'CONFIRMED',
          requiresManualConfirmation: false
        });
        
        // Send admin notification for successful bookings too
        await sendAdminNotification({
          reference: result.reference || result.bookingRef || result.bookingId,
          customerName: data.customerName,
          customerEmail: data.email || 'noreply@thisisafrica.com.au',
          productCode: data.productCode,
          productName: data.productCode,
          dateFrom: data.dateFrom,
          totalCost: result.totalCost || 0,
          currency: result.currency || 'AUD',
          requiresManualConfirmation: false,
          tourplanStatus: result.status || 'OK'
        });
        
        console.log('✅ Email notifications sent for successful booking');
      } catch (emailError) {
        console.error('⚠️ Failed to send email notifications:', emailError);
        // Don't fail the booking if email fails
      }
    }
    
    return successResponse(result, 201);
  } catch (error) {
    console.error('❌ Booking API error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return handleTourPlanError(error);
  }
}

// PUT - Add service to existing booking (not currently used but ready for multi-service bookings)
export async function PUT(request: NextRequest) {
  try {
    const validationResult = await validateRequestBody(request, addServiceSchema);
    if (validationResult.error) return validationResult.error;
    
    const data = validationResult.data;
    // Note: This endpoint is prepared for future multi-service booking functionality
    
    return errorResponse('Multi-service booking not yet implemented', 501);
  } catch (error) {
    return handleTourPlanError(error);
  }
}