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
export const CRUISE_PRODUCT_AVAILABILITY: CruiseProductAvailability[] = [
  // Products with NO availability - require quotes (2-night Zambezi Queen)
  {
    productCode: 'BBKCRTVT001ZAM2NS',
    hasAvailability: false,
    notes: 'Zambezi Queen 2-night standard - no availability, contact for quote'
  },
  {
    productCode: 'BBKCRTVT001ZAM2NM', 
    hasAvailability: false,
    notes: 'Zambezi Queen 2-night master - no availability, contact for quote'
  },
  
  // Products WITH availability - can be booked
  {
    productCode: 'BBKCRTVT001ZAM3NS',
    hasAvailability: true,
    departureDay: 'Friday',
    notes: 'Zambezi Queen 3-night standard - available Fridays'
  },
  {
    productCode: 'BBKCRTVT001ZAM3NM',
    hasAvailability: true,
    departureDay: 'Friday', 
    notes: 'Zambezi Queen 3-night master - available Fridays'
  },
  {
    productCode: 'BBKCRCHO018TIACP2',
    hasAvailability: true,
    departureDay: 'Monday/Wednesday',
    notes: 'Chobe Princess 2-night - available Mondays and Wednesdays'
  },
  {
    productCode: 'BBKCRCHO018TIACP3',
    hasAvailability: true,
    departureDay: 'Friday',
    notes: 'Chobe Princess 3-night - available Fridays'
  }
];

/**
 * Check if a cruise product has availability for booking
 */
export function hasCruiseAvailability(productCode: string): boolean {
  const product = CRUISE_PRODUCT_AVAILABILITY.find(p => p.productCode === productCode);
  return product?.hasAvailability ?? true; // Default to availability if not configured (conservative approach)
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