// lib/api/tourplan/xmlTourplanClient.ts
// Enhanced XML client building on your existing functionality

import { parseString } from 'xml2js';

// ============================================================================
// TYPES (building on your existing interfaces)
// ============================================================================

export interface TourplanConfig {
  agentId: string;
  password: string;
  apiUrl: string;
  timeout?: number;
}

export interface SearchParams {
  destination?: string;
  buttonName?: string;
  dateFrom?: string;
  dateTo?: string;
  adults?: number;
  children?: number;
  rooms?: RoomConfig[];
  info?: string;
  searchType?: 'general' | 'detailed';
}

export interface RoomConfig {
  adults: number;
  children: number;
  roomType?: string;
  childrenAges?: number[];
}

export interface TourplanProduct {
  id: string;
  code: string;
  name: string;
  supplierName: string;
  description: string;
  destinationName: string;
  rates: ProductRate[];
  currency: string;
  availability: string;
  serviceType?: string;
  category?: string;
  images?: string[];
  amenities?: any[];
  _raw?: any;
}

export interface ProductRate {
  adultPrice: number;
  childPrice?: number;
  currency: string;
  rateName: string;
  available?: number;
  date?: string;
}

export interface SearchResponse {
  success: boolean;
  products: TourplanProduct[];
  totalFound: number;
  searchType: string;
  config: {
    buttonName: string;
    productType: string;
  };
  debug: {
    xmlRequestLength: number;
    xmlResponseLength: number;
    parsedStructure: string[];
  };
  error?: string;
}

// ============================================================================
// XML BUILDER CLASS
// ============================================================================

class TourplanXMLBuilder {
  static escapeXml(unsafe: string): string {
    if (!unsafe) return '';
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  static buildSearchRequest(params: SearchParams, config: TourplanConfig): string {
    const {
      destination = 'South Africa',
      buttonName = 'Day Tours',
      dateFrom,
      dateTo,
      adults = 2,
      children = 0,
      info = 'GS', // Default to pricing info
      rooms
    } = params;

    let xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${this.escapeXml(config.agentId)}</AgentID>
    <Password>${this.escapeXml(config.password)}</Password>
    <ButtonName>${this.escapeXml(buttonName)}</ButtonName>
    <DestinationName>${this.escapeXml(destination)}</DestinationName>
    <Info>${this.escapeXml(info)}</Info>`;

    if (dateFrom) {
      xml += `
    <DateFrom>${dateFrom}</DateFrom>`;
    }

    if (dateTo) {
      xml += `
    <DateTo>${dateTo}</DateTo>`;
    }

    // Add room configurations for accommodation/cruise searches
    if (rooms && rooms.length > 0) {
      xml += `
    <RoomConfigs>`;
      rooms.forEach(room => {
        xml += `
      <RoomConfig>
        <Adults>${room.adults}</Adults>`;
        if (room.children && room.children > 0) {
          xml += `
        <Children>${room.children}</Children>`;
        }
        if (room.roomType) {
          xml += `
        <RoomType>${this.escapeXml(room.roomType)}</RoomType>`;
        }
        xml += `
      </RoomConfig>`;
      });
      xml += `
    </RoomConfigs>`;
    } else if (adults || children) {
      // Fallback for simple adult/children counts
      xml += `
    <RoomConfigs>
      <RoomConfig>
        <Adults>${adults}</Adults>`;
      if (children && children > 0) {
        xml += `
        <Children>${children}</Children>`;
      }
      xml += `
      </RoomConfig>
    </RoomConfigs>`;
    }

    xml += `
    <RateConvert>Y</RateConvert>
  </OptionInfoRequest>
</Request>`;

    return xml;
  }

  static buildProductDetailRequest(optionCode: string, config: TourplanConfig, info: string = 'G'): string {
    return `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${this.escapeXml(config.agentId)}</AgentID>
    <Password>${this.escapeXml(config.password)}</Password>
    <Opt>${this.escapeXml(optionCode)}</Opt>
    <Info>${this.escapeXml(info)}</Info>
  </OptionInfoRequest>
</Request>`;
  }

  static buildPingRequest(config: TourplanConfig): string {
    return `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <PingRequest>
    <AgentID>${this.escapeXml(config.agentId)}</AgentID>
    <Password>${this.escapeXml(config.password)}</Password>
  </PingRequest>
</Request>`;
  }
}

// ============================================================================
// XML PARSER CLASS
// ============================================================================

class TourplanXMLParser {
  static async parseSearchResponse(xmlText: string): Promise<TourplanProduct[]> {
    return new Promise((resolve, reject) => {
      parseString(xmlText, {
        explicitArray: false,
        trim: true,
        normalize: true,
        normalizeTags: false,
        attrkey: 'attributes'
      }, (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        try {
          const products = this.extractProductsFromParsedXML(result);
          resolve(products);
        } catch (parseError) {
          reject(parseError);
        }
      });
    });
  }

  private static extractProductsFromParsedXML(parsedData: any): TourplanProduct[] {
    const products: TourplanProduct[] = [];
    
    if (!parsedData?.Reply?.OptionInfoReply?.Option) {
      return products;
    }

    const options = Array.isArray(parsedData.Reply.OptionInfoReply.Option)
      ? parsedData.Reply.OptionInfoReply.Option
      : [parsedData.Reply.OptionInfoReply.Option];

    options.forEach((option: any, index: number) => {
      const rates = this.extractRatesFromOption(option);
      
      const product: TourplanProduct = {
        id: option.Opt || `product-${index}`,
        code: option.Opt || '',
        name: option.OptGeneral?.Description || option.OptGeneral?.SupplierName || 'Unknown Product',
        supplierName: option.OptGeneral?.SupplierName || '',
        description: option.OptGeneral?.Description || '',
        destinationName: option.OptGeneral?.LocalityDescription || '',
        rates: rates,
        currency: this.extractCurrency(option) || 'USD',
        availability: this.extractAvailability(option),
        serviceType: option.OptGeneral?.ServiceType || '',
        category: option.OptGeneral?.Category || '',
        _raw: option
      };

      products.push(product);
    });

    return products;
  }

  private static extractRatesFromOption(option: any): ProductRate[] {
    const rates: ProductRate[] = [];

    // Method 1: Stay Results (for accommodation)
    if (option.OptStayResults?.RateSet?.RateStays?.RateStay) {
      const rateStays = Array.isArray(option.OptStayResults.RateSet.RateStays.RateStay)
        ? option.OptStayResults.RateSet.RateStays.RateStay
        : [option.OptStayResults.RateSet.RateStays.RateStay];
      
      rateStays.forEach((rateStay: any) => {
        if (rateStay.StayPays?.StayPay) {
          const stayPays = Array.isArray(rateStay.StayPays.StayPay)
            ? rateStay.StayPays.StayPay
            : [rateStay.StayPays.StayPay];
          
          stayPays.forEach((stayPay: any) => {
            rates.push({
              adultPrice: parseFloat(stayPay.Pay) || 0,
              currency: stayPay.Currency || 'USD',
              rateName: rateStay.RateName || 'Standard',
              available: parseInt(stayPay.Available) || 0,
              date: stayPay.Date || ''
            });
          });
        }
      });
    }

    // Method 2: Room Rates (alternative accommodation format)
    if (option.OptRates?.RoomRates) {
      const roomRates = option.OptRates.RoomRates;
      
      if (roomRates.SingleRate) {
        rates.push({
          adultPrice: parseFloat(roomRates.SingleRate) || 0,
          currency: roomRates.Currency || 'USD',
          rateName: 'Single'
        });
      }
      
      if (roomRates.TwinRate) {
        rates.push({
          adultPrice: parseFloat(roomRates.TwinRate) || 0,
          currency: roomRates.Currency || 'USD',
          rateName: 'Twin'
        });
      }
      
      if (roomRates.DoubleRate) {
        rates.push({
          adultPrice: parseFloat(roomRates.DoubleRate) || 0,
          currency: roomRates.Currency || 'USD',
          rateName: 'Double'
        });
      }
    }

    // Method 3: General pricing (for tours/activities)
    if (option.OptPrice) {
      const optPrices = Array.isArray(option.OptPrice) ? option.OptPrice : [option.OptPrice];
      
      optPrices.forEach((price: any) => {
        rates.push({
          adultPrice: parseFloat(price.AdultPrice || price.Price || price.SellPrice) || 0,
          childPrice: parseFloat(price.ChildPrice) || undefined,
          currency: price.Currency || 'USD',
          rateName: price.Description || 'Standard',
          available: parseInt(price.Available) || 0,
          date: price.Date || ''
        });
      });
    }

    // Method 4: Simple price extraction
    if (rates.length === 0 && option.SellPrice) {
      rates.push({
        adultPrice: parseFloat(option.SellPrice) || 0,
        currency: option.Currency || 'USD',
        rateName: 'Standard'
      });
    }

    return rates;
  }

  private static extractCurrency(option: any): string {
    return option.OptStayResults?.RateSet?.Currency ||
           option.OptRates?.Currency ||
           option.Currency ||
           'USD';
  }

  private static extractAvailability(option: any): string {
    if (option.Available === 'Y' || option.Available === true) {
      return 'Available';
    }
    if (option.Available === 'N' || option.Available === false) {
      return 'Not Available';
    }
    return 'Check Availability';
  }
}

// ============================================================================
// MAIN CLIENT CLASS
// ============================================================================

export class TourplanXMLClient {
  private config: TourplanConfig;

  constructor(config: TourplanConfig) {
    this.config = config;
  }

  // Create client from environment variables
  static fromEnvironment(): TourplanXMLClient {
    const config: TourplanConfig = {
      agentId: process.env.TOURPLAN_AGENTID || '',
      password: process.env.TOURPLAN_AGENTPASSWORD || '',
      apiUrl: process.env.TOURPLAN_API_URL || '',
      timeout: 30000
    };

    if (!config.agentId || !config.password || !config.apiUrl) {
      throw new Error('Missing required Tourplan environment variables');
    }

    return new TourplanXMLClient(config);
  }

  // Generic method to make XML requests
  private async makeXMLRequest(xmlRequest: string): Promise<string> {
    console.log('🔗 Sending XML to Tourplan:', xmlRequest.substring(0, 200) + '...');

    const response = await fetch(this.config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
      },
      body: xmlRequest,
    });

    console.log('📋 Tourplan Response Status:', response.status);

    if (!response.ok) {
      throw new Error(`Tourplan API error: ${response.status}`);
    }

    const xmlText = await response.text();
    console.log('📋 Tourplan Response Length:', xmlText.length);

    // Check for error responses
    if (xmlText.includes('ErrorReply') || xmlText.includes('<e>')) {
      console.error('❌ Tourplan API error response');
      throw new Error('Tourplan API returned an error');
    }

    return xmlText;
  }

  // Search for products/tours
  async search(params: SearchParams): Promise<SearchResponse> {
    try {
      const xmlRequest = TourplanXMLBuilder.buildSearchRequest(params, this.config);
      const xmlResponse = await this.makeXMLRequest(xmlRequest);
      const products = await TourplanXMLParser.parseSearchResponse(xmlResponse);

      return {
        success: true,
        products,
        totalFound: products.length,
        searchType: params.buttonName || 'Day Tours',
        config: {
          buttonName: params.buttonName || 'Day Tours',
          productType: params.buttonName || 'Day Tours'
        },
        debug: {
          xmlRequestLength: xmlRequest.length,
          xmlResponseLength: xmlResponse.length,
          parsedStructure: products.map(p => p.name)
        }
      };
    } catch (error) {
      return {
        success: false,
        products: [],
        totalFound: 0,
        searchType: params.buttonName || 'Day Tours',
        config: {
          buttonName: params.buttonName || 'Day Tours',
          productType: params.buttonName || 'Day Tours'
        },
        debug: {
          xmlRequestLength: 0,
          xmlResponseLength: 0,
          parsedStructure: []
        },
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get detailed product information
  async getProductDetails(optionCode: string, info: string = 'G'): Promise<TourplanProduct | null> {
    try {
      const xmlRequest = TourplanXMLBuilder.buildProductDetailRequest(optionCode, this.config, info);
      const xmlResponse = await this.makeXMLRequest(xmlRequest);
      const products = await TourplanXMLParser.parseSearchResponse(xmlResponse);
      
      return products.length > 0 ? products[0] : null;
    } catch (error) {
      console.error('Error getting product details:', error);
      return null;
    }
  }

  // Test connectivity
  async ping(): Promise<boolean> {
    try {
      const xmlRequest = TourplanXMLBuilder.buildPingRequest(this.config);
      const xmlResponse = await this.makeXMLRequest(xmlRequest);
      return xmlResponse.includes('PingReply') && !xmlResponse.includes('ErrorReply');
    } catch (error) {
      console.error('Ping failed:', error);
      return false;
    }
  }

  // Specialized search methods
  async searchDayTours(params: Omit<SearchParams, 'buttonName'>): Promise<SearchResponse> {
    return this.search({ ...params, buttonName: 'Day Tours' });
  }

  async searchAccommodation(params: Omit<SearchParams, 'buttonName'>): Promise<SearchResponse> {
    if (!params.dateFrom || !params.dateTo) {
      throw new Error('Date range is required for accommodation searches');
    }
    return this.search({ ...params, buttonName: 'Accommodation', info: 'GS' });
  }

  async searchCruises(params: Omit<SearchParams, 'buttonName'>): Promise<SearchResponse> {
    return this.search({ ...params, buttonName: 'Cruises' });
  }

  async searchRail(params: Omit<SearchParams, 'buttonName'>): Promise<SearchResponse> {
    return this.search({ ...params, buttonName: 'Rail' });
  }

  async searchPackages(params: Omit<SearchParams, 'buttonName'>): Promise<SearchResponse> {
    return this.search({ ...params, buttonName: 'Packages' });
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const TourplanUtils = {
  // Format price with currency
  formatPrice(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  },

  // Get lowest price from rates
  getLowestPrice(product: TourplanProduct): number {
    if (!product.rates || product.rates.length === 0) return 0;
    return Math.min(...product.rates.map(rate => rate.adultPrice).filter(price => price > 0));
  },

  // Format dates for API
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  },

  // Validate room configuration
  validateRoomConfig(room: RoomConfig): string[] {
    const errors: string[] = [];
    if (room.adults < 1) errors.push('At least 1 adult required');
    if (room.children && room.children < 0) errors.push('Children count cannot be negative');
    if (room.adults + (room.children || 0) > 8) errors.push('Maximum 8 guests per room');
    return errors;
  }
};

// Export default instance
export default TourplanXMLClient;