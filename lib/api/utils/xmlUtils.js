/**
 * XML Utilities
 * Helper functions for working with XML data from TourPlan API
 */

// Let's add xml2js for XML parsing
// You'll need to run: npm install xml2js

const { parseString } = require('xml2js');

/**
 * Parse XML string to JavaScript object
 * @param {string} xmlString - The XML string to parse
 * @returns {Promise<Object>} - Parsed JavaScript object
 */
function parseXML(xmlString) {
  return new Promise((resolve, reject) => {
    parseString(xmlString, { explicitArray: false, mergeAttrs: true }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

/**
 * Extract error information from TourPlan XML response
 * @param {string} xmlResponse - The XML response from TourPlan
 * @returns {Promise<Object|null>} - Error object or null if no error
 */
async function extractTourPlanError(xmlResponse) {
  try {
    const parsed = await parseXML(xmlResponse);
    
    // Check for different error formats in TourPlan responses
    if (parsed.Response && parsed.Response.Error) {
      return {
        code: parsed.Response.Error.Code || 'UNKNOWN',
        message: parsed.Response.Error.Message || 'Unknown error',
        details: parsed.Response.Error
      };
    }
    
    // Some TourPlan responses include Status with an error message
    if (parsed.Response && 
        parsed.Response.Status && 
        parsed.Response.Status !== 'OK') {
      return {
        code: parsed.Response.Status,
        message: parsed.Response.Message || 'Request failed',
        details: parsed.Response
      };
    }
    
    return null;
  } catch (err) {
    console.error('Error parsing XML for error extraction:', err);
    return {
      code: 'PARSE_ERROR',
      message: 'Failed to parse XML response',
      details: err.message
    };
  }
}

/**
 * Transform TourPlan XML responses into standardized JavaScript objects
 * @param {string} xmlResponse - The XML response from TourPlan
 * @param {string} responseType - The type of response for specific transformations
 * @returns {Promise<Object>} - Transformed response object
 */
async function transformTourPlanResponse(xmlResponse, responseType) {
  try {
    // First check for errors
    const error = await extractTourPlanError(xmlResponse);
    if (error) {
      throw new Error(`TourPlan API Error: ${error.message} (${error.code})`);
    }
    
    // Parse the XML
    const parsed = await parseXML(xmlResponse);
    
    // Apply specific transformations based on response type
    switch (responseType) {
      case 'GetServiceButtonDetails':
        return transformServiceButtonDetails(parsed);
      case 'GetAvailability':
        return transformAvailability(parsed);
      case 'CreateBooking':
        return transformBookingResponse(parsed);
      case 'GetTourDetails':
        return transformTourDetails(parsed);
      default:
        // Return the parsed response with minimal transformation
        return parsed;
    }
  } catch (err) {
    console.error('Error transforming TourPlan response:', err);
    throw err;
  }
}

/**
 * Transform service button details response
 * @param {Object} parsed - Parsed XML response
 * @returns {Object} - Transformed response
 */
function transformServiceButtonDetails(parsed) {
  if (!parsed.Response || !parsed.Response.GetServiceButtonDetailsResponse) {
    throw new Error('Invalid service button details response');
  }
  
  const response = parsed.Response.GetServiceButtonDetailsResponse;
  
  return {
    buttonName: response.ButtonName,
    description: response.Description,
    buttonText: response.ButtonText,
    buttonType: response.ButtonType,
    status: response.Status
  };
}

/**
 * Transform availability response
 * @param {Object} parsed - Parsed XML response
 * @returns {Object} - Transformed response
 */
function transformAvailability(parsed) {
  if (!parsed.Response || !parsed.Response.GetAvailabilityResponse) {
    throw new Error('Invalid availability response');
  }
  
  const response = parsed.Response.GetAvailabilityResponse;
  
  // Handle case when no services are found
  if (response.Status !== 'OK' || !response.Services || !response.Services.Service) {
    return {
      status: response.Status,
      message: response.Message || 'No services found',
      services: []
    };
  }
  
  // Handle single service vs array of services
  const services = Array.isArray(response.Services.Service) 
    ? response.Services.Service 
    : [response.Services.Service];
  
  return {
    status: response.Status,
    services: services.map(service => ({
      id: service.ServiceId,
      name: service.ServiceName,
      type: service.ServiceType,
      startDate: service.StartDate,
      endDate: service.EndDate,
      duration: service.Duration,
      price: {
        amount: parseFloat(service.Price?.Amount || 0),
        currency: service.Price?.Currency || 'AUD'
      },
      availability: service.Availability,
      description: service.Description
    }))
  };
}

/**
 * Transform tour details response
 * @param {Object} parsed - Parsed XML response
 * @returns {Object} - Transformed response
 */
function transformTourDetails(parsed) {
  if (!parsed.Response || !parsed.Response.GetTourDetailsResponse) {
    throw new Error('Invalid tour details response');
  }
  
  const response = parsed.Response.GetTourDetailsResponse;
  
  return {
    tourId: response.TourId,
    tourName: response.TourName,
    description: response.Description,
    duration: response.Duration,
    startDate: response.StartDate,
    endDate: response.EndDate,
    price: {
      amount: parseFloat(response.Price?.Amount || 0),
      currency: response.Price?.Currency || 'AUD'
    },
    inclusions: response.Inclusions?.Inclusion 
      ? (Array.isArray(response.Inclusions.Inclusion) 
        ? response.Inclusions.Inclusion 
        : [response.Inclusions.Inclusion])
      : [],
    itinerary: response.Itinerary?.Day
      ? (Array.isArray(response.Itinerary.Day)
        ? response.Itinerary.Day.map(day => ({
            dayNumber: day.DayNumber,
            description: day.Description
          }))
        : [{
            dayNumber: response.Itinerary.Day.DayNumber,
            description: response.Itinerary.Day.Description
          }])
      : []
  };
}

/**
 * Transform booking response
 * @param {Object} parsed - Parsed XML response
 * @returns {Object} - Transformed response
 */
function transformBookingResponse(parsed) {
  if (!parsed.Response || !parsed.Response.CreateBookingResponse) {
    throw new Error('Invalid booking response');
  }
  
  const response = parsed.Response.CreateBookingResponse;
  
  return {
    status: response.Status,
    bookingId: response.BookingId,
    reference: response.Reference,
    createdDate: response.CreatedDate,
    totalAmount: {
      amount: parseFloat(response.TotalAmount?.Amount || 0),
      currency: response.TotalAmount?.Currency || 'AUD'
    },
    depositAmount: {
      amount: parseFloat(response.DepositAmount?.Amount || 0),
      currency: response.DepositAmount?.Currency || 'AUD'
    }
  };
}

module.exports = {
  parseXML,
  extractTourPlanError,
  transformTourPlanResponse
};
