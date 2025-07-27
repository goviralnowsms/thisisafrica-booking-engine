import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getDestinations } from '@/lib/tourplan';
import { validateRequestBody, successResponse, errorResponse, handleTourPlanError } from '../utils';

// Request schema
const destinationsSchema = z.object({
  countryName: z.string().min(1, 'Country name is required'),
  reqType: z.string().default('Day Tours'),
});

export async function POST(request: NextRequest) {
  try {
    const validationResult = await validateRequestBody(request, destinationsSchema);
    if (validationResult.error) return validationResult.error;
    
    const { countryName, reqType } = validationResult.data;
    
    // Use simplified service function (replaces WordPress get_destination_ajax_handler)
    const result = await getDestinations(countryName, reqType);
    
    return successResponse(result);
  } catch (error) {
    return handleTourPlanError(error);
  }
}