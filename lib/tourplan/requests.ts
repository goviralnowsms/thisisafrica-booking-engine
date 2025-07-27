import { buildBaseRequest } from './core';

/**
 * Option Info Request Builder
 * Equivalent to WordPress TourplanOptionRequest class
 */
export class OptionInfoRequest {
  private params: Record<string, any> = {};

  setButtonName(buttonName: string): this {
    this.params.ButtonName = buttonName;
    return this;
  }

  setDestination(destination: string): this {
    this.params.DestinationName = destination;
    return this;
  }

  setInfo(info: string): this {
    this.params.Info = info;
    return this;
  }

  setDateRange(from: string, to?: string): this {
    if (from && from.trim()) this.params.DateFrom = from;
    if (to && to.trim()) this.params.DateTo = to;
    return this;
  }

  setTravelers(adults?: number, children?: number): this {
    if (adults) this.params.Adults = adults;
    if (children) this.params.Children = children;
    return this;
  }

  setRoomConfigs(configs: Array<{Adults: number, Children?: number, Type: string, Quantity: number}>): this {
    if (configs.length > 0) {
      const roomConfigsXml = configs.map(config => 
        `<RoomConfig>
          <Adults>${config.Adults}</Adults>
          ${config.Children ? `<Children>${config.Children}</Children>` : ''}
          <Type>${config.Type}</Type>
          <Quantity>${config.Quantity}</Quantity>
        </RoomConfig>`
      ).join('');
      this.params.RoomConfigs = `<RoomConfigs>${roomConfigsXml}</RoomConfigs>`;
    }
    return this;
  }

  build(): string {
    const content = Object.entries(this.params)
      .map(([key, value]) => {
        if (key === 'RoomConfigs') {
          return value; // Already formatted XML
        }
        return `<${key}>${value}</${key}>`;
      })
      .join('\n    ');

    // Get credentials at runtime, not module load time
    const agentId = process.env.TOURPLAN_AGENTID || '';
    const password = process.env.TOURPLAN_AGENTPASSWORD || '';
    
    return `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    ${content}
  </OptionInfoRequest>
</Request>`;
  }
}

/**
 * Add Service Request Builder
 * Equivalent to WordPress booking creation
 */
export class AddServiceRequest {
  private params: Record<string, any> = {};

  setNewBooking(name: string, type: 'B' | 'Q' = 'B'): this {
    this.params.NewBookingInfo = `<NewBookingInfo>
      <n>${name}</n>
      <QB>${type}</QB>
    </NewBookingInfo>`;
    return this;
  }

  setBookingId(bookingId: string): this {
    this.params.BookingId = bookingId;
    return this;
  }

  setProduct(optionCode: string, rateId: string): this {
    this.params.Opt = optionCode;
    this.params.RateId = rateId;
    return this;
  }

  setDates(from: string, to?: string): this {
    this.params.DateFrom = from;
    if (to) this.params.DateTo = to;
    return this;
  }

  setTravelers(adults?: number, children?: number, infants?: number): this {
    if (adults) this.params.Adults = adults;
    if (children) this.params.Children = children;
    if (infants) this.params.Infants = infants;
    return this;
  }

  setCustomerDetails(email?: string, mobile?: string): this {
    if (email) this.params.Email = email;
    if (mobile) this.params.Mobile = mobile;
    return this;
  }

  build(): string {
    const content = Object.entries(this.params)
      .map(([key, value]) => {
        if (key === 'NewBookingInfo') {
          return value; // Already formatted XML
        }
        return `<${key}>${value}</${key}>`;
      })
      .join('\n    ');

    return buildBaseRequest('AddServiceRequest', content);
  }
}

/**
 * Get Booking Request Builder
 */
export class GetBookingRequest {
  private bookingId: string;

  constructor(bookingId: string) {
    this.bookingId = bookingId;
  }

  build(): string {
    return buildBaseRequest('GetBookingRequest', `<BookingId>${this.bookingId}</BookingId>`);
  }
}

/**
 * Simple helper functions for common requests
 */

// Ping request
export function buildPingRequest(): string {
  return buildBaseRequest('PingRequest', '');
}

// Agent info request
export function buildAgentInfoRequest(): string {
  return buildBaseRequest('AgentInfoRequest', '');
}

// Get service button details (for destinations)
export function buildServiceButtonDetailsRequest(buttonName: string): string {
  return buildBaseRequest('GetServiceButtonDetailsRequest', `<ButtonName>${buttonName}</ButtonName>`);
}

/**
 * Quick builder functions for common operations
 */

// Search tours - using working pattern from old booking engine
export function buildTourSearchRequest(destination?: string, dateFrom?: string, dateTo?: string): string {
  return buildProperSearchRequest('Day Tours', destination, dateFrom, dateTo);
}

// Search accommodation  
export function buildAccommodationSearchRequest(
  destination: string, 
  dateFrom: string, 
  dateTo: string,
  roomConfigs: Array<{Adults: number, Children?: number, Type: string, Quantity: number}>
): string {
  return new OptionInfoRequest()
    .setButtonName('Accommodation')
    .setInfo('GS')
    .setDestination(destination)
    .setDateRange(dateFrom, dateTo)
    .setRoomConfigs(roomConfigs)
    .build();
}

// Search group tours - using working pattern from old booking engine
export function buildGroupTourSearchRequest(destination?: string, dateFrom?: string, dateTo?: string): string {
  return buildProperSearchRequest('Group Tours', destination, dateFrom, dateTo);
}

// Build proper search request with pricing info (GS) and rate conversion
export function buildProperSearchRequest(buttonName: string, destination?: string, dateFrom?: string, dateTo?: string, adults: number = 2, children: number = 0): string {
  const agentId = process.env.TOURPLAN_AGENTID || '';
  const password = process.env.TOURPLAN_AGENTPASSWORD || '';
  
  let xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>${buttonName}</ButtonName>`;
    
  // Only add destination if provided
  if (destination && destination.trim()) {
    xml += `
    <DestinationName>${destination}</DestinationName>`;
  }
  
  xml += `
    <Info>GS</Info>`;

  if (dateFrom) {
    xml += `
    <DateFrom>${dateFrom}</DateFrom>`;
  }

  if (dateTo) {
    xml += `
    <DateTo>${dateTo}</DateTo>`;
  }

  // Always include RoomConfig as it's required
  xml += `
    <RoomConfigs>
      <RoomConfig>
        <Adults>${adults}</Adults>`;
  
  if (children > 0) {
    xml += `
        <Children>${children}</Children>`;
  }
  
  xml += `
      </RoomConfig>
    </RoomConfigs>
    <RateConvert>Y</RateConvert>
  </OptionInfoRequest>
</Request>`;

  return xml;
}