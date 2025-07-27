const https = require("https")
const http = require("http")
const { URL } = require("url")

class TourplanClient {
  constructor() {
    this.apiUrl = process.env.TOURPLAN_API_URL
    this.username = process.env.TOURPLAN_USERNAME
    this.password = process.env.TOURPLAN_PASSWORD
    this.agentId = process.env.TOURPLAN_AGENT_ID
    this.proxyUrl = process.env.TOURPLAN_PROXY_URL
    this.useProxy = process.env.USE_TOURPLAN_PROXY === "true"
    this.timeout = 30000 // 30 seconds

    if (!this.apiUrl || !this.username || !this.password || !this.agentId) {
      console.warn("Tourplan client not fully configured")
    }
  }

  isConfigured() {
    return !!(this.apiUrl && this.username && this.password && this.agentId)
  }

  createAuthXml() {
    return `
      <AgentID>${this.agentId}</AgentID>
      <Username>${this.username}</Username>
      <Password>${this.password}</Password>
    `
  }

  createSoapEnvelope(body) {
    return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
              xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
              xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    ${body}
  </soap:Body>
</soap:Envelope>`
  }

  async makeRequest(xmlBody, soapAction = "http://tempuri.org/Search") {
    if (!this.isConfigured()) {
      throw new Error("Tourplan client not properly configured")
    }

    const envelope = this.createSoapEnvelope(xmlBody)
    const targetUrl = this.useProxy && this.proxyUrl ? this.proxyUrl : this.apiUrl
    const url = new URL(targetUrl)

    console.log("Making direct request to Tourplan API:", {
      url: targetUrl,
      action: soapAction,
      useProxy: this.useProxy,
      bodyLength: envelope.length,
    })

    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === "https:" ? 443 : 80),
      path: url.pathname + (url.search || ""),
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        SOAPAction: soapAction,
        "Content-Length": Buffer.byteLength(envelope),
        "User-Agent": "TourplanBookingEngine/1.0",
        Accept: "text/xml, application/xml",
        Authorization: `Basic ${Buffer.from(`${this.username}:${this.password}`).toString("base64")}`,
      },
      timeout: this.timeout,
    }

    return new Promise((resolve, reject) => {
      const client = url.protocol === "https:" ? https : http

      const req = client.request(options, (res) => {
        let data = ""

        res.on("data", (chunk) => {
          data += chunk
        })

        res.on("end", () => {
          console.log("Tourplan response received:", {
            status: res.statusCode,
            contentLength: data.length,
            contentType: res.headers["content-type"],
          })

          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({
              success: true,
              status: res.statusCode,
              data: data,
              headers: res.headers,
            })
          } else {
            console.error("Tourplan API error response:", {
              status: res.statusCode,
              statusMessage: res.statusMessage,
              response: data.substring(0, 500),
            })
            reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage} - ${data.substring(0, 200)}`))
          }
        })
      })

      req.on("error", (error) => {
        console.error("Tourplan request error:", error)
        if (error.code === "ENOTFOUND") {
          reject(new Error("DNS resolution failed - check Tourplan API URL"))
        } else if (error.code === "ECONNREFUSED") {
          reject(new Error("Connection refused - Tourplan API may be down"))
        } else if (error.code === "ETIMEDOUT") {
          reject(new Error("Connection timeout - check network connectivity"))
        } else if (error.code === "ECONNRESET") {
          reject(new Error("Connection reset - network or server issue"))
        } else {
          reject(error)
        }
      })

      req.on("timeout", () => {
        req.destroy()
        reject(new Error(`Request timeout after ${this.timeout}ms`))
      })

      req.setTimeout(this.timeout)

      try {
        req.write(envelope)
        req.end()
      } catch (writeError) {
        console.error("Error writing request:", writeError)
        reject(writeError)
      }
    })
  }

  async searchTours(searchParams = {}) {
    const {
      destination = "",
      startDate = "",
      endDate = "",
      adults = 2,
      children = 0,
      serviceType = "Tour",
      region = "",
    } = searchParams

    const searchBody = `
    <Search xmlns="http://tempuri.org/">
      ${this.createAuthXml()}
      <SearchRequest>
        <ServiceType>${serviceType}</ServiceType>
        <Destination>${destination}</Destination>
        <Region>${region}</Region>
        <StartDate>${startDate}</StartDate>
        <EndDate>${endDate}</EndDate>
        <Adults>${adults}</Adults>
        <Children>${children}</Children>
      </SearchRequest>
    </Search>`

    return await this.makeRequest(searchBody, "http://tempuri.org/Search")
  }

  async getOptionInfo(optionId) {
    const optionBody = `
    <OptionInfo xmlns="http://tempuri.org/">
      ${this.createAuthXml()}
      <OptionID>${optionId}</OptionID>
    </OptionInfo>`

    return await this.makeRequest(optionBody, "http://tempuri.org/OptionInfo")
  }

  async getTourDetails(tourId) {
    const detailsBody = `
    <GetTourDetails xmlns="http://tempuri.org/">
      ${this.createAuthXml()}
      <TourID>${tourId}</TourID>
    </GetTourDetails>`

    return await this.makeRequest(detailsBody, "http://tempuri.org/GetTourDetails")
  }

  async checkAvailability(tourId, date, adults = 2, children = 0) {
    const availabilityBody = `
    <CheckAvailability xmlns="http://tempuri.org/">
      ${this.createAuthXml()}
      <TourID>${tourId}</TourID>
      <Date>${date}</Date>
      <Adults>${adults}</Adults>
      <Children>${children}</Children>
    </CheckAvailability>`

    return await this.makeRequest(availabilityBody, "http://tempuri.org/CheckAvailability")
  }

  async createBooking(bookingParams) {
    const { tourId, startDate, endDate, adults, children, customerDetails } = bookingParams

    const bookingBody = `
    <CreateBooking xmlns="http://tempuri.org/">
      ${this.createAuthXml()}
      <BookingRequest>
        <TourID>${tourId}</TourID>
        <StartDate>${startDate}</StartDate>
        <EndDate>${endDate}</EndDate>
        <Adults>${adults}</Adults>
        <Children>${children}</Children>
        <Customer>
          <FirstName>${customerDetails.firstName}</FirstName>
          <LastName>${customerDetails.lastName}</LastName>
          <Email>${customerDetails.email}</Email>
          <Phone>${customerDetails.phone}</Phone>
        </Customer>
      </BookingRequest>
    </CreateBooking>`

    return await this.makeRequest(bookingBody, "http://tempuri.org/CreateBooking")
  }

  async testConnection() {
    const testBody = `
    <TestConnection xmlns="http://tempuri.org/">
      ${this.createAuthXml()}
    </TestConnection>`

    return await this.makeRequest(testBody, "http://tempuri.org/TestConnection")
  }

  getConfiguration() {
    return {
      apiUrl: this.apiUrl,
      username: this.username,
      agentId: this.agentId,
      configured: this.isConfigured(),
      useProxy: this.useProxy,
      proxyUrl: this.proxyUrl,
    }
  }
}

module.exports = { TourplanClient }
