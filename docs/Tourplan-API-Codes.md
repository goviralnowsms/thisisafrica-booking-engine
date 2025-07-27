Tourplan API Codes

## **1\. API Overview**

The Tourplan HostConnect API is an XML-based API with the following characteristics:

* **API Version**: 5.05.000 (as specified in your project)  
* **Single Endpoint**: All requests use the same URL with different XML request types  
* **Content-Type**: `text/xml; charset=utf-8`  
* **Authentication**: AgentID \+ Password required in every request  
* **DTD Reference**: `hostConnect_5_05_000.dtd`

## **2\. Core Request Structure**

All API requests follow this basic structure:

| \<?xml version="1.0"?\>\<\!DOCTYPE Request SYSTEM "hostConnect\_5\_05\_000.dtd"\>\<Request\>  \<RequestType\>    \<AgentID\>YOUR\_AGENT\_ID\</AgentID\>    \<Password\>YOUR\_PASSWORD\</Password\>    \<\!-- Request-specific parameters \--\>  \</RequestType\>\</Request\> |
| :---- |

## **3\. Key Endpoints for Booking Engine**

### **3.1 Connectivity Testing**

\<PingRequest\>\</PingRequest\>

Purpose: Simple connectivity test to verify API access

### **3.2 Authentication & Agent Info**

| \<AgentInfoRequest\>  \<AgentID\>YOUR\_AGENT\_ID\</AgentID\>  \<Password\>YOUR\_PASSWORD\</Password\>\</AgentInfoRequest\> |
| :---- |

Purpose: Verify credentials and get agent details

### **3.3 Search Products**

| \<OptionInfoRequest\>  \<AgentID\>YOUR\_AGENT\_ID\</AgentID\>  \<Password\>YOUR\_PASSWORD\</Password\>  \<ButtonName\>SEARCH\_TYPE\</ButtonName\>  \<DestinationName\>DESTINATION\</DestinationName\>  \<\!-- Other search parameters \--\>\</OptionInfoRequest\> |
| :---- |

Purpose: Search for available products

Key Parameters by Search Type:

| Search Type | ButtonName | Key Parameters | Notes |
| ----- | ----- | ----- | ----- |
| Day Tours | "Day Tours" | `<Info>D</Info>`, DateFrom, DateTo | Basic search with date range |
| Accommodation | "Accommodation" | `<Info>GS</Info>`, RoomConfigs | Room configurations required |
| Cruises | "Cruises" | DateFrom, RoomConfigs | Cabin configurations |
| Rail | "Rail" | Route parameters | Schedule-based search |
| Packages | "Packages" | `<Info>P</Info>` | Fixed-length, room-based |
| Special Offers | "Special Offers" | Date-sensitive parameters | For deals/promotions |

**3.4 Create Booking**

| \<AddServiceRequest\>  \<AgentID\>YOUR\_AGENT\_ID\</AgentID\>  \<Password\>YOUR\_PASSWORD\</Password\>  \<NewBookingInfo\>    \<n\>CUSTOMER\_NAME\</n\>    \<QB\>B\</QB\> \<\!-- B for booking, Q for quote \--\>  \</NewBookingInfo\>  \<Opt\>PRODUCT\_CODE\</Opt\>  \<RateId\>RATE\_ID\</RateId\>  \<DateFrom\>YYYY-MM-DD\</DateFrom\>  \<\!-- Additional booking details \--\>\</AddServiceRequest\> |
| :---- |

Purpose: Create a new booking or add to existing booking

### **3.5 Get Booking Details**

| \<GetBookingRequest\>  \<AgentID\>YOUR\_AGENT\_ID\</AgentID\>  \<Password\>YOUR\_PASSWORD\</Password\>  \<BookingId\>BOOKING\_ID\</BookingId\>\</GetBookingRequest\> |
| :---- |

Purpose: Retrieve complete booking information

### **3.6 Update Booking**

| \<UpdateBookingRequest\>  \<AgentID\>YOUR\_AGENT\_ID\</AgentID\>  \<Password\>YOUR\_PASSWORD\</Password\>  \<BookingId\>BOOKING\_ID\</BookingId\>  \<\!-- Fields to update \--\>  \<n\>UPDATED\_NAME\</n\>  \<Email\>customer@example.com\</Email\>  \<TourplanBookingStatus\>C\</TourplanBookingStatus\>\</UpdateBookingRequest\> |
| :---- |

Purpose: Modify booking details

### **3.7 Convert Quote to Booking**

| \<QuoteToBookRequest\>  \<AgentID\>YOUR\_AGENT\_ID\</AgentID\>  \<Password\>YOUR\_PASSWORD\</Password\>  \<BookingId\>BOOKING\_ID\</BookingId\>  \<SendSupplierMessage\>Y\</SendSupplierMessage\>\</QuoteToBookRequest\> |
| :---- |

Purpose: Convert a quote to a confirmed booking

### **3.8 Record Payment**

| \<RecordBookingPaymentRequest\>  \<AgentID\>YOUR\_AGENT\_ID\</AgentID\>  \<Password\>YOUR\_PASSWORD\</Password\>  \<BookingId\>BOOKING\_ID\</BookingId\>  \<\!-- Payment details \--\>\</RecordBookingPaymentRequest\> |
| :---- |

Purpose: Process payment information

### **3.9 Cancel Services**

| \<CancelServicesRequest\>  \<AgentID\>YOUR\_AGENT\_ID\</AgentID\>  \<Password\>YOUR\_PASSWORD\</Password\>  \<Ref\>BOOKING\_REFERENCE\</Ref\>\</CancelServicesRequest\> |
| :---- |

Purpose: Cancel an entire booking

## **4\. Common Parameters & Codes**

### **4.1 Room Types**

| Code | Description |
| ----- | ----- |
| SG | Single Room |
| DB | Double Room |
| TW | Twin Room |
| TR | Triple Room |
| QU | Quadruple Room |

### **4.2 Info Parameters**

| Code | Description |
| ----- | ----- |
| D | Day tour information |
| S | Stay price information |
| G | General pricing information |
| I | Availability information |
| R | Rate information |
| T | Ticket information |
| P | Package information |

### **4.3 Standard Error Codes**

| Code | Description |
| ----- | ----- |
| 1000 | General error |
| 1001 | Missing input |
| 1002 | Illegal input (e.g., invalid date) |
| 1003 | Communications error |
| 1050 | Booking not found |
| 1051 | Agent not found/wrong password |
| 1052 | Option not found |

## **5\. Implementing in a Frontend Application**

### **5.1 API Integration Pattern**

For a clean frontend codebase with no backend code:

1. Create a secure mechanism to store credentials (use environment variables)  
2. Implement XML builders for each request type  
3. Create a unified API client to handle all requests  
4. Implement response parsers to convert XML to JSON  
5. Build a caching layer for performance

### **5.2 File Structure (recommended)**

| /lib  /api    /tourplan      index.ts           \# Main API client      config.ts          \# Configuration      types.ts           \# TypeScript interfaces      xml-builder.ts     \# XML generation      xml-parser.ts      \# XML parsing      cache.ts           \# Caching layer  /hooks  useTourplanSearch.ts   \# Search-related hooks  useTourplanBooking.ts  \# Booking flow hooks  useProductDetails.ts   \# Product details hooks |
| :---- |

5.3 Example Implementation

| // lib/api/tourplan/index.tsexport class TourplanAPI {  private endpoint: string;  private agentID: string;  private password: string;    constructor() {    this.endpoint \= process.env.NEXT\_PUBLIC\_TOURPLAN\_ENDPOINT || '';    this.agentID \= process.env.NEXT\_PUBLIC\_TOURPLAN\_AGENT\_ID || '';    this.password \= process.env.NEXT\_PUBLIC\_TOURPLAN\_PASSWORD || '';  }    // Helper to build common XML request structure  private buildBaseRequest(requestType: string, content: string): string {    return \`\<?xml version="1.0"?\>      \<\!DOCTYPE Request SYSTEM "hostConnect\_5\_05\_000.dtd"\>      \<Request\>        \<${requestType}\>          \<AgentID\>${this.agentID}\</AgentID\>          \<Password\>${this.password}\</Password\>          ${content}        \</${requestType}\>      \</Request\>\`;  }    // Search for tours  async searchTours(destination: string, dateFrom: string, dateTo: string) {    const content \= \`      \<ButtonName\>Day Tours\</ButtonName\>      \<DestinationName\>${destination}\</DestinationName\>      \<Info\>D\</Info\>      \<DateFrom\>${dateFrom}\</DateFrom\>      \<DateTo\>${dateTo}\</DateTo\>    \`;        const xml \= this.buildBaseRequest('OptionInfoRequest', content);    return this.executeRequest(xml);  }    // Create a booking  async createBooking(customerName: string, productCode: string, dateFrom: string, isQuote \= false) {    const content \= \`      \<NewBookingInfo\>        \<n\>${customerName}\</n\>        \<QB\>${isQuote ? 'Q' : 'B'}\</QB\>      \</NewBookingInfo\>      \<Opt\>${productCode}\</Opt\>      \<DateFrom\>${dateFrom}\</DateFrom\>    \`;        const xml \= this.buildBaseRequest('AddServiceRequest', content);    return this.executeRequest(xml);  }    // Execute the API request  private async executeRequest(xml: string) {    try {      const response \= await fetch(this.endpoint, {        method: 'POST',        headers: {          'Content-Type': 'text/xml; charset=utf-8',        },        body: xml,      });            const xmlResponse \= await response.text();      return this.parseXMLResponse(xmlResponse);    } catch (error) {      console.error('Tourplan API error:', error);      throw error;    }  }    // Parse XML response to JSON  private parseXMLResponse(xml: string) {    // Implement XML parsing logic here    // You can use libraries like fast-xml-parser    return { success: true, data: {} };  }}// Create a singleton instanceexport const tourplanAPI \= new TourplanAPI(); |
| :---- |

5.4 Hook Example

| // hooks/useTourplanSearch.tsimport { useState } from 'react';import { tourplanAPI } from '../lib/api/tourplan';export function useTourplanSearch() {  const \[results, setResults\] \= useState(\[\]);  const \[loading, setLoading\] \= useState(false);  const \[error, setError\] \= useState(null);    const searchTours \= async (destination: string, dateFrom: string, dateTo: string) \=\> {    setLoading(true);    setError(null);        try {      const response \= await tourplanAPI.searchTours(destination, dateFrom, dateTo);      setResults(response.data || \[\]);      return response;    } catch (err) {      setError(err.message);      return { success: false, error: err.message };    } finally {      setLoading(false);    }  };    return { searchTours, results, loading, error };} |
| :---- |

## **6\. Important Considerations**

### **6.1 Security**

* **Never** store API credentials in client-side code directly  
* Use environment variables for sensitive information  
* Consider implementing a lightweight proxy API if needed

### **6.2 Error Handling**

* Implement proper error handling for all API calls  
* Map error codes to user-friendly messages  
* Add retry logic for network issues

### **6.3 Performance**

* Implement caching for search results and product details  
* Use SWR or React Query for data fetching with built-in caching  
* Consider lazy loading for large responses

### **6.4 Validation**

* Validate all inputs before sending to API  
* Handle date formats correctly (YYYY-MM-DD)  
* Implement proper form validation \</artifact\>

Some key points to note:

* Tourplan uses a single endpoint for all API requests, with different XML request types  
* All requests require authentication with AgentID and Password (and whitelisted IP)  
* Different search types (Day Tours, Accommodation, etc.) use the same endpoint but with different ButtonName values  
* The API follows a standard pattern for creating and managing bookings

