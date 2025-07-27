import { TourPlanXMLBuilder } from './xml-builder';
import { TourPlanXMLParser } from './xml-parser';
import type {
  TourPlanClientOptions,
  TourPlanCredentials,
  BaseSearchRequest,
  AccommodationSearchRequest,
  TourSearchRequest,
  CruiseSearchRequest,
  AddServiceRequest,
  OptionInfoResponse,
  BookingResponse,
  GetBookingResponse,
  TourPlanError,
} from './types';
import { TOURPLAN_CONFIG, ERROR_CODES, ERROR_MESSAGES } from './constants';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class TourPlanClient {
  private static instance: TourPlanClient | null = null;
  private endpoint: string;
  private credentials: TourPlanCredentials;
  private timeout: number;
  private retries: number;
  private cacheMinutes: number;
  private xmlBuilder: TourPlanXMLBuilder;
  private xmlParser: TourPlanXMLParser;
  private cache: Map<string, CacheEntry<any>>;

  private constructor(options: TourPlanClientOptions) {
    this.endpoint = options.endpoint;
    this.credentials = options.credentials;
    this.timeout = options.timeout || TOURPLAN_CONFIG.DEFAULT_TIMEOUT;
    this.retries = options.retries || TOURPLAN_CONFIG.DEFAULT_RETRIES;
    this.cacheMinutes = options.cacheMinutes || TOURPLAN_CONFIG.DEFAULT_CACHE_MINUTES;
    this.xmlBuilder = new TourPlanXMLBuilder(this.credentials);
    this.xmlParser = new TourPlanXMLParser();
    this.cache = new Map();
  }

  static getInstance(options?: TourPlanClientOptions): TourPlanClient {
    if (!TourPlanClient.instance) {
      if (!options) {
        throw new Error('TourPlanClient options required for first initialization');
      }
      TourPlanClient.instance = new TourPlanClient(options);
    }
    return TourPlanClient.instance;
  }

  static resetInstance(): void {
    TourPlanClient.instance = null;
  }

  private async executeRequest<T>(xml: string, cacheKey?: string): Promise<T> {
    // Check cache first
    if (cacheKey) {
      const cached = this.getFromCache<T>(cacheKey);
      if (cached) return cached;
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(this.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/xml; charset=utf-8',
          },
          body: xml,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseXml = await response.text();
        const result = this.xmlParser.parseResponse(responseXml) as T;

        // Cache successful responses
        if (cacheKey) {
          this.setCache(cacheKey, result);
        }

        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (error instanceof Error && error.name === 'AbortError') {
          lastError = new Error('Request timeout');
        }

        // Log retry attempt
        console.warn(`TourPlan API attempt ${attempt}/${this.retries} failed:`, lastError.message);

        // Wait before retry (exponential backoff)
        if (attempt < this.retries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw new Error(`Failed after ${this.retries} attempts: ${lastError?.message || 'Unknown error'}`);
  }

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    const expiryTime = entry.timestamp + (this.cacheMinutes * 60 * 1000);

    if (now > expiryTime) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clearCache(): void {
    this.cache.clear();
  }

  // API Methods

  async ping(): Promise<{ success: boolean; error?: TourPlanError }> {
    const xml = this.xmlBuilder.buildPingRequest();
    const response = await this.executeRequest<string>(xml);
    return this.xmlParser.parsePingResponse(response);
  }

  async getAgentInfo(): Promise<{ agentInfo?: any; error?: TourPlanError }> {
    const xml = this.xmlBuilder.buildAgentInfoRequest();
    const response = await this.executeRequest<string>(xml);
    return this.xmlParser.parseAgentInfoResponse(response);
  }

  async searchProducts(
    params: BaseSearchRequest | AccommodationSearchRequest | TourSearchRequest | CruiseSearchRequest
  ): Promise<OptionInfoResponse> {
    const xml = this.xmlBuilder.buildOptionInfoRequest(params);
    const cacheKey = `search:${JSON.stringify(params)}`;
    const response = await this.executeRequest<string>(xml, cacheKey);
    return this.xmlParser.parseOptionInfoResponse(response);
  }

  async createBooking(params: AddServiceRequest): Promise<BookingResponse> {
    const xml = this.xmlBuilder.buildAddServiceRequest(params);
    const response = await this.executeRequest<string>(xml);
    return this.xmlParser.parseAddServiceResponse(response);
  }

  async addServiceToBooking(bookingId: string, params: Omit<AddServiceRequest, 'NewBookingInfo'>): Promise<BookingResponse> {
    const xml = this.xmlBuilder.buildAddServiceRequest({
      ...params,
      BookingId: bookingId,
    });
    const response = await this.executeRequest<string>(xml);
    return this.xmlParser.parseAddServiceResponse(response);
  }

  async getBooking(bookingId: string): Promise<GetBookingResponse> {
    const xml = this.xmlBuilder.buildGetBookingRequest(bookingId);
    const response = await this.executeRequest<string>(xml);
    return this.xmlParser.parseGetBookingResponse(response);
  }

  async updateBooking(bookingId: string, updates: Record<string, any>): Promise<BookingResponse> {
    const xml = this.xmlBuilder.buildUpdateBookingRequest(bookingId, updates);
    const response = await this.executeRequest<string>(xml);
    return this.xmlParser.parseAddServiceResponse(response);
  }

  async convertQuoteToBooking(bookingId: string, sendSupplierMessage = true): Promise<BookingResponse> {
    const xml = this.xmlBuilder.buildQuoteToBookRequest(bookingId, sendSupplierMessage);
    const response = await this.executeRequest<string>(xml);
    return this.xmlParser.parseAddServiceResponse(response);
  }

  async recordPayment(bookingId: string, payment: Record<string, any>): Promise<BookingResponse> {
    const xml = this.xmlBuilder.buildRecordPaymentRequest(bookingId, payment);
    const response = await this.executeRequest<string>(xml);
    return this.xmlParser.parseAddServiceResponse(response);
  }

  async cancelBooking(bookingRef: string): Promise<BookingResponse> {
    const xml = this.xmlBuilder.buildCancelServicesRequest(bookingRef);
    const response = await this.executeRequest<string>(xml);
    return this.xmlParser.parseAddServiceResponse(response);
  }

  // Helper method to create properly formatted error responses
  createErrorResponse(errorCode: string, customMessage?: string): TourPlanError {
    return {
      ErrorCode: errorCode,
      ErrorMessage: customMessage || ERROR_MESSAGES[errorCode] || 'Unknown error occurred',
    };
  }
}

// Export singleton getter for convenience
export function getTourPlanClient(options?: TourPlanClientOptions): TourPlanClient {
  return TourPlanClient.getInstance(options);
}