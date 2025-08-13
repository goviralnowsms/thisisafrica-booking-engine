/**
 * Group Tours Availability Overrides
 * 
 * Minimal override system for specific Group Tours products that have 
 * incorrect availability in the TourPlan API.
 * 
 * Most Group Tours work correctly - this only handles exceptions.
 * When TourPlan fixes their API, set useTourPlanAPI: true for that product.
 */

interface GroupTourAvailability {
  productCode: string
  departureDay?: string // e.g., "Friday", "Sunday" 
  notes?: string
  useTourPlanAPI?: boolean // Set to true when TourPlan fixes their API
}

/**
 * Only add products here that have incorrect availability in TourPlan API
 */
const AVAILABILITY_OVERRIDES: GroupTourAvailability[] = [
  {
    productCode: 'NBOGTSOAEASSNM061',
    departureDay: 'Friday',
    notes: 'API shows daily availability but actually only departs Fridays (with rare exceptions)',
    useTourPlanAPI: false // Set to true when TourPlan fixes this
  }
]

/**
 * Check if we should show departure day message for a product
 */
export function shouldShowDepartureDay(productCode: string): boolean {
  const override = AVAILABILITY_OVERRIDES.find(item => item.productCode === productCode)
  return override && !override.useTourPlanAPI && override.departureDay ? true : false
}

/**
 * Get departure day message for display
 */
export function getDepartureDayMessage(productCode: string): string | null {
  const override = AVAILABILITY_OVERRIDES.find(item => item.productCode === productCode)
  
  if (!override || override.useTourPlanAPI || !override.departureDay) {
    return null
  }
  
  return `Departs ${override.departureDay}s`
}