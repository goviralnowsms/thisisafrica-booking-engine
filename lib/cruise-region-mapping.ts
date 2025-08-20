/**
 * Cruise Product Region Mapping
 * Maps cruise products to regions based on WordPress configuration
 */

export interface CruiseProduct {
  productCode: string;
  name: string;
  regions: string[]; // Countries where this product should appear
  description?: string;
}

// All 6 cruise products with their region mappings
export const CRUISE_PRODUCTS: CruiseProduct[] = [
  // Zambezi Queen products (appear in Botswana, Namibia, Zimbabwe)
  {
    productCode: 'BBKCRTVT001ZAM2NS',
    name: 'Zambezi Queen 2-night Standard',
    regions: ['botswana', 'namibia', 'zimbabwe'],
    description: 'Zambezi Queen river cruise - 2 nights standard accommodation'
  },
  {
    productCode: 'BBKCRTVT001ZAM2NM', 
    name: 'Zambezi Queen 2-night Master',
    regions: ['botswana', 'namibia', 'zimbabwe'],
    description: 'Zambezi Queen river cruise - 2 nights master suite'
  },
  {
    productCode: 'BBKCRTVT001ZAM3NS',
    name: 'Zambezi Queen 3-night Standard', 
    regions: ['botswana', 'namibia', 'zimbabwe'],
    description: 'Zambezi Queen river cruise - 3 nights standard accommodation'
  },
  {
    productCode: 'BBKCRTVT001ZAM3NM',
    name: 'Zambezi Queen 3-night Master',
    regions: ['botswana', 'namibia', 'zimbabwe'], 
    description: 'Zambezi Queen river cruise - 3 nights master suite'
  },
  
  // Chobe Princess products (appear only in Botswana)
  {
    productCode: 'BBKCRCHO018TIACP2',
    name: 'Chobe Princess 2-night',
    regions: ['botswana'],
    description: 'Chobe Princess river cruise - 2 nights'
  },
  {
    productCode: 'BBKCRCHO018TIACP3',
    name: 'Chobe Princess 3-night',
    regions: ['botswana'],
    description: 'Chobe Princess river cruise - 3 nights'
  }
];

/**
 * Get cruise products available for a specific region/country
 */
export function getCruiseProductsForRegion(country: string): CruiseProduct[] {
  return CRUISE_PRODUCTS.filter(product => 
    product.regions.includes(country.toLowerCase())
  );
}

/**
 * Check if a country should show destination/class filters
 * Only Botswana shows destinations and classes
 */
export function shouldShowDestinationAndClass(country: string): boolean {
  return country.toLowerCase() === 'botswana';
}

/**
 * Get all available cruise regions/countries
 */
export function getCruiseRegions(): { value: string; label: string }[] {
  return [
    { value: 'botswana', label: 'Botswana' },
    { value: 'namibia', label: 'Namibia' }, 
    { value: 'zimbabwe', label: 'Zimbabwe' }
  ];
}