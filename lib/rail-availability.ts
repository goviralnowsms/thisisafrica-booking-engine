/**
 * Rail Product Availability Configuration
 * Manages which rail products have availability vs need quotes
 */

export interface RailProductAvailability {
  productCode: string;
  hasAvailability: boolean;
  departureDay?: string; // Day of week when available
  notes?: string;
}

// Configuration for rail product availability
export const RAIL_PRODUCT_AVAILABILITY: RailProductAvailability[] = [
  // Products with NO availability - require quotes
  {
    productCode: 'CPTRLROV001CTPRRO',
    hasAvailability: false,
    notes: 'No availability data available - contact for quote'
  },
  {
    productCode: 'CPTRLROV001RRCTPR', 
    hasAvailability: false,
    notes: 'No availability data available - contact for quote'
  },
  {
    productCode: 'CPTRLROV001CTPPUL',
    hasAvailability: false,
    notes: 'No availability data available - contact for quote'
  },
  
  // Products WITH availability - can be booked
  {
    productCode: 'PRYRLROV001PRCPPM',
    hasAvailability: true,
    departureDay: 'Friday',
    notes: 'Available Fridays - can be booked online'
  },
  {
    productCode: 'PRYRLROV001PRCPRY',
    hasAvailability: true,
    departureDay: 'Friday', 
    notes: 'Available Fridays - can be booked online'
  },
  {
    productCode: 'PRYRLROV001ROV004',
    hasAvailability: true,
    departureDay: 'Friday',
    notes: 'Available Fridays - can be booked online'
  },
];

/**
 * Check if a rail product has availability for booking
 */
export function hasRailAvailability(productCode: string): boolean {
  const product = RAIL_PRODUCT_AVAILABILITY.find(p => p.productCode === productCode);
  return product?.hasAvailability ?? false; // Default to no availability if not configured
}

/**
 * Get rail product availability details
 */
export function getRailAvailability(productCode: string): RailProductAvailability | null {
  return RAIL_PRODUCT_AVAILABILITY.find(p => p.productCode === productCode) ?? null;
}

/**
 * Get all rail products with availability
 */
export function getAvailableRailProducts(): RailProductAvailability[] {
  return RAIL_PRODUCT_AVAILABILITY.filter(p => p.hasAvailability);
}

/**
 * Get all rail products requiring quotes
 */
export function getQuoteOnlyRailProducts(): RailProductAvailability[] {
  return RAIL_PRODUCT_AVAILABILITY.filter(p => !p.hasAvailability);
}