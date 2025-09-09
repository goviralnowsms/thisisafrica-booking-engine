import { XMLParser } from 'fast-xml-parser';
import type {
  TourPlanError,
  OptionInfo,
  RateInfo,
  OptionInfoResponse,
  BookingResponse,
  GetBookingResponse,
  ServiceLine,
  RoomConfig,
} from './types';
import { ERROR_CODES, ERROR_MESSAGES } from './constants';

export class TourPlanXMLParser {
  private parser: XMLParser;

  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      parseAttributeValue: true,
      trimValues: true,
      parseTrueNumberOnly: true,
      parseTagValue: true,
      arrayMode: false,
    });
  }

  parseResponse(xml: string): any {
    try {
      const parsed = this.parser.parse(xml);
      return parsed.Reply || parsed.Response || parsed;
    } catch (error) {
      throw new Error(`Failed to parse XML response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  parsePingResponse(xml: string): { success: boolean; error?: TourPlanError } {
    const response = this.parseResponse(xml);
    
    if (response.PingReply) {
      return { success: true };
    }

    return {
      success: false,
      error: this.extractError(response),
    };
  }

  parseAgentInfoResponse(xml: string): { agentInfo?: any; error?: TourPlanError } {
    const response = this.parseResponse(xml);
    
    if (response.AgentInfoReply) {
      return { agentInfo: response.AgentInfoReply };
    }

    return {
      error: this.extractError(response),
    };
  }

  parseOptionInfoResponse(xml: string): OptionInfoResponse {
    const response = this.parseResponse(xml);
    
    if (response.OptionInfoReply) {
      const reply = response.OptionInfoReply;
      const options: OptionInfo[] = [];
      const rates: RateInfo[] = [];

      // Parse options
      if (reply.Options) {
        const optionList = this.ensureArray(reply.Options.Option);
        for (const opt of optionList) {
          options.push(this.parseOption(opt));
        }
      }

      // Parse single option (for direct product code searches)
      if (reply.Option) {
        const option = this.parseOption(reply.Option);
        options.push(option);
      }

      // Parse rates
      if (reply.Rates) {
        const rateList = this.ensureArray(reply.Rates.Rate);
        for (const rate of rateList) {
          rates.push(this.parseRate(rate));
        }
      }

      return { Options: options, Rates: rates };
    }

    return {
      Error: this.extractError(response),
    };
  }

  /**
   * Parse accommodation-specific response that includes supplier and product data
   * Merges hotel information (supplier level) with room type information (product level)
   */
  parseAccommodationResponse(xml: string): {
    accommodations: Array<{
      hotelName: string;
      hotelDescription?: string;
      hotelImages?: string[];
      roomType: string;
      roomDescription?: string;
      productCode: string;
      supplier: string;
      rates: RateInfo[];
      dateRanges: any[];
    }>;
    error?: TourPlanError;
  } {
    const response = this.parseResponse(xml);
    
    if (response.OptionInfoReply) {
      const reply = response.OptionInfoReply;
      const accommodations: any[] = [];

      if (reply.Option) {
        const options = this.ensureArray(reply.Option);
        
        for (const option of options) {
          const accommodation: any = {
            productCode: option.Opt || '',
            roomType: option.OptGeneral?.Description || 'Standard Room',
            roomDescription: option.OptGeneral?.Comment || '',
            supplier: option.OptGeneral?.SupplierName || '',
            rates: [],
            dateRanges: []
          };

          // Extract hotel information from supplier data (when Info includes "I")
          if (option.SupplierInfo) {
            accommodation.hotelName = option.SupplierInfo.SupplierName || accommodation.supplier;
            accommodation.hotelDescription = option.SupplierInfo.Description || option.SupplierInfo.DDW;
            accommodation.hotelImages = option.SupplierInfo.Images ? 
              this.ensureArray(option.SupplierInfo.Images.Image) : [];
          } else {
            // Fallback: use supplier name as hotel name
            accommodation.hotelName = accommodation.supplier;
          }

          // Parse pricing and availability data
          if (option.OptDateRanges) {
            const dateRanges = this.ensureArray(option.OptDateRanges.OptDateRange);
            accommodation.dateRanges = dateRanges.map((range: any) => ({
              dateFrom: range.DateFrom,
              dateTo: range.DateTo,
              currency: range.Currency,
              rateSets: range.RateSets ? this.ensureArray(range.RateSets.RateSet) : []
            }));

            // Extract rates from date ranges
            dateRanges.forEach((range: any) => {
              if (range.RateSets?.RateSet) {
                const rateSets = this.ensureArray(range.RateSets.RateSet);
                rateSets.forEach((rateSet: any) => {
                  if (rateSet.OptRate?.RoomRates) {
                    const roomRates = rateSet.OptRate.RoomRates;
                    accommodation.rates.push({
                      RateId: rateSet.RateId || `${accommodation.productCode}-${range.DateFrom}`,
                      Currency: range.Currency || 'AUD',
                      DateFrom: range.DateFrom,
                      DateTo: range.DateTo,
                      SingleRate: this.parseNumber(roomRates.SingleRate),
                      DoubleRate: this.parseNumber(roomRates.DoubleRate),
                      TwinRate: this.parseNumber(roomRates.TwinRate),
                      TripleRate: this.parseNumber(roomRates.TripleRate),
                      Available: true
                    } as any);
                  }
                });
              }
            });
          }

          accommodations.push(accommodation);
        }
      }

      return { accommodations };
    }

    return {
      accommodations: [],
      error: this.extractError(response),
    };
  }

  parseAddServiceResponse(xml: string): BookingResponse {
    const response = this.parseResponse(xml);
    
    if (response.AddServiceReply) {
      const reply = response.AddServiceReply;
      return {
        BookingId: reply.BookingId,
        BookingRef: reply.BookingRef,
        Status: reply.Status,
        TotalCost: this.parseNumber(reply.TotalCost),
        Currency: reply.Currency,
      };
    }

    return {
      BookingId: '',
      Error: this.extractError(response),
    };
  }

  parseGetBookingResponse(xml: string): GetBookingResponse {
    const response = this.parseResponse(xml);
    
    if (response.GetBookingReply) {
      const reply = response.GetBookingReply;
      const serviceLines: ServiceLine[] = [];

      if (reply.ServiceLines) {
        const lines = this.ensureArray(reply.ServiceLines.ServiceLine);
        for (const line of lines) {
          serviceLines.push(this.parseServiceLine(line));
        }
      }

      return {
        BookingId: reply.BookingId,
        BookingRef: reply.BookingRef,
        Status: reply.Status,
        AgentRef: reply.AgentRef,
        Name: reply.Name,
        Email: reply.Email,
        Mobile: reply.Mobile,
        TotalCost: this.parseNumber(reply.TotalCost),
        TotalPaid: this.parseNumber(reply.TotalPaid),
        Currency: reply.Currency,
        ServiceLines: serviceLines,
      };
    }

    return {
      BookingId: '',
      BookingRef: '',
      Status: '',
      Name: '',
      TotalCost: 0,
      Currency: '',
      Error: this.extractError(response),
    };
  }

  private parseOption(opt: any): OptionInfo {
    const option: OptionInfo = {
      Opt: opt.Opt,
      OptCode: opt.OptCode,
      OptName: opt.OptName,
      OptType: opt.OptType,
      SupplierName: opt.SupplierName,
      Region: opt.Region,
      ButtonName: opt.ButtonName,
      Description: opt.Description,
      Comment: opt.Comment,
      Duration: opt.Duration,
      DurationUnits: opt.DurationUnits,
      Image: opt.Image,
    };

    // Parse availability data from OptAvail field
    if (opt.OptAvail) {
      const availString = typeof opt.OptAvail === 'string' ? opt.OptAvail : opt.OptAvail['#text'] || '';
      const availCodes = availString.split(' ').filter((code: string) => code.trim());
      
      // Parse date ranges to determine start date
      let startDate = new Date('2025-09-09'); // Default fallback
      if (opt.OptDateRanges?.OptDateRange) {
        const dateRanges = this.ensureArray(opt.OptDateRanges.OptDateRange);
        if (dateRanges.length > 0 && dateRanges[0].DateFrom) {
          startDate = new Date(dateRanges[0].DateFrom);
        }
      }

      // Convert availability codes to dates
      const availableDates: Array<{
        date: string;
        availability: number;
        dayOfWeek: string;
      }> = [];

      for (let i = 0; i < availCodes.length; i++) {
        const code = availCodes[i];
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        // Check if date is available (positive number means available)
        const availability = parseInt(code);
        if (availability > 0) {
          availableDates.push({
            date: currentDate.toISOString().split('T')[0],
            availability: availability,
            dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDate.getDay()]
          });
        }
      }

      (option as any).availableDates = availableDates;
      (option as any).optAvailCodes = availCodes;
    }

    return option;
  }

  private parseRate(rate: any): RateInfo {
    return {
      RateId: rate.RateId,
      RateName: rate.RateName,
      RateCode: rate.RateCode,
      Currency: rate.Currency,
      Total: this.parseNumber(rate.Total),
      TotalTax: this.parseNumber(rate.TotalTax),
      Nett: this.parseNumber(rate.Nett),
      Gross: this.parseNumber(rate.Gross),
      Commission: this.parseNumber(rate.Commission),
      DateFrom: rate.DateFrom,
      DateTo: rate.DateTo,
      Available: rate.Available === 'Y' || rate.Available === true,
      MinPax: this.parseNumber(rate.MinPax),
      MaxPax: this.parseNumber(rate.MaxPax),
    };
  }

  private parseServiceLine(line: any): ServiceLine {
    const serviceLine: ServiceLine = {
      ServiceLineId: line.ServiceLineId,
      Opt: line.Opt,
      OptName: line.OptName,
      DateFrom: line.DateFrom,
      DateTo: line.DateTo,
      Status: line.Status,
      Adults: this.parseNumber(line.Adults),
      Children: this.parseNumber(line.Children),
      Nett: this.parseNumber(line.Nett),
      Gross: this.parseNumber(line.Gross),
      Currency: line.Currency,
    };

    if (line.RoomConfigs) {
      const configs = this.ensureArray(line.RoomConfigs.RoomConfig);
      serviceLine.RoomConfigs = configs.map((config: any) => this.parseRoomConfig(config));
    }

    return serviceLine;
  }

  private parseRoomConfig(config: any): RoomConfig {
    return {
      Adults: this.parseNumber(config.Adults),
      Children: this.parseNumber(config.Children),
      Infants: this.parseNumber(config.Infants),
      Type: config.Type,
      Quantity: this.parseNumber(config.Quantity),
    };
  }

  private extractError(response: any): TourPlanError {
    if (response.Error) {
      const errorCode = response.Error.ErrorCode || ERROR_CODES.GENERAL_ERROR;
      return {
        ErrorCode: errorCode,
        ErrorMessage: response.Error.ErrorMessage || ERROR_MESSAGES[errorCode] || 'Unknown error occurred',
      };
    }

    if (response.ErrorReply) {
      const errorCode = response.ErrorReply.ErrorCode || ERROR_CODES.GENERAL_ERROR;
      return {
        ErrorCode: errorCode,
        ErrorMessage: response.ErrorReply.ErrorMessage || ERROR_MESSAGES[errorCode] || 'Unknown error occurred',
      };
    }

    return {
      ErrorCode: ERROR_CODES.GENERAL_ERROR,
      ErrorMessage: ERROR_MESSAGES[ERROR_CODES.GENERAL_ERROR],
    };
  }

  private ensureArray(value: any): any[] {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  private parseNumber(value: any): number {
    if (value === null || value === undefined || value === '') return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }
}