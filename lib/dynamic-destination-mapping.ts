/**
 * Dynamic Country to Destination mapping using TourPlan API
 * This replaces hardcoded mappings by calling TourPlan API like WordPress does
 */

export interface CountryDestination {
  value: string;
  label: string;
  tourPlanName: string;
}

/**
 * Get available countries for a specific product type from TourPlan API (client-side)
 */
export async function getAvailableCountriesFromAPI(productType: string): Promise<{ value: string; label: string }[]> {
  try {
    console.log(`🌍 Fetching countries from TourPlan API for ${productType}`)
    
    // For client-side calls, use full URL to work in browser
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const response = await fetch(`${baseUrl}/api/tourplan/destinations?productType=${encodeURIComponent(productType)}`)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const result = await response.json()
    
    if (result.success && result.countries) {
      // Convert country names to value/label pairs
      const countries = result.countries.map((countryName: string) => ({
        value: countryName.toLowerCase().replace(/\s+/g, '-'),
        label: countryName
      }))
      
      console.log(`🌍 Found ${countries.length} countries for ${productType}:`, countries.map(c => c.label))
      return countries
    }
    
    console.warn(`⚠️ No countries found for ${productType}`)
    return []
  } catch (error) {
    console.error(`❌ Error fetching countries for ${productType}:`, error)
    return []
  }
}

/**
 * Get available destinations for a specific product type and country from TourPlan API
 */
export async function getAvailableDestinationsFromAPI(productType: string, country: string): Promise<CountryDestination[]> {
  try {
    console.log(`🗺️ Fetching destinations from TourPlan API for ${productType} in ${country}`)
    
    // Convert country value back to proper case for TourPlan API
    const tourPlanCountry = country.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
    
    const response = await fetch(`/api/tourplan/destinations?productType=${encodeURIComponent(productType)}&country=${encodeURIComponent(tourPlanCountry)}`)
    const result = await response.json()
    
    if (result.success && result.destinations) {
      // Convert destination names to value/label/tourPlanName format
      const destinations = result.destinations.map((destName: string) => ({
        value: destName.toLowerCase().replace(/\s+/g, '-'),
        label: destName,
        tourPlanName: destName
      }))
      
      console.log(`🗺️ Found ${destinations.length} destinations for ${productType} in ${country}:`, destinations.map(d => d.label))
      return destinations
    }
    
    console.warn(`⚠️ No destinations found for ${productType} in ${country}`)
    return []
  } catch (error) {
    console.error(`❌ Error fetching destinations for ${productType} in ${country}:`, error)
    return []
  }
}

/**
 * Get the correct TourPlan destination name for API calls
 */
export function getTourPlanDestinationNameFromValue(productType: string, country: string, destination: string): string {
  // For dynamic mapping, the destination value should be converted back to proper case
  if (destination && destination !== country) {
    return destination.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }
  
  // Default to country name
  return country.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}