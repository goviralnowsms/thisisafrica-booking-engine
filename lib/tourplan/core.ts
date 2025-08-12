import { XMLParser } from 'fast-xml-parser';

// Dynamic configuration - loaded at runtime to ensure env vars are available
function getTourPlanConfig() {
  return {
    endpoint: process.env.TOURPLAN_API_URL || process.env.TOURPLAN_ENDPOINT || '',
    agentId: process.env.TOURPLAN_AGENTID || process.env.TOURPLAN_AGENT_ID || '',
    password: process.env.TOURPLAN_AGENTPASSWORD || process.env.TOURPLAN_PASSWORD || '',
    timeout: 30000,
  };
}

// For backward compatibility
const TOURPLAN_CONFIG = getTourPlanConfig();

// XML Parser instance
const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseAttributeValue: true,
  trimValues: true,
  parseTrueNumberOnly: true,
});

/**
 * Core function to execute TourPlan API requests
 * Equivalent to WordPress tourplan_query() function
 */
export async function tourplanQuery(inputXml: string): Promise<any> {
  try {
    const config = getTourPlanConfig();
    
    // Debug logging
    console.log('🔍 TourPlan Query - Config:', {
      hasEndpoint: !!config.endpoint,
      hasAgentId: !!config.agentId,
      hasPassword: !!config.password,
      agentId: config.agentId
    });
    console.log('📤 TourPlan Query - XML Request:\n', inputXml);
    
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
      },
      body: inputXml,
      signal: AbortSignal.timeout(config.timeout),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const xmlText = await response.text();
    return xmlParser.parse(xmlText);
  } catch (error) {
    console.error('TourPlan API error:', error);
    throw error;
  }
}

/**
 * Helper function that converts XML response to clean JSON
 * Equivalent to WordPress WPXMLREQUEST() function
 */
export async function wpXmlRequest(inputXml: string): Promise<any> {
  try {
    const response = await fetch(TOURPLAN_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
      },
      body: inputXml,
      signal: AbortSignal.timeout(TOURPLAN_CONFIG.timeout),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const xmlText = await response.text();
    console.log('📥 TourPlan Response XML:', xmlText);
    
    // Check for error responses but don't throw yet - let parser handle it
    if (xmlText.includes('ErrorReply')) {
      console.log('⚠️ TourPlan returned an error response');
    }
    
    // Don't throw error for unusable - let the service layer handle it
    // The service layer can provide better context-specific messages
    
    const parsed = xmlParser.parse(xmlText);
    return JSON.parse(JSON.stringify(parsed));
  } catch (error) {
    console.error('TourPlan request failed:', error);
    throw error;
  }
}

/**
 * Build base XML request structure
 */
export function buildBaseRequest(requestType: string, content: string): string {
  // Get fresh config to ensure env vars are loaded
  const config = getTourPlanConfig();
  
  return `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <${requestType}>
    <AgentID>${config.agentId}</AgentID>
    <Password>${config.password}</Password>
    ${content}
  </${requestType}>
</Request>`;
}

/**
 * Simple helper to extract data from common response patterns
 */
export function extractResponseData(response: any, replyType: string): any {
  // Handle Reply wrapper
  if (response.Reply) {
    if (response.Reply[replyType]) {
      return response.Reply[replyType];
    }
    if (response.Reply.ErrorReply) {
      throw new Error(response.Reply.ErrorReply.Error || 'TourPlan API Error');
    }
    return response.Reply;
  }
  
  // Direct access
  if (response[replyType]) return response[replyType];
  
  // Error handling
  if (response.Error) throw new Error(response.Error.ErrorMessage || 'TourPlan API Error');
  if (response.ErrorReply) throw new Error(response.ErrorReply.Error || 'TourPlan API Error');
  
  return response;
}

/**
 * Get TourPlan configuration for debugging (public-safe version)
 */
export function getPublicTourPlanConfig() {
  const config = getTourPlanConfig();
  return {
    endpoint: config.endpoint,
    agentId: config.agentId,
    hasPassword: !!config.password,
  };
}

// For backward compatibility
export { getTourPlanConfig };

// Working TourPlan API interfaces
export interface TourplanBookingParams {
  tourId: string
  startDate: string
  endDate: string
  adults: number
  children: number
  customerDetails: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
}

export interface TourplanResponse {
  success: boolean
  data?: any
  error?: string
  rawResponse?: string
  options?: any[]
  bookingId?: string
  bookingReference?: string
}

/**
 * Working TourPlan API class based on proven old codebase
 */
export class TourplanAPI {
  private config: any

  constructor() {
    this.config = getTourPlanConfig();
    
    // Fallback to hardcoded working credentials if env vars not set
    if (!this.config.endpoint || !this.config.agentId || !this.config.password) {
      console.warn("Using TourPlan credentials from environment variables or defaults");
      this.config = {
        endpoint: process.env.TOURPLAN_API_URL || "https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi",
        agentId: process.env.TOURPLAN_AGENT_ID || "SAMAGT",
        password: process.env.TOURPLAN_PASSWORD || "S@MAgt01",
        timeout: 30000,
      };
    }
  }

  private async makeRequest(xmlBody: string): Promise<TourplanResponse> {
    if (!this.config.endpoint) {
      return {
        success: false,
        error: "Tourplan API not configured",
      };
    }

    console.log("Making Tourplan API request:", {
      url: this.config.endpoint,
      bodyLength: xmlBody.length,
    });

    try {
      const response = await fetch(this.config.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          "Accept": "text/xml",
        },
        body: xmlBody,
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      const responseText = await response.text();

      if (!response.ok) {
        console.error("Tourplan API error:", {
          status: response.status,
          statusText: response.statusText,
          response: responseText.substring(0, 500),
        });
        return {
          success: false,
          error: `Tourplan API error: ${response.status} ${response.statusText}`,
          rawResponse: responseText,
        };
      }

      return this.parseXmlResponse(responseText);
    } catch (error) {
      console.error("Tourplan API request failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  private parseXmlResponse(xmlString: string): TourplanResponse {
    try {
      // Check for HostConnect errors
      const errorMatch = xmlString.match(/<ErrorReply[^>]*>([\s\S]*?)<\/ErrorReply>/);
      if (errorMatch) {
        const errorDetailMatch = errorMatch[1].match(/<Error[^>]*>([\s\S]*?)<\/Error>/);
        const errorCode = errorDetailMatch ? errorDetailMatch[1] : "API Error";
        
        // Provide user-friendly error messages
        let friendlyError = errorCode;
        if (errorCode.includes('1052')) {
          friendlyError = "The selected tour is not available. Please choose a different tour or date.";
        } else if (errorCode.includes('1000')) {
          friendlyError = "Invalid date format. Please check your travel dates.";
        } else if (errorCode.includes('1001')) {
          friendlyError = "Missing required information. Please check all fields are completed.";
        } else if (errorCode.includes('1051')) {
          friendlyError = "Authentication failed. Please try again or contact support.";
        }
        
        return {
          success: false,
          error: friendlyError,
          rawResponse: xmlString,
        };
      }

      // Check for successful Reply
      if (xmlString.includes('<Reply>')) {
        return {
          success: true,
          data: xmlString,
          rawResponse: xmlString,
        };
      }

      return {
        success: false,
        error: "Invalid response format",
        rawResponse: xmlString,
      };
    } catch (error) {
      console.error("XML parsing error:", error);
      return {
        success: false,
        error: "Failed to parse XML response",
        rawResponse: xmlString,
      };
    }
  }

  // IMPLEMENTED: AddServiceRequest for booking creation
  async createBooking(params: TourplanBookingParams): Promise<TourplanResponse & { bookingId?: string; bookingReference?: string }> {
    const {
      tourId,
      startDate,
      endDate,
      adults,
      children,
      customerDetails
    } = params;

    console.log('🎯 CREATING TOURPLAN BOOKING via AddServiceRequest:', {
      tourId,
      startDate,
      customerDetails: customerDetails.firstName + ' ' + customerDetails.lastName
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <AddServiceRequest>
    <AgentID>${this.config.agentId}</AgentID>
    <Password>${this.config.password}</Password>
    <NewBookingInfo>
      <Name>${customerDetails.firstName} ${customerDetails.lastName}</Name>
      <QB>B</QB>
    </NewBookingInfo>
    <Opt>${tourId}</Opt>
    <RateId>Default</RateId>
    <DateFrom>${startDate}</DateFrom>
    <SCUqty>1</SCUqty>
    <Adults>${adults}</Adults>
    <Children>${children}</Children>
    <RoomType>DB</RoomType>
    <Email>${customerDetails.email}</Email>
    <puRemark>${customerDetails.phone}</puRemark>
  </AddServiceRequest>
</Request>`;

    console.log('📤 SENDING AddServiceRequest XML to Tourplan:', xml);

    try {
      const response = await this.makeRequest(xml);
      
      // Parse AddServiceReply specifically
      if (response.rawResponse?.includes('<AddServiceReply>')) {
        const statusMatch = response.rawResponse.match(/<Status>([^<]*)<\/Status>/);
        const status = statusMatch ? statusMatch[1] : null;
        
        if (status === 'OK' || status === '??') {
          console.log('✅ TOURPLAN BOOKING SUCCESS - Status:', status);
          
          // Extract real booking ID and reference from Tourplan response
          const bookingIdMatch = response.rawResponse.match(/<BookingId[^>]*>([^<]*)<\/BookingId>/);
          const bookingRefMatch = response.rawResponse.match(/<Ref[^>]*>([^<]*)<\/Ref>/);
          
          const realBookingId = bookingIdMatch ? bookingIdMatch[1] : null;
          const realBookingRef = bookingRefMatch ? bookingRefMatch[1] : null;
          
          return {
            success: true,
            data: response.rawResponse,
            rawResponse: response.rawResponse,
            bookingId: realBookingId,
            bookingReference: realBookingRef
          };
        } else {
          console.log('❌ TOURPLAN BOOKING FAILED - Status:', status);
          
          // Extract error details if available
          const errorMatch = response.rawResponse.match(/<Error[^>]*>([^<]*)<\/Error>/);
          const errorText = errorMatch ? errorMatch[1] : `Booking failed with status: ${status}`;
          
          return {
            success: false,
            error: errorText,
            rawResponse: response.rawResponse
          };
        }
      }
      
      // Fallback for other response types
      if (response.success) {
        console.log('✅ TOURPLAN RESPONSE SUCCESS (non-booking):', response);
        return response;
      } else {
        console.log('❌ TOURPLAN RESPONSE FAILED:', response.error);
        return response;
      }
    } catch (error) {
      console.error('❌ TOURPLAN BOOKING ERROR:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown booking error'
      };
    }
  }

  isConfigured(): boolean {
    return !!(this.config.endpoint && this.config.agentId && this.config.password);
  }
}

// Export singleton instance
export const tourplanAPI = new TourplanAPI();

// Helper function to get TourplanAPI instance (for compatibility)
export function getTourplanAPI(): TourplanAPI {
  return tourplanAPI;
}