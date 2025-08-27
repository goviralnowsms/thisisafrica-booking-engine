import { buildBaseRequest } from './core';

// Mapping functions for TourPlan codes
function mapDestinationToLocalityCode(destination: string): string {
  const mapping: Record<string, string> = {
    'nairobi jki airport': 'NBO', // This will match both "Jki" and "JKI" when lowercased
    'nairobi': 'NBO', 
    'kenya': 'Kenya', // Country level stays as is
    'tanzania': 'Tanzania',
    'cape town': 'CPT',
    'johannesburg': 'JNB',
    'kasane airport': 'BBK',
    'botswana': 'Botswana'
  };
  
  const key = destination.toLowerCase().trim();
  console.log(`🗺️ Mapping destination "${destination}" (key: "${key}") to:`, mapping[key] || destination);
  return mapping[key] || destination; // Return original if no mapping found
}

function mapClassToTourPlanCode(classFilter: string): string {
  const mapping: Record<string, string> = {
    'basic': 'BA',
    'standard': 'ST', 
    'deluxe': 'DE',
    'luxury': 'LU',
    '1 star': '1S',
    '2 star': '2S',
    '3 star': '3S',
    '4 star': '4S',
    '5 star': '5S'
  };
  
  const key = classFilter.toLowerCase().trim();
  console.log(`🏷️ Mapping class "${classFilter}" (key: "${key}") to:`, mapping[key] || classFilter);
  return mapping[key] || classFilter; // Return original if no mapping found
}

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

  setButtonDestinations(destinations: Array<{ButtonName?: string, DestinationName?: string}>): this {
    if (destinations.length > 0) {
      const buttonDestXml = destinations.map(dest => {
        let xml = '<ButtonDestination>';
        if (dest.ButtonName) xml += `<ButtonName>${dest.ButtonName}</ButtonName>`;
        if (dest.DestinationName) xml += `<DestinationName>${dest.DestinationName}</DestinationName>`;
        xml += '</ButtonDestination>';
        return xml;
      }).join('');
      this.params.ButtonDestinations = `<ButtonDestinations>${buttonDestXml}</ButtonDestinations>`;
    }
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

  setRoomConfigs(configs: Array<{Adults: number, Children?: number, Type?: string, Quantity?: number}>): this {
    if (configs.length > 0) {
      const roomConfigsXml = configs.map(config => 
        `<RoomConfig>
          <Adults>${config.Adults}</Adults>
          ${config.Children && config.Children > 0 ? `<Children>${config.Children}</Children>` : ''}
          <RoomType>${config.Type || 'DB'}</RoomType>
        </RoomConfig>`
      ).join('');
      this.params.RoomConfigs = `<RoomConfigs>${roomConfigsXml}</RoomConfigs>`;
    }
    return this;
  }

  setRateConvert(enabled: boolean = true): this {
    this.params.RateConvert = enabled ? 'Y' : 'N';
    return this;
  }

  build(): string {
    const content = Object.entries(this.params)
      .map(([key, value]) => {
        if (key === 'RoomConfigs' || key === 'ButtonDestinations') {
          return value; // Already formatted XML
        }
        return `<${key}>${value}</${key}>`;
      })
      .join('\n    ');

    // Get credentials at runtime, not module load time
    const agentId = process.env.TOURPLAN_AGENTID || process.env.TOURPLAN_AGENT_ID || '';
    const password = process.env.TOURPLAN_AGENTPASSWORD || process.env.TOURPLAN_PASSWORD || '';
    
    return `<?xml version="1.0" encoding="UTF-8"?>
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
    // Ensure name is not empty and trim any whitespace
    const cleanName = name.trim();
    if (!cleanName) {
      throw new Error('Customer name cannot be empty');
    }
    
    // Ensure name is properly escaped for XML
    const escapedName = cleanName.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    console.log('🔧 Setting booking name:', { 
      original: name, 
      cleaned: cleanName, 
      escaped: escapedName,
      length: escapedName.length 
    });
    
    // TourPlan requires specific booking info structure - use Name instead of n
    this.params.NewBookingInfo = `<NewBookingInfo><Name>${escapedName}</Name><QB>${type}</QB></NewBookingInfo>`;
    
    console.log('🔧 Generated NewBookingInfo XML:', this.params.NewBookingInfo);
    return this;
  }

  setBookingId(bookingId: string): this {
    this.params.BookingId = bookingId;
    return this;
  }

  setProduct(optionCode: string, rateId?: string): this {
    this.params.Opt = optionCode;
    console.log('🔧 AddServiceRequest.setProduct called with:', { optionCode, rateId });
    
    // Always include RateId - working implementation uses "Default"
    this.params.RateId = rateId || 'Default';
    console.log('🔧 Setting RateId to:', this.params.RateId);
    return this;
  }

  setDates(from: string, to?: string): this {
    this.params.DateFrom = from;
    if (to) this.params.DateTo = to;
    return this;
  }

  setTravelers(adults?: number, children?: number, infants?: number): this {
    if (adults) this.params.Adults = adults;
    // Always set Children, even if 0 (to match working implementation)
    this.params.Children = children || 0;
    if (infants) this.params.Infants = infants;
    return this;
  }

  setRoomConfigs(configs: Array<{Adults: number, Children?: number, Infants?: number, Type: string, Quantity?: number}>): this {
    // For group tours, we need to include RoomConfigs element
    if (configs.length > 0) {
      const config = configs[0]; // Use first config
      
      // Set individual passenger counts
      this.params.Adults = config.Adults;
      if (config.Children !== undefined) {
        this.params.Children = config.Children;
      }
      if (config.Infants && config.Infants > 0) {
        this.params.Infants = config.Infants;
      }
      this.params.RoomType = config.Type || 'DB';
      this.params.SCUqty = config.Quantity || 1;
      
      // Also add RoomConfigs element as TourPlan requires it
      this.params.RoomConfigs = `<RoomConfigs><RoomConfig><Adults>${config.Adults}</Adults>${
        config.Children ? `<Children>${config.Children}</Children>` : ''
      }${config.Type ? `<Type>${config.Type}</Type>` : ''}<Quantity>${config.Quantity || 1}</Quantity></RoomConfig></RoomConfigs>`;
    }
    return this;
  }

  setCustomerDetails(email?: string, mobile?: string): this {
    if (email) this.params.Email = email;
    if (mobile) this.params.puRemark = mobile; // Working implementation uses puRemark for phone
    return this;
  }

  build(): string {
    // Build content in the correct order based on TourPlan's requirements
    const orderedContent = [];
    
    // NewBookingInfo must come first
    if (this.params.NewBookingInfo) {
      orderedContent.push(this.params.NewBookingInfo);
    }
    
    // Match working implementation order exactly
    if (this.params.Opt) {
      orderedContent.push(`<Opt>${this.params.Opt}</Opt>`);
    }
    
    if (this.params.RateId) {
      orderedContent.push(`<RateId>${this.params.RateId}</RateId>`);
    }
    
    if (this.params.DateFrom) {
      orderedContent.push(`<DateFrom>${this.params.DateFrom}</DateFrom>`);
    }
    
    if (this.params.SCUqty) {
      orderedContent.push(`<SCUqty>${this.params.SCUqty}</SCUqty>`);
    }
    
    if (this.params.Adults) {
      orderedContent.push(`<Adults>${this.params.Adults}</Adults>`);
    }
    
    if (this.params.Children !== undefined) {
      orderedContent.push(`<Children>${this.params.Children}</Children>`);
    }
    
    if (this.params.RoomType) {
      orderedContent.push(`<RoomType>${this.params.RoomType}</RoomType>`);
    }
    
    // Add RoomConfigs if present (TourPlan requires this)
    if (this.params.RoomConfigs) {
      orderedContent.push(this.params.RoomConfigs);
    }
    
    if (this.params.Email) {
      orderedContent.push(`<Email>${this.params.Email}</Email>`);
    }
    
    if (this.params.puRemark) {
      orderedContent.push(`<puRemark>${this.params.puRemark}</puRemark>`);
    }
    
    // BookingId if updating existing booking
    if (this.params.BookingId) {
      orderedContent.push(`<BookingId>${this.params.BookingId}</BookingId>`);
    }
    
    const content = orderedContent.join('\n    ');

    const fullXML = buildBaseRequest('AddServiceRequest', content);
    console.log('🔧 Complete XML being sent to TourPlan:');
    console.log(fullXML);
    
    return fullXML;
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
export function buildServiceButtonDetailsRequest(buttonName: string, countryName?: string): string {
  let params = `<ButtonName>${buttonName}</ButtonName>`;
  if (countryName) {
    params += `<DestinationName>${countryName}</DestinationName>`;
  }
  return buildBaseRequest('GetServiceButtonDetailsRequest', params);
}

/**
 * Quick builder functions for common operations
 */

// Search tours - using working pattern from old booking engine
export function buildTourSearchRequest(destination?: string, dateFrom?: string, dateTo?: string): string {
  return buildProperSearchRequest('Day Tours', destination, dateFrom, dateTo);
}

// Search accommodation using the exact format required by TourPlan
// Updated based on TourPlan feedback: use ButtonDestinations structure
export function buildAccommodationSearchRequest(
  destination: string, 
  dateFrom: string, 
  dateTo: string,
  roomConfigs: Array<{Adults: number, Children?: number, Type?: string, Quantity?: number}>
): string {
  const request = new OptionInfoRequest()
    .setButtonName('Accommodation')
    .setInfo('S') // Changed from 'GS' to 'S' per TourPlan: "Info S to return results the rate should be confirmed"
    .setDateRange(dateFrom, dateTo)
    .setRateConvert(true)
    .setRoomConfigs(roomConfigs);
    
  // Use ButtonDestinations structure as suggested by TourPlan
  if (destination && destination.trim()) {
    request.setButtonDestinations([
      {
        ButtonName: '', // Empty ButtonName as shown in TourPlan's example
        DestinationName: destination
      }
    ]);
  }
  
  return request.build();
}

// Search group tours - using working pattern from old booking engine
export function buildGroupTourSearchRequest(destination?: string, dateFrom?: string, dateTo?: string, classFilter?: string): string {
  return buildGroupTourProperSearchRequest('Group Tours', destination, dateFrom, dateTo, undefined, undefined, classFilter);
}

// Search cruises - using 'Cruises' ButtonName with class filtering support
export function buildCruiseSearchRequest(destination?: string, dateFrom?: string, dateTo?: string, classFilter?: string): string {
  return buildCruiseProperSearchRequest('Cruises', destination, dateFrom, dateTo, classFilter);
}

// Search rail - using 'Rail' ButtonName without Info parameter
export function buildRailSearchRequest(destination?: string, dateFrom?: string, dateTo?: string): string {
  return buildRailProperSearchRequest('Rail', destination, dateFrom, dateTo);
}

// Search packages - using 'Packages' ButtonName with Info="P"
export function buildPackagesSearchRequest(destination?: string, dateFrom?: string, dateTo?: string): string {
  return buildPackagesProperSearchRequest('Packages', destination, dateFrom, dateTo);
}

// Search special offers - using 'Special Offers' ButtonName
export function buildSpecialOffersSearchRequest(destination?: string, dateFrom?: string, dateTo?: string): string {
  return buildSpecialOffersProperSearchRequest('Special Offers', destination, dateFrom, dateTo);
}

// Build Group Tours search request with correct Info parameter (GMFTD)
export function buildGroupTourProperSearchRequest(buttonName: string, destination?: string, dateFrom?: string, dateTo?: string, adults: number = 2, children: number = 0, classFilter?: string): string {
  const agentId = process.env.TOURPLAN_AGENTID || process.env.TOURPLAN_AGENT_ID || '';
  const password = process.env.TOURPLAN_AGENTPASSWORD || process.env.TOURPLAN_PASSWORD || '';
  
  let xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>${buttonName}</ButtonName>`;
    
  // Determine destination mapping for Group Tours
  let destinationForGroupTours = destination;
  let isKenya = false;
  
  if (destination && destination.trim() && destination.toLowerCase() !== 'all') {
    const destLower = destination.toLowerCase();
    if (destLower.includes('nairobi') || destLower.includes('jki')) {
      // Kenya: WordPress sends country name
      destinationForGroupTours = 'Kenya';
      isKenya = true;
    } else if (destLower.includes('maun') || destLower.includes('kasane')) {
      // Botswana: Use country name like Kenya
      destinationForGroupTours = 'Botswana';
    } else if (destLower.includes('cape town') || destLower.includes('durban') || destLower.includes('johannesburg') || destLower.includes('port elizabeth')) {
      // South Africa: Use full country name (NOT SthAfrica)
      destinationForGroupTours = 'South Africa';
    }
    
    console.log(`🌍 Group Tours destination mapping: "${destination}" → "${destinationForGroupTours}"`);
    xml += `
    <DestinationName>${destinationForGroupTours}</DestinationName>`;
  }
  
  // Map class to TourPlan class codes for non-Kenya countries
  if (classFilter && classFilter.trim() && classFilter.toLowerCase() !== 'all') {
    // Kenya uses ClassDescription, others use Class codes
    if (isKenya) {
      xml += `
    <ClassDescription>${classFilter}</ClassDescription>`;
    } else {
      const classCode = mapClassToTourPlanCode(classFilter);
      xml += `
    <Class>${classCode}</Class>`;
    }
  }
  
  // Use GMFTD for Group Tours per CLAUDE.md documentation
  xml += `
    <Info>GMFTD</Info>`;

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

// Build Packages search request with correct Info parameter (GDM like WordPress)
export function buildPackagesProperSearchRequest(buttonName: string, destination?: string, dateFrom?: string, dateTo?: string, adults: number = 2, children: number = 0, productCodes?: string[]): string {
  const agentId = process.env.TOURPLAN_AGENTID || process.env.TOURPLAN_AGENT_ID || '';
  const password = process.env.TOURPLAN_AGENTPASSWORD || process.env.TOURPLAN_PASSWORD || '';
  
  let xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>`;
    
  // If specific product codes are provided, search by those (like WordPress TourplanOptionCode)
  if (productCodes && productCodes.length > 0) {
    for (const code of productCodes) {
      xml += `
    <Opt>${code}</Opt>`;
    }
  } else {
    // Otherwise use ButtonName + DestinationName (like WordPress TourplanProductsInCountry)
    xml += `
    <ButtonName>${buttonName}</ButtonName>`;
    
    // Only add destination if provided and not empty
    if (destination && destination.trim() && destination.toLowerCase() !== 'all') {
      xml += `
    <DestinationName>${destination}</DestinationName>`;
    }
  }
  
  // Match WordPress exactly: Info="GDM" + SCUqty=1095 
  xml += `
    <Info>GDM</Info>
    <SCUqty>1095</SCUqty>`;

  // Match WordPress structure with RateConvert
  xml += `
    <RateConvert>Y</RateConvert>
  </OptionInfoRequest>
</Request>`;

  return xml;
}

// Build proper search request with pricing info (GS) and rate conversion
export function buildProperSearchRequest(buttonName: string, destination?: string, dateFrom?: string, dateTo?: string, adults: number = 2, children: number = 0): string {
  const agentId = process.env.TOURPLAN_AGENTID || process.env.TOURPLAN_AGENT_ID || '';
  const password = process.env.TOURPLAN_AGENTPASSWORD || process.env.TOURPLAN_PASSWORD || '';
  
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

// Build Rail search request without Info parameter (per WordPress implementation)
export function buildRailProperSearchRequest(buttonName: string, destination?: string, dateFrom?: string, dateTo?: string, adults: number = 2, children: number = 0): string {
  const agentId = process.env.TOURPLAN_AGENTID || process.env.TOURPLAN_AGENT_ID || '';
  const password = process.env.TOURPLAN_AGENTPASSWORD || process.env.TOURPLAN_PASSWORD || '';
  
  let xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>${buttonName}</ButtonName>`;
    
  // Only add destination if provided and not empty
  if (destination && destination.trim() && destination.toLowerCase() !== 'all') {
    xml += `
    <DestinationName>${destination}</DestinationName>`;
  }
  
  // Rail does NOT use Info parameter (key difference from other product types)

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

// Build Cruise search request following API documentation format
// Uses <RoomConfigs> with <RoomType>CABIN_TYPE for class filtering
export function buildCruiseProperSearchRequest(buttonName: string, destination?: string, dateFrom?: string, dateTo?: string, classFilter?: string, adults: number = 2, children: number = 0): string {
  const agentId = process.env.TOURPLAN_AGENTID || process.env.TOURPLAN_AGENT_ID || '';
  const password = process.env.TOURPLAN_AGENTPASSWORD || process.env.TOURPLAN_PASSWORD || '';
  
  console.log(`🚢 Building TourPlan API cruise search with documented format`);
  console.log(`🚢 Parameters: destination=${destination}, dateFrom=${dateFrom}, class=${classFilter}`);
  
  let xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>${buttonName}</ButtonName>`;
  
  // Add DateFrom if provided (required by API docs example)
  if (dateFrom) {
    xml += `
    <DateFrom>${dateFrom}</DateFrom>`;
  }
  
  // Map class filter to cabin type for RoomConfigs
  let roomType = 'CABIN';
  if (classFilter) {
    switch (classFilter.toLowerCase()) {
      case 'luxury':
        roomType = 'SUITE';
        console.log(`🚢 Mapping class 'Luxury' to RoomType 'SUITE'`);
        break;
      case 'superior':
        roomType = 'PREMIUM';
        console.log(`🚢 Mapping class 'Superior' to RoomType 'PREMIUM'`);
        break;
      case 'standard':
      default:
        roomType = 'CABIN';
        console.log(`🚢 Mapping class '${classFilter}' to RoomType 'CABIN'`);
        break;
    }
  }
  
  // RoomConfigs as specified in API documentation
  xml += `
    <RoomConfigs>
      <RoomConfig>
        <Adults>${adults}</Adults>`;
        
  if (children > 0) {
    xml += `
        <Children>${children}</Children>`;
  }
  
  xml += `
        <RoomType>${roomType}</RoomType>
      </RoomConfig>
    </RoomConfigs>`;
  
  // Add DateTo if provided  
  if (dateTo) {
    xml += `
    <DateTo>${dateTo}</DateTo>`;
  }
  
  xml += `
  </OptionInfoRequest>
</Request>`;

  console.log(`🚢 Generated TourPlan cruise XML request:`);
  console.log(xml);
  return xml;
}

// Build Special Offers search request - uses 'Special Offers' ButtonName without Info parameter
export function buildSpecialOffersProperSearchRequest(buttonName: string, destination?: string, dateFrom?: string, dateTo?: string, adults: number = 2, children: number = 0): string {
  const agentId = process.env.TOURPLAN_AGENTID || process.env.TOURPLAN_AGENT_ID || '';
  const password = process.env.TOURPLAN_AGENTPASSWORD || process.env.TOURPLAN_PASSWORD || '';
  
  let xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>${buttonName}</ButtonName>`;
    
  // Only add destination if provided and not empty
  if (destination && destination.trim() && destination.toLowerCase() !== 'all') {
    xml += `
    <DestinationName>${destination}</DestinationName>`;
  }
  
  // Special Offers does NOT use Info parameter (key difference from other product types)

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