// BACKUP of working cruise search implementation (using catalog fallback)
// Created: 2025-08-25
// This version returns filtered results based on destination+class combinations
// from the CSV data, falling back to curated catalog when TourPlan API returns empty

// From services.ts - CRUISE_CATALOG with CSV-based filtering
const ALL_CRUISES = [
  'BBKCRCHO018TIACP2', // Chobe Princess 2 night
  'BBKCRCHO018TIACP3', // Chobe Princess 3 night
  'BBKCRTVT001ZAM2NM', // Zambezi Queen 2 night
  'BBKCRTVT001ZAM2NS', // Zambezi Queen 2 night (variant)
  'BBKCRTVT001ZAM3NM', // Zambezi Queen 3 night
  'BBKCRTVT001ZAM3NS', // Zambezi Queen 3 night/4 days
];

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
  // Legacy fallbacks
  'botswana': ALL_CRUISES,
  'namibia': ALL_CRUISES,
  'zambezi': ALL_CRUISES,
  'all': ALL_CRUISES
};

// From services.ts - searchCruisesFromCatalog function
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
    const normalizedDestination = criteria.destination.toLowerCase().replace(/\s+/g, '-');
    // Normalize class (lowercase)
    const normalizedClass = criteria.class.toLowerCase();
    catalogKey = `${normalizedDestination}-${normalizedClass}`;
    console.log('🚢 Built catalog key:', catalogKey);
  } else if (criteria.destination) {
    catalogKey = criteria.destination.toLowerCase();
  } else {
    catalogKey = 'all';
  }
  
  // Get product codes for cruises based on destination + class combination
  let productCodes: string[] = CRUISE_CATALOG[catalogKey] || ALL_CRUISES;
  
  console.log('🚢 Using cruise product codes:', productCodes);
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
        console.log(`❌ Failed to load product details for: ${productCode}`);
        errors.push(`Failed to load ${productCode}`);
      }
      
      // Rate limiting: Add delay between requests (2 seconds)
      if (i < productCodes.length - 1) {
        console.log('⏳ Rate limiting: Waiting 2 seconds before next request...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
    } catch (error) {
      console.error(`❌ Error fetching cruise ${productCode}:`, error);
      errors.push(`Error loading ${productCode}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  console.log(`🚢 Loaded ${cruiseProducts.length}/${productCodes.length} cruise products successfully`);
  if (errors.length > 0) {
    console.log('🚢 Errors encountered:', errors);
  }
  
  return {
    products: cruiseProducts,
    totalResults: cruiseProducts.length,
    searchCriteria: criteria,
    errors: errors.length > 0 ? errors : undefined
  };
}

// From requests.ts - buildCruiseProperSearchRequest function (current implementation)
export function buildCruiseProperSearchRequest(buttonName: string, destination?: string, dateFrom?: string, dateTo?: string, classFilter?: string, adults: number = 2, children: number = 0): string {
  const agentId = process.env.TOURPLAN_AGENTID || process.env.TOURPLAN_AGENT_ID || '';
  const password = process.env.TOURPLAN_AGENTPASSWORD || process.env.TOURPLAN_PASSWORD || '';
  
  let xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>${buttonName}</ButtonName>
    <Info>GDM</Info>`;
    
  // Only add destination if provided and not empty
  if (destination && destination.trim() && destination.toLowerCase() !== 'all') {
    xml += `
    <DestinationName>${destination}</DestinationName>`;
  }
  
  // Add class filtering if provided - using WordPress format with ClassDescription
  if (classFilter && classFilter.trim()) {
    // Use ClassDescription like WordPress does, not <Class>
    const classDescription = classFilter.charAt(0).toUpperCase() + classFilter.slice(1).toLowerCase();
    console.log(`🚢 Adding ClassDescription filter to cruise search: ${classDescription}`);
    xml += `
    <ClassDescription>${classDescription}</ClassDescription>`;
  }
  
  if (dateFrom) {
    xml += `
    <DateFrom>${dateFrom}</DateFrom>`;
  }
  
  if (dateTo) {
    xml += `
    <DateTo>${dateTo}</DateTo>`;
  }
  
  xml += `
    <RoomConfigs>
      <RoomConfig>
        <Adults>${adults}</Adults>`;
  
  if (children > 0) {
    xml += `
        <Children>${children}</Children>`;
  }
  
  xml += `
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`;
  
  return xml;
}

// From services.ts - the main cruise search logic in searchProducts function
// Case: 'Cruises'
// Try TourPlan API first with class filtering, fallback to catalog if no results
console.log('🚢 Attempting TourPlan API cruise search first with class filtering');
// xml = buildCruiseSearchRequest(criteria.destination, criteria.dateFrom, criteria.dateTo, criteria.class);
// console.log('🚢 Cruise search XML built with class filter:');
// console.log('📋 CRUISE XML REQUEST:', xml);
// console.log('🚢 Will fallback to catalog if TourPlan returns empty');

// Fallback logic:
// if (criteria.productType === 'Cruises') {
//   console.log('🚢 ⚠️ TourPlan API returned no cruise results, falling back to curated catalog');
//   console.log('🚢 Cruise search criteria:', JSON.stringify(criteria, null, 2));
//   const cruiseResults = await searchCruisesFromCatalog(criteria);
//   
//   // ALWAYS apply filtering for cruises, even if no destination (class filtering is important!)
//   console.log(`🚢 Applying filtering to ${cruiseResults.products?.length || 0} cruise products`);
//   console.log('🚢 Filtering by destination:', criteria.destination || 'none');
//   console.log('🚢 Filtering by class:', criteria.class || 'none');
//   
//   const filteredCruiseProducts = applyDynamicDestinationFiltering(
//     cruiseResults.products || [],
//     criteria.destination || '',
//     criteria.class || ''
//   );
//   
//   console.log(`🚢 After filtering: ${filteredCruiseProducts.length} cruise products`);
//   
//   return {
//     products: filteredCruiseProducts,
//     totalResults: filteredCruiseProducts.length,
//     searchCriteria: criteria
//   };
// }

// EXPECTED RESULTS (from CSV data):
// Botswana/Kasane Airport/Luxury: 2 cruises (BBKCRTVT001ZAM2NS, BBKCRTVT001ZAM3NS)  
// Botswana/Kasane Airport/Standard: 2 cruises (BBKCRCHO018TIACP2, BBKCRCHO018TIACP3)
// Botswana/Kasane Airport/Superior: 2 cruises (BBKCRTVT001ZAM2NM, BBKCRTVT001ZAM3NM)