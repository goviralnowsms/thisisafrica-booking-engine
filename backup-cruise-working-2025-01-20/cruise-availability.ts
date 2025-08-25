/**
 * Cruise Product Availability Configuration
 * Manages which cruise products have availability vs need quotes
 */

export interface CruiseProductAvailability {
  productCode: string;
  hasAvailability: boolean;
  departureDay?: string; // Day of week when available
  notes?: string;
}

// Configuration for cruise product availability
// NOTE: This configuration is now ONLY used for metadata (like departure days).
// Actual availability is checked dynamically from calendar data.
// Products will automatically switch between "Book Now" and "Get Quote" based on real availability.
export const CRUISE_PRODUCT_AVAILABILITY: CruiseProductAvailability[] = [
  // Metadata for cruise products (departure day info)
  {
    productCode: 'BBKCRTVT001ZAM2NS',
    hasAvailability: true, // Will be overridden by actual calendar check
    departureDay: 'TBD',
    notes: 'Zambezi Queen 2-night standard - availability checked dynamically'
  },
  {
    productCode: 'BBKCRTVT001ZAM2NM',
    hasAvailability: true, // Will be overridden by actual calendar check
    departureDay: 'TBD',
    notes: 'Zambezi Queen 2-night master - availability checked dynamically'
  },
  {
    productCode: 'BBKCRTVT001ZAM3NS',
    hasAvailability: true, // Will be overridden by actual calendar check
    departureDay: 'Friday',
    notes: 'Zambezi Queen 3-night standard - Fridays (when available)'
  },
  {
    productCode: 'BBKCRTVT001ZAM3NM',
    hasAvailability: true, // Will be overridden by actual calendar check
    departureDay: 'Friday', 
    notes: 'Zambezi Queen 3-night master - Fridays (when available)'
  },
  {
    productCode: 'BBKCRCHO018TIACP2',
    hasAvailability: true, // Will be overridden by actual calendar check
    departureDay: 'Monday/Wednesday',
    notes: 'Chobe Princess 2-night - Mon/Wed (when available)'
  },
  {
    productCode: 'BBKCRCHO018TIACP3',
    hasAvailability: true, // Will be overridden by actual calendar check
    departureDay: 'Friday',
    notes: 'Chobe Princess 3-night - Fridays (when available)'
  }
];

/**
 * Check if a cruise product has availability for booking
 * This is a temporary override - the actual availability should be checked from calendar data
 * Only products explicitly set to false will show "Get Quote"
 */
export function hasCruiseAvailability(productCode: string): boolean {
  const product = CRUISE_PRODUCT_AVAILABILITY.find(p => p.productCode === productCode);
  
  // If explicitly configured as no availability, return false
  if (product && product.hasAvailability === false) {
    return false;
  }
  
  // For all other products (including unconfigured ones), default to true
  // The actual availability check happens in the product details page
  return true;
}

/**
 * Get cruise product availability details
 */
export function getCruiseAvailability(productCode: string): CruiseProductAvailability | null {
  return CRUISE_PRODUCT_AVAILABILITY.find(p => p.productCode === productCode) ?? null;
}

/**
 * Get all cruise products with availability
 */
export function getAvailableCruiseProducts(): CruiseProductAvailability[] {
  return CRUISE_PRODUCT_AVAILABILITY.filter(p => p.hasAvailability);
}

/**
 * Get all cruise products requiring quotes
 */
export function getQuoteOnlyCruiseProducts(): CruiseProductAvailability[] {
  return CRUISE_PRODUCT_AVAILABILITY.filter(p => !p.hasAvailability);
}