/**
 * Optimized TourPlan Search API Route
 * Uses caching, parallel processing, and production optimizations
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { tourPlanCache } from '@/lib/tourplan/cache';
import { tourPlanConfig, isFeatureEnabled, shouldUseCatalog } from '@/lib/tourplan/config';
import { logger } from '@/lib/tourplan/logger';
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
  const startTime = Date.now();
  
  try {
    // Parse request body
    const baseBody = await request.json();
    const productType = baseBody.productType;

    // Log request in development
    logger.debug('🔍 Search request:', { 
      productType, 
      destination: baseBody.destination,
      class: baseBody.class 
    });

    // Validate based on product type
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
      logger.warn('Validation failed:', zodError);
      return errorResponse(
        'Validation failed',
        400,
        zodError?.errors || zodError?.message || 'Invalid request data'
      );
    }

    // Build search criteria
    // For "From..." pricing display, we need all seasonal rates, not just user's date range
    // Use a broad 2+ year range to capture all seasonal pricing like WordPress
    const today = new Date();
    const searchDateFrom = today.toISOString().split('T')[0]; // Today in YYYY-MM-DD format
    const twoYearsFromNow = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate());
    const searchDateTo = twoYearsFromNow.toISOString().split('T')[0]; // 2 years from today
    
    const searchCriteria = {
      productType: validatedData.productType,
      destination: validatedData.destination,
      class: validatedData.class,
      dateFrom: searchDateFrom, // Use broad date range instead of user's filter
      dateTo: searchDateTo,     // Use broad date range instead of user's filter
      adults: validatedData.adults,
      children: validatedData.children,
      roomConfigs: validatedData.roomConfigs || validatedData.cabinConfigs,
      // Store the original user filters for display purposes
      _originalDateFrom: validatedData.dateFrom,
      _originalDateTo: validatedData.dateTo,
    };

    // Check cache first if enabled
    let result;
    const cacheKey = tourPlanCache.generateKey('search', searchCriteria);
    
    if (isFeatureEnabled('useOptimizedSearch') && tourPlanConfig.performance.enableCache) {
      const cached = tourPlanCache.get(cacheKey);
      if (cached) {
        logger.info('✅ Cache hit for search');
        const responseTime = Date.now() - startTime;
        logger.debug(`⚡ Response time: ${responseTime}ms (cached)`);
        
        return NextResponse.json({
          success: true,
          searchCriteria: cached.searchCriteria || {},
          tours: cached.products || [],
          totalResults: cached.totalResults || 0,
          _cached: true,
          _responseTime: responseTime
        });
      }
    }

    // Perform search
    logger.time('search-api-call');
    result = await searchProducts(searchCriteria);
    logger.timeEnd('search-api-call');

    if (result.error) {
      logger.error('Search failed:', result.error);
      return errorResponse('Search failed', 400, { message: result.error });
    }
    
    if (result.message && !result.products?.length) {
      return errorResponse(result.message, 200);
    }

    // Cache successful results
    if (isFeatureEnabled('useOptimizedSearch') && tourPlanConfig.performance.enableCache && result.products?.length > 0) {
      const cacheTTL = tourPlanConfig.performance.cacheTTL.search;
      tourPlanCache.set(cacheKey, {
        searchCriteria: validatedData,
        products: result.products,
        totalResults: result.totalResults,
      }, cacheTTL);
      logger.debug(`💾 Cached search results for ${cacheTTL / 1000}s`);
    }

    // Add default images if needed
    const enhancedProducts = result.products.map((product: any) => {
      if (!product.image) {
        const productTypeKey = validatedData.productType.toLowerCase().replace(' ', '-');
        product.image = `/images/default-${productTypeKey}.jpg`;
      }
      return product;
    });

    const responseTime = Date.now() - startTime;
    logger.info(`⚡ Search completed in ${responseTime}ms - ${enhancedProducts.length} results`);

    // Return response in format expected by frontend
    const response: any = {
      success: true,
      searchCriteria: validatedData,
      tours: enhancedProducts,  // Change from 'products' to 'tours' 
      totalResults: result.totalResults,
    };

    if (logger['isDevelopment']) {
      response._performance = {
        responseTime,
        cached: false,
        productCount: enhancedProducts.length
      };
    }

    return NextResponse.json(response);
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    logger.error(`❌ Search error after ${responseTime}ms:`, error);
    return handleTourPlanError(error);
  }
}

export async function GET(request: NextRequest) {
  // Cache statistics endpoint for monitoring
  if (request.nextUrl.searchParams.get('stats') === 'true') {
    const stats = tourPlanCache.getStats();
    return successResponse({
      cache: stats,
      config: {
        cacheEnabled: tourPlanConfig.performance.enableCache,
        ttl: tourPlanConfig.performance.cacheTTL,
        features: tourPlanConfig.features
      }
    });
  }
  
  // Handle regular GET search requests (from pages)
  const searchParams = request.nextUrl.searchParams;
  const destination = searchParams.get("destination") || undefined;
  const classFilter = searchParams.get("class") || undefined;
  const startDate = searchParams.get("startDate") || undefined;
  const endDate = searchParams.get("endDate") || undefined;
  const travelers = searchParams.get("travelers") ? Number.parseInt(searchParams.get("travelers")!) : undefined;
  const adults = searchParams.get("adults") ? Number.parseInt(searchParams.get("adults")!) : undefined;
  const children = searchParams.get("children") ? Number.parseInt(searchParams.get("children")!) : undefined;
  const productType = searchParams.get("productType") || 'Group Tours';

  console.log('⚡ GET /api/tourplan/search-fast - Search params:', {
    productType,
    destination,
    class: classFilter,
    startDate,
    endDate,
    adults: adults || travelers,
    children
  });

  const startTime = Date.now();
  
  try {
    // Build search criteria
    // For "From..." pricing display, we need all seasonal rates, not just user's date range
    // Use a broad 2+ year range to capture all seasonal pricing like WordPress
    const today = new Date();
    const searchDateFrom = today.toISOString().split('T')[0]; // Today in YYYY-MM-DD format
    const twoYearsFromNow = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate());
    const searchDateTo = twoYearsFromNow.toISOString().split('T')[0]; // 2 years from today
    
    const searchCriteria = {
      productType,
      destination,
      class: classFilter,
      dateFrom: searchDateFrom, // Use broad date range instead of user's filter
      dateTo: searchDateTo,     // Use broad date range instead of user's filter
      adults: adults || travelers,
      children: children,
      // Store the original user filters for display purposes
      _originalDateFrom: startDate,
      _originalDateTo: endDate,
    };

    // Check cache first if enabled
    let result;
    const cacheKey = tourPlanCache.generateKey('search', searchCriteria);
    
    if (isFeatureEnabled('useOptimizedSearch') && tourPlanConfig.performance.enableCache) {
      const cached = tourPlanCache.get(cacheKey);
      if (cached) {
        logger.info('✅ Cache hit for GET search');
        const responseTime = Date.now() - startTime;
        logger.debug(`⚡ Response time: ${responseTime}ms (cached)`);
        
        return NextResponse.json({
          success: true,
          tours: cached.products || [],
          totalResults: cached.totalResults || 0,
          _cached: true,
          _responseTime: responseTime
        });
      }
    }

    // Perform search
    result = await searchProducts(searchCriteria);

    if (result.error) {
      logger.error('Search failed:', result.error);
      return errorResponse('Search failed', 400, { message: result.error });
    }

    // Cache successful results
    if (isFeatureEnabled('useOptimizedSearch') && tourPlanConfig.performance.enableCache && result.products?.length > 0) {
      const cacheTTL = tourPlanConfig.performance.cacheTTL.search;
      tourPlanCache.set(cacheKey, {
        products: result.products,
        totalResults: result.totalResults,
      }, cacheTTL);
      logger.debug(`💾 Cached search results for ${cacheTTL / 1000}s`);
    }

    const responseTime = Date.now() - startTime;
    logger.info(`⚡ Search completed in ${responseTime}ms - ${result.products?.length || 0} results`);

    return NextResponse.json({
      success: true,
      tours: result.products || [],
      totalResults: result.totalResults || 0,
      _responseTime: responseTime
    });
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    logger.error(`❌ Search error after ${responseTime}ms:`, error);
    return handleTourPlanError(error);
  }
}