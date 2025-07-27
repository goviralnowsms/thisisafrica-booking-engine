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
 * Get detailed product information
 * Replaces WordPress TourplanOptionRequest functionality
 */
export async function getProductDetails(productCode: string) {
  try {
    // Build request specifically for this product
    const xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${process.env.TOURPLAN_AGENTID}</AgentID>
    <Password>${process.env.TOURPLAN_AGENTPASSWORD}</Password>
    <Opt>${productCode}</Opt>
    <Info>GMFTD</Info>
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
    
    // Transform rates to match WordPress format
    const formattedRates = productRates.map(rate => ({
      dateRange: rate.dateFrom && rate.dateTo 
        ? `${rate.dateFrom} - ${rate.dateTo}`
        : 'Available dates',
      singleRate: rate.singleRate || 0,
      doubleRate: rate.doubleRate || rate.twinRate || 0,
      twinRate: rate.twinRate || rate.doubleRate || 0,
      twinRateFormatted: (rate.twinRate || rate.doubleRate) 
        ? `${rate.currency || 'AUD'} $${Math.round((rate.twinRate || rate.doubleRate) / 2).toLocaleString()}`
        : 'Price on application',
      twinRateTotal: rate.twinRate || rate.doubleRate || 0,
      currency: rate.currency || 'AUD',
      rateName: rate.rateName || 'Standard',
      dateFrom: rate.dateFrom,
      dateTo: rate.dateTo
    }));
    
    return {
      id: option.Opt,
      code: option.Opt,
      name: option.OptGeneral?.Description || 'Unnamed Product',
      description: option.OptGeneral?.Comment || '',
      supplierName: option.OptGeneral?.SupplierName || '',
      location: option.OptGeneral?.LocalityDescription || '',
      duration: option.OptGeneral?.Periods ? `${option.OptGeneral.Periods} days` : '',
      periods: parseInt(option.OptGeneral?.Periods || '0'),
      
      // Rates in WordPress format
      rates: formattedRates,
      
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
 * Create a new booking
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
    const xml = new AddServiceRequest()
      .setNewBooking(bookingData.customerName, bookingData.isQuote ? 'Q' : 'B')
      .setProduct(bookingData.productCode, bookingData.rateId)
      .setDates(bookingData.dateFrom, bookingData.dateTo)
      .setTravelers(bookingData.adults, bookingData.children, bookingData.infants)
      .setCustomerDetails(bookingData.email, bookingData.mobile)
      .build();
    
    const response = await wpXmlRequest(xml);
    const bookingReply = extractResponseData(response, 'AddServiceReply');
    
    return {
      bookingId: bookingReply.BookingId,
      reference: bookingReply.BookingRef || bookingReply.Reference,
      status: bookingReply.Status || (bookingData.isQuote ? 'Quote' : 'Booked'),
      totalCost: parseFloat(bookingReply.TotalCost || '0'),
      currency: bookingReply.Currency || 'USD',
    };
  } catch (error) {
    console.error('Error creating booking:', error);
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