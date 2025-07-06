import { parseStringPromise } from "xml2js"

export interface TourplanConfig {
  baseUrl: string
  username: string
  password: string
  agentId: string
}

export class TourplanAPIDebug {
  private config: TourplanConfig

  constructor(config: TourplanConfig) {
    this.config = config
  }

  // Test basic connectivity
  async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      console.log("Testing Tourplan API connection...")
      console.log("Base URL:", this.config.baseUrl)
      console.log("Username:", this.config.username ? "✓ Set" : "✗ Missing")
      console.log("Password:", this.config.password ? "✓ Set" : "✗ Missing")
      console.log("Agent ID:", this.config.agentId ? "✓ Set" : "✗ Missing")

      if (!this.config.baseUrl || !this.config.username || !this.config.password) {
        return {
          success: false,
          message: "Missing required Tourplan credentials",
          details: {
            hasBaseUrl: !!this.config.baseUrl,
            hasUsername: !!this.config.username,
            hasPassword: !!this.config.password,
            hasAgentId: !!this.config.agentId,
          },
        }
      }

      // Test with a simple SOAP request
      const testXML = this.buildTestXML()
      console.log("Test SOAP XML:", testXML)

      const response = await fetch(this.config.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          SOAPAction: "",
          "User-Agent": "TourplanBookingEngine/1.0",
        },
        body: testXML,
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      const responseText = await response.text()
      console.log("Response body:", responseText.substring(0, 500) + "...")

      if (!response.ok) {
        return {
          success: false,
          message: `HTTP error: ${response.status} ${response.statusText}`,
          details: {
            status: response.status,
            statusText: response.statusText,
            responseBody: responseText.substring(0, 1000),
          },
        }
      }

      // Try to parse the XML response
      try {
        const parsedResponse = await parseStringPromise(responseText)
        console.log("Parsed XML response:", JSON.stringify(parsedResponse, null, 2))

        return {
          success: true,
          message: "Successfully connected to Tourplan API",
          details: {
            responseLength: responseText.length,
            parsedResponse: parsedResponse,
          },
        }
      } catch (parseError) {
        return {
          success: false,
          message: "Connected but failed to parse XML response",
          details: {
            parseError: parseError instanceof Error ? parseError.message : "Unknown parse error",
            responseBody: responseText.substring(0, 1000),
          },
        }
      }
    } catch (error) {
      console.error("Connection test failed:", error)
      return {
        success: false,
        message: "Connection failed",
        details: {
          error: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
        },
      }
    }
  }

  private buildTestXML(): string {
    return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Header>
    <Authentication xmlns="http://tempuri.org/">
      <Username>${this.config.username}</Username>
      <Password>${this.config.password}</Password>
      <AgentId>${this.config.agentId}</AgentId>
    </Authentication>
  </soap:Header>
  <soap:Body>
    <GetVersion xmlns="http://tempuri.org/" />
  </soap:Body>
</soap:Envelope>`
  }

  // Test search functionality
  async testSearch(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      const searchXML = this.buildSearchXML({
        country: "South Africa",
        destination: "Cape Town",
      })

      console.log("Search SOAP XML:", searchXML)

      const response = await fetch(this.config.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          SOAPAction: "http://tempuri.org/SearchTours",
        },
        body: searchXML,
      })

      const responseText = await response.text()
      console.log("Search response:", responseText.substring(0, 500) + "...")

      if (!response.ok) {
        return {
          success: false,
          message: `Search failed: ${response.status} ${response.statusText}`,
          details: { responseBody: responseText.substring(0, 1000) },
        }
      }

      const parsedResponse = await parseStringPromise(responseText)

      return {
        success: true,
        message: "Search test completed",
        details: { parsedResponse },
      }
    } catch (error) {
      return {
        success: false,
        message: "Search test failed",
        details: { error: error instanceof Error ? error.message : "Unknown error" },
      }
    }
  }

  private buildSearchXML(params: { country?: string; destination?: string }): string {
    return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Header>
    <Authentication xmlns="http://tempuri.org/">
      <Username>${this.config.username}</Username>
      <Password>${this.config.password}</Password>
      <AgentId>${this.config.agentId}</AgentId>
    </Authentication>
  </soap:Header>
  <soap:Body>
    <SearchTours xmlns="http://tempuri.org/">
      ${params.country ? `<Country>${params.country}</Country>` : ""}
      ${params.destination ? `<Destination>${params.destination}</Destination>` : ""}
      <IncludeCancellationDeadlines>true</IncludeCancellationDeadlines>
    </SearchTours>
  </soap:Body>
</soap:Envelope>`
  }
}
