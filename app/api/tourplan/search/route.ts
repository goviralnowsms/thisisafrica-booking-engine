import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { searchProducts } from '@/lib/tourplan/services';
// Use optimized version if available
// import { searchProductsOptimized as searchProducts } from '@/lib/tourplan/services-optimized';
import { 
  validateRequestBody, 
  successResponse, 
  errorResponse, 
  handleTourPlanError,
  dateSchema,
  roomConfigSchema 
} from '../utils';

// Base search schema
const baseSearchSchema = z.object({
  productType: z.enum([
    'Day Tours',
    'Group Tours',
    'Accommodation',
    'Cruises',
    'Rail',
    'Packages',
    'Special Offers',
  ]),
  destination: z.string().optional(),
  class: z.string().optional(),
  dateFrom: dateSchema.optional(),
  dateTo: dateSchema.optional(),
});

// Accommodation search schema
const accommodationSearchSchema = baseSearchSchema.extend({
  productType: z.literal('Accommodation'),
  dateFrom: dateSchema,
  dateTo: dateSchema,
  roomConfigs: z.array(roomConfigSchema).min(1),
});

// Tour search schema
const tourSearchSchema = baseSearchSchema.extend({
  productType: z.enum(['Day Tours', 'Group Tours']),
  adults: z.number().int().min(1).optional(),
  children: z.number().int().min(0).optional(),
});

// Cruise search schema
const cruiseSearchSchema = baseSearchSchema.extend({
  productType: z.literal('Cruises'),
  cabinConfigs: z.array(roomConfigSchema).min(1),
});

export async function POST(request: NextRequest) {
  try {
    // Parse base request first to determine product type
    const baseBody = await request.json();
    const productType = baseBody.productType;

    // Validate based on product type using the already parsed body
    let validatedData: any;
    
    try {
      switch (productType) {
        case 'Accommodation':
          validatedData = accommodationSearchSchema.parse(baseBody);
          break;

        case 'Day Tours':
        case 'Group Tours':
          validatedData = tourSearchSchema.parse(baseBody);
          break;

        case 'Cruises':
          validatedData = cruiseSearchSchema.parse(baseBody);
          break;

        default:
          validatedData = baseSearchSchema.parse(baseBody);
      }
    } catch (zodError: any) {
      return errorResponse(
        'Validation failed',
        400,
        zodError?.errors || zodError?.message || 'Invalid request data'
      );
    }

    // Build search criteria for the simplified service
    const searchCriteria = {
      productType: validatedData.productType,
      destination: validatedData.destination,
      class: validatedData.class,
      dateFrom: validatedData.dateFrom,
      dateTo: validatedData.dateTo,
      adults: validatedData.adults,
      children: validatedData.children,
      roomConfigs: validatedData.roomConfigs || validatedData.cabinConfigs,
    };

    // Use simplified service function
    const result = await searchProducts(searchCriteria);
    
    if (result.error) {
      return errorResponse('Search failed', 400, { message: result.error });
    }
    
    if (result.message && !result.products?.length) {
      return errorResponse(result.message, 200);
    }

    // Enhance products with default images if needed
    const productsToEnhance = result.products || [];
    
    const enhancedProducts = productsToEnhance.map((product: any) => {
      if (!product.image) {
        const productTypeKey = validatedData.productType.toLowerCase().replace(' ', '-');
        product.image = `/images/default-${productTypeKey}.jpg`;
      }
      return product;
    });
    
    // Return flat structure without wrapping in 'data'
    const finalResponse = {
      success: true,
      searchCriteria: validatedData,
      products: enhancedProducts,
      totalResults: result.totalResults || enhancedProducts.length,
    };
    
    return NextResponse.json(finalResponse);
  } catch (error) {
    return handleTourPlanError(error);
  }
}