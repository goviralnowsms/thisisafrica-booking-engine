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

/**
 * Group Tours filtering rules based on CSV comparison data
 * Maps specific destination+class combinations to expected product codes
 */
const GROUP_TOURS_CATALOG: Record<string, string[]> = {
  // Kenya combinations
  'kenya-nairobi-jki-airport-basic': ['NBOGTARP001CKSM', 'NBOGTARP001THRSM3'],
  'kenya-nairobi-jki-airport-deluxe': [
    'NBOGTARP001CKEKEE', 'NBOGTARP001CKSE', 'NBOGTARP001EAEKE',
    'NBOGTARP001THRKE3', 'NBOGTARP001THRSE3'
  ],
  'kenya-nairobi-jki-airport-deluxe-plus': ['NBOGTARP001EAESE'],
  'kenya-nairobi-jki-airport-standard': [
    'NBOGTARP001CKSO', 'NBOGTARP001THRSO3', 'NBOGTSOAEASKTNM21',
    'NBOGTSOAEASSNM022', 'NBOGTSOAEASSNM031', 'NBOGTSOAEASSNM041',
    'NBOGTSOAEASSNM061', 'NBOGTSOAEASSNM062', 'NBOGTSOAEASSNM071',
    'NBOGTSOAEASSNM091', 'NBOGTSOAEASSNM111', 'NBOGTSOAEASSNM131'
  ],

  // Botswana combinations - each product appears in ONLY its correct category
  'botswana-maun-basic': ['MUBGTSUNWAYSUNA13'], // Basic tour starting in Maun city
  'botswana-maun-deluxe': [], // No deluxe tours start in city
  'botswana-maun-overland-camping': [], // No overland tours start in city
  'botswana-maun-airport-basic': [], // No basic tours start at airport
  'botswana-maun-airport-deluxe': ['MUBGTJENMANJENBSE'], // Deluxe tour with airport pickup
  'botswana-maun-airport-overland-camping': ['MUBGTSUNWAYSUBT13'], // Overland with airport pickup

  // Namibia combinations
  'namibia-windhoek-deluxe': ['WDHGTSOANAMCAPNAM'],
  'namibia-windhoek-deluxe-plus': ['WDHGTULTSAFULTNAM', 'WDHGTSOANAMEXNASP'],
  'namibia-windhoek-standard': ['WDHGTSOANAMHINAMC'],

  // South Africa combinations
  'south-africa-cape-town-city-basic': [
    'CPTGTNOMAD NOMNAM', 'CPTGTSUNWAYCWA13', 'CPTGTSUNWAYSUNA21'
  ],
  'south-africa-cape-town-city-overland-camping': [
    'CPTGTSUNWAYSUCV21', 'CPTGTSUNWAYSUCW14'
  ],
  'south-africa-cape-town-city-standard': ['CPTGTSATOURSAGRD4'],
  'south-africa-durban-airport-basic': ['DURGTNOMAD NADC'],
  'south-africa-durban-airport-standard': [], // Empty per CSV - all show 0 in WordPress  
  'south-africa-durban-airport-overland-camping': ['DURGTNOMAD NDC'],
  'south-africa-johannesburg-basic': ['JNBGTSUNWAYSAA17'],
  'south-africa-johannesburg-overland-camping': [], // Empty per CSV - all show 0 in WordPress
  'south-africa-johannesburg-standard': [], // Empty per CSV - all show 0 in WordPress
  'south-africa-johannesburg-airport-basic': [
    'JNBGTNOMAD NAJC', 'JNBGTNOMAD NAJD', 'JNBGTNOMAD NAJP',
    'JNBGTSUNWAYSUNA14', 'JNBGTSUNWAYSUNZBA'
  ],
  'south-africa-johannesburg-airport-overland-camping': [
    'JNBGTSUNWAYSUBT14', 'JNBGTNOMAD NJP', 'JNBGTNOMAD NJD', 'JNBGTNOMAD NJC'
  ],
  'south-africa-johannesburg-airport-standard': [
    'JNBGTNOMAD NAJCSG', 'JNBGTNOMAD NAJPSG', 'JNBGTSATOURSAJOUR'
  ],
  'south-africa-port-elizabeth-basic': ['CPTGTSATOURSAGRD4'],
  'south-africa-port-elizabeth-standard': ['PLZGTNOMAD NAPCSG', 'PLZGTTVT001TISD20', 'PLZGTTVT001TISG20'],
  'south-africa-port-elizabeth-overland-camping': ['PLZGTNOMAD NPC'],

  // Tanzania combinations
  'tanzania-kilimanjaro-airport-deluxe': ['JROGTARP001SIMSE7'],
  'tanzania-kilimanjaro-airport-luxury': ['JROGTARP001SIMWEP'],
  'tanzania-kilimanjaro-airport-standard': [
    'JROGTARP001SIMTW7', 'JROGTSOAEASSNM024', 'JROGTSOAEASSNM042'
  ],

  // Zambia combinations
  'zambia-livingstone-basic': ['LVIGTSUNWAYNBA15', 'LVIGTSUNWAYSUNNBA'],
  'zambia-livingstone-overland-camping': ['LVIGTSUNWAYSUNB15', 'LVIGTSUNWAYSUNB21'],

  // Zimbabwe combinations
  'zimbabwe-victoria-falls-airport-basic': ['VFAGTNOMAD NAZZ'],
  'zimbabwe-victoria-falls-airport-standard': ['VFAGTJENMANJENW15', 'VFAGTJENMANJENW12']
};

const CRUISE_CATALOG: Record<string, string[]> = {
  // Based on tours-filter.csv data for CRUISE section (lines 210-218)
  // Botswana/Kasane Airport combinations:
  'botswana-kasane-airport-luxury': [
    'BBKCRTVT001ZAM2NS', // Zambezi Queen 2-night standard (mapped to luxury in CSV)
    'BBKCRTVT001ZAM3NS', // Zambezi Queen 3-night standard
  ],
  'botswana-kasane-airport-standard': [
    'BBKCRCHO018TIACP2', // Chobe Princess 2-night
    'BBKCRCHO018TIACP3', // Chobe Princess 3-night
  ],
  'botswana-kasane-airport-superior': [
    'BBKCRTVT001ZAM2NM', // Zambezi Queen 2-night master
    'BBKCRTVT001ZAM3NM', // Zambezi Queen 3-night master
  ],
  // Namibia gets same products as Botswana (from CSV lines 212, 215, 218)
  'namibia-kasane-airport-luxury': [
    'BBKCRTVT001ZAM2NS',
    'BBKCRTVT001ZAM3NS',
  ],
  'namibia-kasane-airport-standard': [
    'BBKCRCHO018TIACP2',
    'BBKCRCHO018TIACP3',
  ],
  'namibia-kasane-airport-superior': [
    'BBKCRTVT001ZAM2NM',
    'BBKCRTVT001ZAM3NM',
  ],
  // Legacy fallbacks - only for 'all' or unspecified searches  
  'all': ALL_CRUISES
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
  'CPTRLROV001CTPRRO', // Cape Town rail journey (Royal)
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
    'CPTRLROV001CTPRRO', // Cape Town rail journey (Royal)
    'PRYRLROV001ROV004', // Pretoria Rovos Rail
    'PRYRLROV001PRCPRY', // Pretoria to Cape Town rail
    'PRYRLROV001PRCPPM', // Pretoria rail journey
  ],
  'victoria-falls': [
    'VFARLROV001VFPRDX', // Victoria Falls rail journey
    'VFARLROV001VFPRRY', // Victoria Falls rail journey (variant)
    'VFARLROV001VFPYPM', // Victoria Falls rail journey (variant 2)
  ],
  'victoria-falls-town': [
    'VFARLROV001VFPRDX', // Victoria Falls rail journey
    'VFARLROV001VFPRRY', // Victoria Falls rail journey (variant)
    'VFARLROV001VFPYPM', // Victoria Falls rail journey (variant 2)
  ],
  'cape-town': [
    'CPTRLROV001RRCTPR', // Cape Town rail journey
    'CPTRLROV001CTPPUL', // Cape Town rail journey (variant)
    'CPTRLROV001CTPRRO', // Cape Town rail journey (Royal)
  ],
  'cape-town-rail-station': [
    'CPTRLROV001RRCTPR', // Cape Town rail journey
    'CPTRLROV001CTPPUL', // Cape Town rail journey (variant)
    'CPTRLROV001CTPRRO', // Cape Town rail journey (Royal)
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
  'pretoria-rail-station': [
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
      'cape town rail station': 'South Africa',  // Search at country level, filter later
      'cape-town-rail-station': 'South Africa',
      'pretoria rail station': 'South Africa',   // Search at country level, filter later
      'pretoria-rail-station': 'South Africa',
      'zimbabwe': 'Zimbabwe',
      'victoria-falls': 'Zimbabwe',
      'victoria falls': 'Zimbabwe',
      'victoria falls town': 'Zimbabwe',  // Search at country level, filter later
      'victoria-falls-town': 'Zimbabwe',
      'victoriafalls': 'Zimbabwe'
    };

    const destination = criteria.destination?.toLowerCase();
    console.log(`🚂 TourPlan API: Looking up destination mapping for: "${destination}"`);
    const tourPlanDestination = destination ? destinationMapping[destination] : null;

    if (!tourPlanDestination) {
      console.log(`🚂 TourPlan API: No mapping for destination "${criteria.destination}", returning empty`);
      console.log(`🚂 Available mappings:`, Object.keys(destinationMapping));
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
 * Apply Group Tours filtering - Hybrid approach:
 * 1. First tries dynamic filtering based on API response data
 * 2. Falls back to CSV-based catalog if needed
 */
function applyGroupToursFiltering(products: any[], destination: string, classFilter: string): any[] {
  console.log(`🚌 Applying hybrid Group Tours filtering`);
  console.log(`🚌 Destination: "${destination}", Class: "${classFilter}"`);
  
  if (!destination || !classFilter) {
    console.log('🚌 No destination or class provided, returning all products');
    return products;
  }
  
  // STEP 1: Check if we have specific catalog rules first
  // Build catalog key to see if we have explicit rules
  const normalizeKey = (str: string) => str.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/airport/g, 'airport')
    .replace(/jki/g, 'jki')
    .replace(/overland-camping/g, 'overland-camping')
    .replace(/deluxe\+/g, 'deluxe-plus');

  const destKey = normalizeKey(destination);
  const classKey = normalizeKey(classFilter);
  let catalogKey = '';

  // Determine catalog key (same logic as below)
  if (destKey.includes('nairobi') || destKey.includes('jki')) {
    catalogKey = `kenya-nairobi-jki-airport-${classKey}`;
  }
  // ... other destination patterns would go here if needed for this check

  // If we have specific catalog rules, use them but also check for new products
  if (catalogKey && GROUP_TOURS_CATALOG[catalogKey] !== undefined) {
    console.log(`🚌 Using CSV-based catalog PLUS new products (have specific rules for "${catalogKey}")`);
    
    // Get catalog products first
    const expectedCodes = GROUP_TOURS_CATALOG[catalogKey];
    console.log(`🚌 Catalog expects: ${expectedCodes.length} products:`, expectedCodes);
    
    // Also try dynamic filtering to catch any NEW products
    const dynamicallyFiltered = applyDynamicDestinationFiltering(products, destination, classFilter);
    console.log(`🚌 API dynamic filtering found: ${dynamicallyFiltered.length} products`);
    
    // Find products that are in dynamic results but NOT in our catalog
    const newProducts = dynamicallyFiltered.filter(product => {
      const productCode = product.code || product.id || '';
      return !expectedCodes.some(expectedCode => {
        const normalizedProductCode = productCode.replace(/%20/g, ' ');
        const normalizedExpectedCode = expectedCode.replace(/%20/g, ' ');
        return normalizedProductCode.includes(normalizedExpectedCode) || 
               normalizedExpectedCode.includes(normalizedProductCode) ||
               productCode.includes(expectedCode) || 
               expectedCode.includes(productCode);
      });
    });
    
    if (newProducts.length > 0) {
      console.log(`🚌 Found ${newProducts.length} NEW products not in catalog:`, 
        newProducts.map(p => p.code || p.id));
    }
    
    // Get catalog products
    const catalogProducts = products.filter(product => {
      const productCode = product.code || product.id || '';
      return expectedCodes.some(expectedCode => {
        const normalizedProductCode = productCode.replace(/%20/g, ' ');
        const normalizedExpectedCode = expectedCode.replace(/%20/g, ' ');
        return normalizedProductCode.includes(normalizedExpectedCode) || 
               normalizedExpectedCode.includes(normalizedProductCode) ||
               productCode.includes(expectedCode) || 
               expectedCode.includes(productCode);
      });
    });
    
    // Combine catalog products + new products
    const finalProducts = [...catalogProducts, ...newProducts];
    console.log(`🚌 Final result: ${catalogProducts.length} catalog + ${newProducts.length} new = ${finalProducts.length} total products`);
    
    return finalProducts;
  } else {
    // STEP 1.5: Try dynamic filtering first (for destinations without specific catalog rules)
    const dynamicallyFiltered = applyDynamicDestinationFiltering(products, destination, classFilter);
    
    // If dynamic filtering found reasonable results, use it
    if (dynamicallyFiltered.length > 0 && dynamicallyFiltered.length < products.length) {
      console.log(`🚌 Dynamic filtering successful: ${products.length} → ${dynamicallyFiltered.length} products`);
      return dynamicallyFiltered;
    }
    
    console.log(`🚌 Dynamic filtering didn't work well, falling back to CSV-based catalog`);
  }
  
  // If we didn't determine a catalog key above, build it now
  let fullCatalogKey = catalogKey; // Use the key we already determined above
  if (!fullCatalogKey) {
    if (destKey.includes('nairobi') || destKey.includes('jki')) {
      fullCatalogKey = `kenya-nairobi-jki-airport-${classKey}`;
    } 
    // Botswana - treat Maun and Maun Airport as the same
    else if (destKey.includes('maun')) {
      // First check if we have an airport-specific key
      const airportKey = `botswana-maun-airport-${classKey}`;
      const cityKey = `botswana-maun-${classKey}`;
      
      // Try airport key first, then city key
      if (destKey.includes('airport') && GROUP_TOURS_CATALOG[airportKey]) {
        fullCatalogKey = airportKey;
      } else if (GROUP_TOURS_CATALOG[cityKey]) {
        fullCatalogKey = cityKey;
      } else {
        // Default to airport key since most CSV entries use that
        fullCatalogKey = airportKey;
      }
    } 
    // Namibia destinations  
    else if (destKey.includes('windhoek')) {
      fullCatalogKey = `namibia-windhoek-${classKey}`;
    } 
    // South Africa - treat Johannesburg and Johannesburg Airport more intelligently
    else if (destKey.includes('johannesburg')) {
      // Check both airport and city keys
      const airportKey = `south-africa-johannesburg-airport-${classKey}`;
      const cityKey = `south-africa-johannesburg-${classKey}`;
      
      // Try to be smart about which one to use
      if (destKey.includes('airport') && GROUP_TOURS_CATALOG[airportKey]) {
        fullCatalogKey = airportKey;
      } else if (!destKey.includes('airport') && GROUP_TOURS_CATALOG[cityKey]) {
        fullCatalogKey = cityKey;
      } else if (GROUP_TOURS_CATALOG[airportKey]) {
        // Default to airport if city doesn't exist
        fullCatalogKey = airportKey;
      } else {
        fullCatalogKey = cityKey;
      }
    }
    else if (destKey.includes('cape-town')) {
      // Always use city version for Cape Town
      fullCatalogKey = `south-africa-cape-town-city-${classKey}`;
    } 
    else if (destKey.includes('durban')) {
      // Always use airport version for Durban (that's what CSV has)
      fullCatalogKey = `south-africa-durban-airport-${classKey}`;
    } 
    else if (destKey.includes('port-elizabeth')) {
      fullCatalogKey = `south-africa-port-elizabeth-${classKey}`;
    } 
    // Tanzania destinations
    else if (destKey.includes('kilimanjaro')) {
      fullCatalogKey = `tanzania-kilimanjaro-airport-${classKey}`;
    } 
    // Zambia destinations
    else if (destKey.includes('livingstone')) {
      fullCatalogKey = `zambia-livingstone-${classKey}`;
    } 
    // Zimbabwe destinations  
    else if (destKey.includes('victoria-falls')) {
      fullCatalogKey = `zimbabwe-victoria-falls-airport-${classKey}`;
    }
    // If no specific pattern matches, try to infer from destination name
    else {
      console.log(`🚌 No specific destination pattern found for "${destKey}", trying country-based fallback`);
      // This should not happen often, but provides a fallback
      fullCatalogKey = `unknown-${destKey}-${classKey}`;
    }
  }
  
  console.log(`🚌 Built catalog key: "${fullCatalogKey}"`);
  
  // Get expected product codes from catalog
  const expectedCodes = GROUP_TOURS_CATALOG[fullCatalogKey];
  if (!expectedCodes) {
    console.log(`🚌 No specific filtering rules found for "${fullCatalogKey}", returning all products`);
    return products;
  }
  
  console.log(`🚌 Expected product codes:`, expectedCodes);
  
  // Handle empty array (no products should be shown)
  if (expectedCodes.length === 0) {
    console.log(`🚌 Catalog specifies NO products should be shown for "${fullCatalogKey}"`);
    return [];
  }
  
  // Filter products to only those that match expected codes
  const filteredProducts = products.filter(product => {
    const productCode = product.code || product.id || '';
    return expectedCodes.some(expectedCode => {
      // Handle both space and %20 encoded versions
      const normalizedProductCode = productCode.replace(/%20/g, ' ');
      const normalizedExpectedCode = expectedCode.replace(/%20/g, ' ');
      
      return normalizedProductCode.includes(normalizedExpectedCode) || 
             normalizedExpectedCode.includes(normalizedProductCode) ||
             productCode.includes(expectedCode) || 
             expectedCode.includes(productCode);
    });
  });
  
  console.log(`🚌 Filtered from ${products.length} to ${filteredProducts.length} products`);
  return filteredProducts;
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
  class?: string;
}) {
  console.log('🚢 Searching cruise catalog with criteria:', criteria);
  
  // Build catalog key from destination and class
  let catalogKey = '';
  if (criteria.destination && criteria.class) {
    // Normalize destination (remove spaces, lowercase)
    let normalizedDestination = criteria.destination.toLowerCase().replace(/\s+/g, '-');
    
    // Map common destination patterns to specific keys
    if (normalizedDestination === 'namibia') {
      normalizedDestination = 'namibia-kasane-airport'; // Namibia cruises operate from Kasane
    } else if (normalizedDestination === 'botswana') {
      normalizedDestination = 'botswana-kasane-airport'; // All cruises operate from Kasane
    } else if (normalizedDestination === 'kasane-airport') {
      // "Kasane Airport" maps to Botswana (default country for Kasane)
      normalizedDestination = 'botswana-kasane-airport';
    }
    
    // Normalize class (lowercase)
    const normalizedClass = criteria.class.toLowerCase();
    catalogKey = `${normalizedDestination}-${normalizedClass}`;
    console.log('🚢 Built catalog key:', catalogKey);
  } else if (criteria.destination) {
    let normalizedDestination = criteria.destination.toLowerCase();
    if (normalizedDestination === 'namibia' || normalizedDestination === 'botswana') {
      // For destination-only searches, return empty array (need class to filter properly)
      catalogKey = 'destination-only-no-class';
    } else {
      catalogKey = normalizedDestination;
    }
  } else {
    catalogKey = 'all';
  }
  
  // Get product codes for cruises based on destination + class combination
  let productCodes: string[] = CRUISE_CATALOG[catalogKey];
  
  if (!productCodes) {
    if (catalogKey === 'all') {
      productCodes = ALL_CRUISES;
      console.log('🚢 No specific filtering - returning all cruises');
    } else if (catalogKey === 'destination-only-no-class') {
      productCodes = [];
      console.log('🚢 Destination provided but no class - returning empty (need both for filtering)');
    } else {
      productCodes = [];
      console.log(`🚢 No catalog entry found for "${catalogKey}" - returning empty array`);
    }
  }
  
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
  class?: string;
  dateFrom?: string;
  dateTo?: string;
  adults?: number;
  children?: number;
  roomConfigs?: Array<{Adults: number, Children?: number, Type: string, Quantity: number}>;
}): Promise<{products: any[], totalResults: number, searchCriteria?: any}> {
  try {
    console.log('🔍 Starting product search with criteria:', criteria);
    console.log(`🔍 ProductType="${criteria.productType}" (will match switch case)`);
    let xml: string;
    
    // Build appropriate request based on product type
    switch (criteria.productType) {
      case 'Day Tours':
        xml = buildTourSearchRequest(criteria.destination, criteria.dateFrom, criteria.dateTo);
        break;
        
      case 'Group Tours':
      case 'Guided group tours':
        // For Group Tours, search by country only to include "On request" products,
        // then apply destination/class filtering client-side
        console.log('🚌 Using country-only search + client-side filtering for Group Tours to preserve "On request" products');
        
        // Extract country from destination - comprehensive mapping
        let countryForSearch = '';
        if (criteria.destination) {
          const destLower = criteria.destination.toLowerCase();
          
          // Kenya
          if (destLower.includes('nairobi') || destLower.includes('jki') || destLower.includes('kenya')) {
            countryForSearch = 'Kenya';
          } 
          // Botswana  
          else if (destLower.includes('maun') || destLower.includes('kasane') || destLower.includes('botswana')) {
            countryForSearch = 'Botswana';
          } 
          // South Africa
          else if (destLower.includes('cape town') || destLower.includes('durban') || 
                   destLower.includes('johannesburg') || destLower.includes('port elizabeth') || 
                   destLower.includes('south africa')) {
            countryForSearch = 'South Africa';
          } 
          // Namibia
          else if (destLower.includes('windhoek') || destLower.includes('namibia')) {
            countryForSearch = 'Namibia';
          } 
          // Tanzania
          else if (destLower.includes('kilimanjaro') || destLower.includes('arusha') || 
                   destLower.includes('tanzania')) {
            countryForSearch = 'Tanzania';
          } 
          // Zimbabwe
          else if (destLower.includes('victoria falls') || destLower.includes('harare') || 
                   destLower.includes('zimbabwe')) {
            countryForSearch = 'Zimbabwe';
          } 
          // Zambia  
          else if (destLower.includes('livingstone') || destLower.includes('lusaka') || 
                   destLower.includes('zambia')) {
            countryForSearch = 'Zambia';
          } 
          // Uganda
          else if (destLower.includes('kampala') || destLower.includes('entebbe') || 
                   destLower.includes('uganda')) {
            countryForSearch = 'Uganda';
          } 
          // Rwanda
          else if (destLower.includes('kigali') || destLower.includes('rwanda')) {
            countryForSearch = 'Rwanda';
          } 
          // Ethiopia
          else if (destLower.includes('addis ababa') || destLower.includes('ethiopia')) {
            countryForSearch = 'Ethiopia';
          } 
          // Morocco
          else if (destLower.includes('casablanca') || destLower.includes('marrakech') || 
                   destLower.includes('morocco')) {
            countryForSearch = 'Morocco';
          } 
          // Egypt
          else if (destLower.includes('cairo') || destLower.includes('egypt')) {
            countryForSearch = 'Egypt';
          } 
          else {
            // Default to destination if no mapping found - still search by country
            countryForSearch = criteria.destination;
          }
        }
        
        // Build country-only search (no destination/class filtering in XML)
        xml = buildGroupTourSearchRequest(countryForSearch, criteria.dateFrom, criteria.dateTo);
        console.log(`🌍 Group Tours: Searching country "${countryForSearch}" with client-side filtering for destination="${criteria.destination}" class="${criteria.class}"`);
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
        // Try TourPlan API first with class filtering, fallback to catalog if no results
        console.log('🚢 Attempting TourPlan API cruise search first with class filtering');
        xml = buildCruiseSearchRequest(criteria.destination, criteria.dateFrom, criteria.dateTo, criteria.class);
        console.log('🚢 Cruise search XML built with class filter:');
        console.log('📋 CRUISE XML REQUEST:', xml);
        console.log('🚢 Will fallback to catalog if TourPlan returns empty');
        break;
        
      case 'Rail':
      case 'Rail journeys':
        // Try TourPlan API first for destinations that work, fallback to catalog
        console.log('🚂 Attempting TourPlan API rail search first');
        const railApiResults = await searchRailFromTourPlanAPI(criteria);
        if (railApiResults.totalResults > 0) {
          console.log(`🚂 ✅ TourPlan API returned ${railApiResults.totalResults} rail products`);
          
          // Apply destination and class filtering to Rail products for specific stations
          const destLower = criteria.destination?.toLowerCase() || '';
          const needsFiltering = destLower.includes('rail station') || destLower.includes('rail-station') || 
                                 destLower.includes('victoria falls town') || destLower.includes('victoria-falls-town');
          
          if (needsFiltering) {
            console.log('🚂 Applying destination filtering for Rail station:', criteria.destination);
            const filteredRailProducts = applyDynamicDestinationFiltering(
              railApiResults.products,
              criteria.destination,
              criteria.class
            );
            console.log(`🚂 Filtered from ${railApiResults.totalResults} to ${filteredRailProducts.length} products`);
            return {
              products: filteredRailProducts,
              totalResults: filteredRailProducts.length,
              searchCriteria: criteria
            };
          }
          
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
        // For Packages, search by country only to include "On request" products,
        // then apply destination/class filtering client-side (same as Group Tours)
        console.log('📦 Using country-only search + client-side filtering for Packages to preserve "On request" products');
        
        // Extract country from destination (reuse Group Tours mapping logic)
        let packageCountryForSearch = '';
        if (criteria.destination) {
          const destLower = criteria.destination.toLowerCase();
          
          // Kenya
          if (destLower.includes('nairobi') || destLower.includes('jki') || destLower.includes('kenya')) {
            packageCountryForSearch = 'Kenya';
          } 
          // Botswana  
          else if (destLower.includes('maun') || destLower.includes('kasane') || 
                   destLower.includes('chobe') || destLower.includes('botswana')) {
            packageCountryForSearch = 'Botswana';
            console.log(`📦 MATCHED Botswana mapping for destination "${criteria.destination}"`);
          } 
          // South Africa - add hoedspruit to the check
          else if (destLower.includes('cape town') || destLower.includes('durban') || 
                   destLower.includes('johannesburg') || destLower.includes('port elizabeth') || 
                   destLower.includes('hoedspruit') || destLower.includes('sabi sand') ||
                   destLower.includes('south africa')) {
            packageCountryForSearch = 'South Africa';
          } 
          // Namibia
          else if (destLower.includes('windhoek') || destLower.includes('namibia')) {
            packageCountryForSearch = 'Namibia';
          } 
          // Tanzania
          else if (destLower.includes('kilimanjaro') || destLower.includes('arusha') || 
                   destLower.includes('tanzania')) {
            packageCountryForSearch = 'Tanzania';
          } 
          // Zimbabwe
          else if (destLower.includes('victoria falls') || destLower.includes('harare') || 
                   destLower.includes('zimbabwe')) {
            packageCountryForSearch = 'Zimbabwe';
          } 
          // Zambia  
          else if (destLower.includes('livingstone') || destLower.includes('lusaka') || 
                   destLower.includes('zambia')) {
            packageCountryForSearch = 'Zambia';
          } 
          // Uganda
          else if (destLower.includes('kampala') || destLower.includes('entebbe') || 
                   destLower.includes('uganda')) {
            packageCountryForSearch = 'Uganda';
          } 
          // Rwanda
          else if (destLower.includes('kigali') || destLower.includes('rwanda')) {
            packageCountryForSearch = 'Rwanda';
          } 
          // Ethiopia
          else if (destLower.includes('addis ababa') || destLower.includes('ethiopia')) {
            packageCountryForSearch = 'Ethiopia';
          } 
          // Morocco
          else if (destLower.includes('casablanca') || destLower.includes('marrakech') || 
                   destLower.includes('morocco')) {
            packageCountryForSearch = 'Morocco';
          } 
          // Egypt
          else if (destLower.includes('cairo') || destLower.includes('egypt')) {
            packageCountryForSearch = 'Egypt';
          } 
          else {
            // Default to destination if no mapping found
            packageCountryForSearch = criteria.destination;
          }
        }
        
        // Build country-only search (no destination/class filtering in XML)
        console.log(`📦 DEBUG: packageCountryForSearch="${packageCountryForSearch}", criteria.destination="${criteria.destination}"`);
        if (!packageCountryForSearch || packageCountryForSearch === '') {
          console.error(`⚠️ No country found for destination "${criteria.destination}" - this will cause empty results!`);
          console.log(`📦 Available country mappings: Kenya, Botswana, South Africa, Namibia, Tanzania, Zimbabwe, Zambia, Uganda, Rwanda`);
        }
        xml = buildPackagesSearchRequest(packageCountryForSearch, criteria.dateFrom, criteria.dateTo);
        console.log(`📦 Packages: Searching country "${packageCountryForSearch}" with client-side filtering for destination="${criteria.destination}" class="${criteria.class}"`);
        console.log(`📦 Looking for specific products like BBKPKTVT001BOD6KM in the response...`);
        
        // Store the original destination for later checking if we need product code search
        (criteria as any)._originalDestination = criteria.destination;
        (criteria as any)._needsProductCodeSearch = false;
        
        // Check if this is a problematic destination that needs direct product code search
        if (criteria.destination) {
          const destLower = criteria.destination.toLowerCase();
          if ((destLower.includes('hoedspruit') || destLower.includes('hds')) ||
              (destLower.includes('johannesburg') && destLower.includes('airport')) ||
              (destLower.includes('sabi sand')) ||
              (destLower.includes('entebbe')) ||
              (destLower.includes('livingstone') && destLower.includes('airport'))) {
            console.log(`📦 ⚠️ Detected problematic destination "${criteria.destination}" - may need direct product code search`);
            (criteria as any)._needsProductCodeSearch = true;
          }
        }
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
      
      // For Cruises, fallback to catalog approach if TourPlan API returns empty
      if (criteria.productType === 'Cruises') {
        console.log('🚢 ⚠️ TourPlan API returned no cruise results, falling back to curated catalog');
        console.log('🚢 Cruise search criteria:', JSON.stringify(criteria, null, 2));
        const cruiseResults = await searchCruisesFromCatalog(criteria);
        
        // Catalog search already applies the filtering, no need for additional filtering
        console.log(`🚢 Catalog search completed: ${cruiseResults.products?.length || 0} cruise products`);
        
        return {
          products: cruiseResults.products || [],
          totalResults: cruiseResults.totalResults || 0,
          searchCriteria: criteria
        };
      }
      
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
        
        // For Cruises, fetch detailed product information like the product details page does
        if (criteria.productType === 'Cruises') {
          const productCode = option.Opt || option['@_Opt'];
          console.log('🚢 Fetching detailed cruise info for:', productCode);
          try {
            const productDetails = await getProductDetails(productCode);
            
            return {
              id: productCode,
              code: productCode,
              name: productDetails.name || `Cruise ${productCode}`,
              description: productDetails.description || productDetails.content?.introduction || 'River cruise in Southern Africa',
              supplier: productDetails.supplierName || 'River Cruise Operator',
              duration: productDetails.duration || 'Multi-day cruise',
              image: null,
              rates: productDetails.rates?.length > 0 ? productDetails.rates.map(rate => ({
                currency: rate.currency,
                singleRate: rate.singleRate || 0,
                doubleRate: rate.doubleRate || 0,
                twinRate: rate.twinRate || 0,
                rateName: rate.rateName || 'Standard'
              })) : [{
                currency: 'AUD',
                singleRate: 0,
                rateName: 'Price on Application'
              }],
            };
          } catch (error) {
            console.error(`🚢 Failed to get detailed cruise info for ${productCode}:`, error);
            // Fallback to basic info
            return {
              id: productCode,
              code: productCode,
              name: `Cruise ${productCode}`,
              description: 'River cruise in Southern Africa',
              supplier: 'River Cruise Operator',
              duration: 'Multi-day cruise',
              image: null,
              rates: [{
                currency: 'AUD',
                singleRate: 0,
                rateName: 'Price on Application'
              }],
            };
          }
        }
        
        // For other product types, use the basic search response data
        return {
          id: option.Opt || option['@_Opt'],
          code: option.Opt || option['@_Opt'],
          name: option.OptGeneral?.Description || option.OptGeneral?.SupplierName || 'Unnamed Product',
          description: option.OptGeneral?.Comment || option.OptGeneral?.Description || '',
          supplier: option.OptGeneral?.SupplierName || '',
          duration: option.OptGeneral?.Periods ? `${option.OptGeneral.Periods} nights` : '',
          location: option.OptGeneral?.LocalityDescription || '', // Add location field!
          locality: option.OptGeneral?.Locality || '', // Add locality code too
          class: option.OptGeneral?.ClassDescription || '', // Add class field!
          countries: extractCountriesFromAmenities(option.Amenities), // Add countries from amenities!
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
    
    // Apply destination-specific filtering to match WordPress behavior
    console.log('🔍 Pre-filter check:', {
      productType: criteria.productType,
      destination: criteria.destination,
      class: criteria.class,
      productsBeforeFilter: finalProducts.length
    });
    
    // Configuration: Countries that work correctly with TourPlan API filtering
    // Add countries here as TourPlan configuration gets fixed
    const countriesWithWorkingTourPlanConfig = [
      // Removed Kenya to enable client-side filtering for "On request" products
      // Add countries as client fixes TourPlan config: 'botswana', 'south africa', 'namibia', etc.
    ];
    
    const destinationLower = criteria.destination?.toLowerCase() || '';
    const hasWorkingConfig = countriesWithWorkingTourPlanConfig.some(country => 
      destinationLower.includes(country)
    );
    
    // Check if we need destination filtering (with or without class)
    const needsDestinationFiltering = criteria.destination && 
                                     (criteria.productType === 'Group Tours' || 
                                      criteria.productType === 'Guided group tours' ||
                                      criteria.productType === 'Packages' ||
                                      criteria.productType === 'Pre-designed packages' ||
                                      criteria.productType === 'Cruises');
    
    // Debug for cruise products specifically
    if (criteria.productType === 'Cruises') {
      console.log('🚢 DEBUG: Cruise API success path reached (but should not happen - cruises use catalog)');
      console.log('🚢 DEBUG: finalProducts.length:', finalProducts.length);
      console.log('🚢 WARNING: Cruises should use catalog fallback, not TourPlan API results');
    }
    
    if (needsDestinationFiltering) {
      // If only destination is provided (no class), we still need to filter by destination
      if (!criteria.class) {
        console.log('✅ Applying destination-only filtering (no class specified)');
        // Pass empty string for class to filter by destination only
        const filteredByDestination = applyDynamicDestinationFiltering(finalProducts, criteria.destination, '');
        if (filteredByDestination.length !== finalProducts.length) {
          console.log(`🎯 Applied destination-only filtering: ${finalProducts.length} → ${filteredByDestination.length} products`);
          finalProducts = filteredByDestination;
        }
      } else {
        console.log('✅ Applying client-side destination/class filtering to preserve "On request" products');
        
        // Use CSV-based filtering for Group Tours, fall back to dynamic filtering for others
        if (criteria.productType === 'Group Tours' || criteria.productType === 'Guided group tours') {
          console.log('🚌 Using CSV-based Group Tours filtering');
          const filteredByGroupTours = applyGroupToursFiltering(finalProducts, criteria.destination, criteria.class);
          if (filteredByGroupTours.length !== finalProducts.length) {
            console.log(`🚌 Applied Group Tours CSV filtering: ${finalProducts.length} → ${filteredByGroupTours.length} products`);
            finalProducts = filteredByGroupTours;
          }
        } else {
          const filteredByDestination = applyDynamicDestinationFiltering(finalProducts, criteria.destination, criteria.class);
          if (filteredByDestination.length !== finalProducts.length) {
            console.log(`🎯 Applied dynamic destination filtering: ${finalProducts.length} → ${filteredByDestination.length} products`);
            finalProducts = filteredByDestination;
          }
        }
      }
    } else if (criteria.productType === 'Cruises' && criteria.class) {
      // Cruises should not reach this code path - they use catalog fallback
      console.log('🚢 WARNING: Cruise class filtering reached - should use catalog instead');
    } else {
      console.log('⏭️ No destination/class filtering needed for this search:', {
        destination: criteria.destination,
        hasDestination: !!criteria.destination,
        hasClass: !!criteria.class,
        productType: criteria.productType
      });
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
    // Build request for this product with extended date range to match WordPress (goes to 2027+)
    const currentDate = new Date();
    const nextYear = new Date(currentDate.getFullYear() + 5, currentDate.getMonth(), currentDate.getDate());
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
      countries: extractCountriesFromAmenities(option.Amenities),
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
      // Skip file logging on Vercel (read-only filesystem)
      if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
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
      } else {
        console.log(`📁 Skipped XML logging (production/Vercel environment)`);
      }
    }
    
    let response, addServiceReply;
    
    try {
      response = await wpXmlRequest(xml);
      console.log('📥 Raw TourPlan response:', JSON.stringify(response, null, 2));
      
      // Save cruise/rail booking response for TourPlan support (skip on Vercel)
      if ((isCruiseBooking || isRailBooking) && process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
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
      
      // Extract and highlight key configuration fields that determine if booking works
      const serviceConfig = addServiceReply?.ServiceLines?.ServiceLine || addServiceReply?.ServiceLine || {};
      const configAnalysis = {
        '🔑 KEY CONFIGURATION FIELDS': '====================',
        'Product Code': bookingData.productCode,
        'Status': addServiceReply?.Status,
        'CostedInBooking': serviceConfig.CostedInBooking || 'NOT SET',
        'TourplanServiceStatus': serviceConfig.TourplanServiceStatus || 'NOT SET',
        'CancelDeleteStatus': serviceConfig.CancelDeleteStatus || 'NOT SET',
        'ServiceCategory': serviceConfig.ServiceCategory || 'NOT SET',
        'Voucher_Status': serviceConfig.Voucher_Status || 'NOT SET',
        'CanUpdate': serviceConfig.CanUpdate || 'NOT SET',
        'CanAccept': serviceConfig.CanAccept || 'NOT SET',
        '====================': '===================='
      };
      
      console.log('🔍 TOURPLAN PRODUCT CONFIGURATION ANALYSIS:');
      console.table(configAnalysis);
      
      // Highlight potential issues
      const issues = [];
      if (serviceConfig.CostedInBooking !== 'Y') {
        issues.push('❌ CostedInBooking is not "Y" - product may not be configured for online booking');
      }
      if (serviceConfig.TourplanServiceStatus !== 'WR') {
        issues.push('❌ TourplanServiceStatus is not "WR" (Web Request) - product needs TourPlan configuration');
      }
      if (!serviceConfig.CancelDeleteStatus || serviceConfig.CancelDeleteStatus === '') {
        issues.push('⚠️ CancelDeleteStatus is blank - may have read-only restrictions');
      }
      if (addServiceReply?.Status === 'NO') {
        issues.push('❌ Status is "NO" - booking was declined by TourPlan');
      }
      
      if (issues.length > 0) {
        console.log('⚠️ POTENTIAL CONFIGURATION ISSUES DETECTED:');
        issues.forEach(issue => console.log(issue));
        console.log('📞 These issues need to be fixed in TourPlan\'s product configuration');
      } else if (addServiceReply?.Status === 'OK' || addServiceReply?.Status === 'RQ' || addServiceReply?.Status === 'WQ') {
        console.log('✅ Product appears correctly configured for online booking');
      }
      
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
          fallbackReason: bookingError.message,
          debugXml: {
            request: xml,
            response: bookingError.message,
            error: true
          }
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
          fallbackReason: bookingError.message,
          debugXml: {
            request: xml,
            response: bookingError.message,
            error: true
          }
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
        debugXml: {
          request: xml,
          response: JSON.stringify(response, null, 2)
        }
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
        debugXml: {
          request: xml,
          response: JSON.stringify(response, null, 2)
        }
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
 * Map local class names to WordPress class names based on CSV analysis
 * This handles the mismatch between local search classes and WordPress display classes
 */
function mapLocalClassToWordPressPatterns(localClass: string, productType: string): string[] {
  const classLower = localClass.toLowerCase();
  
  if (productType === 'Packages' || productType === 'Pre-designed packages') {
    // Package class mappings from CSV analysis - some specific products show different classes in WordPress
    switch(classLower) {
      case 'basic':
        // Most Basic packages stay as Basic, but some specific products show as Deluxe in WordPress
        return ['basic', 'deluxe']; // Allow both to capture product-specific mappings
      case 'standard': 
        // Most Standard packages show as Standard, but some show as Deluxe in WordPress  
        return ['standard', 'deluxe']; // Allow both to capture Rwanda "deluxe (wp class)" products
      case 'luxury':
        // Most Luxury packages show as Luxury, but some might show as Deluxe in WordPress
        return ['luxury', 'deluxe']; // Allow both to be safe
      default:
        return [classLower];
    }
  } else {
    // Group Tours - use direct mapping for now (can be expanded based on CSV patterns)
    return [classLower];
  }
}

/**
 * Apply dynamic destination filtering based on TourPlan API response data
 * Filters products by their LocalityDescription and ClassDescription to match WordPress behavior
 */
function applyDynamicDestinationFiltering(products: any[], destination: string, classFilter: string): any[] {
  // If no destination, return all products
  if (!destination) {
    return products;
  }
  
  // Note: classFilter can be empty string for destination-only filtering

  console.log(`🎯 Applying pattern-based filtering for destination: "${destination}", class: "${classFilter || 'NO CLASS'}"`);
  console.log(`🎯 Class filter check - Value: '${classFilter}', Type: ${typeof classFilter}, Empty: ${!classFilter || classFilter === ''}`);
  console.log(`📦 Total products before filtering: ${products.length}`);
  
  // Check if BBKPKTVT001BOD6KM is in the products array
  const hasBOD6KM = products.some(p => (p.code || p.id || '').includes('BOD6KM'));
  if (!hasBOD6KM) {
    console.log(`⚠️ BBKPKTVT001BOD6KM is NOT in the products array from TourPlan API`);
  } else {
    console.log(`✅ BBKPKTVT001BOD6KM IS in the products array from TourPlan API`);
  }
  
  const filteredProducts = products.filter((product: any) => {
    const productCode = product.code || product.id || '';
    const productName = (product.name || '').toLowerCase();
    const productDescription = (product.description || '').toLowerCase();
    const supplierName = (product.supplier || '').toLowerCase();
    const productLocation = (product.location || '').toLowerCase(); // Use API location field
    const productClass = (product.class || '').toLowerCase(); // Use API class field
    
    if (productCode.includes('BOD6KM')) {
      console.log(`🎯 FOUND BOD6KM product: ${productCode} - "${product.name}" - Supplier: "${product.supplier}"`);
    }
    
    // Debug logging for Johannesburg products to understand location/class data
    if (productCode.includes('JNB') && productCode.includes('NOMAD')) {
      console.log(`🏢 JNB NOMAD product: ${productCode} - Location: "${product.location}" - Class: "${product.class}"`);
    }
    
    console.log(`🔍 Checking product: ${productCode} - "${product.name}" - Supplier: "${product.supplier}"`);
    
    // Pattern-based matching for destinations and classes
    const destLower = destination.toLowerCase();
    const classLower = classFilter.toLowerCase();
    
    // DESTINATION PATTERNS - Based on product code prefixes and content
    let destinationMatch = false;
    
    // SPECIAL CASE: Botswana needs strict filtering because TourPlan returns wrong results
    if (destLower.includes('maun')) {
      if (destLower.includes('airport')) {
        // Maun Airport products - check for specific patterns
        if (classLower === 'deluxe') {
          destinationMatch = productCode.includes('JENMAN'); // Jenman operates deluxe from Maun Airport
        } else if (classLower === 'overland camping' || classLower.includes('camping')) {
          destinationMatch = productCode.includes('SUBT'); // Sunway Budget Tours from Maun Airport
        }
      } else {
        // Plain "Maun" products - check for basic tours
        if (classLower === 'basic') {
          destinationMatch = productCode.includes('SUNA'); // Sunway basic tours from Maun (MUBGTSUNWAYSUNA13)
        }
      }
    } else if (destLower.includes('kasane')) {
      // Kasane Airport products - specific mappings to match WordPress
      // Exclude products that WordPress puts in Chobe National Park
      if (productCode === 'BBKPKCHO0153NIGPA' || productCode === 'BBKPKCHO015BUSDEL' || 
          productCode === 'BBKPKTVT001CGLCOK') {
        // These are in Chobe National Park according to WordPress, even though they have BBK
        destinationMatch = false;
      } else {
        // Include all other BBK products and specifically BBKPKTVT001BOD6KM
        destinationMatch = productCode.includes('KAS') || productCode.includes('BBK') ||
                          productCode === 'BBKPKTVT001BOD6KM'; // Explicitly include this one
      }
    } else if (destLower.includes('chobe')) {
      // Chobe National Park packages - specific patterns for Chobe-based products
      // Exclude Kasane Airport products that just visit Chobe (e.g. BBKPKCHOBAKBAK*)
      if (productCode.includes('CHOBAK') || productCode.includes('CHOLWA')) {
        // These are Kasane Airport products that visit Chobe, not Chobe-based
        destinationMatch = false;
      } else {
        // True Chobe products have CHO, CHB, or CGL (Chobe Game Lodge)
        destinationMatch = productCode.includes('CHO') || productCode.includes('CHB') || 
                          productCode.includes('CGL'); // Chobe Game Lodge (e.g. BBKPKTVT001CGLCOK)
      }
    } 
    // NORMAL CASES: These countries work fine with TourPlan API, just match by airport code
    else if (destLower.includes('nairobi') || destLower.includes('jki')) {
      destinationMatch = productCode.includes('NBO'); // Kenya works fine with TourPlan filtering
    }
    // Tanzania destinations  
    else if (destLower.includes('arusha') || destLower.includes('jro') || destLower.includes('kilimanjaro')) {
      destinationMatch = productCode.includes('JRO') || productCode.includes('ARU');
    }
    // South Africa destinations
    else if (destLower.includes('johannesburg')) {
      if (destLower.includes('airport')) {
        // Johannesburg Airport specific products: JNBPKTHISSA* but exclude ones that actually start elsewhere
        // Based on WordPress comparison: exclude products that start at Hoedspruit per their descriptions
        // JNBPKTHISSAHOSALU - actually starts at "Kruger" (should be in Hoedspruit)
        // JNBPKTHISSAHOSAST - actually starts at "Hoedspruit Airport" (should be in Hoedspruit)
        const excludedFromJohannesburg = ['JNBPKTHISSAHOSALU', 'JNBPKTHISSAHOSAST'];
        destinationMatch = productCode.includes('JNBPKTHISSA') && !excludedFromJohannesburg.includes(productCode);
        
        if (excludedFromJohannesburg.includes(productCode)) {
          console.log(`🚫 Excluding ${productCode} from Johannesburg Airport - actually starts at Hoedspruit`);
        }
      } else {
        // General Johannesburg products
        destinationMatch = productCode.includes('JNB');
      }
    } else if (destLower.includes('cape town') || destLower.includes('cape-town')) {
      if (destLower.includes('rail station') || destLower.includes('rail-station')) {
        // Cape Town Rail Station for Rail products: Only these 3 specific products per WordPress
        // CPTRLROV001CTPPUL, CPTRLROV001CTPRRO, CPTRLROV001RRCTPR
        console.log(`🚂 Cape Town Rail Station filtering: ${productCode}`);
        destinationMatch = productCode === 'CPTRLROV001CTPPUL' || 
                          productCode === 'CPTRLROV001CTPRRO' || 
                          productCode === 'CPTRLROV001RRCTPR';
        if (destinationMatch) {
          console.log(`✅ Cape Town Rail product matched: ${productCode}`);
        } else {
          console.log(`❌ Cape Town Rail product excluded: ${productCode}`);
        }
      } else {
        // Cape Town Airport for other products: CPT*
        destinationMatch = productCode.includes('CPT');
      }
    } else if (destLower.includes('pretoria')) {
      if (destLower.includes('rail station') || destLower.includes('rail-station')) {
        // Pretoria Rail Station for Rail products: Only these 3 specific products per WordPress
        // PRYRLROV001PRCPPM, PRYRLROV001PRCPRY, PRYRLROV001ROV004
        destinationMatch = productCode === 'PRYRLROV001PRCPPM' || 
                          productCode === 'PRYRLROV001PRCPRY' || 
                          productCode === 'PRYRLROV001ROV004';
      } else {
        // General Pretoria products
        destinationMatch = productCode.includes('PRY');
      }
    } else if (destLower.includes('hoedspruit') || destLower.includes('hds')) {
      // Hoedspruit products: HDSPKMAKUTS* or GKPPKTVT001* (not GKPPKSABBLD which is Sabi Sand)
      // Also include products that were excluded from Johannesburg because they actually start at Hoedspruit
      const hoedspruitProducts = ['JNBPKTHISSAHOSALU', 'JNBPKTHISSAHOSAST'];
      destinationMatch = productCode.includes('HDS') || productCode.includes('GKPPKTVT001') || hoedspruitProducts.includes(productCode);
      
      if (hoedspruitProducts.includes(productCode)) {
        console.log(`✅ Including ${productCode} in Hoedspruit - correctly identified start location`);
      }
    } else if (destLower.includes('sabi sand') || destLower.includes('sabi sabi')) {
      // Sabi Sand products: GKPPKSABBLD*
      destinationMatch = productCode.includes('GKPPKSABBLD');
    } else if (destLower.includes('durban') || destLower.includes('dur')) {
      destinationMatch = productCode.includes('DUR');
    } else if (destLower.includes('port elizabeth') || destLower.includes('plz')) {
      destinationMatch = productCode.includes('PLZ');
    }
    // Zambia destinations  
    else if (destLower.includes('livingstone') || destLower.includes('lvi')) {
      destinationMatch = productCode.includes('LVI');
    }
    // Zimbabwe destinations
    else if (destLower.includes('victoria falls')) {
      if (destLower.includes('town')) {
        // Victoria Falls Town for Rail products: Only these 3 specific products per WordPress
        // VFARLROV001VFPRDX, VFARLROV001VFPRRY, VFARLROV001VFPYPM
        destinationMatch = productCode === 'VFARLROV001VFPRDX' || 
                          productCode === 'VFARLROV001VFPRRY' || 
                          productCode === 'VFARLROV001VFPYPM';
      } else {
        // Victoria Falls Airport for other products: VFA*
        destinationMatch = productCode.includes('VFA');
      }
    }
    // Namibia destinations
    else if (destLower.includes('windhoek') || destLower.includes('wdh')) {
      destinationMatch = productCode.includes('WDH');
    }
    // Rwanda destinations
    else if (destLower.includes('kigali') || destLower.includes('kgl') || destLower.includes('rwanda')) {
      destinationMatch = productCode.includes('KGL'); // All Rwanda packages start with KGL
    }
    // Uganda destinations  
    else if (destLower.includes('entebbe') || destLower.includes('ebb') || destLower.includes('uganda')) {
      destinationMatch = productCode.includes('EBB'); // All Uganda packages start with EBB
    }
    
    // If no specific destination pattern matched, skip this product
    if (!destinationMatch) {
      console.log(`❌ ${productCode}: No destination match for "${destination}"`);
      return false;
    }
    
    // CLASS PATTERNS - Based on supplier and product code patterns
    let classMatch = false;
    
    // If no class filter provided, match all classes for this destination
    if (!classFilter || classFilter === '') {
      classMatch = true; // Match all classes when no class is specified
    }
    // RAIL-SPECIFIC CLASS FILTERING: Rail products only exist in Luxury class per WordPress
    // Based on CSV data: NO BASIC CLASS IN WORDPRESS, NO STANDARD CLASS IN WORDPRESS for Rail
    else if ((classLower === 'basic' || classLower === 'standard') && productCode.includes('RL')) {
      // Rail products (RL code) should NOT appear in Basic or Standard classes
      classMatch = false;
      console.log(`🚂 Excluding Rail product ${productCode} from ${classFilter} class - Rail only has Luxury class in WordPress`);
    } else if (classLower === 'basic') {
      // Basic class patterns - future products with these patterns will auto-match
      classMatch = productCode.includes('SAA') || // Sunway Africa Adventure basic (e.g. JNBGTSUNWAYSAA17)
                  productCode.includes('CKSM') || // Classic Kenya Standard/Mixed
                  productCode.includes('THRSO') || // Three parks standard/other
                  productCode.includes('SUNA13') || // Sunway basic tours (e.g. MUBGTSUNWAYSUNA13)
                  productCode.includes('CWA13') || // Sunway Cape West adventure (e.g. CPTGTSUNWAYCWA13)
                  productCode.includes('NAZZ') || // Nomad Zimbabwe basic (e.g. VFAGTNOMAD%20NAZZ)
                  productCode.includes('NOMNAM') || // Nomad Namibia tours (e.g. CPTGTNOMAD%20NOMNAM)
                  productCode.includes('NBA15') || // Sunway Namibia basic (e.g. LVIGTSUNWAYNBA15)
                  productCode.includes('SUNNBA') || // Sunway Namibia basic (e.g. LVIGTSUNWAYSUNNBA)
                  // Package (PK) basic patterns
                  productCode.includes('CKSNPK') || // Kenya basic packages (e.g. NBOPKARP001CKSNPK) 
                  productCode.includes('CPGRKA') || // Cape Town basic packages (e.g. CPTPKTHISSACPGRKA)
                  productCode.includes('GEUB') || productCode.includes('GERB') || // Rwanda basic packages (e.g. KGLPKAASAFAGEUB, KGLPKAASAFAGERB)
                  productCode.includes('EBBPKAASAFAGITMB') || // Uganda basic packages (specific pattern)
                  // Zimbabwe packages moved to Deluxe (per WordPress mapping)
                  productCode.includes('HOSADE') || // Johannesburg basic packages (e.g. JNBPKTHISSAHOSADE)
                  (productCode.includes('NOMAD') && (productCode.includes('%20NA') || productCode.includes(' NA')) && 
                   !productCode.includes('SG')) || // Nomad basic: has NA prefix, no SG suffix (e.g. DURGTNOMAD%20NADC, JNBGTNOMAD%20NAJC)
                  (supplierName.includes('sunway') && (productCode.includes('SAA') || productCode.includes('SUNA') || productCode.includes('CWA'))) || // Sunway basic patterns
                  (supplierName.includes('nomad') && (productCode.includes('%20NA') || productCode.includes(' NA')) && 
                   !productCode.includes('SG')); // Nomad supplier basic (NA prefix, no SG)
    } else if (classLower === 'standard') {
      // Exclude products that belong in other classes
      if (productCode.includes('BAIRDX') || productCode === 'EBBPKAASAFAGITMB') {
        classMatch = false; // BAIRDX is Deluxe, AGITMB is Basic only
      } else {
        // Standard class patterns
        classMatch = productCode === 'BBKPKCHO004CHOLUX' || // Special case: has CHOLUX but is actually Standard (3-star hotel)
                  productCode.includes('CKSO') || // Classic Kenya Standard Other
                  productCode.includes('THRSO') || // Three parks standard
                  productCode.includes('SOAEAS') || // East Africa standard
                  productCode.includes('SATOUR') || // SA Tours standard (e.g. CPTGTSATOURSAGRD4)
                  productCode.includes('SIMTW') || // Alpha Travel standard lodges (e.g. JROGTARP001SIMTW7)
                  productCode.includes('HINAMC') || // South African Overland Adventure standard (e.g. WDHGTSOANAMHINAMC)
                  productCode.includes('JENW15') || productCode.includes('JENW12') || // Jenman standard (e.g. VFAGTJENMANJENW15)
                  // Package (PK) standard patterns
                  productCode.includes('AAGMST') || productCode.includes('AAPPST') || productCode.includes('AGERS') || productCode.includes('AGEUS') || productCode.includes('AGGAME') || // Rwanda standard packages
                  productCode.includes('CKSLP') || // Kenya standard packages (e.g. NBOPKARP001CKSLP)
                  // Johannesburg Airport standard packages (from WordPress mapping)
                  productCode === 'JNBPKTHISSASPLEN1' || productCode === 'JNBPKTHISSASPLEN2' || // Johannesburg specific standard packages
                  // Zambia standard packages (from WordPress mapping)
                  productCode.includes('FE2NAV') || // Zambia standard package (LVIPKTVT001FE2NAV)
                  // Uganda standard packages (explicit list from WordPress mapping)
                  productCode === 'EBBPKARP001BAIRST' || productCode === 'EBBPKAASAFAAGITMS' || // Only these 2 are Standard in WordPress
                  // Zimbabwe standard packages (from WordPress mapping)
                  productCode.includes('VFCH01') || productCode.includes('VFCHD1') || productCode.includes('VFCHO5') || // Victoria Falls standard
                  productCode.includes('FC3NT2') || productCode.includes('FE2NT1') || // More VF standard packages
                  productCode.includes('CHOLWA') || productCode.includes('BAK3DP') || productCode.includes('BAK4DP') || // Botswana standard packages
                  // Cape Town standard packages  
                  productCode.includes('GRANDS') || productCode.includes('SCENST') || productCode.includes('SDCGST') || // This is Africa Cape Town standard (e.g. CPTPKTHISSAGRANDS)
                  productCode.includes('CTEXHO') || productCode.includes('CTCLHO') || productCode.includes('CTERHO') || productCode.includes('CTERPW') || // TVT Cape Town standard packages
                  // Hoedspruit standard packages
                  productCode.includes('MSSCLA') || productCode.includes('MSSWLK') || productCode.includes('MAKUTS') || // Hoedspruit standard (e.g. HDSPKMAKUTSMSSCLA)
                  productCode.includes('AGMST') || productCode.includes('APPST') || productCode.includes('GERS') || productCode.includes('GEUS') || productCode.includes('GGAME') || // Rwanda standard packages
                  // Cruise (CR) standard patterns - Per WordPress mapping
                  productCode.includes('TIACP2') || productCode.includes('TIACP3') || // Chobe Princess standard (e.g. BBKCRCHO018TIACP2/3)
                  (productCode.includes('NOMAD') && productCode.includes('SG')) || // NOMAD with SG suffix = Standard Group (e.g. JNBGTNOMAD%20NAJCSG)
                  productName.includes('standard');
      }
    } else if (classLower === 'deluxe') {
      // Deluxe class patterns - specific lodge/operator patterns
      classMatch = productCode.includes('JENMAN') || // Jenman is deluxe operator
                  productCode.includes('CKEKEE') || // Classic Kenya Keekorok (deluxe)
                  productCode.includes('CKSE') || // Classic Kenya Serena (deluxe)
                  productCode.includes('THRKE') || // Three parks Kenya (deluxe)
                  productCode.includes('THRSE') || // Three parks Serena (deluxe)
                  productCode.includes('SIMSE') || // Serena lodges deluxe (e.g. JROGTARP001SIMSE7)
                  productCode.includes('EAEKE') || // East Africa Kenya deluxe (e.g. NBOGTARP001EAEKE)
                  productCode.includes('CAPNAM') || // South African Overland Adventure Cape to Namibia deluxe (e.g. WDHGTSOANAMCAPNAM)
                  // Package (PK) deluxe patterns
                  productCode.includes('ENCHAN') || productCode.includes('FIMSER') || productCode.includes('WLWFPC') || productCode.includes('WDD') || // Kenya deluxe packages
                  productCode.includes('3NIGPA') || productCode.includes('BUSDEL') || productCode.includes('CGLCOK') || // Botswana deluxe packages
                  // Johannesburg Airport deluxe packages (from WordPress mapping)
                  productCode === 'JNBPKTHISSAHOSADE' || // Johannesburg specific deluxe package
                  productCode.includes('BOD6KM') || // Botswana deluxe package (e.g. BBKPKTVT001BOD6KM)
                  productCode.includes('GEUD') || productCode.includes('GERWDX') || // Rwanda deluxe packages (e.g. KGLPKAASAFAGEUD, KGLPKARP001GERWDX)
                  // Uganda deluxe packages (from WordPress mapping)
                  productCode.includes('BAIRDX') || // Uganda deluxe package (EBBPKARP001BAIRDX)
                  // Zimbabwe deluxe packages (moved from Basic per WordPress mapping)
                  productCode.includes('VFCHD2') || productCode.includes('VFCHO2') || productCode.includes('VFCHO6') || // Victoria Falls deluxe packages
                  productCode.includes('VFCRU1') || productCode.includes('VFCRU2') || productCode.includes('ZAMDR1') || productCode.includes('ZAMDR2') || // More VF deluxe
                  productCode.includes('FC3NT1') || productCode.includes('FC3NT3') || productCode.includes('FC3NT5') || // FC deluxe packages
                  productCode.includes('FE2NSL') || productCode.includes('FE2NT2') || productCode.includes('FE2NT3') || // FE deluxe packages  
                  productCode.includes('FE3NT2') || productCode.includes('FE3NT3') || productCode.includes('FE3NT6') || // More FE deluxe packages
                  productCode.includes('FSD2NW') || productCode.includes('FSD3NS') || productCode.includes('FSD3NW') || productCode.includes('FSD3WS') || // FSD deluxe packages
                  // Cape Town deluxe packages
                  productCode.includes('CPGRKA') || productCode.includes('ASCENDX') || productCode.includes('SDCRDX') || // This is Africa Cape Town deluxe (e.g. CPTPKTHISSACPGRKA)
                  productCode.includes('CTCLCM') || productCode.includes('CTCLPW') || productCode.includes('CTCLRB') || productCode.includes('CTCLSS') || productCode.includes('CTCLVL') || // TVT Cape Town deluxe packages
                  productCode.includes('CTERRB') || productCode.includes('CTERSS') || productCode.includes('CTERVL') || productCode.includes('CTEXCM') || productCode.includes('CTEXPW') || // More TVT Cape Town deluxe
                  productCode.includes('CTEXRB') || productCode.includes('CTEXSS') || productCode.includes('CTEXVL') || productCode.includes('CTRCO') || // Even more TVT Cape Town deluxe
                  // Hoedspruit deluxe packages
                  productCode.includes('KREDEL') || // Hoedspruit deluxe (e.g. GKPPKTVT001KREDEL)
                  supplierName.includes('jenman');
    } else if (classLower === 'deluxe plus' || classLower === 'd+') {
      // Deluxe Plus patterns
      classMatch = productCode.includes('EAESE') || // East Africa Serena (premium)
                  productCode.includes('EXNASP') || // South African Overland Adventure exclusive Namibia (e.g. WDHGTSOANAMEXNASP)
                  productCode.includes('ULTSAF') || // Ultimate Safaris (e.g. WDHGTULTSAFULTNAM)
                  productName.includes('premium') ||
                  productName.includes('exclusive');
    } else if (classLower === 'overland camping' || classLower.includes('camping') || classLower === 'oc') {
      // Overland camping patterns - future SUBT/SUC products will auto-match  
      classMatch = productCode.includes('SUBT') || // Sunway Budget Tours
                  productCode.includes('SUC') || // Sunway Camping tours (e.g. CPTGTSUNWAYSUC)
                  productCode.includes('OVLD') || // Overland codes
                  (productCode.includes('NOMAD') && (productCode.includes('%20N') || productCode.includes(' N')) && 
                   !(productCode.includes('%20NA') || productCode.includes(' NA'))) || // Nomad camping with space+N but not space+NA pattern (e.g. DURGTNOMAD%20NDC)
                  productName.includes('camping') ||
                  productName.includes('overland') ||
                  productDescription.includes('camping');
    } else if (classLower === 'luxury') {
      // Special case: BBKPKCHO004CHOLUX is actually Standard despite having CHOLUX in the code
      if (productCode === 'BBKPKCHO004CHOLUX') {
        classMatch = false; // This product is Standard, not Luxury
      } else {
        // Luxury class patterns
        classMatch = productCode.includes('LUX') ||
                    productCode.includes('SIMWEP') || // Alpha Travel luxury lodges (e.g. JROGTARP001SIMWEP)
                    // Package (PK) luxury patterns
                    productCode.includes('FIMMG') || productCode.includes('FIMMKT') || productCode.includes('FIMMLG') || // Kenya luxury packages
                    productCode.includes('CPKU2N') || // Botswana luxury packages (e.g. BBKPKCPKUZ%20CPKU2N)
                    productCode.includes('STDBUS') || // BBKPKCHO015STDBUS is actually Luxury per WordPress
                    // Cape Town luxury packages
                    productCode.includes('SCENLX') || productCode.includes('SDCGLX') || // This is Africa Cape Town luxury (e.g. CPTPKTHISSASCENLX)
                    productCode.includes('CTCLTB') || productCode.includes('CTCLVA') || productCode.includes('CTERTB') || productCode.includes('CTERVC') || productCode.includes('CTEXTB') || productCode.includes('CTEXVA') || // TVT Cape Town luxury packages
                    // Zambia luxury packages (from WordPress mapping)
                    productCode.includes('FE2NRL') || // Zambia luxury package (LVIPKTVT001FE2NRL)
                    // Zimbabwe luxury packages (from WordPress mapping)
                    productCode.includes('FE3NT1') || productCode.includes('SAFETST') || productCode.includes('VFCHD4') || productCode.includes('VFCHO7') || // Victoria Falls luxury
                    productCode.includes('VFCRU3') || productCode.includes('ZAMDR3') || productCode.includes('ZAMDR4') || // More VF luxury
                    productCode.includes('FC3NT4') || productCode.includes('FC3NT6') || productCode.includes('FC3NT7') || // FC luxury packages
                    productCode.includes('FE2NT4') || productCode.includes('FE2NT8') || productCode.includes('FE3NT5') || productCode.includes('FE3NT7') || productCode.includes('FE3NT8') || // FE luxury packages
                    productCode.includes('FEVHPC') || productCode.includes('FSD3CL') || productCode.includes('FSD3CS') || // More VF luxury packages
                    // Cruise (CR) luxury patterns - Per WordPress mapping
                    // Note: WordPress puts Zambezi Queen STANDARD cabins in Luxury class (confusing but matches their setup)
                    productCode.includes('ZAM3NS') || productCode.includes('ZAM2NS') || // Zambezi Queen Standard cabins shown as Luxury in WordPress
                    // Rail (RL) luxury patterns - ALL Rail products are luxury class per WordPress
                    productCode.includes('RLROV') || // Rovos Rail luxury trains (e.g. CPTRLROV001CTPPUL, PRYRLROV001PRCPPM)
                    productCode.includes('VFAR') || // Victoria Falls Rail luxury (e.g. VFARLROV001VFPRDX)
                    (productCode.includes('RL') && (productCode.includes('CPT') || productCode.includes('PRY') || productCode.includes('VFA'))) || // General Rail pattern
                    productName.includes('luxury') ||
                    productDescription.includes('luxury') ||
                    productName.includes('exclusive');
      }
    } else if (classLower === 'superior') {
      // Superior class patterns (mainly for cruises) - Per WordPress mapping
      classMatch = productCode.includes('ZAM3NM') || productCode.includes('ZAM2NM'); // Zambezi Queen Master cabin superior (e.g. BBKCRTVT001ZAM3NM)
    } else {
      // For unknown classes, be more permissive
      classMatch = true; // Show all products if class pattern is unknown
      console.log(`⚠️ Unknown class "${classFilter}" - showing all products for destination`);
    }
    
    const matches = destinationMatch && classMatch;
    console.log(`${matches ? '✅' : '❌'} ${productCode}: destination=${destinationMatch}, class=${classMatch}`);
    
    return matches;
  });
  
  console.log(`🎯 Dynamic filtering result: ${products.length} → ${filteredProducts.length} products`);
  if (filteredProducts.length > 0) {
    console.log('✅ Matching products:', filteredProducts.map(p => `${p.code} - ${p.name}`));
  }
  
  // HYBRID APPROACH: If filtering produces 0 results but we had products before filtering,
  // fall back to showing all country results with a warning - BUT ONLY for combinations we know should have results
  if (filteredProducts.length === 0 && products.length > 0) {
    // Check if this is a known "empty" combination that should genuinely return 0 results
    const destLower = destination.toLowerCase();
    const classLower = classFilter.toLowerCase();
    
    // Known combinations that should return 0 results (don't apply fallback)
    const knownEmptyCombinations = [
      // South Africa Hoedspruit Airport has no Luxury packages
      { dest: 'hoedspruit', class: 'luxury' },
      // South Africa Sabi Sand has no Standard or Deluxe packages
      { dest: 'sabi sand', class: 'standard' },
      { dest: 'sabi sand', class: 'deluxe' },
      // South Africa Johannesburg Airport has no Luxury packages (per WordPress)
      { dest: 'johannesburg', class: 'luxury' },
      // Zambia Livingstone Airport has no Deluxe class (only Standard and Luxury in WordPress)
      { dest: 'livingstone', class: 'deluxe' },
      // Zimbabwe Victoria Falls Airport has no Basic class (moved to Deluxe per WordPress)
      { dest: 'victoria falls', class: 'basic' },
      // Rail products have NO Basic or Standard classes (only Luxury per WordPress)
      { dest: 'cape town rail station', class: 'basic' },
      { dest: 'cape town rail station', class: 'standard' },
      { dest: 'pretoria rail station', class: 'basic' },
      { dest: 'pretoria rail station', class: 'standard' },
      { dest: 'victoria falls town', class: 'basic' },
      { dest: 'victoria falls town', class: 'standard' },
      // Add more known empty combinations as discovered
    ];
    
    const isKnownEmpty = knownEmptyCombinations.some(combo => 
      destLower.includes(combo.dest) && classLower === combo.class
    );
    
    if (isKnownEmpty) {
      console.log(`✅ Correctly returning 0 results for ${destination}/${classFilter} - this combination has no products`);
      return [];
    }
    
    // Otherwise apply the hybrid fallback
    console.log(`🔄 HYBRID FALLBACK: Filtering produced 0 results but ${products.length} products exist at country level`);
    console.log(`🔄 Returning all country results for destination: "${destination}", class: "${classFilter}"`);
    console.log(`🔄 This indicates pattern matching needs fixing for this combination`);
    
    // Add a flag to each product indicating this is a fallback result
    return products.map(product => ({
      ...product,
      _isHybridFallback: true,
      _fallbackReason: `Showing all results for ${destination}/${classFilter} - specific filtering needs improvement`
    }));
  }
  
  return filteredProducts;
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

/**
 * Extract countries from TourPlan amenities data
 * Countries are stored as amenities with category "CTY"
 */
function extractCountriesFromAmenities(amenities: any): string[] {
  if (!amenities || !amenities.Amenity) {
    return [];
  }

  // Handle both single amenity and array of amenities
  const amenityArray = Array.isArray(amenities.Amenity) ? amenities.Amenity : [amenities.Amenity];
  
  // Country mapping from TourPlan codes to display names
  const countryMapping: {[key: string]: string} = {
    'BW': 'Botswana',
    'KE': 'Kenya', 
    'TZ': 'Tanzania',
    'ZW': 'Zimbabwe',
    'ZM': 'Zambia',
    'NA': 'Namibia',
    'SA': 'South Africa',
    'ZA': 'South Africa', // Alternative code
    'MW': 'Malawi',
    'MZ': 'Mozambique',
    'UG': 'Uganda',
    'RW': 'Rwanda',
    'ET': 'Ethiopia',
    'LS': 'Lesotho',
    'SZ': 'eSwatini (Swaziland)',
    'MU': 'Mauritius',
    'MG': 'Madagascar',
    'RE': 'Reunion',
    'SC': 'Seychelles'
  };

  // Extract countries from amenities with category "CTY" 
  const countries: string[] = [];
  
  amenityArray.forEach((amenity: any) => {
    if (amenity.AmenityCategory === 'CTY' && amenity.AmenityCode) {
      const countryName = countryMapping[amenity.AmenityCode];
      if (countryName && !countries.includes(countryName)) {
        countries.push(countryName);
      }
    }
  });

  return countries.sort(); // Return sorted list
}