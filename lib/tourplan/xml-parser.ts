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
    return {
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