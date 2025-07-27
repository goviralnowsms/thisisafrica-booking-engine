// lib/api/tourplan/index.ts
// Main Tourplan API integration

import { TourplanXMLClient } from './xmlTourplanClient';

// Export the XML client and utilities
export { TourplanXMLClient, TourplanUtils } from './xmlTourplanClient';
export type { 
  TourplanConfig, 
  SearchParams, 
  TourplanProduct, 
  ProductRate, 
  SearchResponse 
} from './xmlTourplanClient';

// Create API client from environment variables
export function createTourplanAPIFromEnv() {
  return TourplanXMLClient.fromEnvironment();
}

// Constants for the API
export const TOURPLAN_CONSTANTS = {
  INFO_TYPES: {
    GENERAL: 'G',
    DETAILED: 'GS',
    PRICING: 'GS',
    DESCRIPTION: 'D',
    GDMP: 'GDMP'
  },
  BUTTON_NAMES: {
    DAY_TOURS: 'Day Tours',
    ACCOMMODATION: 'Accommodation',
    CRUISES: 'Cruises',
    RAIL: 'Rail',
    PACKAGES: 'Packages',
    SPECIAL_OFFERS: 'Special Offers'
  }
};
