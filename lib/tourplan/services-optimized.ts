/**
 * Optimized TourPlan services with caching and performance improvements
 * This file contains performance-optimized versions of search functions
 */

import { wpXmlRequest, extractResponseData } from './core';
import { tourPlanCache } from './cache';
import { 
  buildProperSearchRequest,
  buildGroupTourSearchRequest,
  buildCruiseSearchRequest,
  buildRailSearchRequest,
  buildPackagesSearchRequest,
} from './requests';
import { getLocalAssets } from '../image-index';

// Import existing catalogs and helpers from original services
import { 
  extractRatesFromOption, 
  extractArray,
  extractCountriesFromAmenities,
  applyDynamicDestinationFiltering,
  applyGroupToursFiltering
} from './services';

// Catalog exports removed - now using API-based filtering directly
// export { GROUP_TOURS_CATALOG, CRUISE_CATALOG, RAIL_CATALOG } from './services';

// Environment flag for debug logging
const DEBUG_MODE = process.env.NODE_ENV === 'development';
const log = DEBUG_MODE ? console.log : () => {};

/**
 * Optimized batch product details fetcher
 * Fetches multiple products in parallel with rate limiting
 */
async function batchGetProductDetails(
  productCodes: string[],
  maxConcurrent: number = 3
): Promise<Map<string, any>> {
  const results = new Map<string, any>();
  
  // Process in batches to avoid rate limiting
  for (let i = 0; i < productCodes.length; i += maxConcurrent) {
    const batch = productCodes.slice(i, i + maxConcurrent);
    
    const batchPromises = batch.map(async (code) => {
      // Check cache first
      const cacheKey = tourPlanCache.generateKey('product-detail', { code });
      const cached = tourPlanCache.get(cacheKey);
      
      if (cached) {
        log(`✅ Cache hit for product ${code}`);
        return { code, data: cached };
      }
      
      try {
        const data = await getProductDetailsOptimized(code);
        if (data) {
          // Cache for 10 minutes
          tourPlanCache.set(cacheKey, data, 10 * 60 * 1000);
        }
        return { code, data };
      } catch (error) {
        log(`❌ Failed to fetch ${code}:`, error);
        return { code, data: null };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    batchResults.forEach(({ code, data }) => {
      if (data) {
        results.set(code, data);
      }
    });
    
    // Small delay between batches to avoid rate limiting
    if (i + maxConcurrent < productCodes.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
}

/**
 * Optimized product details fetcher with minimal XML
 */
async function getProductDetailsOptimized(productCode: string): Promise<any> {
  const currentDate = new Date();
  const nextYear = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());
  const dateFrom = currentDate.toISOString().split('T')[0];
  const dateTo = nextYear.toISOString().split('T')[0];
  
  const xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${process.env.TOURPLAN_AGENTID || process.env.TOURPLAN_AGENT_ID}</AgentID>
    <Password>${process.env.TOURPLAN_AGENTPASSWORD || process.env.TOURPLAN_PASSWORD}</Password>
    <Opt>${productCode}</Opt>
    <Info>GM</Info>
    <DateFrom>${dateFrom}</DateFrom>
    <DateTo>${dateTo}</DateTo>
  </OptionInfoRequest>
</Request>`;
  
  const response = await wpXmlRequest(xml);
  const optionInfo = extractResponseData(response, 'OptionInfoReply');
  
  if (!optionInfo?.Option) {
    return null;
  }
  
  const option = optionInfo.Option;
  const rates = extractRatesFromOption(option);
  const localAssets = getLocalAssets(productCode);
  
  return {
    code: productCode,
    name: option.OptGeneral?.Description || `Product ${productCode}`,
    description: option.OptGeneral?.Comment || '',
    supplierName: option.OptGeneral?.SupplierName || '',
    location: option.OptGeneral?.LocalityDescription || '',
    class: option.OptGeneral?.ClassDescription || '',
    duration: option.OptGeneral?.Periods ? `${option.OptGeneral.Periods} nights` : '',
    rates,
    localAssets,
    countries: extractCountriesFromAmenities(option.Amenities)
  };
}

/**
 * Optimized main search function with caching and parallel processing
 */
export async function searchProductsOptimized(criteria: {
  productType: string;
  destination?: string;
  class?: string;
  dateFrom?: string;
  dateTo?: string;
  adults?: number;
  children?: number;
  roomConfigs?: any[];
  cabinConfigs?: any[];
}): Promise<{
  products: any[];
  totalResults: number;
  searchCriteria?: any;
  message?: string;
  error?: string;
}> {
  try {
    // Generate cache key for search
    const searchCacheKey = tourPlanCache.generateKey('search', criteria);
    
    // Check cache first
    const cachedResult = tourPlanCache.get(searchCacheKey);
    if (cachedResult) {
      log('✅ Cache hit for search');
      return cachedResult as any;
    }
    
    // Build appropriate XML request based on product type
    let xml = '';
    
    switch (criteria.productType) {
      case 'Group Tours':
      case 'Guided group tours':
        xml = buildGroupTourSearchRequest(
          criteria.destination,
          criteria.dateFrom,
          criteria.dateTo,
          criteria.adults,
          criteria.children
        );
        break;
        
      case 'Cruises':
        // For cruises, use catalog approach directly (faster)
        // Cruise catalog fallback removed - TourPlan API now works for cruises
        return {
          products: [],
          totalResults: 0
        };
        tourPlanCache.set(searchCacheKey, cruiseResults, 10 * 60 * 1000);
        return cruiseResults;
        
      case 'Rail':
      case 'Rail journeys':
        // For rail, use catalog approach directly (faster)
        const railResults = await searchRailFromCatalogOptimized(criteria);
        tourPlanCache.set(searchCacheKey, railResults, 10 * 60 * 1000);
        return railResults;
        
      case 'Packages':
      case 'Pre-designed packages':
        xml = buildPackagesSearchRequest(
          criteria.destination,
          criteria.dateFrom,
          criteria.dateTo
        );
        break;
        
      default:
        xml = buildProperSearchRequest(
          criteria.productType,
          criteria.destination,
          criteria.dateFrom,
          criteria.dateTo,
          criteria.adults || 2,
          criteria.children || 0
        );
    }
    
    // Make API request
    const response = await wpXmlRequest(xml);
    const optionInfo = extractResponseData(response, 'OptionInfoReply');
    
    // Handle empty or error responses
    if (!optionInfo?.Option) {
      const emptyResult = {
        products: [],
        totalResults: 0,
        searchCriteria: criteria,
        message: `No ${criteria.productType} found`
      };
      return emptyResult;
    }
    
    // Extract options
    const options = extractArray(optionInfo.Option);
    
    // Process products with optimized logic
    const products = options.map((option: any) => {
      const productCode = option.Opt || option['@_Opt'];
      const rates = extractRatesFromOption(option);
      
      // Use search response data directly (avoid extra API calls)
      return {
        id: productCode,
        code: productCode,
        name: option.OptGeneral?.Description || 'Unnamed Product',
        description: option.OptGeneral?.Comment || '',
        supplier: option.OptGeneral?.SupplierName || '',
        duration: option.OptGeneral?.Periods ? `${option.OptGeneral.Periods} nights` : '',
        location: option.OptGeneral?.LocalityDescription || '',
        locality: option.OptGeneral?.Locality || '',
        class: option.OptGeneral?.ClassDescription || '',
        countries: extractCountriesFromAmenities(option.Amenities),
        image: null,
        rates: rates.length > 0 ? rates : [{
          currency: 'AUD',
          singleRate: 0,
          rateName: 'Price on Application'
        }]
      };
    });
    
    // Filter out test products
    let finalProducts = products.filter((product: any) => 
      !product.name?.toLowerCase().includes('test') &&
      !product.description?.toLowerCase().includes('test')
    );
    
    // Apply filtering based on product type
    if (criteria.destination) {
      if (criteria.productType === 'Group Tours' || criteria.productType === 'Guided group tours') {
        finalProducts = applyGroupToursFiltering(finalProducts, criteria.destination, criteria.class || '');
      } else if (criteria.class) {
        finalProducts = applyDynamicDestinationFiltering(finalProducts, criteria.destination, criteria.class);
      }
    }
    
    const result = {
      products: finalProducts,
      totalResults: finalProducts.length,
      searchCriteria: criteria
    };
    
    // Cache the result
    tourPlanCache.set(searchCacheKey, result, 5 * 60 * 1000);
    
    return result;
    
  } catch (error) {
    console.error('Search error:', error);
    return {
      products: [],
      totalResults: 0,
      searchCriteria: criteria,
      error: error instanceof Error ? error.message : 'Search failed'
    };
  }
}

/**
 * Optimized cruise catalog search
 */
// searchCruisesFromCatalogOptimized function removed - now using API-based cruise search directly

/**
 * Optimized rail catalog search
 */
async function searchRailFromCatalogOptimized(criteria: any): Promise<any> {
  const RAIL_CODES = [
    'VFARLROV001VFPRDX',
    'VFARLROV001VFPRRY',
    'VFARLROV001VFPYPM',
    'CPTRLROV001RRCTPR',
    'CPTRLROV001CTPPUL',
    'CPTRLROV001CTPRRO',
    'PRYRLROV001ROV004',
    'PRYRLROV001PRCPRY',
    'PRYRLROV001PRCPPM',
  ];
  
  // Similar optimization as cruise search
  const cachedRail = new Map<string, any>();
  const toFetch: string[] = [];
  
  for (const code of RAIL_CODES) {
    const cacheKey = tourPlanCache.generateKey('product-detail', { code });
    const cached = tourPlanCache.get(cacheKey);
    if (cached) {
      cachedRail.set(code, cached);
    } else {
      toFetch.push(code);
    }
  }
  
  let fetchedProducts = new Map<string, any>();
  if (toFetch.length > 0) {
    fetchedProducts = await batchGetProductDetails(toFetch, 3);
  }
  
  const allProducts = [...cachedRail.values(), ...fetchedProducts.values()];
  
  return {
    products: allProducts,
    totalResults: allProducts.length,
    searchCriteria: criteria
  };
}