import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getBookingDetails, TourPlanClient } from '@/lib/tourplan';
import { 
  validateRequestBody,
  successResponse, 
  errorResponse, 
  handleTourPlanError 
} from '../../utils';

// Update booking schema
const updateBookingSchema = z.object({
  customerName: z.string().optional(),
  email: z.string().email().optional(),
  mobile: z.string().optional(),
  agentRef: z.string().optional(),
  status: z.enum(['C', 'X', 'Q']).optional(), // Confirmed, Cancelled, Quote
});

// GET - Get booking details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await params;
    
    if (!bookingId) {
      return errorResponse('Booking ID is required', 400);
    }
    
    // Use simplified service function
    const result = await getBookingDetails(bookingId);
    
    return successResponse({
      bookingId: result.bookingId,
      bookingRef: result.reference,
      status: result.status,
      customer: {
        name: result.customerName,
        email: result.email,
        mobile: result.mobile,
      },
      financial: {
        totalCost: result.totalCost,
        totalPaid: result.totalPaid,
        currency: result.currency,
        balance: result.totalCost - result.totalPaid,
      },
      services: result.services || [],
    });
  } catch (error) {
    return handleTourPlanError(error);
  }
}

// PATCH - Update booking details
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await params;
    
    if (!bookingId) {
      return errorResponse('Booking ID is required', 400);
    }
    
    const validationResult = await validateRequestBody(request, updateBookingSchema);
    if (validationResult.error) return validationResult.error;
    
    const data = validationResult.data;
    const client = new TourPlanClient();
    
    // Build update object
    const updates: Record<string, any> = {};
    if (data.customerName) updates.n = data.customerName;
    if (data.email) updates.Email = data.email;
    if (data.mobile) updates.Mobile = data.mobile;
    if (data.agentRef) updates.AgentRef = data.agentRef;
    if (data.status) updates.TourplanBookingStatus = data.status;
    
    const result = await client.updateBooking(bookingId, updates);
    
    if (result.Error) {
      return errorResponse(
        'Failed to update booking',
        400,
        result.Error
      );
    }
    
    return successResponse({
      bookingId: result.BookingId,
      bookingRef: result.BookingRef,
      status: result.Status,
      message: 'Booking updated successfully',
    });
  } catch (error) {
    return handleTourPlanError(error);
  }
}

// DELETE - Cancel booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await params;
    
    if (!bookingId) {
      return errorResponse('Booking ID is required', 400);
    }
    
    const client = new TourPlanClient();
    
    // First get the booking to get the reference
    const booking = await client.getBooking(bookingId);
    if (booking.Error) {
      return errorResponse(
        'Booking not found',
        404,
        booking.Error
      );
    }
    
    // Cancel using the booking reference
    const result = await client.cancelBooking(booking.BookingRef || bookingId);
    
    if (result.Error) {
      return errorResponse(
        'Failed to cancel booking',
        400,
        result.Error
      );
    }
    
    return successResponse({
      bookingId: result.BookingId,
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    return handleTourPlanError(error);
  }
}