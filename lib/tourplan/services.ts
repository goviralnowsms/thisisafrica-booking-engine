import { wpXmlRequest, extractResponseData } from './core';
import { 
  buildServiceButtonDetailsRequest,
  buildTourSearchRequest,
  buildGroupTourSearchRequest,
  buildAccommodationSearchRequest,
  buildProperSearchRequest,
  OptionInfoRequest,
  AddServiceRequest,
  GetBookingRequest 
} from './requests';
import { getLocalAssets } from '../image-index';

/**
 * Get destinations and classes for a country/product type
 * Replaces WordPress get_destination_ajax_handler()
 */
export async function getDestinations(countryName: string, reqType: string = 'Day Tours') {
  try {
    const xml = buildServiceButtonDetailsRequest(reqType);
    const response = await wpXmlRequest(xml);
    
    // Extract localities and classes from response
    const buttonDetails = extractResponseData(response, 'GetServiceButtonDetailsReply');
    
    const localities = extractArray(buttonDetails?.LocalityDescriptions?.LocalityDescription);
    const classes = extractArray(buttonDetails?.ClassDescriptions?.ClassDescription);
    
    return {
      reqType,
      countryName,
      LocalityDescription: localities,
      ClassDescription: classes,
      localityCount: localities.length,
      classesCount: classes.length,
    };
  } catch (error) {
    console.error('Error getting destinations:', error);
    return {
      reqType,
      countryName,
      LocalityDescription: [],
      ClassDescription: [],
      localityCount: 0,
      classesCount: 0,
    };
  }
}

/**
 * Search for tours/products
 * Replaces WordPress TourplanProductSearchOptions functionality
 */
export async function searchProducts(criteria: {
  productType: string;
  destination?: string;
  dateFrom?: string;
  dateTo?: string;
  adults?: number;
  children?: number;
  roomConfigs?: Array<{Adults: number, Children?: number, Type: string, Quantity: number}>;
}) {
  try {
    let xml: string;
    
    // Build appropriate request based on product type
    switch (criteria.productType) {
      case 'Day Tours':
        xml = buildTourSearchRequest(criteria.destination, criteria.dateFrom, criteria.dateTo);
        break;
        
      case 'Group Tours':
        xml = buildGroupTourSearchRequest(criteria.destination, criteria.dateFrom, criteria.dateTo);
        break;
        
      case 'Accommodation':
        if (!criteria.roomConfigs || !criteria.dateFrom || !criteria.dateTo) {
          throw new Error('Accommodation search requires room configs and dates');
        }
        xml = buildAccommodationSearchRequest(
          criteria.destination || '',
          criteria.dateFrom,
          criteria.dateTo,
          criteria.roomConfigs
        );
        break;
        
      default:
        // Generic search using the working pattern
        xml = buildProperSearchRequest(
          criteria.productType, 
          criteria.destination, 
          criteria.dateFrom, 
          criteria.dateTo,
          criteria.adults || 2,
          criteria.children || 0
        );
        break;
    }
    
    console.log('Sending TourPlan search XML:', xml);
    const response = await wpXmlRequest(xml);
    const optionInfo = extractResponseData(response, 'OptionInfoReply');
    
    // Debug logging
    console.log('Search response:', JSON.stringify(optionInfo, null, 2));
    
    // Check if response indicates no results or error
    if (!optionInfo || optionInfo.Status === 'unusable' || optionInfo.Message) {
      console.log('No results or error in search:', optionInfo?.Message || 'No options found');
      return {
        products: [],
        totalResults: 0,
        searchCriteria: criteria,
        message: optionInfo?.Message || 'No tours found for your search criteria',
      };
    }
    
    // Check for empty response (no Option elements)
    if (!optionInfo.Option) {
      console.log('Empty response - no tours found');
      return {
        products: [],
        totalResults: 0,
        searchCriteria: criteria,
        message: criteria.destination 
          ? `No ${criteria.productType} found for ${criteria.destination}` 
          : `Please select a destination to search for ${criteria.productType}`,
      };
    }
    
    // Extract options and rates
    const options = extractArray(optionInfo?.Option);
    const rates = extractArray(optionInfo?.Rate);
    
    // Transform to consistent format using proven patterns from old booking engine
    const products = options.map((option: any) => {
      // Extract rates using multiple methods like the working client
      const productRates = extractRatesFromOption(option);
      
      return {
        id: option.Opt || option['@_Opt'],
        code: option.Opt || option['@_Opt'],
        name: option.OptGeneral?.Description || option.OptGeneral?.SupplierName || 'Unnamed Product',
        description: option.OptGeneral?.Description || '',
        supplier: option.OptGeneral?.SupplierName || '',
        duration: option.OptGeneral?.Periods ? `${option.OptGeneral.Periods} nights` : '',
        image: null,
        rates: productRates,
      };
    });
    
    return {
      products,
      totalResults: products.length,
      searchCriteria: criteria,
    };
  } catch (error) {
    console.error('Error searching products:', error);
    return {
      products: [],
      totalResults: 0,
      searchCriteria: criteria,
      error: error instanceof Error ? error.message : 'Search failed',
    };
  }
}

/**
 * Get detailed product information with enhanced date range
 * Replaces WordPress TourplanOptionRequest functionality
 */
export async function getProductDetails(productCode: string) {
  try {
    // Build request for this product with a broader date range to get more pricing data
    const currentDate = new Date();
    const nextYear = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());
    const dateFrom = currentDate.toISOString().split('T')[0];
    const dateTo = nextYear.toISOString().split('T')[0];
    
    const xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${process.env.TOURPLAN_AGENTID || process.env.TOURPLAN_AGENT_ID}</AgentID>
    <Password>${process.env.TOURPLAN_AGENTPASSWORD || process.env.TOURPLAN_PASSWORD}</Password>
    <Opt>${productCode}</Opt>
    <Info>GMFTD</Info>
    <DateFrom>${dateFrom}</DateFrom>
    <DateTo>${dateTo}</DateTo>
    <RateConvert>Y</RateConvert>
  </OptionInfoRequest>
</Request>`;
    
    console.log('Getting product details for:', productCode);
    const response = await wpXmlRequest(xml);
    const optionInfo = extractResponseData(response, 'OptionInfoReply');
    
    if (!optionInfo?.Option) {
      throw new Error(`Product ${productCode} not found`);
    }
    
    const option = optionInfo.Option;
    
    // Extract rates using our helper function
    const productRates = extractRatesFromOption(option);
    
    // Enhanced note parsing with all categories from WordPress patterns
    const notes: any[] = [];
    const structuredContent: any = {};
    
    if (option.OptionNotes?.OptionNote) {
      const notesList = extractArray(option.OptionNotes.OptionNote);
      notesList.forEach((note: any) => {
        const category = note.NoteCategory;
        const text = note.NoteText;
        
        // Store raw notes for compatibility
        notes.push({
          category,
          text
        });
        
        // Map to structured content like WordPress
        switch (category) {
          case 'PII': // Product Introduction/Information
            structuredContent.introduction = text;
            break;
          case 'PDW': // Product Details Web
          case 'DTL': // Details
            structuredContent.details = text;
            break;
          case 'INC': // Inclusions
          case 'INE': // Inclusions Extended
            structuredContent.inclusions = text;
            break;
          case 'EXC': // Exclusions
            structuredContent.exclusions = text;
            break;
          case 'PHL': // Product Highlights
          case 'HLT': // Highlights
          case 'SHL': // Short Highlights
            structuredContent.highlights = text;
            break;
          case 'TRM': // Terms
          case 'TCO': // Terms and Conditions
            structuredContent.terms = text;
            break;
          case 'MPI': // Map Image
            structuredContent.mapImage = text;
            break;
        }
      });
    }
    
    // Get local assets (images and PDFs)
    const localAssets = getLocalAssets(productCode);
    
    // Group rates by date ranges and consolidate pricing
    const rateGroups = new Map();
    
    productRates.forEach(rate => {
      const key = `${rate.dateFrom}-${rate.dateTo}-${rate.rateName || 'Standard'}`;
      if (!rateGroups.has(key)) {
        rateGroups.set(key, {
          dateFrom: rate.dateFrom,
          dateTo: rate.dateTo,
          rateName: rate.rateName || 'Standard',
          currency: rate.currency || 'AUD',
          singleRate: 0,
          doubleRate: 0,
          twinRate: 0
        });
      }
      
      const group = rateGroups.get(key);
      if (rate.singleRate) group.singleRate = rate.singleRate;
      if (rate.doubleRate) group.doubleRate = rate.doubleRate;
      if (rate.twinRate) group.twinRate = rate.twinRate;
    });
    
    // Transform consolidated rates to match WordPress format
    const formattedRates = Array.from(rateGroups.values()).map(rate => {
      const twinRateValue = rate.twinRate || rate.doubleRate || 0;
      const singleRateValue = rate.singleRate || 0;
      
      // Create proper date range display
      let dateRangeDisplay = 'Available dates';
      if (rate.dateFrom && rate.dateTo) {
        const fromDate = new Date(rate.dateFrom);
        const toDate = new Date(rate.dateTo);
        
        // If same date, show single date, otherwise show range
        if (rate.dateFrom === rate.dateTo) {
          dateRangeDisplay = fromDate.toLocaleDateString('en-AU', { 
            day: '2-digit', month: 'short', year: 'numeric' 
          });
        } else {
          dateRangeDisplay = `${fromDate.toLocaleDateString('en-AU', { 
            day: '2-digit', month: 'short' 
          })} - ${toDate.toLocaleDateString('en-AU', { 
            day: '2-digit', month: 'short', year: 'numeric' 
          })}`;
        }
      }
      
      return {
        dateRange: dateRangeDisplay,
        singleRate: singleRateValue,
        doubleRate: rate.doubleRate || rate.twinRate || 0,
        twinRate: twinRateValue,
        twinRateFormatted: twinRateValue > 0
          ? `${rate.currency} $${Math.round(twinRateValue / 2).toLocaleString()}`
          : 'POA',
        twinRateTotal: twinRateValue,
        currency: rate.currency,
        rateName: rate.rateName,
        dateFrom: rate.dateFrom,
        dateTo: rate.dateTo
      };
    });
    
    return {
      id: option.Opt,
      code: option.Opt,
      name: option.OptGeneral?.Description || 'Unnamed Product',
      description: option.OptGeneral?.Comment || '',
      supplierName: option.OptGeneral?.SupplierName || '',
      location: option.OptGeneral?.LocalityDescription || '',
      duration: option.OptGeneral?.Periods ? `${option.OptGeneral.Periods} days` : '',
      periods: parseInt(option.OptGeneral?.Periods || '0'),
      
      // Rates in WordPress format (sorted by date)
      rates: formattedRates.sort((a, b) => {
        if (!a.dateFrom || !b.dateFrom) return 0;
        return new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime();
      }),
      
      // Raw notes array for compatibility
      notes,
      
      // Structured content for easy access
      content: structuredContent,
      
      // Local assets (images and PDFs)
      localAssets,
      
      // Additional metadata
      locality: option.OptGeneral?.LocalityDescription,
      class: option.OptGeneral?.ClassDescription,
    };
  } catch (error) {
    console.error('Error getting product details:', error);
    throw error;
  }
}

/**
 * Get pricing for specific date ranges - used for calendar view
 * Returns pricing data for a date range with multiple departure dates
 */
export async function getPricingForDateRange(productCode: string, dateFrom: string, dateTo: string, adults: number = 2, children: number = 0, roomType: string = 'DB') {
  try {
    const xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${process.env.TOURPLAN_AGENTID || process.env.TOURPLAN_AGENT_ID}</AgentID>
    <Password>${process.env.TOURPLAN_AGENTPASSWORD || process.env.TOURPLAN_PASSWORD}</Password>
    <Opt>${productCode}</Opt>
    <Info>GS</Info>
    <DateFrom>${dateFrom}</DateFrom>
    <DateTo>${dateTo}</DateTo>
    <RateConvert>Y</RateConvert>
    <RoomConfigs>
      <RoomConfig>
        <Adults>${adults}</Adults>
        ${children > 0 ? `<Children>${children}</Children>` : ''}
        <Type>${roomType}</Type>
        <Quantity>1</Quantity>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`;
    
    console.log('Getting pricing for date range:', productCode, dateFrom, 'to', dateTo);
    const response = await wpXmlRequest(xml);
    const optionInfo = extractResponseData(response, 'OptionInfoReply');
    
    if (!optionInfo?.Option) {
      return { dateRanges: [], error: 'No pricing data found' };
    }
    
    // Extract date ranges with pricing
    const option = optionInfo.Option;
    const dateRanges: any[] = [];
    
    if (option.OptDateRanges?.OptDateRange) {
      const ranges = extractArray(option.OptDateRanges.OptDateRange);
      ranges.forEach((range: any) => {
        if (range.RateSets?.RateSet) {
          const rateSets = extractArray(range.RateSets.RateSet);
          rateSets.forEach((rateSet: any) => {
            if (rateSet.OptRate?.RoomRates) {
              const roomRates = rateSet.OptRate.RoomRates;
              dateRanges.push({
                dateFrom: range.DateFrom,
                dateTo: range.DateTo,
                currency: range.Currency || 'AUD',
                singleRate: roomRates.SingleRate ? Math.round(parseFloat(roomRates.SingleRate) / 100) : 0,
                doubleRate: roomRates.DoubleRate ? Math.round(parseFloat(roomRates.DoubleRate) / 100) : 0,
                twinRate: roomRates.TwinRate ? Math.round(parseFloat(roomRates.TwinRate) / 100) : 0,
                rateName: rateSet.RateName || 'Standard',
                appliesDaysOfWeek: rateSet.AppliesDaysOfWeek,
                available: !rateSet.IsClosed
              });
            }
          });
        }
      });
    }
    
    return { dateRanges, rawResponse: optionInfo };
  } catch (error) {
    console.error('Error getting pricing for date range:', error);
    return { dateRanges: [], error: error instanceof Error ? error.message : 'Pricing request failed' };
  }
}

/**
 * Get rate details with inventory information
 * Required to get valid RateId for booking
 * 
 * IMPORTANT: Group tours use RateName from RateSet, not separate RateId elements
 * Using Info>D to get RateSet information with RateName
 */
export async function getRateDetails(productCode: string, dateFrom: string, dateTo?: string, adults: number = 2, children: number = 0, roomType: string = 'DB') {
  try {
    // Use Info=D to get rate details with RateSet information
    const xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${process.env.TOURPLAN_AGENTID || process.env.TOURPLAN_AGENT_ID}</AgentID>
    <Password>${process.env.TOURPLAN_AGENTPASSWORD || process.env.TOURPLAN_PASSWORD}</Password>
    <Opt>${productCode}</Opt>
    <Info>D</Info>
    <DateFrom>${dateFrom}</DateFrom>
    ${dateTo ? `<DateTo>${dateTo}</DateTo>` : ''}
    <RateConvert>Y</RateConvert>
  </OptionInfoRequest>
</Request>`;
    
    console.log('🔍 Getting rate details for booking (using GMFTD):', {
      productCode,
      dateFrom,
      dateTo,
      adults,
      children,
      roomType
    });
    
    const response = await wpXmlRequest(xml);
    const optionInfo = extractResponseData(response, 'OptionInfoReply');
    
    if (!optionInfo?.Option) {
      console.error('❌ No option found in rate response');
      throw new Error(`No rate information found for product ${productCode}`);
    }
    
    // Extract RateName from OptDateRanges RateSet (this is what TourPlan uses as RateId for group tours)
    const option = optionInfo.Option;
    let validRateId = null;
    let availableRates: any[] = [];
    
    // Look for rates in OptDateRanges (primary source for group tours)
    if (option.OptDateRanges?.OptDateRange) {
      const dateRanges = extractArray(option.OptDateRanges.OptDateRange);
      
      for (const dateRange of dateRanges) {
        // Check if this date range overlaps with our requested dates
        const rangeFrom = new Date(dateRange.DateFrom);
        const rangeTo = new Date(dateRange.DateTo || dateRange.DateFrom);
        const requestFrom = new Date(dateFrom);
        const requestTo = dateTo ? new Date(dateTo) : requestFrom;
        
        // Check for date overlap
        const hasOverlap = requestFrom <= rangeTo && requestTo >= rangeFrom;
        
        if (dateRange.RateSets?.RateSet) {
          const rateSets = extractArray(dateRange.RateSets.RateSet);
          
          for (const rateSet of rateSets) {
            // Use RateName as the RateId (this is key insight from debug results)
            const rateName = rateSet.RateName || 'Standard';
            availableRates.push({
              rateName,
              dateFrom: dateRange.DateFrom,
              dateTo: dateRange.DateTo,
              hasOverlap,
              currency: dateRange.Currency || 'AUD'
            });
            
            // Prefer rates that overlap with our requested dates
            if (hasOverlap && !validRateId) {
              validRateId = rateName;
              console.log('Found matching RateName for dates:', rateName);
            }
          }
        }
      }
    }
    
    // If no overlapping rate found, use the first available rate
    if (!validRateId && availableRates.length > 0) {
      validRateId = availableRates[0].rateName;
      console.log('No overlapping rate found, using first available RateName:', validRateId);
    }
    
    // If still no rate found, use the helper to search thoroughly
    if (!validRateId && option) {
      console.log('🔍 Using helper to search for RateId...');
      validRateId = extractRateIdFromOption(option);
    }
    
    // Final fallback - return null to omit RateId entirely
    if (!validRateId) {
      console.log('No RateId found in response - will omit from booking request');
      validRateId = null; // This will cause the element to be omitted
    }
    
    console.log('✅ Found rate details:', {
      productCode,
      validRateId,
      availableRatesCount: availableRates.length,
      dateFrom,
      dateTo
    });
    
    return {
      rateId: validRateId,
      availableRates,
      option: option,
      rawResponse: optionInfo
    };
  } catch (error) {
    console.error('Error getting rate details:', error);
    throw error;
  }
}

/**
 * Create a new booking using the working TourplanAPI
 * Replaces WordPress booking creation functionality
 */
export async function createBooking(bookingData: {
  customerName: string;
  productCode: string;
  rateId: string;
  dateFrom: string;
  dateTo?: string;
  isQuote?: boolean;
  email?: string;
  mobile?: string;
  adults?: number;
  children?: number;
  infants?: number;
}) {
  try {
    const { getTourplanAPI } = await import('./core');
    const tourplanAPI = getTourplanAPI();
    
    console.log('🔄 Creating TourPlan booking with data:', {
      productCode: bookingData.productCode,
      customerName: bookingData.customerName,
      dateFrom: bookingData.dateFrom,
      adults: bookingData.adults,
      children: bookingData.children
    });
    
    // Parse customer name
    const nameParts = bookingData.customerName.split(' ');
    const firstName = nameParts[0] || 'Guest';
    const lastName = nameParts.slice(1).join(' ') || 'User';
    
    // Call the working TourplanAPI createBooking method
    const response = await tourplanAPI.createBooking({
      tourId: bookingData.productCode,
      startDate: bookingData.dateFrom,
      endDate: bookingData.dateTo || bookingData.dateFrom,
      adults: bookingData.adults || 2,
      children: bookingData.children || 0,
      customerDetails: {
        firstName,
        lastName,
        email: bookingData.email || '',
        phone: bookingData.mobile || '',
      }
    });
    
    console.log('📋 TourPlan API response:', {
      success: response.success,
      bookingId: response.bookingId,
      bookingReference: response.bookingReference,
      error: response.error
    });
    
    if (response.success) {
      // Return format expected by the API route
      return {
        bookingId: response.bookingId,
        reference: response.bookingReference,
        bookingRef: response.bookingReference, // Alternative field name
        status: 'OK', // TourPlan returned success
        totalCost: 0,
        currency: 'AUD',
        rateId: bookingData.rateId,
        rawResponse: response.rawResponse,
      };
    } else {
      console.error('❌ TourPlan booking failed:', response.error);
      throw new Error(response.error || 'Booking creation failed');
    }
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    throw error;
  }
}

/**
 * Get booking details
 */
export async function getBookingDetails(bookingId: string) {
  try {
    const xml = new GetBookingRequest(bookingId).build();
    const response = await wpXmlRequest(xml);
    const bookingReply = extractResponseData(response, 'GetBookingReply');
    
    return {
      bookingId: bookingReply.BookingId,
      reference: bookingReply.BookingRef || bookingReply.Reference,
      status: bookingReply.Status,
      customerName: bookingReply.Name,
      email: bookingReply.Email,
      mobile: bookingReply.Mobile,
      totalCost: parseFloat(bookingReply.TotalCost || '0'),
      totalPaid: parseFloat(bookingReply.TotalPaid || '0'),
      currency: bookingReply.Currency || 'USD',
      services: extractArray(bookingReply.ServiceLine || bookingReply.ServiceLines?.ServiceLine),
    };
  } catch (error) {
    console.error('Error getting booking details:', error);
    throw error;
  }
}

/**
 * Helper to extract RateId from option response
 * For group tours, this usually means extracting RateName from RateSet
 */
function extractRateIdFromOption(option: any): string | null {
  // Check various possible locations for RateId based on TourPlan response structure
  
  // 1. Direct RateId on option
  if (option.RateId) {
    console.log('Found RateId directly on option:', option.RateId);
    return option.RateId;
  }
  
  // 2. In rate information
  if (option.Rate?.RateId) {
    console.log('Found RateId in Rate:', option.Rate.RateId);
    return option.Rate.RateId;
  }
  
  // 3. In OptStayResults
  if (option.OptStayResults?.RateId) {
    console.log('Found RateId in OptStayResults:', option.OptStayResults.RateId);
    return option.OptStayResults.RateId;
  }
  
  // 4. In first RateSet - check both RateId and RateName
  if (option.OptDateRanges?.OptDateRange) {
    const dateRanges = extractArray(option.OptDateRanges.OptDateRange);
    for (const range of dateRanges) {
      if (range.RateSets?.RateSet) {
        const rateSets = extractArray(range.RateSets.RateSet);
        for (const rateSet of rateSets) {
          if (rateSet.RateId) {
            console.log('Found RateId in RateSet:', rateSet.RateId);
            return rateSet.RateId;
          }
          // For group tours, use RateName as RateId
          if (rateSet.RateName) {
            console.log('Found RateName in RateSet (using as RateId):', rateSet.RateName);
            return rateSet.RateName;
          }
        }
      }
    }
  }
  
  console.log('No RateId or RateName found in option structure');
  return null;
}

/**
 * Extract rates from option using proven patterns from old booking engine
 */
function extractRatesFromOption(option: any): any[] {
  const rates: any[] = [];

  // Method 1: OptDateRanges (most common for tours)
  if (option.OptDateRanges?.OptDateRange) {
    const dateRanges = extractArray(option.OptDateRanges.OptDateRange);
    
    dateRanges.forEach((dateRange: any) => {
      if (dateRange.RateSets?.RateSet) {
        const rateSets = extractArray(dateRange.RateSets.RateSet);
        
        rateSets.forEach((rateSet: any) => {
          if (rateSet.OptRate?.RoomRates) {
            const roomRates = rateSet.OptRate.RoomRates;
            
            // Convert from cents to dollars (TourPlan returns prices in cents)
            if (roomRates.SingleRate) {
              rates.push({
                currency: dateRange.Currency || 'AUD',
                singleRate: Math.round(parseFloat(roomRates.SingleRate) / 100),
                rateName: rateSet.RateName || 'Single',
                dateFrom: dateRange.DateFrom,
                dateTo: dateRange.DateTo
              });
            }
            
            if (roomRates.DoubleRate) {
              rates.push({
                currency: dateRange.Currency || 'AUD',
                doubleRate: Math.round(parseFloat(roomRates.DoubleRate) / 100),
                rateName: rateSet.RateName || 'Double',
                dateFrom: dateRange.DateFrom,
                dateTo: dateRange.DateTo
              });
            }
            
            if (roomRates.TwinRate) {
              rates.push({
                currency: dateRange.Currency || 'AUD',
                twinRate: Math.round(parseFloat(roomRates.TwinRate) / 100),
                rateName: rateSet.RateName || 'Twin',
                dateFrom: dateRange.DateFrom,
                dateTo: dateRange.DateTo
              });
            }
          }
        });
      }
    });
  }

  // Method 2: OptStayResults (common for tours)
  if (option.OptStayResults) {
    const stayResults = option.OptStayResults;
    
    // Extract total price if available
    if (stayResults.TotalPrice || stayResults.AgentPrice) {
      rates.push({
        currency: stayResults.Currency || 'AUD',
        singleRate: Math.round((parseFloat(stayResults.AgentPrice || stayResults.TotalPrice) / 100) / 2), // Divide by 2 for per person
        doubleRate: Math.round(parseFloat(stayResults.AgentPrice || stayResults.TotalPrice) / 100),
        twinRate: Math.round(parseFloat(stayResults.AgentPrice || stayResults.TotalPrice) / 100),
        rateName: stayResults.RateName || 'Standard',
        dateFrom: stayResults.PeriodValueAdds?.PeriodValueAdd?.DateFrom,
        dateTo: stayResults.PeriodValueAdds?.PeriodValueAdd?.DateTo
      });
    }
  }
  
  // Method 3: Stay Results (for accommodation)
  if (option.OptStayResults?.RateSet?.RateStays?.RateStay) {
    const rateStays = extractArray(option.OptStayResults.RateSet.RateStays.RateStay);
    
    rateStays.forEach((rateStay: any) => {
      if (rateStay.StayPays?.StayPay) {
        const stayPays = extractArray(rateStay.StayPays.StayPay);
        
        stayPays.forEach((stayPay: any) => {
          rates.push({
            currency: stayPay.Currency || 'AUD',
            singleRate: Math.round(parseFloat(stayPay.Pay) / 100),
            rateName: rateStay.RateName || 'Standard',
            dateFrom: stayPay.Date,
            available: parseInt(stayPay.Available) || 0
          });
        });
      }
    });
  }

  // Fallback: if no rates found, return a placeholder
  if (rates.length === 0) {
    rates.push({
      currency: 'AUD',
      singleRate: 0,
      rateName: 'Price on Application'
    });
  }

  return rates;
}

/**
 * Utility function to ensure array format
 * Handles single items or arrays from XML parsing
 */
function extractArray(data: any): any[] {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}