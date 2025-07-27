// TourPlan API - WordPress-style Implementation

// Core functions (equivalent to WordPress tourplan_query and WPXMLREQUEST)
export { tourplanQuery, wpXmlRequest, getTourPlanConfig } from './core';

// Request builders (equivalent to WordPress TourPlan classes)
export { 
  OptionInfoRequest,
  AddServiceRequest,
  GetBookingRequest,
  buildPingRequest,
  buildAgentInfoRequest,
  buildServiceButtonDetailsRequest,
  buildTourSearchRequest,
  buildAccommodationSearchRequest,
  buildGroupTourSearchRequest,
} from './requests';

// Service functions (equivalent to WordPress AJAX handlers and classes)
export {
  getDestinations,
  searchProducts,
  getProductDetails,
  createBooking,
  getBookingDetails,
} from './services';

// Legacy exports for backward compatibility
export { TourPlanClient, getTourPlanClient } from './client';
export type * from './types';
export * from './constants';

// Simple helper to check TourPlan connection
export async function checkTourPlanConnection() {
  try {
    const { tourplanQuery } = await import('./core');
    const { buildPingRequest } = await import('./requests');
    
    const xml = buildPingRequest();
    const response = await tourplanQuery(xml);
    
    return {
      connected: true,
      response,
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}