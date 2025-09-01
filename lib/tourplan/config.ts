/**
 * TourPlan API Configuration
 * Centralized configuration for performance tuning and feature flags
 */

export const tourPlanConfig = {
  // Performance settings
  performance: {
    enableCache: true,
    cacheTTL: {
      search: 5 * 60 * 1000,      // 5 minutes for search results
      product: 10 * 60 * 1000,     // 10 minutes for product details
      destination: 30 * 60 * 1000, // 30 minutes for destination data
    },
    maxConcurrentRequests: 3,      // Max parallel API requests
    requestTimeout: 15000,          // 15 seconds timeout
    retryAttempts: 2,              // Number of retry attempts
    retryDelay: 1000,              // Initial retry delay in ms
    batchSize: 5,                  // Batch size for parallel fetches
  },

  // Feature flags
  features: {
    useOptimizedSearch: true,      // Use optimized search with caching
    parallelProductFetch: true,    // Fetch product details in parallel
    useCatalogFallback: true,      // Use catalog for Rail/Cruise when API fails
    enableDebugLogging: process.env.NODE_ENV === 'development',
    logApiRequests: process.env.TOURPLAN_LOG_REQUESTS === 'true',
    logPerformanceMetrics: process.env.TOURPLAN_LOG_PERFORMANCE === 'true',
  },

  // Product type configurations
  productTypes: {
    // Product types that should use catalog approach for better performance
    useCatalogOnly: ['Rail', 'Rail journeys', 'Cruises'],
    
    // Product types that need detailed fetching
    requireDetailedFetch: ['Accommodation', 'Hotels'],
    
    // Product types that can use search response data directly
    useSearchDataOnly: ['Group Tours', 'Guided group tours', 'Day Tours'],
  },

  // API optimization settings
  api: {
    // Reduce XML response size by limiting Info parameter
    minimalInfoParams: {
      search: 'GM',           // General + Minimal for search
      detail: 'GMFTD',       // General + Minimal + Full + Text + Details
      pricing: 'GDMA',       // General + Details + Minimal + Availability
      availability: 'A',     // Availability only
    },
    
    // Fields to extract from search response (avoid detail fetches)
    searchResponseFields: [
      'Opt',
      'OptGeneral.Description',
      'OptGeneral.SupplierName',
      'OptGeneral.Comment',
      'OptGeneral.LocalityDescription',
      'OptGeneral.ClassDescription',
      'OptGeneral.Periods',
      'OptDateRanges',
      'Amenities',
    ],
  },

  // Error handling
  errors: {
    showDetailedErrors: process.env.NODE_ENV === 'development',
    logToSentry: process.env.SENTRY_DSN ? true : false,
    fallbackMessages: {
      search: 'Unable to search tours at this time. Please try again.',
      detail: 'Unable to load tour details. Please try again.',
      booking: 'Unable to process booking. Please contact support.',
    },
  },
};

/**
 * Get configuration value with fallback
 */
export function getConfig<T>(path: string, defaultValue: T): T {
  const keys = path.split('.');
  let value: any = tourPlanConfig;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return defaultValue;
    }
  }
  
  return value as T;
}

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof tourPlanConfig.features): boolean {
  return tourPlanConfig.features[feature] || false;
}

/**
 * Check if product type should use catalog
 */
export function shouldUseCatalog(productType: string): boolean {
  return tourPlanConfig.productTypes.useCatalogOnly.includes(productType);
}

/**
 * Check if product type needs detailed fetching
 */
export function needsDetailedFetch(productType: string): boolean {
  return tourPlanConfig.productTypes.requireDetailedFetch.includes(productType);
}

/**
 * Get appropriate Info parameter for request type
 */
export function getInfoParam(requestType: 'search' | 'detail' | 'pricing' | 'availability'): string {
  return tourPlanConfig.api.minimalInfoParams[requestType];
}