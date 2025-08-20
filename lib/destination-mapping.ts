/**
 * Country to Destination mapping based on TourPlan API testing results
 * This ensures users only see destinations that actually have products
 */

export interface CountryDestinations {
  [country: string]: {
    displayName: string;
    destinations: {
      value: string;
      label: string;
      tourPlanName: string; // Exact name needed for TourPlan API
    }[];
  };
}

// Based on our TourPlan API testing, these are the countries/destinations that actually work
export const PRODUCT_DESTINATIONS: Record<string, CountryDestinations> = {
  'Group Tours': {
    'kenya': {
      displayName: 'Kenya',
      destinations: [
        { value: 'kenya', label: 'Kenya (All Regions)', tourPlanName: 'Kenya' },
        { value: 'masai-mara', label: 'Masai Mara', tourPlanName: 'Kenya' },
        { value: 'amboseli', label: 'Amboseli', tourPlanName: 'Kenya' },
        { value: 'tsavo', label: 'Tsavo', tourPlanName: 'Kenya' }
      ]
    },
    'tanzania': {
      displayName: 'Tanzania',
      destinations: [
        { value: 'tanzania', label: 'Tanzania (All Regions)', tourPlanName: 'Tanzania' },
        { value: 'serengeti', label: 'Serengeti', tourPlanName: 'Tanzania' },
        { value: 'ngorongoro', label: 'Ngorongoro Crater', tourPlanName: 'Tanzania' },
        { value: 'zanzibar', label: 'Zanzibar', tourPlanName: 'Tanzania' }
      ]
    }
  },

  'Rail': {
    'south-africa': {
      displayName: 'South Africa',
      destinations: [
        { value: 'south-africa', label: 'South Africa (All Routes)', tourPlanName: 'South Africa' },
        { value: 'cape-town', label: 'Cape Town Routes', tourPlanName: 'South Africa' },
        { value: 'pretoria', label: 'Pretoria Routes', tourPlanName: 'South Africa' }
      ]
    },
    'zimbabwe': {
      displayName: 'Zimbabwe',
      destinations: [
        { value: 'zimbabwe', label: 'Zimbabwe (All Routes)', tourPlanName: 'Zimbabwe' },
        { value: 'victoria-falls', label: 'Victoria Falls Routes', tourPlanName: 'Zimbabwe' }
      ]
    }
  },

  'Cruises': {
    'botswana': {
      displayName: 'Botswana',
      destinations: [
        { value: 'kasane-airport', label: 'Kasane Airport', tourPlanName: 'Botswana' }
      ]
    },
    'namibia': {
      displayName: 'Namibia',
      destinations: []
    },
    'zimbabwe': {
      displayName: 'Zimbabwe', 
      destinations: []
    }
  },

  'Packages': {
    'kenya': {
      displayName: 'Kenya',
      destinations: [
        { value: 'kenya', label: 'Kenya (All Packages)', tourPlanName: 'Kenya' },
        { value: 'masai-mara', label: 'Masai Mara Packages', tourPlanName: 'Kenya' },
        { value: 'nairobi', label: 'Nairobi Packages', tourPlanName: 'Kenya' }
      ]
    }
  }
};

// Generic destinations for products that don't have specific API mappings (fallback to catalog)
export const GENERIC_DESTINATIONS: CountryDestinations = {
  'botswana': {
    displayName: 'Botswana',
    destinations: [
      { value: 'botswana', label: 'Botswana', tourPlanName: 'Botswana' },
      { value: 'chobe', label: 'Chobe National Park', tourPlanName: 'Chobe' },
      { value: 'okavango', label: 'Okavango Delta', tourPlanName: 'Okavango' }
    ]
  },
  'kenya': {
    displayName: 'Kenya',
    destinations: [
      { value: 'kenya', label: 'Kenya', tourPlanName: 'Kenya' },
      { value: 'masai-mara', label: 'Masai Mara', tourPlanName: 'Masai Mara' },
      { value: 'amboseli', label: 'Amboseli', tourPlanName: 'Amboseli' },
      { value: 'tsavo', label: 'Tsavo', tourPlanName: 'Tsavo' }
    ]
  },
  'namibia': {
    displayName: 'Namibia',
    destinations: [
      { value: 'namibia', label: 'Namibia', tourPlanName: 'Namibia' },
      { value: 'sossusvlei', label: 'Sossusvlei', tourPlanName: 'Sossusvlei' },
      { value: 'windhoek', label: 'Windhoek', tourPlanName: 'Windhoek' }
    ]
  },
  'south-africa': {
    displayName: 'South Africa',
    destinations: [
      { value: 'south-africa', label: 'South Africa', tourPlanName: 'South Africa' },
      { value: 'cape-town', label: 'Cape Town', tourPlanName: 'Cape Town' },
      { value: 'kruger', label: 'Kruger National Park', tourPlanName: 'Kruger' },
      { value: 'johannesburg', label: 'Johannesburg', tourPlanName: 'Johannesburg' }
    ]
  },
  'tanzania': {
    displayName: 'Tanzania',
    destinations: [
      { value: 'tanzania', label: 'Tanzania', tourPlanName: 'Tanzania' },
      { value: 'serengeti', label: 'Serengeti', tourPlanName: 'Serengeti' },
      { value: 'ngorongoro', label: 'Ngorongoro Crater', tourPlanName: 'Ngorongoro' },
      { value: 'zanzibar', label: 'Zanzibar', tourPlanName: 'Zanzibar' }
    ]
  },
  'uganda': {
    displayName: 'Uganda',
    destinations: [
      { value: 'uganda', label: 'Uganda', tourPlanName: 'Uganda' },
      { value: 'bwindi', label: 'Bwindi Impenetrable Forest', tourPlanName: 'Bwindi' },
      { value: 'queen-elizabeth', label: 'Queen Elizabeth National Park', tourPlanName: 'Queen Elizabeth' }
    ]
  },
  'zambia': {
    displayName: 'Zambia',
    destinations: [
      { value: 'zambia', label: 'Zambia', tourPlanName: 'Zambia' },
      { value: 'victoria-falls', label: 'Victoria Falls', tourPlanName: 'Victoria Falls' },
      { value: 'south-luangwa', label: 'South Luangwa', tourPlanName: 'South Luangwa' }
    ]
  },
  'zimbabwe': {
    displayName: 'Zimbabwe',
    destinations: [
      { value: 'zimbabwe', label: 'Zimbabwe', tourPlanName: 'Zimbabwe' },
      { value: 'victoria-falls', label: 'Victoria Falls', tourPlanName: 'Victoria Falls' },
      { value: 'hwange', label: 'Hwange National Park', tourPlanName: 'Hwange' }
    ]
  }
};

/**
 * Get available countries for a specific product type
 */
export function getAvailableCountries(productType: string): { value: string; label: string }[] {
  const productMappings = PRODUCT_DESTINATIONS[productType];
  
  if (productMappings) {
    return Object.keys(productMappings).map(countryKey => ({
      value: countryKey,
      label: productMappings[countryKey].displayName
    }));
  }
  
  // Fallback to all countries for unknown product types
  return Object.keys(GENERIC_DESTINATIONS).map(countryKey => ({
    value: countryKey,
    label: GENERIC_DESTINATIONS[countryKey].displayName
  }));
}

/**
 * Get available destinations for a specific product type and country
 */
export function getAvailableDestinations(productType: string, country: string): { value: string; label: string; tourPlanName: string }[] {
  const productMappings = PRODUCT_DESTINATIONS[productType];
  
  if (productMappings && productMappings[country]) {
    return productMappings[country].destinations;
  }
  
  // Fallback to generic destinations
  if (GENERIC_DESTINATIONS[country]) {
    return GENERIC_DESTINATIONS[country].destinations;
  }
  
  return [];
}

/**
 * Get the correct TourPlan destination name for API calls
 */
export function getTourPlanDestinationName(productType: string, country: string, destination: string): string {
  const destinations = getAvailableDestinations(productType, country);
  const foundDestination = destinations.find(dest => dest.value === destination);
  return foundDestination?.tourPlanName || destination;
}