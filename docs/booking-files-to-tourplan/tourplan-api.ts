import { env } from "./env"

export interface TourplanConfig {
  apiUrl: string
  username: string
  password: string
  agentId: string
  proxyUrl?: string
  useProxy?: boolean
}

export interface TourplanSearchParams {
  destination?: string
  startDate?: string
  endDate?: string
  adults?: number
  children?: number
  serviceType?: string
  region?: string
  buttonName?: string
  optionCode?: string
  info?: string
}

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
}

export function getTourplanConfig(): TourplanConfig {
  if (!env.TOURPLAN_API_URL || !env.TOURPLAN_USERNAME || !env.TOURPLAN_PASSWORD || !env.TOURPLAN_AGENT_ID) {
    throw new Error("Tourplan configuration incomplete")
  }

  return {
    apiUrl: env.TOURPLAN_API_URL,
    username: env.TOURPLAN_USERNAME,
    password: env.TOURPLAN_PASSWORD,
    agentId: env.TOURPLAN_AGENT_ID,
    proxyUrl: env.TOURPLAN_PROXY_URL,
    useProxy: env.USE_TOURPLAN_PROXY,
  }
}

export async function testTourplanConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const api = new TourplanAPI()
    const result = await api.testConnection()
    return { success: result.success, error: result.error }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export function getTourplanAPI(): TourplanAPI {
  return new TourplanAPI()
}

export class TourplanAPI {
  private config: TourplanConfig

  constructor() {
    try {
      this.config = getTourplanConfig()
    } catch (error) {
      console.warn("Tourplan API not configured via env vars, using hardcoded credentials:", error)
      // Use the same hardcoded credentials that work in the demo page
      this.config = {
        apiUrl: "https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi",
        username: "SAMAGT", // Not used in HostConnect
        password: "S@MAgt01",
        agentId: "SAMAGT",
      }
    }
  }

  private async makeRequest(xmlBody: string): Promise<TourplanResponse> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: "Tourplan API not configured",
      }
    }

    const url = this.config.useProxy && this.config.proxyUrl ? this.config.proxyUrl : this.config.apiUrl

    if (!url) {
      return {
        success: false,
        error: "No API URL configured",
      }
    }

    console.log("Making Tourplan API request:", {
      url,
      bodyLength: xmlBody.length,
      useProxy: this.config.useProxy,
    })

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          "Accept": "text/xml",
        },
        body: xmlBody,
        signal: AbortSignal.timeout(30000), // 30 second timeout
      })

      const responseText = await response.text()

      if (!response.ok) {
        console.error("Tourplan API error:", {
          status: response.status,
          statusText: response.statusText,
          response: responseText.substring(0, 500),
        })
        return {
          success: false,
          error: `Tourplan API error: ${response.status} ${response.statusText}`,
          rawResponse: responseText,
        }
      }

      return this.parseXmlResponse(responseText)
    } catch (error) {
      console.error("Tourplan API request failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  private parseXmlResponse(xmlString: string): TourplanResponse {
    try {
      // Check for HostConnect errors
      const errorMatch = xmlString.match(/<ErrorReply[^>]*>([\s\S]*?)<\/ErrorReply>/)
      if (errorMatch) {
        const errorDetailMatch = errorMatch[1].match(/<Error[^>]*>([\s\S]*?)<\/Error>/)
        return {
          success: false,
          error: errorDetailMatch ? errorDetailMatch[1] : "API Error",
          rawResponse: xmlString,
        }
      }

      // Check for successful Reply
      if (xmlString.includes('<Reply>')) {
        const options = this.extractOptions(xmlString)
        return {
          success: true,
          data: xmlString,
          rawResponse: xmlString,
          options: options,
        }
      }

      return {
        success: false,
        error: "Invalid response format",
        rawResponse: xmlString,
      }
    } catch (error) {
      console.error("XML parsing error:", error)
      return {
        success: false,
        error: "Failed to parse XML response",
        rawResponse: xmlString,
      }
    }
  }

  private extractOptions(xmlString: string): any[] {
    const options: any[] = []
    
    // Simple regex-based extraction (you might want to use xml2js for more robust parsing)
    const optionRegex = /<Option[^>]*>([\s\S]*?)<\/Option>/g
    let match
    
    while ((match = optionRegex.exec(xmlString)) !== null) {
      const optionXml = match[1]
      
      // Extract basic option info
      const opt = this.extractValue(optionXml, 'Opt')
      const description = this.extractValue(optionXml, 'Description')
      const supplierName = this.extractValue(optionXml, 'SupplierName')
      const localityDescription = this.extractValue(optionXml, 'LocalityDescription')
      const classDescription = this.extractValue(optionXml, 'ClassDescription')
      
      if (opt) {
        options.push({
          code: opt,
          name: description,
          supplier: supplierName,
          location: localityDescription,
          class: classDescription,
          rawXml: match[0]
        })
      }
    }
    
    return options
  }

  private extractValue(xml: string, tagName: string): string | null {
    const match = xml.match(new RegExp(`<${tagName}[^>]*>([^<]*)<\/${tagName}>`))
    return match ? match[1].trim() : null
  }

  // CORRECTED METHODS USING PROPER HOSTCONNECT FORMAT

  async searchTours(params: TourplanSearchParams = {}): Promise<TourplanResponse> {
    const {
      destination,
      startDate,
      endDate,
      adults = 2,
      children = 0,
      buttonName,
      optionCode,
      info = 'GMFT'
    } = params

    let searchElements = ''
    
    if (optionCode) {
      searchElements = `<Opt>${optionCode}</Opt>`
    } else {
      // Use your tour code pattern
      searchElements = `<Opt>LOCGTSAMTOU??????</Opt>`
      if (destination) searchElements += `<DestinationName>${destination}</DestinationName>`
      if (buttonName) searchElements += `<ButtonName>${buttonName}</ButtonName>`
    }

    let dateElements = ''
    if (startDate && endDate) {
      dateElements = `
        <DateFrom>${startDate}</DateFrom>
        <DateTo>${endDate}</DateTo>
        <RoomConfigs>
          <RoomConfig>
            <Adults>${adults}</Adults>
            ${children > 0 ? `<Children>${children}</Children>` : ''}
            <RoomType>DB</RoomType>
          </RoomConfig>
        </RoomConfigs>`
    }

    const xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${this.config.agentId}</AgentID>
    <Password>${this.config.password}</Password>
    ${searchElements}
    <Info>${info}</Info>
    ${dateElements}
  </OptionInfoRequest>
</Request>`

    return this.makeRequest(xml)
  }

  async searchAccommodation(params: TourplanSearchParams = {}): Promise<TourplanResponse> {
    const {
      destination,
      startDate,
      endDate,
      adults = 2,
      children = 0,
      info = 'GMFT'
    } = params

    let searchElements = `<Opt>LOCACSAMHTL??????</Opt>`
    if (destination) searchElements += `<DestinationName>${destination}</DestinationName>`

    let dateElements = ''
    if (startDate && endDate) {
      dateElements = `
        <DateFrom>${startDate}</DateFrom>
        <DateTo>${endDate}</DateTo>
        <RoomConfigs>
          <RoomConfig>
            <Adults>${adults}</Adults>
            ${children > 0 ? `<Children>${children}</Children>` : ''}
            <RoomType>DB</RoomType>
          </RoomConfig>
        </RoomConfigs>`
    }

    const xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${this.config.agentId}</AgentID>
    <Password>${this.config.password}</Password>
    ${searchElements}
    <Info>${info}</Info>
    ${dateElements}
  </OptionInfoRequest>
</Request>`

    return this.makeRequest(xml)
  }

  async getTourDetails(tourId: string): Promise<TourplanResponse> {
    const xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${this.config.agentId}</AgentID>
    <Password>${this.config.password}</Password>
    <Opt>${tourId}</Opt>
    <Info>GMFTD</Info>
    <NotesInRtf>H</NotesInRtf>
  </OptionInfoRequest>
</Request>`

    return this.makeRequest(xml)
  }

  async getOptionInfo(optionId: string): Promise<TourplanResponse> {
    return this.getTourDetails(optionId)
  }

  async checkAvailability(tourId: string, date: string, adults: number, children: number): Promise<TourplanResponse> {
    const xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${this.config.agentId}</AgentID>
    <Password>${this.config.password}</Password>
    <Opt>${tourId}</Opt>
    <Info>S</Info>
    <DateFrom>${date}</DateFrom>
    <DateTo>${date}</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>${adults}</Adults>
        ${children > 0 ? `<Children>${children}</Children>` : ''}
        <RoomType>DB</RoomType>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`

    return this.makeRequest(xml)
  }

  async getProductSearchData(): Promise<TourplanResponse> {
    const xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <GetProductSearchDataRequest>
    <AgentID>${this.config.agentId}</AgentID>
    <Password>${this.config.password}</Password>
  </GetProductSearchDataRequest>
</Request>`

    return this.makeRequest(xml)
  }

  async testConnection(): Promise<TourplanResponse> {
    const xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <AgentInfoRequest>
    <AgentID>${this.config.agentId}</AgentID>
    <Password>${this.config.password}</Password>
    <ReturnAccountInfo>Y</ReturnAccountInfo>
  </AgentInfoRequest>
</Request>`

    return this.makeRequest(xml)
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
    } = params

    console.log('🎯 CREATING TOURPLAN BOOKING via AddServiceRequest:', {
      tourId,
      startDate,
      customerDetails: customerDetails.firstName + ' ' + customerDetails.lastName
    })

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
</Request>`

    console.log('📤 SENDING AddServiceRequest XML to Tourplan:', xml)

    try {
      const response = await this.makeRequest(xml)
      
      // Parse AddServiceReply specifically
      if (response.rawResponse?.includes('<AddServiceReply>')) {
        const statusMatch = response.rawResponse.match(/<Status>([^<]*)<\/Status>/)
        const status = statusMatch ? statusMatch[1] : null
        
        if (status === 'OK' || status === '??') {
          console.log('✅ TOURPLAN BOOKING SUCCESS - Status:', status)
          
          // Extract real booking ID and reference from Tourplan response
          const bookingIdMatch = response.rawResponse.match(/<BookingId[^>]*>([^<]*)<\/BookingId>/)
          const bookingRefMatch = response.rawResponse.match(/<Ref[^>]*>([^<]*)<\/Ref>/)
          
          const realBookingId = bookingIdMatch ? bookingIdMatch[1] : null
          const realBookingRef = bookingRefMatch ? bookingRefMatch[1] : null
          
          return {
            success: true,
            data: response.rawResponse,
            rawResponse: response.rawResponse,
            bookingId: realBookingId,
            bookingReference: realBookingRef
          }
        } else {
          console.log('❌ TOURPLAN BOOKING FAILED - Status:', status)
          
          // Extract error details if available
          const errorMatch = response.rawResponse.match(/<Error[^>]*>([^<]*)<\/Error>/)
          const errorText = errorMatch ? errorMatch[1] : `Booking failed with status: ${status}`
          
          return {
            success: false,
            error: errorText,
            rawResponse: response.rawResponse
          }
        }
      }
      
      // Fallback for other response types
      if (response.success) {
        console.log('✅ TOURPLAN RESPONSE SUCCESS (non-booking):', response)
        return response
      } else {
        console.log('❌ TOURPLAN RESPONSE FAILED:', response.error)
        return response
      }
    } catch (error) {
      console.error('❌ TOURPLAN BOOKING ERROR:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown booking error'
      }
    }
  }

  isConfigured(): boolean {
    return !!(this.config.apiUrl && this.config.username && this.config.password && this.config.agentId)
  }

  getConfig() {
    return {
      apiUrl: this.config.apiUrl,
      username: this.config.username,
      agentId: this.config.agentId,
      configured: this.isConfigured(),
      useProxy: this.config.useProxy,
      proxyUrl: this.config.proxyUrl,
    }
  }
}

export const tourplanAPI = new TourplanAPI()
