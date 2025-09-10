import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createBooking, getProductDetails } from '@/lib/tourplan';
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
    console.log('🚨 BOOKING API POST CALLED - EMAIL DEBUG');
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
    console.log('📅 Booking dates:', data.dateFrom, 'to', data.dateTo);
    console.log('👥 Passengers:', data.adults, 'adults,', data.children || 0, 'children');
    console.log('📧 Customer email received:', data.email);
    console.log('📞 Customer mobile received:', data.mobile);
    console.log('👤 Customer name received:', data.customerName);
    
    // Use provided dates without complex product lookup (was causing Vercel timeouts)
    const calculatedDateTo = data.dateTo;
    const productName = data.productCode; // Use product code as fallback name
    
    const result = await createBooking({
      customerName: data.customerName,
      productCode: data.productCode,
      rateId: data.rateId || '',
      dateFrom: data.dateFrom,
      dateTo: calculatedDateTo,
      isQuote: data.bookingType === 'quote',
      email: data.email,
      mobile: data.mobile,
      adults: data.adults,
      children: data.children,
      infants: data.infants,
    });
    
    // Log the full TourPlan response for debugging
    console.log('📥 TourPlan booking response:', {
      status: result.status,
      bookingId: result.bookingId,
      reference: result.reference || result.bookingRef,
      message: result.message,
      totalCost: result.totalCost
    });
    
    // Extract configuration for analysis
    if (result.debugXml && result.status) {
      console.log('📊 BOOKING RESULT SUMMARY:');
      console.log('=====================================');
      console.log(`Product: ${data.productCode}`);
      console.log(`Status: ${result.status} ${result.status === 'NO' ? '❌ DECLINED' : result.status === 'OK' || result.status === 'RQ' || result.status === 'WQ' ? '✅ ACCEPTED' : '⚠️ UNKNOWN'}`);
      console.log(`Reference: ${result.reference || result.bookingRef || 'NONE'}`);
      console.log('=====================================');
      
      // If this is a known working product that failed, flag it
      const WORKING_PRODUCTS = ['NBOGTARP001CKEKEE', 'NBOGTARP001THRKE3'];
      if (WORKING_PRODUCTS.includes(data.productCode) && result.status === 'NO') {
        console.error('🚨 CRITICAL: A normally working product was declined!');
        console.error('This may indicate: wrong departure day, invalid dates, or TourPlan configuration change');
      }
    }
    
    // Define products that successfully book into TourPlan (based on testing - Aug 2025)
    // IMPORTANT: Cruise products require specific departure days (Mon/Wed/Fri)
    const WORKING_PRODUCTS = {
      GROUP_TOURS: [
        'NBOGTARP001CKSE',      // Classic Kenya - Serena lodges (WORKS)
        'NBOGTARP001CKEKEE',    // Classic Kenya - Keekorok lodges (WORKS)
        'NBOGTARP001CKSM',      // Classic Kenya - Mixed lodges (WORKS)
        'NBOGTSOAEASSNM061',    // East Africa tour (WORKS)
        'NBOGTSOAEASSNM131'     // East Africa tour variant (WORKS)
        // NOT WORKING: NBOGTARP001THRKE3, NBOGTARP001THRSE3 (return Status="NO")
      ],
      RAIL: ['VFARLROV001VFPRDX', 'VFARLROV001VFPRRY', 'VFARLROV001VFPYPM'],
      CRUISE: [
        'BBKCRCHO018TIACP2',  // Chobe Princess 2 night (Mon/Wed only)
        'BBKCRCHO018TIACP3',  // Chobe Princess 3 night (Mon/Wed)
        'BBKCRTVT001ZAM3NM',  // Zambezi Queen 3 night NM variant (Fridays only, Aug 15 - Nov 28)
        // Note: BBKCRTVT001ZAM3NS (NS variant) declines even with correct Friday dates
        // BBKCRCHO018TIACP4 status unknown - need departure days
      ]
    };
    
    // Check if this product is known to work with TourPlan
    const isWorkingProduct = 
      WORKING_PRODUCTS.GROUP_TOURS.includes(data.productCode) ||
      WORKING_PRODUCTS.RAIL.includes(data.productCode) ||
      WORKING_PRODUCTS.CRUISE.includes(data.productCode);
    
    // Check if this is a Group Tour (should go directly to TourPlan)
    const isGroupTour = data.productCode.includes('GT');
    if (isGroupTour) {
      console.log('✅ This is a Group Tour - should book directly into TourPlan');
      if (WORKING_PRODUCTS.GROUP_TOURS.includes(data.productCode)) {
        console.log('✅ This Group Tour product is configured correctly in TourPlan');
      } else {
        console.log('⚠️ This Group Tour product may be declined by TourPlan');
      }
    }
    
    // Handle different TourPlan responses
    if (result.status === 'NO' || result.status === 'WQ') {
      // NO = Declined, WQ = Website Quote (manual confirmation required)
      // RQ = On Request (successfully booked but awaiting confirmation) - should be treated as successful
      console.log(`⚠️ TourPlan returned status: ${result.status} - handling as quote requiring manual confirmation`);
      
      if (isWorkingProduct && result.status === 'NO') {
        console.error('❌ ERROR: A normally working product was declined by TourPlan!');
        console.error('Product:', data.productCode);
        console.error('Check: Date availability, rate validity, or TourPlan configuration changes');
      }
      
      // For quotes, we might still get a reference from TourPlan
      const tourplanRef = result.reference || result.bookingRef || null;
      const tourplanBookingId = result.bookingId || null;
      
      // Only generate TIA reference if TourPlan didn't provide one AND product is not known to work
      let bookingRef = tourplanRef;
      
      if (!tourplanRef) {
        // Only use TIA fallback for products that don't work with TourPlan
        if (isWorkingProduct) {
          // Working products should have gotten a TAWB reference
          console.error('⚠️ Warning: Working product did not get TourPlan reference!');
          bookingRef = `TIA-ERROR-${Date.now()}`;
        } else {
          // Non-working products get appropriate TIA prefix
          const isCruise = data.productCode.includes('CRCHO') ||    // Chobe Princess codes
                           data.productCode.includes('CRTVT') ||    // Zambezi Queen codes  
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
          if (isCruise && !WORKING_PRODUCTS.CRUISE.includes(data.productCode)) {
            productPrefix = 'TIA-CRUISE';
            console.log('📝 Using TIA-CRUISE fallback for non-working cruise product');
          } else if (isRail && !WORKING_PRODUCTS.RAIL.includes(data.productCode)) {
            productPrefix = 'TIA-RAIL';
            console.log('📝 Using TIA-RAIL fallback for non-working rail product');
          }
          
          bookingRef = `${productPrefix}-${Date.now()}`;
        }
      }
      
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
          dateTo: calculatedDateTo,
          adults: data.adults,
          children: data.children,
          infants: data.infants
        },
        requiresManualConfirmation: true,
        createdAt: new Date().toISOString(),
        message: result.status === 'WQ' 
          ? 'Quote created in TourPlan. Staff will confirm availability and finalize your booking within 48 hours.'
          : 'Your booking has been received. Our team will contact you within 48 hours to confirm availability.',
        rawResponse: result.rawResponse,
        // debugXml: result.debugXml, // Removed - causing 500 errors on Vercel
        configurationAnalysis: {
          productCode: data.productCode,
          status: result.status,
          expectedToWork: isWorkingProduct,
          statusMeaning: result.status === 'NO' ? 'Declined by TourPlan' : 
                         result.status === 'RQ' ? 'On Request' :
                         result.status === 'WQ' ? 'Website Quote' :
                         result.status === 'OK' ? 'Confirmed' : 'Unknown',
          requiresConfiguration: result.status === 'NO' && !isWorkingProduct ? 
            'Product needs TourPlan configuration for online booking' : 
            result.status === 'NO' && isWorkingProduct ?
            'Check departure day/dates - product normally works' : 
            'Manual confirmation required'
        }
      };
      
      console.log('📝 Manual confirmation booking created:', bookingRef);
      
      // Send email notifications
      try {
        // Send customer email
        await sendBookingConfirmation({
          reference: bookingRef,
          customerEmail: data.email || 'noreply@thisisafrica.com.au',
          customerName: data.customerName,
          productName: productName,
          dateFrom: data.dateFrom,
          dateTo: calculatedDateTo,
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
          productName: productName,
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
    
    // Handle RQ status (On Request - successfully booked but awaiting confirmation)
    if (result.status === 'RQ') {
      console.log('✅ TourPlan returned RQ status - booking successful, awaiting supplier confirmation');
      
      const confirmedBooking = {
        bookingId: result.bookingId,
        reference: result.reference || result.bookingRef,
        status: 'PENDING_SUPPLIER_CONFIRMATION',
        tourplanStatus: result.status,
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
          dateTo: calculatedDateTo,
          adults: data.adults,
          children: data.children,
          infants: data.infants
        },
        requiresManualConfirmation: false, // RQ is successfully in TourPlan
        createdAt: new Date().toISOString(),
        message: 'Your booking has been successfully submitted to TourPlan and is awaiting supplier confirmation.',
        rawResponse: result.rawResponse
      };
      
      // Send email notifications (as successful booking, not manual)
      try {
        await sendBookingConfirmation({
          reference: result.reference || result.bookingRef,
          customerEmail: data.email || 'noreply@thisisafrica.com.au',
          customerName: data.customerName,
          productName: productName,
          dateFrom: data.dateFrom,
          dateTo: calculatedDateTo,
          totalCost: result.totalCost || 0,
          currency: result.currency || 'AUD',
          status: 'PENDING_SUPPLIER_CONFIRMATION',
          requiresManualConfirmation: false
        });
        
        await sendAdminNotification({
          reference: result.reference || result.bookingRef,
          customerName: data.customerName,
          customerEmail: data.email || 'noreply@thisisafrica.com.au',
          productCode: data.productCode,
          productName: productName,
          dateFrom: data.dateFrom,
          totalCost: result.totalCost || 0,
          currency: result.currency || 'AUD',
          requiresManualConfirmation: false,
          tourplanStatus: result.status
        });
        
        console.log('✅ Email notifications sent for RQ booking');
      } catch (emailError) {
        console.error('⚠️ Failed to send email notifications:', emailError);
      }
      
      return successResponse(confirmedBooking, 201);
    }
    
    // For successful bookings (status OK or other success statuses)
    if (result.bookingId || result.reference) {
      try {
        // Send customer confirmation
        await sendBookingConfirmation({
          reference: result.reference || result.bookingRef || result.bookingId,
          customerEmail: data.email || 'noreply@thisisafrica.com.au',
          customerName: data.customerName,
          productName: productName,
          dateFrom: data.dateFrom,
          dateTo: calculatedDateTo,
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
          productName: productName,
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