import { XMLParser } from 'fast-xml-parser';

// Simple configuration - using correct env var names
const TOURPLAN_CONFIG = {
  endpoint: process.env.TOURPLAN_API_URL || '',
  agentId: process.env.TOURPLAN_AGENTID || '',
  password: process.env.TOURPLAN_AGENTPASSWORD || '',
  timeout: 30000,
};

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
    
    // Check for error responses
    if (xmlText.includes('ErrorReply')) {
      const errorMatch = xmlText.match(/<Error>(.*?)<\/Error>/);
      const errorMessage = errorMatch ? errorMatch[1] : 'TourPlan API error';
      console.error('TourPlan API error:', errorMessage);
      throw new Error(errorMessage);
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
  return `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <${requestType}>
    <AgentID>${TOURPLAN_CONFIG.agentId}</AgentID>
    <Password>${TOURPLAN_CONFIG.password}</Password>
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
 * Get TourPlan configuration for debugging
 */
export function getTourPlanConfig() {
  return {
    endpoint: TOURPLAN_CONFIG.endpoint,
    agentId: TOURPLAN_CONFIG.agentId,
    hasPassword: !!TOURPLAN_CONFIG.password,
  };
}