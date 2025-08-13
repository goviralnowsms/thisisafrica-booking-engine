import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDestinations } from '@/lib/tourplan';
import { validateRequestBody, successResponse, errorResponse, handleTourPlanError } from '../utils';

// Request schema
const destinationsSchema = z.object({
  countryName: z.string().min(1, 'Country name is required'),
  reqType: z.string().default('Day Tours'),
});

/**
 * GET method for getting countries and destinations from TourPlan API
 * Replicates WordPress TourplanProductSearchOptions functionality
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const productType = searchParams.get("productType") || 'Group Tours'
  const country = searchParams.get("country") || ''

  try {
    console.log(`🗺️ Getting destinations for productType: ${productType}, country: ${country}`)
    
    // Use the same service function as POST method
    const result = await getDestinations(country, productType)
    
    return NextResponse.json({
      success: true,
      productType,
      country,
      // For countries: when country is empty, LocalityDescription contains available countries
      // For destinations: when country is provided, LocalityDescription contains destinations
      countries: country ? [] : result.LocalityDescription || [],
      destinations: country ? result.LocalityDescription || [] : [],
      classes: result.ClassDescription || [],
      localityCount: result.localityCount || 0,
      classesCount: result.classesCount || 0,
    })
  } catch (error) {
    console.error("API error getting destinations:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to get destinations",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

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