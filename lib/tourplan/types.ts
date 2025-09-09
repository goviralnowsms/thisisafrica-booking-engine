// TourPlan API Types

// Base types
export interface TourPlanCredentials {
  agentId: string;
  password: string;
}

// Room configuration types
export type RoomType = 'SG' | 'DB' | 'TW' | 'TR' | 'QU';

export interface RoomConfig {
  Adults: number;
  Children?: number;
  Infants?: number;
  Type: RoomType;
  Quantity: number;
}

// Search types
export type ProductType = 
  | 'Day Tours'
  | 'Group Tours'
  | 'Accommodation'
  | 'Cruises'
  | 'Rail'
  | 'Packages'
  | 'Special Offers';

export type InfoType = 'D' | 'S' | 'G' | 'I' | 'R' | 'T' | 'P' | 'GMFTD' | 'GS' | 'GSI' | 'DI';

export interface ButtonDestination {
  ButtonName?: string;
  DestinationName?: string;
}

export interface BaseSearchRequest {
  ButtonName: ProductType;
  DestinationName?: string;
  DateFrom?: string;
  DateTo?: string;
  Info?: InfoType;
  Opt?: string; // For direct product code search
  ButtonDestinations?: ButtonDestination[]; // For accommodation search structure
}

export interface AccommodationSearchRequest extends BaseSearchRequest {
  ButtonName: 'Accommodation';
  Info: 'GS' | 'GSI' | 'S'; // Support new accommodation info types
  RoomConfigs: RoomConfig[];
  DateFrom: string;
  DateTo: string;
  ButtonDestinations?: ButtonDestination[]; // For accommodation-specific search structure
}

export interface TourSearchRequest extends BaseSearchRequest {
  ButtonName: 'Day Tours' | 'Group Tours';
  Info: 'D' | 'GMFTD';
  Adults?: number;
  Children?: number;
}

export interface CruiseSearchRequest extends BaseSearchRequest {
  ButtonName: 'Cruises';
  CabinConfigs: RoomConfig[];
}

// Booking types
export type BookingType = 'B' | 'Q'; // B = Booking, Q = Quote

export interface NewBookingInfo {
  Name: string;
  QB: BookingType;
  Email?: string;
  Mobile?: string;
}

export interface AddServiceRequest {
  NewBookingInfo?: NewBookingInfo;
  BookingId?: string;
  Opt: string;
  RateId: string;
  DateFrom: string;
  DateTo?: string;
  RoomConfigs?: RoomConfig[];
  Adults?: number;
  Children?: number;
  Infants?: number;
  Note?: string;
}

// Response types
export interface TourPlanError {
  ErrorCode: string;
  ErrorMessage: string;
}

export interface AvailableDate {
  date: string;
  availability: number;
  dayOfWeek: string;
}

export interface OptionInfo {
  Opt: string;
  OptCode?: string;
  OptName: string;
  OptType?: string;
  SupplierName?: string;
  Region?: string;
  ButtonName?: string;
  Description?: string;
  Comment?: string;
  Duration?: string;
  DurationUnits?: string;
  Image?: string;
  availableDates?: AvailableDate[];
  optAvailCodes?: string[];
}

export interface RateInfo {
  RateId: string;
  RateName?: string;
  RateCode?: string;
  Currency: string;
  Total: number;
  TotalTax?: number;
  Nett?: number;
  Gross?: number;
  Commission?: number;
  DateFrom?: string;
  DateTo?: string;
  Available?: boolean;
  MinPax?: number;
  MaxPax?: number;
}

export interface OptionInfoResponse {
  Options?: OptionInfo[];
  Rates?: RateInfo[];
  Error?: TourPlanError;
}

export interface BookingResponse {
  BookingId: string;
  BookingRef?: string;
  Status?: string;
  TotalCost?: number;
  Currency?: string;
  Error?: TourPlanError;
}

export interface ServiceLine {
  ServiceLineId: string;
  Opt: string;
  OptName: string;
  DateFrom: string;
  DateTo?: string;
  Status: string;
  RoomConfigs?: RoomConfig[];
  Adults?: number;
  Children?: number;
  Nett?: number;
  Gross?: number;
  Currency?: string;
}

export interface GetBookingResponse {
  BookingId: string;
  BookingRef?: string;
  Status: string;
  AgentRef?: string;
  Name: string;
  Email?: string;
  Mobile?: string;
  TotalCost: number;
  TotalPaid?: number;
  Currency: string;
  ServiceLines?: ServiceLine[];
  Error?: TourPlanError;
}

// API method types
export type TourPlanRequest = 
  | 'PingRequest'
  | 'AgentInfoRequest'
  | 'OptionInfoRequest'
  | 'AddServiceRequest'
  | 'GetBookingRequest'
  | 'UpdateBookingRequest'
  | 'QuoteToBookRequest'
  | 'RecordBookingPaymentRequest'
  | 'CancelServicesRequest';

// Client options
export interface TourPlanClientOptions {
  endpoint: string;
  credentials: TourPlanCredentials;
  timeout?: number;
  retries?: number;
  cacheMinutes?: number;
}