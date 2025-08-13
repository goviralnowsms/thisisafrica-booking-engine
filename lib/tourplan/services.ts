import { wpXmlRequest, extractResponseData, getTourPlanConfig } from './core';
import { 
  buildServiceButtonDetailsRequest,
  buildTourSearchRequest,
  buildGroupTourSearchRequest,
  buildAccommodationSearchRequest,
  buildCruiseSearchRequest,
  buildRailSearchRequest,
  buildPackagesSearchRequest,
  buildSpecialOffersSearchRequest,
  buildProperSearchRequest,
  OptionInfoRequest,
  AddServiceRequest,
  GetBookingRequest 
} from './requests';
import { getLocalAssets } from '../image-index';

/**
 * Curated cruise catalog
 * Maps destinations to known cruise product codes that exist in TourPlan
 */
/**
 * All 6 cruise products - they all operate from Botswana but visit different destinations
 */
const ALL_CRUISES = [
  'BBKCRCHO018TIACP2', // Chobe Princess 2 night
  'BBKCRCHO018TIACP3', // Chobe Princess 3 night
  'BBKCRTVT001ZAM2NM', // Zambezi Queen 2 night
  'BBKCRTVT001ZAM2NS', // Zambezi Queen 2 night (variant)
  'BBKCRTVT001ZAM3NM', // Zambezi Queen 3 night
  'BBKCRTVT001ZAM3NS', // Zambezi Queen 3 night/4 days
];

const CRUISE_CATALOG: Record<string, string[]> = {
  // All cruises operate from Botswana but can be filtered by destination
  'botswana': ALL_CRUISES, // Show all cruises when Botswana is selected
  'namibia': ALL_CRUISES,  // Show all cruises when Namibia is selected (they visit Namibian waters)
  'zambezi': ALL_CRUISES,  // Show all cruises when Zambezi is selected (they cruise the Zambezi river)
  'all': ALL_CRUISES       // Default - show all cruises
};

/**
 * Curated rail catalog
 * Maps destinations to known rail product codes that exist in TourPlan
 */
const ALL_RAIL_PRODUCTS = [
  // Zimbabwe rail products
  'VFARLROV001VFPRDX', // Victoria Falls rail journey
  'VFARLROV001VFPRRY', // Victoria Falls rail journey (variant)
  'VFARLROV001VFPYPM', // Victoria Falls rail journey (variant 2)
  // South Africa rail products
  'CPTRLROV001RRCTPR', // Cape Town rail journey
  'CPTRLROV001CTPPUL', // Cape Town rail journey (variant)
  'PRYRLROV001ROV004', // Pretoria Rovos Rail
  'PRYRLROV001PRCPRY', // Pretoria to Cape Town rail
  'PRYRLROV001PRCPPM', // Pretoria rail journey
];

const RAIL_CATALOG: Record<string, string[]> = {
  'zimbabwe': [
    'VFARLROV001VFPRDX', // Victoria Falls rail journey
    'VFARLROV001VFPRRY', // Victoria Falls rail journey (variant)
    'VFARLROV001VFPYPM', // Victoria Falls rail journey (variant 2)
  ],
  'south-africa': [
    'CPTRLROV001RRCTPR', // Cape Town rail journey
    'CPTRLROV001CTPPUL', // Cape Town rail journey (variant)
    'PRYRLROV001ROV004', // Pretoria Rovos Rail
    'PRYRLROV001PRCPRY', // Pretoria to Cape Town rail
    'PRYRLROV001PRCPPM', // Pretoria rail journey
  ],
  'victoria-falls': [
    'VFARLROV001VFPRDX', // Victoria Falls rail journey
    'VFARLROV001VFPRRY', // Victoria Falls rail journey (variant)
    'VFARLROV001VFPYPM', // Victoria Falls rail journey (variant 2)
  ],
  'cape-town': [
    'CPTRLROV001RRCTPR', // Cape Town rail journey
    'CPTRLROV001CTPPUL', // Cape Town rail journey (variant)
  ],
  'johannesburg': [
    'PRYRLROV001ROV004', // Pretoria Rovos Rail
    'PRYRLROV001PRCPRY', // Pretoria to Cape Town rail
    'PRYRLROV001PRCPPM', // Pretoria rail journey
  ],
  'pretoria': [
    'PRYRLROV001ROV004', // Pretoria Rovos Rail
    'PRYRLROV001PRCPRY', // Pretoria to Cape Town rail
    'PRYRLROV001PRCPPM', // Pretoria rail journey
  ],
  'all': ALL_RAIL_PRODUCTS
};

/**
 * Curated accommodation catalog
 * Since TourPlan ButtonName="Accommodation" returns empty results,
 * we use a curated list of known accommodation and tour products with lodging
 */
const ACCOMMODATION_CATALOG: Record<string, string[]> = {
  'all': [
    // Kenya accommodations and tours with lodging
    'NBOGTARP001CKSE', // Classic Kenya - Serena lodges (confirmed working)
    'NBOGTARP001CKEKEE', // Classic Kenya - Keekorok
    'NBOGTARP001CKSO', // Classic Kenya - other variant
    'NBOGTARP001CKSLP', // Classic Kenya luxury package
    'NBOGTARP001THRKE3', // Three parks Kenya
    'NBOGTARP001THRSE3', // Three parks Serena
    'NBOGTARP001THRSM3', // Three parks mixed
    'NBOGTARP001THRSO3', // Three parks other
    'NBOGTARP001EAESE', // East Africa Serena
    'NBOPKARP001CKSNPK', // Kenya National Parks
    'NBOPKARP001FIMMGV', // Governor's Camp
    'NBOPKARP001FIMMKT', // Kenya tented camp
    'NBOPKARP001FIMMLG', // Luxury lodge
    'NBOGTSOAEASN13124', // East Africa Safari Network
    
    // South Africa accommodations
    'CPTGTSUNWAYSUCV21', // Cape & Victoria Falls
    'CPTGTSUNWAYSUNA21', // Southern Africa tour
    'HDSSPMAKUTSMSSCLS', // Classic Kruger Package
    'JNBGTSUNWAYSUNA14', // Johannesburg based tours
    'JNBGTSATOURSAJOUR', // SA Journey
    
    // Tanzania accommodations
    'JROGTARP001SIMSE7', // Serengeti 7 days
    'JROGTARP001SIMTW7', // Tanzania wildlife
    'JROGTARP001SIMWEP', // Wilderness experience
    
    // Zimbabwe/Victoria Falls
    'VFAGTJENMANJENW12', // Victoria Falls 12 days
    'VFAGTJENMANJENW15', // Victoria Falls 15 days
    
    // Namibia
    'WDHGTSOANAMHINAMC', // Namibia classic
    'WDHGTULTSAFULTNAM', // Ultimate Namibia
    
    // Botswana
    'MUBGTSUNWAYSUNA13', // Botswana tours
    
    // Packages with accommodation
    'NBOPKTHISSAWLWFPC', // Wildlife package
    'BBKPKTVT001BOD6KM', // Botswana package
    'BBKPKTVT001CGLCOK', // Chobe/Okavango
  ],
  'kenya': [
    'NBOGTARP001CKSE', 'NBOGTARP001CKEKEE', 'NBOGTARP001CKSO', 'NBOGTARP001CKSLP',
    'NBOGTARP001THRKE3', 'NBOGTARP001THRSE3', 'NBOGTARP001THRSM3', 'NBOGTARP001THRSO3',
    'NBOGTARP001EAESE', 'NBOPKARP001CKSNPK', 'NBOPKARP001FIMMGV', 'NBOPKARP001FIMMKT',
    'NBOPKARP001FIMMLG', 'NBOGTSOAEASN13124', 'NBOPKTHISSAWLWFPC'
  ],
  'south-africa': [
    'CPTGTSUNWAYSUCV21', 'CPTGTSUNWAYSUNA21', 'HDSSPMAKUTSMSSCLS',
    'JNBGTSUNWAYSUNA14', 'JNBGTSATOURSAJOUR'
  ],
  'tanzania': [
    'JROGTARP001SIMSE7', 'JROGTARP001SIMTW7', 'JROGTARP001SIMWEP'
  ],
  'zimbabwe': [
    'VFAGTJENMANJENW12', 'VFAGTJENMANJENW15'
  ],
  'namibia': [
    'WDHGTSOANAMHINAMC', 'WDHGTULTSAFULTNAM'
  ],
  'botswana': [
    'MUBGTSUNWAYSUNA13', 'BBKPKTVT001BOD6KM', 'BBKPKTVT001CGLCOK'
  ],
  'victoria-falls': [
    'VFAGTJENMANJENW12', 'VFAGTJENMANJENW15', 'CPTGTSUNWAYSUCV21'
  ]
};

/**
 * Search accommodation using curated catalog
 * Since TourPlan ButtonName="Accommodation" returns empty results
 */
async function searchAccommodationFromCatalog(criteria: {
  productType: string;
  destination?: string;
  dateFrom?: string;
  dateTo?: string;
  adults?: number;
  children?: number;
  class?: string;
}): Promise<SearchResult> {
  try {
    console.log('🏨 Accommodation catalog search for:', criteria.destination || 'all destinations');
    
    // Determine which accommodation products to fetch based on destination
    const destination = criteria.destination?.toLowerCase() || 'all';
    let accommodationCodes = ACCOMMODATION_CATALOG[destination] || ACCOMMODATION_CATALOG['all'];
    
    // If specific destination not found, use all
    if (!ACCOMMODATION_CATALOG[destination] && destination !== 'all') {
      console.log(`🏨 No specific catalog for ${destination}, using all accommodations`);
      accommodationCodes = ACCOMMODATION_CATALOG['all'];
    }
    
    console.log(`🏨 Fetching ${accommodationCodes.length} accommodation products`);
    
    // Fetch product details for each accommodation code
    const accommodationPromises = accommodationCodes.map(async (code) => {
      try {
        const productData = await getProductDetails(code);
        
        if (productData) {
          return {
            id: productData.code || code,
            code: productData.code || code,
            name: productData.name || `Accommodation ${code}`,
            description: productData.description || '',
            supplier: productData.supplier || 'This is Africa',
            duration: productData.duration || '',
            destination: productData.destination || criteria.destination || '',
            image: productData.image || getLocalAssets(code).image || '/images/safari-lodge.png',
            rates: productData.rates || [],
            dateRanges: productData.dateRanges || [],
            productType: 'Accommodation',
            tourLevel: productData.tourLevel || 'standard'
          };
        }
        return null;
      } catch (error) {
        console.error(`Error fetching accommodation ${code}:`, error);
        return null;
      }
    });
    
    const accommodationResults = await Promise.all(accommodationPromises);
    const validAccommodations = accommodationResults.filter(r => r !== null);
    
    console.log(`🏨 Successfully loaded ${validAccommodations.length} accommodation products`);
    
    // Apply date filtering if provided
    let filteredAccommodations = validAccommodations;
    if (criteria.dateFrom || criteria.dateTo) {
      filteredAccommodations = validAccommodations.filter(accommodation => {
        // If accommodation has date ranges, check availability
        if (accommodation.dateRanges && accommodation.dateRanges.length > 0) {
          return accommodation.dateRanges.some((range: any) => {
            const rangeStart = new Date(range.dateFrom);
            const rangeEnd = new Date(range.dateTo || range.dateFrom);
            const searchStart = criteria.dateFrom ? new Date(criteria.dateFrom) : rangeStart;
            const searchEnd = criteria.dateTo ? new Date(criteria.dateTo) : rangeEnd;
            
            return rangeStart <= searchEnd && rangeEnd >= searchStart;
          });
        }
        // If no date ranges, include it (always available)
        return true;
      });
    }
    
    // Filter out test products
    const accommodationsBeforeTestFilter = filteredAccommodations.length;
    filteredAccommodations = filteredAccommodations.filter((product: any) => 
      !product.name?.toLowerCase().includes('test') &&
      !product.description?.toLowerCase().includes('test')
    );
    if (accommodationsBeforeTestFilter > filteredAccommodations.length) {
      console.log(`🧪 Filtered out ${accommodationsBeforeTestFilter - filteredAccommodations.length} test accommodation products`);
    }
    
    return {
      products: filteredAccommodations,
      totalResults: filteredAccommodations.length,
      searchCriteria: criteria,
      message: `Found ${filteredAccommodations.length} accommodation options`,
    };
  } catch (error) {
    console.error('❌ Accommodation catalog search error:', error);
    return {
      products: [],
      totalResults: 0,
      searchCriteria: criteria,
      error: 'Failed to search accommodations',
    };
  }
}

/**
 * Get destinations and classes for a country/product type
 * Replaces WordPress get_destination_ajax_handler()
 */
export async function getDestinations(countryName: string, reqType: string = 'Day Tours') {
  try {
    // Try both Group Tours and Day Tours to get comprehensive country/destination list
    const requests = [reqType];
    
    // For Group Tours, also try Day Tours as fallback since WordPress might be using Day Tours API
    if (reqType === 'Group Tours') {
      requests.push('Day Tours');
    }
    
    let bestResult = null;
    let maxLocalities = 0;
    
    for (const buttonName of requests) {
      try {
        console.log(`🔍 Trying ButtonName="${buttonName}" for ${countryName || 'countries list'}`);
        const xml = buildServiceButtonDetailsRequest(buttonName, countryName);
        const response = await wpXmlRequest(xml);
        
        // Extract localities and classes from response
        const buttonDetails = extractResponseData(response, 'GetServiceButtonDetailsReply');
        
        // Handle different response structures:
        // For countries list: check Countries.Country.CountryName
        // For destinations list: check LocalityDescriptions.LocalityDescription
        let localities = [];
        
        if (buttonDetails?.Countries?.Country && !countryName) {
          // Getting countries list - extract CountryName from Countries.Country array
          const countries = extractArray(buttonDetails.Countries.Country);
          localities = countries.map((country: any) => country.CountryName).filter(Boolean);
          console.log(`📍 Extracted ${localities.length} countries:`, localities);
        } else if (buttonDetails?.LocalityDescriptions?.LocalityDescription) {
          // Getting destinations list - extract from LocalityDescriptions
          localities = extractArray(buttonDetails.LocalityDescriptions.LocalityDescription);
          console.log(`📍 Extracted ${localities.length} destinations:`, localities);
        }
        
        const classes = extractArray(buttonDetails?.ClassDescriptions?.ClassDescription);
        
        console.log(`✅ ButtonName="${buttonName}" returned ${localities.length} localities, ${classes.length} classes`);
        
        // Use the result with the most localities (countries or destinations)
        if (localities.length > maxLocalities) {
          maxLocalities = localities.length;
          bestResult = {
            reqType: buttonName,
            countryName,
            LocalityDescription: localities,
            ClassDescription: classes,
            localityCount: localities.length,
            classesCount: classes.length,
          };
        }
      } catch (error) {
        console.warn(`⚠️ ButtonName="${buttonName}" failed:`, error);
      }
    }
    
    if (bestResult) {
      console.log(`🎯 Using best result from ButtonName="${bestResult.reqType}" with ${bestResult.localityCount} localities`);
      return bestResult;
    }
    
    // Fallback if all requests failed
    return {
      reqType,
      countryName,
      LocalityDescription: [],
      ClassDescription: [],
      localityCount: 0,
      classesCount: 0,
    };
  } catch (error) {
    console.error('Error getting destinations:', error);
    return {
      reqType,
      countryName,
      LocalityDescription: [],
      ClassDescription: [],
      localityCount: 0,
      classesCount: 0,
    };
  }
}

/**
 * Search rail journeys using curated catalog
 * Since TourPlan Rail search returns empty results but direct product lookup works
 */
async function searchRailFromCatalog(criteria: {
  productType: string;
  destination?: string;
  dateFrom?: string;
  dateTo?: string;
  adults?: number;
  children?: number;
  class?: string;
}): Promise<SearchResult> {
  try {
    console.log('🚂 Rail catalog search for:', criteria.destination);
    
    // Determine which rail products to fetch based on destination
    const destination = criteria.destination?.toLowerCase() || 'all';
    const railCodes = RAIL_CATALOG[destination] || RAIL_CATALOG['all'];
    
    // Fetch product details for each rail code
    const railPromises = railCodes.map(async (code) => {
      try {
        const productData = await getProductDetails(code);
        
        if (productData) {
          return {
            id: productData.code || code,
            code: productData.code || code,
            name: productData.name || 'Rail Journey',
            description: productData.description || '',
            supplier: productData.supplierName || 'Railway Operator',
            destination: productData.location || 'Africa',
            duration: productData.duration || 'Multi-day',
            rates: productData.rates || [],
            localAssets: productData.localAssets
          };
        }
        return null;
      } catch (error) {
        console.warn(`⚠️ Failed to fetch rail product ${code}:`, error);
        return null;
      }
    });
    
    // Wait for all rail products to be fetched
    const railResults = await Promise.all(railPromises);
    let validRailProducts = railResults.filter(product => product !== null);
    
    // Filter out test products
    const railBeforeTestFilter = validRailProducts.length;
    validRailProducts = validRailProducts.filter((product: any) => 
      !product.name?.toLowerCase().includes('test') &&
      !product.description?.toLowerCase().includes('test')
    );
    if (railBeforeTestFilter > validRailProducts.length) {
      console.log(`🧪 Filtered out ${railBeforeTestFilter - validRailProducts.length} test rail products`);
    }
    
    console.log(`🚂 Successfully fetched ${validRailProducts.length} rail products`);
    
    return {
      success: true,
      tours: validRailProducts,
      totalResults: validRailProducts.length,
      searchCriteria: criteria
    };
    
  } catch (error) {
    console.error('❌ Rail catalog search failed:', error);
    return {
      success: false,
      tours: [],
      totalResults: 0,
      error: 'Failed to search rail journeys',
      searchCriteria: criteria
    };
  }
}

/**
 * Search Rail using TourPlan API (works for South Africa and Zimbabwe)
 * Falls back to catalog if API returns no results
 */
async function searchRailFromTourPlanAPI(criteria: {
  productType: string;
  destination?: string;
  dateFrom?: string;
  dateTo?: string;
  adults?: number;
  children?: number;
  class?: string;
}): Promise<{products: any[], totalResults: number, searchCriteria?: any}> {
  try {
    // Map destination names to TourPlan API format
    const destinationMapping: Record<string, string> = {
      'south-africa': 'South Africa',
      'south africa': 'South Africa',
      'southafrica': 'South Africa',
      'zimbabwe': 'Zimbabwe',
      'victoria-falls': 'Zimbabwe',
      'victoria falls': 'Zimbabwe',
      'victoriafalls': 'Zimbabwe'
    };

    const destination = criteria.destination?.toLowerCase();
    const tourPlanDestination = destination ? destinationMapping[destination] : null;

    if (!tourPlanDestination) {
      console.log(`🚂 TourPlan API: No mapping for destination "${criteria.destination}", returning empty`);
      return {
        products: [],
        totalResults: 0,
        searchCriteria: criteria
      };
    }

    console.log(`🚂 TourPlan API: Searching Rail for "${tourPlanDestination}"`);
    
    // Build Rail search request
    const xml = buildRailSearchRequest(tourPlanDestination, criteria.dateFrom, criteria.dateTo);
    const response = await wpXmlRequest(xml);
    const optionInfo = extractResponseData(response, 'OptionInfoReply');

    if (!optionInfo.Option) {
      console.log(`🚂 TourPlan API: No rail products found for ${tourPlanDestination}`);
      return {
        products: [],
        totalResults: 0,
        searchCriteria: criteria
      };
    }

    // Convert response to products array
    const options = Array.isArray(optionInfo.Option) ? optionInfo.Option : [optionInfo.Option];
    const railProducts = [];

    for (const option of options) {
      try {
        const productCode = option.Opt;
        console.log(`🚂 TourPlan API: Processing rail product ${productCode}`);
        
        // Get detailed product information
        const productDetails = await getProductDetails(productCode);
        
        if (productDetails) {
          railProducts.push({
            id: productCode,
            code: productCode,
            name: productDetails.name || `Rail Journey ${productCode}`,
            description: productDetails.description || '',
            supplier: productDetails.supplierName || 'Railway Operator',
            destination: tourPlanDestination,
            duration: productDetails.duration || 'Multi-day',
            rates: productDetails.rates || [],
            images: getLocalAssets('rail').images || [],
            level: 'luxury',
            productType: 'Rail',
            source: 'tourplan-api'
          });
        }
      } catch (error) {
        console.error(`🚂 Error processing rail product ${option.Opt}:`, error);
      }
    }

    console.log(`🚂 TourPlan API: Successfully found ${railProducts.length} rail products`);
    
    return {
      products: railProducts,
      totalResults: railProducts.length,
      searchCriteria: criteria
    };
    
  } catch (error) {
    console.error('❌ TourPlan API rail search failed:', error);
    return {
      products: [],
      totalResults: 0,
      searchCriteria: criteria
    };
  }
}

/**
 * Helper function to add delay between API calls
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Helper function to retry API calls with exponential backoff
 */
async function retryApiCall<T>(
  fn: () => Promise<T>, 
  maxRetries: number = 3, 
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Add delay before each attempt (except the first)
      if (attempt > 0) {
        const delayMs = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`⏳ Retrying in ${delayMs}ms (attempt ${attempt + 1}/${maxRetries})`);
        await delay(delayMs);
      }
      
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`🔄 Attempt ${attempt + 1}/${maxRetries} failed:`, lastError.message);
      
      // If it's a rate limiting error, wait longer
      if (lastError.message.includes('2050') || lastError.message.includes('Request denied')) {
        console.log('🚫 Rate limiting detected, using longer delay');
        await delay(3000); // 3 second delay for rate limiting
      }
    }
  }
  
  throw lastError || new Error('All retry attempts failed');
}

/**
 * Search cruises using curated catalog with rate limiting protection
 * Since TourPlan returns empty results for cruise searches
 */
async function searchCruisesFromCatalog(criteria: {
  productType: string;
  destination?: string;
  dateFrom?: string;
  dateTo?: string;
  adults?: number;
  children?: number;
}) {
  console.log('🚢 Searching cruise catalog with criteria:', criteria);
  
  // Get product codes for cruises - all cruises are available regardless of destination filter
  let productCodes: string[] = ALL_CRUISES;
  
  console.log('🚢 Using all cruise product codes:', productCodes);
  console.log('🚢 Implementing rate limiting protection with delays between calls');
  
  // Fetch details for each cruise with rate limiting protection
  const cruiseProducts = [];
  const errors = [];
  
  for (let i = 0; i < productCodes.length; i++) {
    const productCode = productCodes[i];
    
    try {
      console.log(`🚢 Fetching details for cruise ${i + 1}/${productCodes.length}: ${productCode}`);
      
      // Use retry logic with exponential backoff
      const productDetails = await retryApiCall(
        () => getProductDetails(productCode),
        3, // max 3 retries
        2000 // start with 2 second delay
      );
      
      if (productDetails && productDetails.name) {
        cruiseProducts.push({
          id: productCode,
          code: productCode,
          name: productDetails.name,
          description: productDetails.description || 'River cruise in Southern Africa',
          supplier: productDetails.supplierName || 'River Cruise Operator',
          duration: productDetails.duration || 'Multi-day cruise',
          country: 'Botswana',
          locality: 'Chobe/Zambezi Rivers',
          rates: productDetails.rates || [],
          images: [],
          inclusions: [],
          exclusions: []
        });
        console.log(`✅ Successfully loaded: ${productDetails.name}`);
      } else {
        console.warn(`⚠️ Product ${productCode} returned no data`);
      }
      
      // Add delay between successful calls to respect rate limits
      if (i < productCodes.length - 1) {
        console.log('⏳ Waiting 1.5s before next API call...');
        await delay(1500);
      }
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`❌ Failed to fetch details for ${productCode} after retries:`, errorMsg);
      errors.push({ productCode, error: errorMsg });
      
      // Don't add fallback entries that cause UI confusion
      // Instead, continue with successful products only
      console.log('🚫 Skipping fallback entry to avoid UI confusion');
      
      // Add longer delay after errors to let rate limits reset
      if (i < productCodes.length - 1) {
        console.log('⏳ Waiting 3s after error before next attempt...');
        await delay(3000);
      }
    }
  }
  
  console.log(`🚢 Successfully loaded ${cruiseProducts.length}/${productCodes.length} cruise products`);
  if (errors.length > 0) {
    console.log(`❌ Failed to load ${errors.length} products:`, errors);
  }
  
  // Filter out test products
  const cruisesBeforeTestFilter = cruiseProducts.length;
  const filteredCruiseProducts = cruiseProducts.filter((product: any) => 
    !product.name?.toLowerCase().includes('test') &&
    !product.description?.toLowerCase().includes('test')
  );
  if (cruisesBeforeTestFilter > filteredCruiseProducts.length) {
    console.log(`🧪 Filtered out ${cruisesBeforeTestFilter - filteredCruiseProducts.length} test cruise products`);
  }
  
  return {
    products: filteredCruiseProducts,
    totalResults: filteredCruiseProducts.length,
    searchCriteria: criteria,
    errors: errors // Include error info for debugging
  };
}


/**
 * Search for tours/products
 * Replaces WordPress TourplanProductSearchOptions functionality
 */
export async function searchProducts(criteria: {
  productType: string;
  destination?: string;
  dateFrom?: string;
  dateTo?: string;
  adults?: number;
  children?: number;
  roomConfigs?: Array<{Adults: number, Children?: number, Type: string, Quantity: number}>;
}): Promise<{products: any[], totalResults: number, searchCriteria?: any}> {
  try {
    let xml: string;
    
    // Build appropriate request based on product type
    switch (criteria.productType) {
      case 'Day Tours':
        xml = buildTourSearchRequest(criteria.destination, criteria.dateFrom, criteria.dateTo);
        break;
        
      case 'Group Tours':
      case 'Guided group tours':
        xml = buildGroupTourSearchRequest(criteria.destination, criteria.dateFrom, criteria.dateTo);
        break;
        
      case 'Accommodation':
        // Since TourPlan ButtonName="Accommodation" returns empty, use catalog approach
        console.log('🏨 Using curated accommodation catalog (ButtonName search returns empty)');
        return searchAccommodationFromCatalog(criteria);
        
      case 'Hotels':
        // Test Hotels ButtonName as alternative to Accommodation
        console.log('🏨 Testing ButtonName="Hotels" for accommodation');
        const hotelRoomConfigs = [{
          Adults: criteria.adults || 2,
          Children: criteria.children || 0,
          Type: 'DB',
          Quantity: 1
        }];
        // Build request with Hotels ButtonName
        const hotelRequest = new OptionInfoRequest()
          .setButtonName('Hotels')
          .setInfo('GS')
          .setDateRange(criteria.dateFrom || '', criteria.dateTo || '')
          .setRateConvert(true)
          .setRoomConfigs(hotelRoomConfigs);
        
        if (criteria.destination && criteria.destination.trim()) {
          hotelRequest.setDestination(criteria.destination);
        }
        
        xml = hotelRequest.build();
        break;

      case 'Cruises':
        // Try TourPlan API first with corrected ButtonName="Cruise" and Botswana destination
        console.log('🚢 Attempting TourPlan API cruise search with ButtonName="Cruise" and Botswana');
        xml = buildCruiseSearchRequest(criteria.destination, criteria.dateFrom, criteria.dateTo);
        console.log('🚢 Cruise search XML built with corrected parameters');
        break;
        
      case 'Rail':
      case 'Rail journeys':
        // Try TourPlan API first for destinations that work, fallback to catalog
        console.log('🚂 Attempting TourPlan API rail search first');
        const railApiResults = await searchRailFromTourPlanAPI(criteria);
        if (railApiResults.totalResults > 0) {
          console.log(`🚂 ✅ TourPlan API returned ${railApiResults.totalResults} rail products`);
          return railApiResults;
        } else {
          console.log('🚂 ⚠️ TourPlan API returned no results, falling back to curated catalog');
          const railResults = await searchRailFromCatalog(criteria);
          return {
            products: railResults.tours || [],
            totalResults: railResults.totalResults || 0,
            searchCriteria: criteria
          };
        }
        
      case 'Packages':
      case 'Pre-designed packages':
        // Packages use ButtonName="Packages" with Info="P"  
        console.log('📦 Building packages search with destination:', criteria.destination);
        xml = buildPackagesSearchRequest(criteria.destination, criteria.dateFrom, criteria.dateTo);
        console.log('📦 Packages search XML built');
        break;
        
      case 'Special Offers':
        // Special Offers use ButtonName="Special Offers" without Info parameter
        console.log('🎁 Building special offers search with destination:', criteria.destination);
        xml = buildSpecialOffersSearchRequest(criteria.destination, criteria.dateFrom, criteria.dateTo);
        console.log('🎁 Special offers search XML built');
        break;
        
      default:
        // Test various ButtonNames for accommodation dynamically
        const accommodationButtonNames = ['Hotels', 'Hotel', 'Lodging', 'Lodgings', 'Lodge', 'Lodges', 
                                         'Stay', 'Stays', 'Accommodations', 'Property', 'Properties',
                                         'Resort', 'Resorts', 'Guest House', 'Guesthouse'];
        
        if (accommodationButtonNames.includes(criteria.productType)) {
          console.log(`🏨 Testing ButtonName="${criteria.productType}" for accommodation`);
          const testRoomConfigs = [{
            Adults: criteria.adults || 2,
            Children: criteria.children || 0,
            Type: 'DB',
            Quantity: 1
          }];
          const testRequest = new OptionInfoRequest()
            .setButtonName(criteria.productType)
            .setInfo('GS')
            .setDateRange(criteria.dateFrom || '', criteria.dateTo || '')
            .setRateConvert(true)
            .setRoomConfigs(testRoomConfigs);
          
          if (criteria.destination && criteria.destination.trim()) {
            testRequest.setDestination(criteria.destination);
          }
          
          xml = testRequest.build();
        } else {
          // Generic search using the working pattern
          xml = buildProperSearchRequest(
            criteria.productType, 
            criteria.destination, 
            criteria.dateFrom, 
            criteria.dateTo,
            criteria.adults || 2,
            criteria.children || 0
          );
        }
        break;
    }
    
    console.log('Sending TourPlan search XML:', xml);
    
    // Use retry logic for search requests to handle rate limiting
    const response = await retryApiCall(
      () => wpXmlRequest(xml),
      3, // max 3 retries
      2000 // start with 2 second delay
    );
    const optionInfo = extractResponseData(response, 'OptionInfoReply');
    
    // Enhanced debug logging for accommodation
    if (criteria.productType === 'Accommodation') {
      console.log('🏨 Raw TourPlan response for accommodation:', JSON.stringify(response, null, 2));
      console.log('🏨 Extracted option info:', JSON.stringify(optionInfo, null, 2));
    } else {
      console.log('Search response:', JSON.stringify(optionInfo, null, 2));
    }
    
    // Check if response indicates no results or error
    if (!optionInfo || optionInfo.Status === 'unusable' || optionInfo.Message) {
      console.log('No results or error in search:', optionInfo?.Message || 'No options found');
      
      // If accommodation search failed, try searching under "Packages" as fallback
      if (criteria.productType === 'Accommodation') {
        console.log('🏨 Accommodation search failed, trying fallback search under Packages...');
        try {
          const fallbackResult = await searchProducts({
            ...criteria,
            productType: 'Packages'
          });
          
          // Filter results to only include accommodation-like products
          const accommodationProducts = fallbackResult.products.filter((product: any) => 
            product.name?.toLowerCase().includes('lodge') ||
            product.name?.toLowerCase().includes('camp') ||
            product.name?.toLowerCase().includes('hotel') ||
            product.name?.toLowerCase().includes('resort') ||
            product.description?.toLowerCase().includes('accommodation')
          );
          
          if (accommodationProducts.length > 0) {
            console.log(`🏨 Found ${accommodationProducts.length} accommodation products in Packages`);
            return {
              products: accommodationProducts,
              totalResults: accommodationProducts.length,
              searchCriteria: criteria,
              message: `Found accommodation options (${accommodationProducts.length} properties)`,
            };
          }
        } catch (error) {
          console.log('🏨 Fallback search also failed:', error);
        }
      }
      
      return {
        products: [],
        totalResults: 0,
        searchCriteria: criteria,
        message: optionInfo?.Message || 'No tours found for your search criteria',
      };
    }
    
    // Check for empty response (no Option elements)
    if (!optionInfo.Option) {
      console.log('Empty response - no tours found');
      return {
        products: [],
        totalResults: 0,
        searchCriteria: criteria,
        message: criteria.destination 
          ? `No ${criteria.productType} found for ${criteria.destination}` 
          : `Please select a destination to search for ${criteria.productType}`,
      };
    }
    
    // Extract options and rates
    const options = extractArray(optionInfo?.Option);
    const rates = extractArray(optionInfo?.Rate);
    
    // Transform to consistent format using proven patterns from old booking engine
    const products = await Promise.all(options.map(async (option: any) => {
      const productCode = option.Opt || option['@_Opt'];
      
      // For Rail and Packages products, we need to get detailed information separately
      // because the search response doesn't include rich product data
      if ((criteria.productType === 'Rail' || criteria.productType === 'Rail journeys' || criteria.productType === 'Packages' || criteria.productType === 'Pre-designed packages') && productCode) {
        try {
          const productTypeIcon = (criteria.productType === 'Rail' || criteria.productType === 'Rail journeys') ? '🚂' : '📦';
          console.log(`${productTypeIcon} Getting detailed ${criteria.productType} product info for:`, productCode);
          const detailedProduct = await getProductDetails(productCode);
          
          const defaultName = (criteria.productType === 'Rail' || criteria.productType === 'Rail journeys') ? 'Rail Journey' : 'Travel Package';
          
          return {
            id: productCode,
            code: productCode,
            name: detailedProduct.name || defaultName,
            description: detailedProduct.description || detailedProduct.content?.introduction || '',
            supplier: detailedProduct.supplierName || '',
            duration: detailedProduct.duration || '',
            image: null,
            rates: detailedProduct.rates?.length > 0 ? detailedProduct.rates.map(rate => {
              // For packages, the API values appear to be in a different scale
              if (criteria.productType === 'Packages' || criteria.productType === 'Pre-designed packages') {
                return {
                  currency: rate.currency,
                  singleRate: Math.round(rate.singleRate || 0), // API values are already in dollars
                  doubleRate: Math.round(rate.doubleRate || 0), // API values are already in dollars  
                  twinRate: Math.round((rate.twinRate || 0) / 2), // Divide by 2 for per person twin share
                  rateName: rate.rateName || 'Standard'
                };
              } else {
                // For rail products, keep existing logic
                return {
                  currency: rate.currency,
                  singleRate: rate.singleRate || 0,
                  doubleRate: rate.doubleRate || 0,
                  twinRate: rate.twinRate || 0,
                  rateName: rate.rateName || 'Standard'
                };
              }
            }) : [{
              currency: 'AUD',
              singleRate: 0,
              rateName: 'Price on Application'
            }],
          };
        } catch (error) {
          console.error(`Failed to get detailed ${criteria.productType} product info for`, productCode, error);
          // Fallback to basic info
          const productRates = extractRatesFromOption(option);
          const defaultName = (criteria.productType === 'Rail' || criteria.productType === 'Rail journeys') ? 'Rail Journey' : 'Travel Package';
          
          return {
            id: productCode,
            code: productCode,
            name: option.OptGeneral?.Description || defaultName,
            description: option.OptGeneral?.Description || '',
            supplier: option.OptGeneral?.SupplierName || '',
            duration: option.OptGeneral?.Periods ? `${option.OptGeneral.Periods} nights` : '',
            image: null,
            rates: productRates,
          };
        }
      } else {
        // For other product types, use the basic search response data
        const productRates = extractRatesFromOption(option);
        
        return {
          id: option.Opt || option['@_Opt'],
          code: option.Opt || option['@_Opt'],
          name: option.OptGeneral?.Description || option.OptGeneral?.SupplierName || 'Unnamed Product',
          description: option.OptGeneral?.Description || '',
          supplier: option.OptGeneral?.SupplierName || '',
          duration: option.OptGeneral?.Periods ? `${option.OptGeneral.Periods} nights` : '',
          image: null,
          rates: productRates,
        };
      }
    }));
    
    // If this was an accommodation search using Special Offers fallback, filter for accommodation-like products
    let finalProducts = products;
    if (criteria.productType === 'Accommodation' && xml.includes('Special Offers')) {
      console.log('🏨 Filtering Special Offers results for accommodation products...');
      finalProducts = products.filter((product: any) => 
        product.name?.toLowerCase().includes('lodge') ||
        product.name?.toLowerCase().includes('camp') ||
        product.name?.toLowerCase().includes('hotel') ||
        product.name?.toLowerCase().includes('resort') ||
        product.name?.toLowerCase().includes('accommodation') ||
        product.name?.toLowerCase().includes('savanna') ||
        product.name?.toLowerCase().includes('sabi') ||
        product.description?.toLowerCase().includes('accommodation') ||
        product.description?.toLowerCase().includes('lodge') ||
        product.description?.toLowerCase().includes('camp')
      );
      console.log(`🏨 Filtered from ${products.length} to ${finalProducts.length} accommodation products`);
    }
    
    // Filter out test products from all results
    const productsBeforeTestFilter = finalProducts.length;
    finalProducts = finalProducts.filter((product: any) => 
      !product.name?.toLowerCase().includes('test') &&
      !product.description?.toLowerCase().includes('test')
    );
    if (productsBeforeTestFilter > finalProducts.length) {
      console.log(`🧪 Filtered out ${productsBeforeTestFilter - finalProducts.length} test products`);
    }
    
    return {
      products: finalProducts,
      totalResults: finalProducts.length,
      searchCriteria: criteria,
    };
  } catch (error) {
    console.error('Error searching products:', error);
    return {
      products: [],
      totalResults: 0,
      searchCriteria: criteria,
      error: error instanceof Error ? error.message : 'Search failed',
    };
  }
}

/**
 * Get detailed product information with enhanced date range
 * Replaces WordPress TourplanOptionRequest functionality
 */
export async function getProductDetails(productCode: string) {
  try {
    // Build request for this product with a broader date range to get more pricing data
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
    <Info>GMFTD</Info>
    <DateFrom>${dateFrom}</DateFrom>
    <DateTo>${dateTo}</DateTo>
    <RateConvert>Y</RateConvert>
  </OptionInfoRequest>
</Request>`;
    
    console.log('Getting product details for:', productCode);
    
    // Use retry logic for product detail requests to handle rate limiting
    const response = await retryApiCall(
      () => wpXmlRequest(xml),
      3, // max 3 retries
      2000 // start with 2 second delay
    );
    const optionInfo = extractResponseData(response, 'OptionInfoReply');
    
    if (!optionInfo?.Option) {
      throw new Error(`Product ${productCode} not found`);
    }
    
    const option = optionInfo.Option;
    
    // Extract rates using our helper function
    let productRates = extractRatesFromOption(option);
    
    // Check if this is a rail product for logging purposes
    const isRail = productCode.includes('RLROV') ||     // Rovos Rail codes like CPTRLROV001CTPPUL
                   productCode.includes('RAIL') ||      // General rail codes
                   productCode.toLowerCase().includes('rail') ||
                   productCode.includes('BLUE') ||      // Blue Train codes
                   productCode.includes('PREMIER')      // Premier Classe codes
    
    if (isRail) {
      console.log('🚂 Rail product detected - using live TourPlan API pricing:', {
        productCode,
        ratesFromAPI: productRates.length
      });
    }
    
    // Enhanced note parsing with all categories from WordPress patterns
    const notes: any[] = [];
    const structuredContent: any = {};
    
    if (option.OptionNotes?.OptionNote) {
      const notesList = extractArray(option.OptionNotes.OptionNote);
      notesList.forEach((note: any) => {
        const category = note.NoteCategory;
        const text = note.NoteText;
        
        // Store raw notes for compatibility
        notes.push({
          category,
          text
        });
        
        // Map to structured content like WordPress
        switch (category) {
          case 'PII': // Product Introduction/Information
            structuredContent.introduction = text;
            break;
          case 'PDW': // Product Details Web
          case 'DTL': // Details
            structuredContent.details = text;
            break;
          case 'INC': // Inclusions
          case 'INE': // Inclusions Extended
            structuredContent.inclusions = text;
            break;
          case 'EXC': // Exclusions
            structuredContent.exclusions = text;
            break;
          case 'PHL': // Product Highlights
          case 'HLT': // Highlights
          case 'SHL': // Short Highlights
            structuredContent.highlights = text;
            break;
          case 'TRM': // Terms
          case 'TCO': // Terms and Conditions
            structuredContent.terms = text;
            break;
          case 'MPI': // Map Image
            structuredContent.mapImage = text;
            break;
        }
      });
    }
    
    // Get local assets (images and PDFs)
    const localAssets = getLocalAssets(productCode);
    
    // Group rates by date ranges and consolidate pricing
    const rateGroups = new Map();
    
    productRates.forEach(rate => {
      const key = `${rate.dateFrom}-${rate.dateTo}-${rate.rateName || 'Standard'}`;
      if (!rateGroups.has(key)) {
        rateGroups.set(key, {
          dateFrom: rate.dateFrom,
          dateTo: rate.dateTo,
          rateName: rate.rateName || 'Standard',
          currency: rate.currency || 'AUD',
          singleRate: 0,
          doubleRate: 0,
          twinRate: 0
        });
      }
      
      const group = rateGroups.get(key);
      if (rate.singleRate) group.singleRate = rate.singleRate;
      if (rate.doubleRate) group.doubleRate = rate.doubleRate;
      if (rate.twinRate) group.twinRate = rate.twinRate;
    });
    
    // Transform consolidated rates to match WordPress format
    const formattedRates = Array.from(rateGroups.values()).map(rate => {
      const twinRateValue = rate.twinRate || rate.doubleRate || 0;
      const singleRateValue = rate.singleRate || 0;
      
      // Create proper date range display
      let dateRangeDisplay = 'Available dates';
      if (rate.dateFrom && rate.dateTo) {
        const fromDate = new Date(rate.dateFrom);
        const toDate = new Date(rate.dateTo);
        
        // If same date, show single date, otherwise show range
        if (rate.dateFrom === rate.dateTo) {
          dateRangeDisplay = fromDate.toLocaleDateString('en-AU', { 
            day: '2-digit', month: 'short', year: 'numeric' 
          });
        } else {
          dateRangeDisplay = `${fromDate.toLocaleDateString('en-AU', { 
            day: '2-digit', month: 'short' 
          })} - ${toDate.toLocaleDateString('en-AU', { 
            day: '2-digit', month: 'short', year: 'numeric' 
          })}`;
        }
      }
      
      return {
        dateRange: dateRangeDisplay,
        singleRate: singleRateValue,
        doubleRate: rate.doubleRate || rate.twinRate || 0,
        twinRate: twinRateValue,
        twinRateFormatted: twinRateValue > 0
          ? `${rate.currency} $${Math.round(twinRateValue / 2 / 100).toLocaleString()}`
          : 'POA',
        twinRateTotal: twinRateValue,
        currency: rate.currency,
        rateName: rate.rateName,
        dateFrom: rate.dateFrom,
        dateTo: rate.dateTo
      };
    });
    
    return {
      id: option.Opt,
      code: option.Opt,
      name: option.OptGeneral?.Description || 'Unnamed Product',
      description: option.OptGeneral?.Comment || '',
      supplierName: option.OptGeneral?.SupplierName || '',
      location: option.OptGeneral?.LocalityDescription || '',
      duration: option.OptGeneral?.Periods ? `${option.OptGeneral.Periods} days` : '',
      periods: parseInt(option.OptGeneral?.Periods || '0'),
      
      // Rates in WordPress format (sorted by date)
      rates: formattedRates.sort((a, b) => {
        if (!a.dateFrom || !b.dateFrom) return 0;
        return new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime();
      }),
      
      // Raw notes array for compatibility
      notes,
      
      // Structured content for easy access
      content: structuredContent,
      
      // Local assets (images and PDFs)
      localAssets,
      
      // Additional metadata
      locality: option.OptGeneral?.LocalityDescription,
      class: option.OptGeneral?.ClassDescription,
    };
  } catch (error) {
    console.error('Error getting product details:', error);
    throw error;
  }
}

/**
 * Get pricing for specific date ranges - used for calendar view
 * Returns pricing data for a date range with multiple departure dates
 */
export async function getPricingForDateRange(productCode: string, dateFrom: string, dateTo: string, adults: number = 2, children: number = 0, roomType: string = 'DB') {
  try {
    // Determine the correct Info parameter based on product type
    // Adding availability flags (A=basic availability, E=full availability, I=detailed)
    const isRail = productCode.includes('RLROV') ||     // Rovos Rail codes like CPTRLROV001CTPPUL
                   productCode.includes('RAIL') ||      // General rail codes
                   productCode.toLowerCase().includes('rail') ||
                   productCode.includes('BLUE') ||      // Blue Train codes
                   productCode.includes('PREMIER')      // Premier Classe codes
    
    const isCruise = productCode.includes('CRCHO') ||   // Chobe cruise codes
                     productCode.includes('CRTVT') ||   // Zambezi cruise codes
                     productCode.includes('BBKCR')      // Botswana cruise codes
    
    // WordPress uses specific Info parameters to get availability data
    // From tourplan-api-classes.php: uses 'GDM' for general queries, but needs 'A' for availability
    const baseInfo = isRail ? 'GMFTD' : 'GDM'  // WordPress uses GDM, not GS
    const infoParam = `${baseInfo}A`  // Add availability flag like WordPress does
    
    console.log(`📊 Using Info parameter "${infoParam}" for product ${productCode} (isRail: ${isRail}, isCruise: ${isCruise}) - includes availability flags`)
    
    const xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${process.env.TOURPLAN_AGENTID || process.env.TOURPLAN_AGENT_ID}</AgentID>
    <Password>${process.env.TOURPLAN_AGENTPASSWORD || process.env.TOURPLAN_PASSWORD}</Password>
    <Opt>${productCode}</Opt>
    <Info>${infoParam}</Info>
    <DateFrom>${dateFrom}</DateFrom>
    <DateTo>${dateTo}</DateTo>
    <ACache>N</ACache>
    <RateConvert>Y</RateConvert>
    <RoomConfigs>
      <RoomConfig>
        <Adults>${adults}</Adults>
        ${children > 0 ? `<Children>${children}</Children>` : ''}
        <Type>${roomType}</Type>
        <Quantity>1</Quantity>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`;
    
    console.log('Getting pricing for date range:', productCode, dateFrom, 'to', dateTo);
    console.log(`🚂 Rail API request using Info="${infoParam}"`);
    const response = await wpXmlRequest(xml);
    const optionInfo = extractResponseData(response, 'OptionInfoReply');
    
    // Debug: Log the raw response to see what TourPlan returns with availability flags
    if (isRail || isCruise) {
      console.log(`📊 Raw TourPlan response for ${isRail ? 'rail' : 'cruise'} product:`, JSON.stringify(optionInfo, null, 2));
    }
    
    if (!optionInfo?.Option) {
      return { dateRanges: [], error: 'No pricing data found' };
    }
    
    // Check for availability data that WordPress uses (OptAvail field)
    const option = optionInfo.Option;
    if (option.OptAvail) {
      console.log('📊 WordPress-style availability data found:', {
        OptAvail: option.OptAvail
      });
      
      // Process OptAvail like WordPress does (space-separated availability codes)
      const availCodes = option.OptAvail.toString().split(' ');
      console.log('📊 Availability codes for', availCodes.length, 'days:', availCodes.slice(0, 10), '...');
    }
    
    // Extract date ranges with pricing
    const dateRanges: any[] = [];
    
    // Extract OptAvail data for WordPress-style availability processing FIRST
    const optAvail = option.OptAvail ? option.OptAvail.toString().split(' ') : null;
    
    if (option.OptDateRanges?.OptDateRange) {
      const ranges = extractArray(option.OptDateRanges.OptDateRange);
      ranges.forEach((range: any) => {
        if (range.RateSets?.RateSet) {
          const rateSets = extractArray(range.RateSets.RateSet);
          rateSets.forEach((rateSet: any) => {
            if (rateSet.OptRate?.RoomRates) {
              const roomRates = rateSet.OptRate.RoomRates;
              dateRanges.push({
                dateFrom: range.DateFrom,
                dateTo: range.DateTo,
                currency: range.Currency || 'AUD',
                singleRate: roomRates.SingleRate ? parseFloat(roomRates.SingleRate) : 0,
                doubleRate: roomRates.DoubleRate ? parseFloat(roomRates.DoubleRate) : 0,
                twinRate: roomRates.TwinRate ? parseFloat(roomRates.TwinRate) : 0,
                rateName: rateSet.RateName || 'Standard',
                appliesDaysOfWeek: rateSet.AppliesDaysOfWeek,
                available: isRail ? true : (rateSet.IsClosed !== 'Y'), // Rail products show as available since they require manual confirmation
                optAvail: optAvail  // Pass WordPress-style availability data
              });
            }
          });
        }
      });
    }
    
    
    return { 
      dateRanges, 
      rawResponse: optionInfo,
      optAvail: optAvail  // WordPress-style availability codes
    };
  } catch (error) {
    console.error('Error getting pricing for date range:', error);
    return { dateRanges: [], error: error instanceof Error ? error.message : 'Pricing request failed' };
  }
}

/**
 * Get rate details with inventory information
 * Required to get valid RateId for booking
 * 
 * IMPORTANT: Group tours and cruises use RateName from RateSet, not separate RateId elements
 * Using Info>GMFTD to get proper RateSet information with RateName for both group tours and cruises
 */
export async function getRateDetails(productCode: string, dateFrom: string, dateTo?: string, adults: number = 2, children: number = 0, roomType: string = 'DB') {
  try {
    // Use Info=GMFTD to get rate details with RateSet information (works for both group tours and cruises)
    const config = getTourPlanConfig();
    const xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${config.agentId}</AgentID>
    <Password>${config.password}</Password>
    <Opt>${productCode}</Opt>
    <Info>GMFTD</Info>
    <DateFrom>${dateFrom}</DateFrom>
    ${dateTo ? `<DateTo>${dateTo}</DateTo>` : ''}
    <RateConvert>Y</RateConvert>
  </OptionInfoRequest>
</Request>`;
    
    console.log('🔍 Getting rate details for booking (using GMFTD):', {
      productCode,
      dateFrom,
      dateTo,
      adults,
      children,
      roomType
    });
    
    const response = await wpXmlRequest(xml);
    const optionInfo = extractResponseData(response, 'OptionInfoReply');
    
    if (!optionInfo?.Option) {
      console.error('❌ No option found in rate response');
      throw new Error(`No rate information found for product ${productCode}`);
    }
    
    // Extract RateName from OptDateRanges RateSet (this is what TourPlan uses as RateId for group tours)
    const option = optionInfo.Option;
    let validRateId = null;
    let availableRates: any[] = [];
    
    // Look for rates in OptDateRanges (primary source for group tours)
    if (option.OptDateRanges?.OptDateRange) {
      const dateRanges = extractArray(option.OptDateRanges.OptDateRange);
      
      for (const dateRange of dateRanges) {
        // Check if this date range overlaps with our requested dates
        const rangeFrom = new Date(dateRange.DateFrom);
        const rangeTo = new Date(dateRange.DateTo || dateRange.DateFrom);
        const requestFrom = new Date(dateFrom);
        const requestTo = dateTo ? new Date(dateTo) : requestFrom;
        
        // Check for date overlap
        const hasOverlap = requestFrom <= rangeTo && requestTo >= rangeFrom;
        
        if (dateRange.RateSets?.RateSet) {
          const rateSets = extractArray(dateRange.RateSets.RateSet);
          
          for (const rateSet of rateSets) {
            // Use RateName as the RateId (this is key insight from debug results)
            const rateName = rateSet.RateName || 'Standard';
            availableRates.push({
              rateName,
              dateFrom: dateRange.DateFrom,
              dateTo: dateRange.DateTo,
              hasOverlap,
              currency: dateRange.Currency || 'AUD'
            });
            
            // Prefer rates that overlap with our requested dates
            if (hasOverlap && !validRateId) {
              validRateId = rateName;
              console.log('Found matching RateName for dates:', rateName);
            }
          }
        }
      }
    }
    
    // If no overlapping rate found, use the first available rate
    if (!validRateId && availableRates.length > 0) {
      validRateId = availableRates[0].rateName;
      console.log('No overlapping rate found, using first available RateName:', validRateId);
    }
    
    // If still no rate found, use the helper to search thoroughly
    if (!validRateId && option) {
      console.log('🔍 Using helper to search for RateId...');
      validRateId = extractRateIdFromOption(option);
    }
    
    // Final fallback - return null to omit RateId entirely
    if (!validRateId) {
      console.log('No RateId found in response - will omit from booking request');
      validRateId = null; // This will cause the element to be omitted
    }
    
    console.log('✅ Found rate details:', {
      productCode,
      validRateId,
      availableRatesCount: availableRates.length,
      dateFrom,
      dateTo
    });
    
    return {
      rateId: validRateId,
      availableRates,
      option: option,
      rawResponse: optionInfo
    };
  } catch (error) {
    console.error('Error getting rate details:', error);
    throw error;
  }
}

/**
 * Create a new booking using the working TourplanAPI
 * Replaces WordPress booking creation functionality
 */
export async function createBooking(bookingData: {
  customerName: string;
  productCode: string;
  rateId: string;
  dateFrom: string;
  dateTo?: string;
  isQuote?: boolean;
  email?: string;
  mobile?: string;
  adults?: number;
  children?: number;
  infants?: number;
}) {
  try {
    console.log('🔄 Creating TourPlan booking with data:', {
      productCode: bookingData.productCode,
      customerName: bookingData.customerName,
      dateFrom: bookingData.dateFrom,
      rateId: bookingData.rateId,
      adults: bookingData.adults,
      children: bookingData.children
    });
    
    // Enhanced logging for cruise/rail booking attempts to capture for TourPlan support
    const isCruiseBooking = bookingData.productCode.includes('CRCHO') || 
                           bookingData.productCode.includes('CRTVT') || 
                           bookingData.productCode.includes('BBKCR');
    const isRailBooking = bookingData.productCode.includes('RLROV') || 
                          bookingData.productCode.includes('RAIL') ||
                          bookingData.productCode.toLowerCase().includes('rail') ||
                          bookingData.productCode.includes('VFARLROV') ||  // Victoria Falls rail
                          bookingData.productCode.includes('CPTRLROV') ||  // Cape Town rail
                          bookingData.productCode.includes('PRYRLROV');    // Pretoria rail
    
    if (isCruiseBooking || isRailBooking) {
      const productType = isCruiseBooking ? 'CRUISE' : 'RAIL';
      console.log(`\n${'='.repeat(80)}`);
      console.log(`📝 CAPTURING ${productType} BOOKING ATTEMPT FOR TOURPLAN SUPPORT`);
      console.log(`${'='.repeat(80)}`);
      console.log('Product Code:', bookingData.productCode);
      console.log('Date:', bookingData.dateFrom);
      console.log('Customer:', bookingData.customerName);
      console.log('Timestamp:', new Date().toISOString());
    }
    
    // Parse customer name
    const nameParts = bookingData.customerName.split(' ');
    const firstName = nameParts[0] || 'Guest';
    const lastName = nameParts.slice(1).join(' ') || 'User';
    
    // Build the XML request directly with the proper RateId
    const config = getTourPlanConfig();
    
    // Use "Default" as RateId if none provided or if it's "Standard"
    // TourPlan rejects "Standard" but accepts "Default"
    let rateIdToUse = bookingData.rateId;
    if (!rateIdToUse || rateIdToUse === 'Standard' || rateIdToUse === '') {
      rateIdToUse = 'Default';
    }
    
    // Check if this is a Group Tour
    const isGroupTour = bookingData.productCode.includes('GT');
    console.log(`🎯 Product analysis: ${isGroupTour ? 'GROUP TOUR' : 'Other product type'} - ${bookingData.productCode}`);
    
    // Check if this is a rail product
    const isRail = bookingData.productCode.includes('RLROV') ||     // Rovos Rail codes
                   bookingData.productCode.includes('RAIL') ||      // General rail codes
                   bookingData.productCode.toLowerCase().includes('rail') ||
                   bookingData.productCode.includes('BLUE') ||      // Blue Train codes
                   bookingData.productCode.includes('PREMIER');     // Premier Classe codes
    
    // Build appropriate XML based on product type
    let xml: string;
    
    if (isRail) {
      // Rail products now attempt TourPlan booking
      console.log('🚂 Rail product detected - attempting TourPlan API booking (previously bypassed)');
    }
    
    // Continue with standard TourPlan booking for all products (including rail)
    console.log('📋 Proceeding with TourPlan booking');
    
    // Determine booking type - Group Tours should be quotes (QB=Q) for manual confirmation
    const bookingType = isGroupTour ? 'Q' : (bookingData.isQuote ? 'Q' : 'B');
    console.log(`📋 Using booking type: QB=${bookingType} ${bookingType === 'Q' ? '(Quote for manual confirmation)' : '(Direct booking)'}`);
    
    // Standard TourPlan booking format for all products  
    xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <AddServiceRequest>
    <AgentID>${config.agentId}</AgentID>
    <Password>${config.password}</Password>
    <NewBookingInfo>
      <Name>${firstName} ${lastName}</Name>
      <QB>${bookingType}</QB>
    </NewBookingInfo>
    <Opt>${bookingData.productCode}</Opt>
    <RateId>${rateIdToUse}</RateId>
    <DateFrom>${bookingData.dateFrom}</DateFrom>
    <SCUqty>1</SCUqty>
    <Adults>${bookingData.adults || 2}</Adults>
    <Children>${bookingData.children || 0}</Children>
    <RoomType>DB</RoomType>
    ${bookingData.email ? `<Email>${bookingData.email}</Email>` : ''}
    ${bookingData.mobile ? `<puRemark>${bookingData.mobile}</puRemark>` : ''}
  </AddServiceRequest>
</Request>`;

    console.log('📤 SENDING CreateBooking XML with proper RateId:', xml);
    
    // Save cruise/rail booking attempts to files for TourPlan support
    if (isCruiseBooking || isRailBooking) {
      const fs = require('fs');
      const path = require('path');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const productType = isCruiseBooking ? 'cruise' : 'rail';
      const logDir = path.join(process.cwd(), 'tourplan-logs', 'booking-attempts');
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      
      // Save request XML
      const requestFile = path.join(logDir, `${productType}-booking-request-${timestamp}.xml`);
      fs.writeFileSync(requestFile, xml);
      console.log(`📁 Saved ${productType} booking request to: ${requestFile}`);
    }
    
    let response, addServiceReply;
    
    try {
      response = await wpXmlRequest(xml);
      console.log('📥 Raw TourPlan response:', JSON.stringify(response, null, 2));
      
      // Save cruise/rail booking response for TourPlan support
      if (isCruiseBooking || isRailBooking) {
        const fs = require('fs');
        const path = require('path');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const productType = isCruiseBooking ? 'cruise' : 'rail';
        const logDir = path.join(process.cwd(), 'tourplan-logs', 'booking-attempts');
        
        // Save response (raw XML string)
        const responseFile = path.join(logDir, `${productType}-booking-response-${timestamp}.xml`);
        fs.writeFileSync(responseFile, JSON.stringify(response, null, 2));
        console.log(`📁 Saved ${productType} booking response to: ${responseFile}`);
      }
      
      addServiceReply = extractResponseData(response, 'AddServiceReply');
      
      console.log('📋 TourPlan booking response:', {
        status: addServiceReply?.Status,
        bookingId: addServiceReply?.BookingId,
        reference: addServiceReply?.Ref,
        fullReply: addServiceReply
      });
      
      // Check for error responses
      if (response?.Reply?.Error) {
        const error = response.Reply.Error;
        console.error('❌ TourPlan returned an error:', error);
        throw new Error(`TourPlan error: ${error.ErrorText || error.ErrorCode || 'Unknown error'}`);
      }
    } catch (bookingError) {
      // Check if this is a cruise product
      const isCruise = bookingData.productCode.includes('CRCHO') ||    // Chobe Princess codes (BBKCRCHO...)
                       bookingData.productCode.includes('CRTVT') ||    // Zambezi Queen codes (BBKCRTVT...)  
                       bookingData.productCode.includes('BBKCR') ||    // Botswana cruise codes
                       bookingData.productCode.toLowerCase().includes('cruise');
      
      console.log('🔍 Product booking fallback for:', bookingData.productCode, 'isCruise:', isCruise, 'isRail:', isRail);
      
      // Special handling for rail and cruise booking failures  
      if (isRail) {
        console.warn('🚂 Rail booking failed in TourPlan, falling back to manual processing:', bookingError);
        
        const railBookingRef = `TIA-RAIL-${Date.now()}`;
        
        return {
          success: true,
          requiresManualConfirmation: true,
          allowPayment: true,
          status: 'PAYMENT_PENDING',
          message: 'TourPlan booking failed. Please complete your deposit payment. Our team will contact you within 48 hours to confirm availability and finalize your rail booking.',
          bookingReference: railBookingRef,
          bookingRef: railBookingRef,
          bookingId: railBookingRef,
          id: railBookingRef,
          fallbackReason: bookingError.message
        };
      } else if (isCruise) {
        console.warn('🚢 Cruise booking failed in TourPlan, falling back to manual processing:', bookingError);
        
        const cruiseBookingRef = `TIA-CRUISE-${Date.now()}`;
        
        return {
          success: true,
          requiresManualConfirmation: true,
          allowPayment: true,
          status: 'PAYMENT_PENDING',
          message: 'TourPlan booking failed. Please complete your deposit payment. Our team will contact you within 48 hours to confirm availability and finalize your cruise booking.',
          bookingReference: cruiseBookingRef,
          bookingRef: cruiseBookingRef,
          bookingId: cruiseBookingRef,
          id: cruiseBookingRef,
          fallbackReason: bookingError.message
        };
      } else {
        // For other products, re-throw the error
        throw bookingError;
      }
    }
    
    if (!addServiceReply) {
      console.error('❌ No AddServiceReply found in response');
      throw new Error('Invalid response from TourPlan - no AddServiceReply found');
    }
    
    if (addServiceReply.Status === 'OK' || addServiceReply.Status === '??') {
      // Return format expected by the API route
      return {
        bookingId: addServiceReply.BookingId,
        reference: addServiceReply.Ref,
        bookingRef: addServiceReply.Ref, // Alternative field name
        status: addServiceReply.Status,
        totalCost: 0,
        currency: 'AUD',
        rateId: bookingData.rateId,
        rawResponse: response,
      };
    } else {
      console.warn('⚠️ TourPlan booking returned non-OK status:', addServiceReply.Status);
      console.log('📋 Full response:', JSON.stringify(response, null, 2));
      
      // Return the non-OK status to the API route so it can handle quotes/declined bookings
      return {
        bookingId: addServiceReply.BookingId || null,
        reference: addServiceReply.Ref || null,
        bookingRef: addServiceReply.Ref || null,
        status: addServiceReply.Status, // NO, RQ, WQ, etc.
        totalCost: 0,
        currency: 'AUD',
        rateId: bookingData.rateId,
        rawResponse: response,
      };
    }
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    throw error;
  }
}

/**
 * Get booking details
 */
export async function getBookingDetails(bookingId: string) {
  try {
    const xml = new GetBookingRequest(bookingId).build();
    const response = await wpXmlRequest(xml);
    const bookingReply = extractResponseData(response, 'GetBookingReply');
    
    return {
      bookingId: bookingReply.BookingId,
      reference: bookingReply.BookingRef || bookingReply.Reference,
      status: bookingReply.Status,
      customerName: bookingReply.Name,
      email: bookingReply.Email,
      mobile: bookingReply.Mobile,
      totalCost: parseFloat(bookingReply.TotalCost || '0'),
      totalPaid: parseFloat(bookingReply.TotalPaid || '0'),
      currency: bookingReply.Currency || 'USD',
      services: extractArray(bookingReply.ServiceLine || bookingReply.ServiceLines?.ServiceLine),
    };
  } catch (error) {
    console.error('Error getting booking details:', error);
    throw error;
  }
}

/**
 * Helper to extract RateId from option response
 * For group tours, this usually means extracting RateName from RateSet
 */
function extractRateIdFromOption(option: any): string | null {
  // Check various possible locations for RateId based on TourPlan response structure
  
  // 1. Direct RateId on option
  if (option.RateId) {
    console.log('Found RateId directly on option:', option.RateId);
    return option.RateId;
  }
  
  // 2. In rate information
  if (option.Rate?.RateId) {
    console.log('Found RateId in Rate:', option.Rate.RateId);
    return option.Rate.RateId;
  }
  
  // 3. In OptStayResults
  if (option.OptStayResults?.RateId) {
    console.log('Found RateId in OptStayResults:', option.OptStayResults.RateId);
    return option.OptStayResults.RateId;
  }
  
  // 4. In first RateSet - check both RateId and RateName
  if (option.OptDateRanges?.OptDateRange) {
    const dateRanges = extractArray(option.OptDateRanges.OptDateRange);
    for (const range of dateRanges) {
      if (range.RateSets?.RateSet) {
        const rateSets = extractArray(range.RateSets.RateSet);
        for (const rateSet of rateSets) {
          if (rateSet.RateId) {
            console.log('Found RateId in RateSet:', rateSet.RateId);
            return rateSet.RateId;
          }
          // For group tours, use RateName as RateId
          if (rateSet.RateName) {
            console.log('Found RateName in RateSet (using as RateId):', rateSet.RateName);
            return rateSet.RateName;
          }
        }
      }
    }
  }
  
  console.log('No RateId or RateName found in option structure');
  return null;
}

/**
 * Extract rates from option using proven patterns from old booking engine
 */
function extractRatesFromOption(option: any): any[] {
  const rates: any[] = [];

  // Method 1: OptDateRanges (most common for tours)
  if (option.OptDateRanges?.OptDateRange) {
    const dateRanges = extractArray(option.OptDateRanges.OptDateRange);
    
    dateRanges.forEach((dateRange: any) => {
      if (dateRange.RateSets?.RateSet) {
        const rateSets = extractArray(dateRange.RateSets.RateSet);
        
        rateSets.forEach((rateSet: any) => {
          if (rateSet.OptRate?.RoomRates) {
            const roomRates = rateSet.OptRate.RoomRates;
            
            // Convert from cents to dollars (TourPlan returns prices in cents)
            if (roomRates.SingleRate) {
              rates.push({
                currency: dateRange.Currency || 'AUD',
                singleRate: parseFloat(roomRates.SingleRate),
                rateName: rateSet.RateName || 'Single',
                dateFrom: dateRange.DateFrom,
                dateTo: dateRange.DateTo
              });
            }
            
            if (roomRates.DoubleRate) {
              rates.push({
                currency: dateRange.Currency || 'AUD',
                doubleRate: parseFloat(roomRates.DoubleRate),
                rateName: rateSet.RateName || 'Double',
                dateFrom: dateRange.DateFrom,
                dateTo: dateRange.DateTo
              });
            }
            
            if (roomRates.TwinRate) {
              rates.push({
                currency: dateRange.Currency || 'AUD',
                twinRate: parseFloat(roomRates.TwinRate),
                rateName: rateSet.RateName || 'Twin',
                dateFrom: dateRange.DateFrom,
                dateTo: dateRange.DateTo
              });
            }
          }
        });
      }
    });
  }

  // Method 2: OptStayResults (common for tours)
  if (option.OptStayResults) {
    const stayResults = option.OptStayResults;
    
    // Extract total price if available
    if (stayResults.TotalPrice || stayResults.AgentPrice) {
      rates.push({
        currency: stayResults.Currency || 'AUD',
        singleRate: Math.round((parseFloat(stayResults.AgentPrice || stayResults.TotalPrice) / 100) / 2), // Divide by 2 for per person
        doubleRate: Math.round(parseFloat(stayResults.AgentPrice || stayResults.TotalPrice) / 100),
        twinRate: Math.round(parseFloat(stayResults.AgentPrice || stayResults.TotalPrice) / 100),
        rateName: stayResults.RateName || 'Standard',
        dateFrom: stayResults.PeriodValueAdds?.PeriodValueAdd?.DateFrom,
        dateTo: stayResults.PeriodValueAdds?.PeriodValueAdd?.DateTo
      });
    }
  }
  
  // Method 3: Stay Results (for accommodation)
  if (option.OptStayResults?.RateSet?.RateStays?.RateStay) {
    const rateStays = extractArray(option.OptStayResults.RateSet.RateStays.RateStay);
    
    rateStays.forEach((rateStay: any) => {
      if (rateStay.StayPays?.StayPay) {
        const stayPays = extractArray(rateStay.StayPays.StayPay);
        
        stayPays.forEach((stayPay: any) => {
          rates.push({
            currency: stayPay.Currency || 'AUD',
            singleRate: Math.round(parseFloat(stayPay.Pay) / 100),
            rateName: rateStay.RateName || 'Standard',
            dateFrom: stayPay.Date,
            available: parseInt(stayPay.Available) || 0
          });
        });
      }
    });
  }

  // Fallback: if no rates found, return a placeholder
  if (rates.length === 0) {
    rates.push({
      currency: 'AUD',
      singleRate: 0,
      rateName: 'Price on Application'
    });
  }

  return rates;
}

/**
 * Utility function to ensure array format
 * Handles single items or arrays from XML parsing
 */
function extractArray(data: any): any[] {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

/**
 * Get hardcoded rail product pricing
 * Same data as used in pricing calendar - ensures consistency
 */
function getRailProductPricing(productCode: string) {
  switch (productCode) {
    // Cape Town to Pretoria routes
    case 'CPTRLROV001CTPPUL':
      return {
        name: 'Cape Town to Pretoria (Pullman)',
        singleRate: 331900, // $3,319 in cents
        twinRate: 497800,   // $4,978 in cents (total for twin room)
      }
      
    case 'CPTRLROV001CTPRRO':
      return {
        name: 'Cape Town to Pretoria (Royal)',
        singleRate: 637200, // $6,372 in cents  
        twinRate: 955800,   // $9,558 in cents (total for twin room)
      }
      
    case 'CPTRLROV001RRCTPR':
      return {
        name: 'Cape Town to Pretoria (RRCTPR)',
        singleRate: 477900, // $4,779 in cents
        twinRate: 716900,   // $7,169 in cents (total for twin room)
      }

    // Pretoria to Cape Town routes
    case 'PRYRLROV001PRCPPM':
      return {
        name: 'Pretoria to Cape Town (Pullman)',
        singleRate: 331900, // $3,319 in cents
        twinRate: 497800,   // $4,978 in cents (total for twin room)
      }
      
    case 'PRYRLROV001PRCPRY':
      return {
        name: 'Pretoria to Cape Town (Royal)',
        singleRate: 637200, // $6,372 in cents  
        twinRate: 955800,   // $9,558 in cents (total for twin room)
      }
      
    case 'PRYRLROV001ROV004':
      return {
        name: 'Pretoria to Cape Town (ROV004)',
        singleRate: 477900, // $4,779 in cents
        twinRate: 716900,   // $7,169 in cents (total for twin room)
      }
      
    default:
      console.log('🚂 Unknown rail product code:', productCode, '- no pricing override');
      return null
  }
}