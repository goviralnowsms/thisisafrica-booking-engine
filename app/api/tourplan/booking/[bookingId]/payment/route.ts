import { NextRequest } from 'next/server';
import { z } from 'zod';
import { 
  getTourPlanClient, 
  validateRequestBody,
  successResponse, 
  errorResponse, 
  handleTourPlanError,
  dateSchema 
} from '../../../utils';

// Payment recording schema
const recordPaymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3),
  paymentDate: dateSchema,
  paymentMethod: z.enum(['CARD', 'CASH', 'BANK', 'OTHER']),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

// POST - Record payment
export async function POST(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const { bookingId } = params;
    
    if (!bookingId) {
      return errorResponse('Booking ID is required', 400);
    }
    
    const validationResult = await validateRequestBody(request, recordPaymentSchema);
    if (validationResult.error) return validationResult.error;
    
    const data = validationResult.data;
    const client = getTourPlanClient();
    
    const paymentData = {
      Amount: data.amount,
      Currency: data.currency,
      PaymentDate: data.paymentDate,
      PaymentMethod: data.paymentMethod,
      Reference: data.reference,
      Notes: data.notes,
    };
    
    const result = await client.recordPayment(bookingId, paymentData);
    
    if (result.Error) {
      return errorResponse(
        'Failed to record payment',
        400,
        result.Error
      );
    }
    
    return successResponse({
      bookingId: result.BookingId,
      bookingRef: result.BookingRef,
      message: 'Payment recorded successfully',
      totalCost: result.TotalCost,
      currency: result.Currency,
    }, 201);
  } catch (error) {
    return handleTourPlanError(error);
  }
}