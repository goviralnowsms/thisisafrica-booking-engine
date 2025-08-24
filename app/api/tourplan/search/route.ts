import { NextRequest } from 'next/server';
import { z } from 'zod';
import { searchProducts } from '@/lib/tourplan/services';
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

    // Validate based on product type
    let validatedData: any;
    let validationResult;

    switch (productType) {
      case 'Accommodation':
        validationResult = await validateRequestBody(request.clone(), accommodationSearchSchema);
        if (validationResult.error) return validationResult.error;
        validatedData = validationResult.data;
        break;

      case 'Day Tours':
      case 'Group Tours':
        validationResult = await validateRequestBody(request.clone(), tourSearchSchema);
        if (validationResult.error) return validationResult.error;
        validatedData = validationResult.data;
        break;

      case 'Cruises':
        validationResult = await validateRequestBody(request.clone(), cruiseSearchSchema);
        if (validationResult.error) return validationResult.error;
        validatedData = validationResult.data;
        break;

      default:
        validationResult = await validateRequestBody(request.clone(), baseSearchSchema);
        if (validationResult.error) return validationResult.error;
        validatedData = validationResult.data;
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
    console.log('Calling searchProducts with:', searchCriteria);
    const result = await searchProducts(searchCriteria);
    console.log('Search result:', result);

    if (result.error) {
      return errorResponse('Search failed', 400, { message: result.error });
    }
    
    if (result.message && !result.products?.length) {
      return errorResponse(result.message, 200);
    }

    // Enhance products with default images if needed
    const enhancedProducts = result.products.map((product: any) => {
      if (!product.image) {
        const productTypeKey = validatedData.productType.toLowerCase().replace(' ', '-');
        product.image = `/images/default-${productTypeKey}.jpg`;
      }
      return product;
    });

    return successResponse({
      searchCriteria: validatedData,
      products: enhancedProducts,
      totalResults: result.totalResults,
    });
  } catch (error) {
    return handleTourPlanError(error);
  }
}