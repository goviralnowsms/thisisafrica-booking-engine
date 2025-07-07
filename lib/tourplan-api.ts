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
    const config = getTourplanConfig()
    const url = config.useProxy && config.proxyUrl ? config.proxyUrl : config.apiUrl

    // Simple connectivity test
    const response = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(10000),
    })

    return { success: response.ok }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export class TourplanAPI {
  private config: TourplanConfig

  constructor() {
    try {
      this.config = getTourplanConfig()
    } catch (error) {
      console.warn("Tourplan API not configured:", error)
      this.config = {
        apiUrl: "",
        username: "",
        password: "",
        agentId: "",
      }
    }
  }

  private createAuthXml(): string {
    return `
    <AgentID>${this.config.agentId}</AgentID>
    <Password>${this.config.password}</Password>`
  }

  private createTourplanUserXml(): string {
    return `
    <TourplanUser>
      <AgentID>${this.config.agentId}</AgentID>
      <Password>${this.config.password}</Password>
    </TourplanUser>`
  }

  private createSoapEnvelope(body: string): string {
    return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
              xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
              xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    ${body}
  </soap:Body>
</soap:Envelope>`
  }

  private async makeRequest(soapAction: string, body: string): Promise<TourplanResponse> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: "Tourplan API not configured",
      }
    }

    // Send plain XML instead of SOAP envelope
    const xmlBody = body
    const url = this.config.useProxy && this.config.proxyUrl ? this.config.proxyUrl : this.config.apiUrl

    if (!url) {
      return {
        success: false,
        error: "No API URL configured",
      }
    }

    console.log("Making Tourplan API request:", {
      url,
      action: soapAction,
      bodyLength: xmlBody.length,
      useProxy: this.config.useProxy,
    })

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          "User-Agent": "TourplanBookingEngine/1.0",
          Authorization: `Basic ${Buffer.from(`${this.config.username}:${this.config.password}`).toString("base64")}`,
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
      // Check for errors first
      const errorMatch = xmlString.match(/<Error[^>]*>(.*?)<\/Error>/s)
      if (errorMatch) {
        return {
          success: false,
          error: errorMatch[1],
          rawResponse: xmlString,
        }
      }

      // Return the full XML response since we're not using SOAP envelopes
      return {
        success: true,
        data: xmlString,
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

  async searchTours(params: TourplanSearchParams): Promise<TourplanResponse> {
    const searchBody = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  ${this.createTourplanUserXml()}
  <GetServicesRequest>
    <ServiceType>${params.serviceType || "Tour"}</ServiceType>
    <Destination>${params.destination || ""}</Destination>
    <Region>${params.region || ""}</Region>
    <StartDate>${params.startDate || ""}</StartDate>
    <EndDate>${params.endDate || ""}</EndDate>
    <Adults>${params.adults || 2}</Adults>
    <Children>${params.children || 0}</Children>
  </GetServicesRequest>
</Request>`

    return this.makeRequest("GetServices", searchBody)
  }

  async getTourDetails(tourId: string): Promise<TourplanResponse> {
    const detailsBody = `
    <GetTourDetails xmlns="http://tempuri.org/">
      ${this.createAuthXml()}
      <TourID>${tourId}</TourID>
    </GetTourDetails>`

    return this.makeRequest("http://tempuri.org/GetTourDetails", detailsBody)
  }

  async getOptionInfo(optionId: string): Promise<TourplanResponse> {
    const optionBody = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  ${this.createTourplanUserXml()}
  <OptionInfoRequest>
    <OptionID>${optionId}</OptionID>
  </OptionInfoRequest>
</Request>`

    return this.makeRequest("OptionInfo", optionBody)
  }

  async checkAvailability(tourId: string, date: string, adults: number, children: number): Promise<TourplanResponse> {
    const availabilityBody = `
    <CheckAvailability xmlns="http://tempuri.org/">
      ${this.createAuthXml()}
      <TourID>${tourId}</TourID>
      <Date>${date}</Date>
      <Adults>${adults}</Adults>
      <Children>${children}</Children>
    </CheckAvailability>`

    return this.makeRequest("http://tempuri.org/CheckAvailability", availabilityBody)
  }

  async createBooking(params: TourplanBookingParams): Promise<TourplanResponse> {
    const bookingBody = `
    <CreateBooking xmlns="http://tempuri.org/">
      ${this.createAuthXml()}
      <BookingRequest>
        <TourID>${params.tourId}</TourID>
        <StartDate>${params.startDate}</StartDate>
        <EndDate>${params.endDate}</EndDate>
        <Adults>${params.adults}</Adults>
        <Children>${params.children}</Children>
        <Customer>
          <FirstName>${params.customerDetails.firstName}</FirstName>
          <LastName>${params.customerDetails.lastName}</LastName>
          <Email>${params.customerDetails.email}</Email>
          <Phone>${params.customerDetails.phone}</Phone>
        </Customer>
      </BookingRequest>
    </CreateBooking>`

    return this.makeRequest("http://tempuri.org/CreateBooking", bookingBody)
  }

  async testConnection(): Promise<TourplanResponse> {
    const testBody = `
    <TestConnection xmlns="http://tempuri.org/">
      ${this.createAuthXml()}
    </TestConnection>`

    return this.makeRequest("http://tempuri.org/TestConnection", testBody)
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
