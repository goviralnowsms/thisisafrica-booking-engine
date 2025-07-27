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
  rateId: z.string().min(1),
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
    const validationResult = await validateRequestBody(request, createBookingSchema);
    if (validationResult.error) return validationResult.error;
    
    const data = validationResult.data;
    
    // Use simplified service function
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
    
    return successResponse(result, 201);
  } catch (error) {
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