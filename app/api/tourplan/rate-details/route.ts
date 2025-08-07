import { NextRequest } from 'next/server';
import { getRateDetails } from '@/lib/tourplan/services';
import { successResponse, errorResponse, handleTourPlanError } from '../utils';

// GET - Get rate details for booking
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const productCode = searchParams.get('productCode');
    const dateFrom = searchParams.get('dateFrom');
    const adults = parseInt(searchParams.get('adults') || '2');
    const children = parseInt(searchParams.get('children') || '0');
    const roomType = searchParams.get('roomType') || 'DB';

    if (!productCode || !dateFrom) {
      return errorResponse('Missing required parameters: productCode and dateFrom', 400);
    }

    console.log('🔍 Getting rate details for:', {
      productCode,
      dateFrom,
      adults,
      children,
      roomType
    });

    const result = await getRateDetails(productCode, dateFrom, undefined, adults, children, roomType);

    return successResponse({
      rateId: result.rateId,
      productCode,
      dateFrom,
      adults,
      children,
      roomType
    });

  } catch (error) {
    console.error('❌ Rate details API error:', error);
    return handleTourPlanError(error);
  }
}