// TourPlan API Constants

export const TOURPLAN_CONFIG = {
  DTD_VERSION: 'hostConnect_5_05_000.dtd',
  XML_VERSION: '1.0',
  DEFAULT_TIMEOUT: 30000,
  DEFAULT_RETRIES: 3,
  DEFAULT_CACHE_MINUTES: 10,
} as const;

export const ROOM_TYPES = {
  SINGLE: 'SG',
  DOUBLE: 'DB',
  TWIN: 'TW',
  TRIPLE: 'TR',
  QUADRUPLE: 'QU',
} as const;

export const ROOM_TYPE_LABELS = {
  SG: 'Single',
  DB: 'Double',
  TW: 'Twin',
  TR: 'Triple',
  QU: 'Quadruple',
} as const;

export const INFO_TYPES = {
  DAY_TOUR: 'D',
  STAY_PRICE: 'S',
  GENERAL: 'G',
  AVAILABILITY: 'I',
  RATE: 'R',
  TICKET: 'T',
  PACKAGE: 'P',
  GROUP_MULTI: 'GMFTD',
  GENERAL_STAY: 'GS',
} as const;

export const BOOKING_TYPES = {
  BOOKING: 'B',
  QUOTE: 'Q',
} as const;

export const ERROR_CODES = {
  GENERAL_ERROR: '1000',
  MISSING_INPUT: '1001',
  ILLEGAL_INPUT: '1002',
  COMMUNICATIONS_ERROR: '1003',
  BOOKING_NOT_FOUND: '1050',
  AGENT_AUTH_FAILED: '1051',
  OPTION_NOT_FOUND: '1052',
} as const;

export const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.GENERAL_ERROR]: 'An error occurred processing your request',
  [ERROR_CODES.MISSING_INPUT]: 'Required information is missing',
  [ERROR_CODES.ILLEGAL_INPUT]: 'Invalid input provided',
  [ERROR_CODES.COMMUNICATIONS_ERROR]: 'Unable to connect to booking system',
  [ERROR_CODES.BOOKING_NOT_FOUND]: 'Booking not found',
  [ERROR_CODES.AGENT_AUTH_FAILED]: 'Authentication failed',
  [ERROR_CODES.OPTION_NOT_FOUND]: 'Product not found',
};

export const PRODUCT_TYPES = {
  DAY_TOURS: 'Day Tours',
  GROUP_TOURS: 'Group Tours',
  ACCOMMODATION: 'Accommodation',
  CRUISES: 'Cruises',
  RAIL: 'Rail',
  PACKAGES: 'Packages',
  SPECIAL_OFFERS: 'Special Offers',
} as const;

export const BOOKING_STATUS = {
  PENDING: 'PND',
  CONFIRMED: 'CNF',
  CANCELLED: 'CXL',
  QUOTE: 'QTE',
} as const;

// Default image mappings for tours without images
export const DEFAULT_TOUR_IMAGES: Record<string, string> = {
  safari: '/images/default-safari.jpg',
  cruise: '/images/default-cruise.jpg',
  rail: '/images/default-rail.jpg',
  accommodation: '/images/default-accommodation.jpg',
  package: '/images/default-package.jpg',
  tour: '/images/default-tour.jpg',
};