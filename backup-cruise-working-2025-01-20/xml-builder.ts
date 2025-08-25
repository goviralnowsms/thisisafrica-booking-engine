import { XMLBuilder } from 'fast-xml-parser';
import type {
  TourPlanCredentials,
  BaseSearchRequest,
  AccommodationSearchRequest,
  TourSearchRequest,
  CruiseSearchRequest,
  AddServiceRequest,
  RoomConfig,
  TourPlanRequest,
} from './types';
import { TOURPLAN_CONFIG } from './constants';

export class TourPlanXMLBuilder {
  private builder: XMLBuilder;
  private credentials: TourPlanCredentials;

  constructor(credentials: TourPlanCredentials) {
    this.credentials = credentials;
    this.builder = new XMLBuilder({
      ignoreAttributes: false,
      format: true,
      suppressEmptyNode: true,
      cdataTagName: '__cdata',
      attributeNamePrefix: '@_',
    });
  }

  private buildBaseRequest(requestType: TourPlanRequest, content: Record<string, any>) {
    const xmlObj = {
      '?xml': {
        '@_version': TOURPLAN_CONFIG.XML_VERSION,
        '@_encoding': 'UTF-8',
      },
      '!DOCTYPE': {
        '@_Request': true,
        '@_SYSTEM': TOURPLAN_CONFIG.DTD_VERSION,
      },
      Request: {
        [requestType]: {
          AgentID: this.credentials.agentId,
          Password: this.credentials.password,
          ...content,
        },
      },
    };

    return this.builder.build(xmlObj);
  }

  buildPingRequest(): string {
    return this.buildBaseRequest('PingRequest', {});
  }

  buildAgentInfoRequest(): string {
    return this.buildBaseRequest('AgentInfoRequest', {});
  }

  buildOptionInfoRequest(params: BaseSearchRequest | AccommodationSearchRequest | TourSearchRequest | CruiseSearchRequest): string {
    const content: Record<string, any> = {
      ButtonName: params.ButtonName,
    };

    if (params.DestinationName) {
      content.DestinationName = params.DestinationName;
    }

    if (params.DateFrom) {
      content.DateFrom = params.DateFrom;
    }

    if (params.DateTo) {
      content.DateTo = params.DateTo;
    }

    if (params.Info) {
      content.Info = params.Info;
    }

    // Handle accommodation-specific fields
    if ('RoomConfigs' in params && params.RoomConfigs) {
      content.RoomConfigs = {
        RoomConfig: params.RoomConfigs.map(this.buildRoomConfig),
      };
    }

    // Handle cruise-specific fields
    if ('CabinConfigs' in params && params.CabinConfigs) {
      content.CabinConfigs = {
        CabinConfig: params.CabinConfigs.map(this.buildRoomConfig),
      };
    }

    // Handle tour-specific fields
    if ('Adults' in params && params.Adults) {
      content.Adults = params.Adults;
    }

    if ('Children' in params && params.Children) {
      content.Children = params.Children;
    }

    return this.buildBaseRequest('OptionInfoRequest', content);
  }

  buildAddServiceRequest(params: AddServiceRequest): string {
    const content: Record<string, any> = {
      Opt: params.Opt,
      RateId: params.RateId,
      DateFrom: params.DateFrom,
    };

    if (params.DateTo) {
      content.DateTo = params.DateTo;
    }

    if (params.NewBookingInfo) {
      content.NewBookingInfo = {
        n: params.NewBookingInfo.Name,
        QB: params.NewBookingInfo.QB,
      };

      if (params.NewBookingInfo.Email) {
        content.NewBookingInfo.Email = params.NewBookingInfo.Email;
      }

      if (params.NewBookingInfo.Mobile) {
        content.NewBookingInfo.Mobile = params.NewBookingInfo.Mobile;
      }
    }

    if (params.BookingId) {
      content.BookingId = params.BookingId;
    }

    if (params.RoomConfigs) {
      content.RoomConfigs = {
        RoomConfig: params.RoomConfigs.map(this.buildRoomConfig),
      };
    }

    if (params.Adults) {
      content.Adults = params.Adults;
    }

    if (params.Children) {
      content.Children = params.Children;
    }

    if (params.Infants) {
      content.Infants = params.Infants;
    }

    if (params.Note) {
      content.Note = params.Note;
    }

    return this.buildBaseRequest('AddServiceRequest', content);
  }

  buildGetBookingRequest(bookingId: string): string {
    return this.buildBaseRequest('GetBookingRequest', {
      BookingId: bookingId,
    });
  }

  buildUpdateBookingRequest(bookingId: string, updates: Record<string, any>): string {
    return this.buildBaseRequest('UpdateBookingRequest', {
      BookingId: bookingId,
      ...updates,
    });
  }

  buildQuoteToBookRequest(bookingId: string, sendSupplierMessage = true): string {
    return this.buildBaseRequest('QuoteToBookRequest', {
      BookingId: bookingId,
      SendSupplierMessage: sendSupplierMessage ? 'Y' : 'N',
    });
  }

  buildRecordPaymentRequest(bookingId: string, payment: Record<string, any>): string {
    return this.buildBaseRequest('RecordBookingPaymentRequest', {
      BookingId: bookingId,
      ...payment,
    });
  }

  buildCancelServicesRequest(bookingRef: string): string {
    return this.buildBaseRequest('CancelServicesRequest', {
      Ref: bookingRef,
    });
  }

  private buildRoomConfig(room: RoomConfig): Record<string, any> {
    const config: Record<string, any> = {
      Adults: room.Adults,
      Type: room.Type,
      Quantity: room.Quantity,
    };

    if (room.Children) {
      config.Children = room.Children;
    }

    if (room.Infants) {
      config.Infants = room.Infants;
    }

    return config;
  }
}