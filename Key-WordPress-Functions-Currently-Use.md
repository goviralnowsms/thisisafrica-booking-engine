## **Key WordPress Functions Currently in Use**

Looking at your WordPress implementation, here are the key functions that interact with the Tourplan API:

### **1\. Core API Functions**

| // Main function to execute Tourplan API requestsfunction tourplan\_query($input\_xml) {    // Initializes cURL request    // Sets content type to XML    // Sends POST request to Tourplan API    // Returns SimpleXMLElement object}// Helper function that converts SimpleXMLElement to JSONfunction WPXMLREQUEST($input\_xml) {    return json\_decode(json\_encode(tourplan\_query($input\_xml)), true);} |
| :---- |

2\. AJAX Handlers

| // Retrieves destination information from Tourplanfunction get\_destination\_ajax\_handler() {    // Gets country data via AJAX    // Uses TourplanProductSearchOptions class    // Returns localities and classes}// Loads product images from Tourplanfunction load\_product\_image\_ajax\_handler() {    // Gets product image via AJAX    // Uses TourplanOptionRequest class}// Loads supplier images from Tourplanfunction load\_supplier\_image\_ajax\_handler() {    // Gets supplier image via AJAX    // Uses TourplanSupplierRequest class} |
| :---- |

### **3\. Tourplan Classes (in tourplan-api-classes.php)**

These PHP classes handle different types of Tourplan API requests:

| // Core Tourplan classesclass TourplanProductsInCountry    // For country-based searchesclass TourplanOptionCode           // For product code searchesclass TourplanSupplierCode         // For supplier code searchesclass TourplanSupplierID           // For supplier ID searchesclass TourplanRequest              // Base request classclass TourplanProductSearchOptions // For search optionsclass TourplanProductRequest       // For product-specific requestsclass TourplanOptionRequest        // For tour/product optionsclass TourplanSupplierRequest      // For supplier informationclass TourplanProduct              // Base product classclass TourplanOptionProduct        // For option productsclass TourplanSupplierProduct      // For supplier products |
| :---- |

## **Next.js Implementation Approach**

For your new Next.js implementation, you'll need to replicate these WordPress functions as modern JavaScript/TypeScript services. Here's how to approach this:

### **1\. API Client**

Create a centralized API client that handles all Tourplan API requests:

| // lib/api/tourplan/index.tsexport class TourplanAPI {  private endpoint: string;  private agentID: string;  private password: string;    constructor() {    this.endpoint \= process.env.NEXT\_PUBLIC\_TOURPLAN\_ENDPOINT || '';    this.agentID \= process.env.NEXT\_PUBLIC\_TOURPLAN\_AGENT\_ID || '';    this.password \= process.env.NEXT\_PUBLIC\_TOURPLAN\_PASSWORD || '';  }    // Equivalent to tourplan\_query()  async executeRequest(xml: string): Promise\<any\> {    try {      const response \= await fetch(this.endpoint, {        method: 'POST',        headers: {          'Content-Type': 'text/xml; charset=utf-8'        },        body: xml      });            const xmlResponse \= await response.text();      return this.parseXMLResponse(xmlResponse);    } catch (error) {      console.error('Tourplan API error:', error);      throw error;    }  }    // XML to JSON parser  private parseXMLResponse(xml: string): any {    // Use a library like fast-xml-parser    // This replaces the WPXMLREQUEST function  }} |
| :---- |

### **2\. Request Builders**

Create classes for building different types of XML requests:

| // lib/api/tourplan/request-builders.tsexport class OptionInfoRequestBuilder {  private agentID: string;  private password: string;  private params: Record\<string, any\> \= {};    constructor(agentID: string, password: string) {    this.agentID \= agentID;    this.password \= password;  }    setButtonName(name: string): this {    this.params.buttonName \= name;    return this;  }    setDestination(destination: string): this {    this.params.destinationName \= destination;    return this;  }    setInfo(info: string): this {    this.params.info \= info;    return this;  }    setDateRange(from: string, to: string): this {    this.params.dateFrom \= from;    this.params.dateTo \= to;    return this;  }    build(): string {    return \`\<?xml version="1.0"?\>      \<\!DOCTYPE Request SYSTEM "hostConnect\_5\_05\_000.dtd"\>      \<Request\>        \<OptionInfoRequest\>          \<AgentID\>${this.agentID}\</AgentID\>          \<Password\>${this.password}\</Password\>          ${this.params.buttonName ? \`\<ButtonName\>${this.params.buttonName}\</ButtonName\>\` : ''}          ${this.params.destinationName ? \`\<DestinationName\>${this.params.destinationName}\</DestinationName\>\` : ''}          ${this.params.info ? \`\<Info\>${this.params.info}\</Info\>\` : ''}          ${this.params.dateFrom ? \`\<DateFrom\>${this.params.dateFrom}\</DateFrom\>\` : ''}          ${this.params.dateTo ? \`\<DateTo\>${this.params.dateTo}\</DateTo\>\` : ''}        \</OptionInfoRequest\>      \</Request\>\`;  }} |
| :---- |

### **3\. API Services**

Create service modules for different types of API operations:

| // lib/api/tourplan/services/search-service.tsimport { tourplanAPI } from '../index';import { OptionInfoRequestBuilder } from '../request-builders';export async function getDestinations(country: string, buttonName: string \= 'Day Tours') {  // This replaces get\_destination\_ajax\_handler  const builder \= new OptionInfoRequestBuilder(    tourplanAPI.agentID,    tourplanAPI.password  )    .setButtonName(buttonName)    .setDestination(country);      const response \= await tourplanAPI.executeRequest(builder.build());    return {    localities: extractLocalities(response),    classes: extractClasses(response)  };}function extractLocalities(response: any) {  // Parse the localities from the response  // Similar to what TourplanProductSearchOptions.getLocalities() does}function extractClasses(response: any) {  // Parse the classes from the response  // Similar to what TourplanProductSearchOptions.getClasses() does} |
| :---- |

### **4\. React Hooks for API Integration**

Create custom hooks for components to use the API services (suggestion):

| // hooks/useTourplanDestinations.tsimport { useState, useEffect } from 'react';import { getDestinations } from '../lib/api/tourplan/services/search-service';export function useTourplanDestinations(country: string, buttonName: string \= 'Day Tours') {  const \[localities, setLocalities\] \= useState\<string\[\]\>(\[\]);  const \[classes, setClasses\] \= useState\<string\[\]\>(\[\]);  const \[loading, setLoading\] \= useState\<boolean\>(false);  const \[error, setError\] \= useState\<string | null\>(null);    useEffect(() \=\> {    if (\!country) return;        setLoading(true);    setError(null);        getDestinations(country, buttonName)      .then(data \=\> {        setLocalities(data.localities);        setClasses(data.classes);      })      .catch(err \=\> {        setError(err.message);      })      .finally(() \=\> {        setLoading(false);      });  }, \[country, buttonName\]);    return { localities, classes, loading, error };} |
| :---- |

### **5\. API Routes for Server-Side Processing**

Since you're building a frontend-only codebase, you'll need API routes in Next.js to handle server-side processing:

| // app/api/tourplan/destinations/route.tsimport { NextRequest, NextResponse } from 'next/server';import { getDestinations } from '@/lib/api/tourplan/services/search-service';export async function POST(req: NextRequest) {  try {    const body \= await req.json();    const { country, buttonName } \= body;        if (\!country) {      return NextResponse.json({ error: 'Country is required' }, { status: 400 });    }        const data \= await getDestinations(country, buttonName || 'Day Tours');    return NextResponse.json(data);  } catch (error: any) {    return NextResponse.json({ error: error.message }, { status: 500 });  }} |
| :---- |

## **Important Implementation Notes**

1. **Security Considerations**:  
   * Store your Tourplan API credentials in environment variables  
   * Consider implementing a lightweight proxy API to hide credentials from the client  
2. **XML Processing**:  
   * Use a library like `fast-xml-parser` or `xml2js` for XML parsing  
   * Create robust XML builders for each request type  
3. **Error Handling**:  
   * Implement proper error handling for all API calls  
   * Map Tourplan error codes to user-friendly messages  
4. **Data Transformation**:  
   * Create utility functions to transform Tourplan XML responses into usable JSON  
5. **Caching Strategy**:  
   * Implement client-side caching using SWR or React Query  
   * Consider server-side caching for frequently accessed data

## **Example WordPress Function to Next.js Migration**

Here's a specific example of how to migrate the `get_destination_ajax_handler` WordPress function to Next.js:

### **WordPress Version:**

| Key-WordPress-Functions-Currently-Usefunction get\_destination\_ajax\_handler() {  $data \= $\_REQUEST\['data'\];  $query \= new TourplanProductSearchOptions($data\['reqType'\], $data\['countryName'\]);  $data\['localityCount'\] \= count($data\['LocalityDescription'\] \= $query\-\>getLocalities());  $data\['classesCount'\] \= count($data\['ClassDescription'\] \= $query\-\>getClasses());  echo json\_encode($data);  exit;}add\_action('wp\_ajax\_get\_destination', 'get\_destination\_ajax\_handler');add\_action('wp\_ajax\_nopriv\_get\_destination', 'get\_destination\_ajax\_handler'); |
| :---- |

[Next.js](http://Next.js) version

| // app/api/tourplan/destinations/route.tsimport { NextRequest, NextResponse } from 'next/server';import { tourplanAPI } from '@/lib/api/tourplan';import { OptionInfoRequestBuilder } from '@/lib/api/tourplan/request-builders';export async function POST(req: NextRequest) {  try {    const body \= await req.json();    const { reqType, countryName } \= body;        if (\!countryName) {      return NextResponse.json({ error: 'Country name is required' }, { status: 400 });    }        const builder \= new OptionInfoRequestBuilder(      process.env.TOURPLAN\_AGENT\_ID || '',      process.env.TOURPLAN\_PASSWORD || ''    )      .setButtonName(reqType || 'Day Tours')      .setDestination(countryName);        const response \= await tourplanAPI.executeRequest(builder.build());        // Extract localities and classes    const localities \= extractLocalities(response);    const classes \= extractClasses(response);        return NextResponse.json({      reqType,      countryName,      LocalityDescription: localities,      ClassDescription: classes,      localityCount: localities.length,      classesCount: classes.length    });  } catch (error: any) {    return NextResponse.json({ error: error.message }, { status: 500 });  }}function extractLocalities(response: any): string\[\] {  // Logic to extract localities from XML response  try {    const localities \= response?.GetServiceButtonDetailsReply?.LocalityDescriptions?.LocalityDescription || \[\];    return Array.isArray(localities) ? localities : \[localities\];  } catch (e) {    return \[\];  }}function extractClasses(response: any): string\[\] {  // Logic to extract classes from XML response  try {    const classes \= response?.GetServiceButtonDetailsReply?.ClassDescriptions?.ClassDescription || \[\];    return Array.isArray(classes) ? classes : \[classes\];  } catch (e) {    return \[\];  }} |
| :---- |

By following this approach, you'll be able to replicate the functionality of your WordPress Tourplan integration in your new Next.js frontend-only application. \</artifact\>

Based on the information I found in your project knowledge, I've created a comprehensive guide for migrating the WordPress Tourplan API integration to a Next.js frontend-only application. Here's a summary of what's covered:

## **Key Components in the Guide:**

1. **Core WordPress Functions**: I've identified the essential WordPress functions that interact with the Tourplan API, including:  
   * `tourplan_query()` \- The main function for making API requests  
   * `WPXMLREQUEST()` \- Helper for converting XML to JSON  
   * AJAX handlers for destinations and images  
   * Tourplan class structure  
2. **Next.js Implementation Strategy**: The guide provides a clear approach for implementing these functions in a modern Next.js context:  
   * Creating a central API client  
   * Building request builders for XML generation  
   * Developing service modules for different API operations  
   * Using React hooks for component integration  
   * Setting up API routes for server-side processing  
3. **Practical Example**: The guide includes a specific example of migrating the `get_destination_ajax_handler` WordPress function to Next.js.  
4. **Implementation Notes**: Important considerations for security, XML processing, error handling, data transformation, and caching.

### **Key UI Components**

Based on the component examples in the project knowledge, here are the core UI components needed:

| /components  /ui               \# Base UI components (from shadcn/ui)    button.tsx    card.tsx    form.tsx    input.tsx    select.tsx    badge.tsx    skeleton.tsx    ...    /forms            \# Form components for different search types    search-form.tsx    universal-search-form.tsx    booking-form.tsx    payment-form.tsx    /layout           \# Layout components    header.tsx    footer.tsx    navigation.tsx    /product          \# Product display components    tour-results.tsx    product\-card.tsx    product\-gallery.tsx    product\-details.tsx    /booking          \# Booking flow components    booking-confirmation.tsx    booking-summary.tsx    passenger-details.tsx    voucher-display.tsx |
| :---- |

2.3 Page Structure

| /app  /page.tsx                      \# Home page with main search form  /layout.tsx                    \# Root layout  /productdetails/page.tsx       \# Product details page  /booking/page.tsx              \# Booking form page  /booking/confirmation/page.tsx \# Booking confirmation page  /quote/page.tsx                \# Quote page    /api                           \# API routes    /tourplan/\[...routes\]        \# Tourplan API endpoints    /tours/\[...routes\]           \# Tour-specific endpoints |
| :---- |

The booking engine follows this user journey:

1. **Home Page** → User enters search criteria  
2. **Search Results Page** → User browses available tours/products  
3. **Product Details Page** → User views detailed information  
4. **Booking Form Page** → User enters booking details  
5. **Payment Page** → User completes payment  
6. **Confirmation Page** → User receives booking confirmation

## **4\. Interface Design Patterns**

### **4.1 Search Forms**

Implement a universal search form component that adapts based on search type:

* **Day Tours**: Simple form with destination, date range  
* **Accommodation**: Room configurations, dates, adults/children  
* **Cruises**: Cabin configurations, departure dates  
* **Rail**: Route selection, class options

Example approach for the universal form:

| function UniversalSearchForm({ type }: { type: SearchType }) {  // Common fields for all search types  const \[destination, setDestination\] \= useState("");    // Render different field sets based on type  const renderTypeSpecificFields \= () \=\> {    switch(type) {      case "day-tours":        return \<DayTourFields /\>;      case "accommodation":        return \<AccommodationFields /\>;      case "cruises":        return \<CruiseFields /\>;      // ...other types    }  };    return (    \<form\>      {/\* Common fields \*/}      \<DestinationField value={destination} onChange={setDestination} /\>            {/\* Type-specific fields \*/}      {renderTypeSpecificFields()}            \<SubmitButton /\>    \</form\>  );} |
| :---- |

### **4.2 Results Display**

Use a card-based layout for search results with:

* Featured image  
* Title and brief description  
* Price  
* Rating/reviews  
* Quick view option  
* Filtering and sorting controls

### **4.3 Booking Flow**

Implement a multi-step form for the booking process:

1. **Passenger Details**: Name, contact info  
2. **Options & Extras**: Additional services  
3. **Payment**: Payment method and details  
4. **Review & Confirm**: Final confirmation

Use a progress indicator to show current step in the process.

## **5\. Data Flow Architecture**

### **5.1 Client-Side Flow**

| UI Component → React Hook → API Service → API Client → Tourplan API     ↑                                                        ↓     └────────────────── Response Transformation ─────────────┘ |
| :---- |

5.2 Server-Side Flow (API Routes)

| API Route → Request Validation → XML Builder → Tourplan API → XML Parser → Response |
| :---- |

## **6\. Example Interface Mockups**

Based on the component examples found in the project knowledge, the interfaces should follow these patterns:

### **6.1 Search Form**

### **\`\`\`**

### **\#\#\# 6.1 Search Form**

### 

### **\`\`\`**

### **┌─────────────────────────────────────────────────────┐**

### **│ Search African Experiences                          │**

### **├─────────────────────────────────────────────────────┤**

### **│ ┌─────────┐ ┌─────────────┐ ┌──────────────────┐   │**

### **│ │ Type ▼  │ │ Country ▼   │ │ Destination ▼    │   │**

### **│ └─────────┘ └─────────────┘ └──────────────────┘   │**

### **│                                                     │**

### **│ ┌──────────────────────────────────────────────┐   │**

### **│ │                     Search                    │   │**

### **│ └──────────────────────────────────────────────┘   │**

### **└─────────────────────────────────────────────────────┘**

### **\`\`\`**

### 

### **Additional details like dates, adults, children, etc. will be collected during the booking process or offered as filters on the results page.**

### 

### Additional details like dates, adults, children, etc. will be collected during the booking process or offered as filters on the results page.

6.2 Results Page

| // Common Search Criteriaexport interface BaseSearchCriteria {  country?: string;  destination?: string;  tourLevel?: 'basic' | 'standard' | 'luxury';}// Search Results Filtersexport interface SearchFilters {  startDate?: string;  endDate?: string;  adults?: number;  children?: number;  childrenAges?: ChildInfo\[\];  priceRange?: \[number, number\];  duration?: 'short' | 'medium' | 'long'; // or number range  amenities?: string\[\];  tourLevel?: 'basic' | 'standard' | 'luxury';} |
| :---- |

┌─────────────────────────────────────────────────────┐  
│ ← Back to Search  |  15 Tours Found                 │  
├─────────────────────────────────────────────────────┤  
│ ┌─────────────────────────────────────────────────┐ │  
│ │ \[Image\]                                         │ │  
│ │                                                 │ │  
│ │ Serengeti Safari Experience                     │ │  
│ │ ★★★★☆ 4.7 (28 reviews)                         │ │  
│ │                                                 │ │  
│ │ 5-day safari through Tanzania's most iconic...  │ │  
│ │                                                 │ │  
│ │ From $1,299 per person                          │ │  
│ │                                                 │ │  
│ │ \[View Details\]                                  │ │  
│ └─────────────────────────────────────────────────┘ │  
│                                                     │  
│ ┌─────────────────────────────────────────────────┐ │  
│ │ \[Image\]                                         │ │  
│ ...                                                 │  
└─────────────────────────────────────────────────────┘

6.3 Booking Form

┌─────────────────────────────────────────────────────┐  
│ ← Back to Details  |  Booking: Serengeti Safari     │  
├─────────────────────────────────────────────────────┤  
│ ┌───────────────────────┐ ┌─────────────────────┐   │  
│ │ Passenger Details     │ │ Booking Summary     │   │  
│ │                       │ │                     │   │  
│ │ First Name: \[       \] │ │ Serengeti Safari    │   │  
│ │ Last Name:  \[       \] │ │ 5 days, 4 nights    │   │  
│ │ Email:      \[       \] │ │                     │   │  
│ │ Phone:      \[       \] │ │ 2 Adults            │   │  
│ │                       │ │ $1,299 × 2          │   │  
│ │ Optional Extras:      │ │                     │   │  
│ │ ☑ Airport Transfer    │ │ Extras:             │   │  
│ │ ☐ Premium Package     │ │ Airport Transfer    │   │  
│ │ ☐ Photo Package       │ │ $99                 │   │  
│ │                       │ │                     │   │  
│ │                       │ │ Total: $2,697       │   │  
│ │ \[Continue to Payment\] │ │                     │   │  
│ └───────────────────────┘ └─────────────────────┘   │  
└─────────────────────────────────────────────────────┘

## **7\. Implementation Approach**

### **7.1 Phased Development**

As outlined in the Implementation Roadmap document, use a phased approach:

1. Core search foundation  
2. Individual search types  
3. Integration and polish

### **7.2 Component-First Development**

1. Build and test individual UI components  
2. Implement API integration  
3. Connect components to create complete pages  
4. Test full user flows

## **8\. API Integration Strategy**

### **8.1 XML Request Building**

Create a robust XML builder system:

| // Example request builder patternconst builder \= new OptionInfoRequestBuilder()  .setButtonName("Day Tours")  .setDestination("Serengeti")  .setDateRange("2025-07-15", "2025-07-22")  .setInfo("D");const xmlRequest \= builder.build(); |
| :---- |

### 8.2 Response Parsing

## Implement consistent response parsing:

| function parseTourplanResponse(xmlResponse: string) {  // Parse XML to JavaScript object  const parsed \= parseXML(xmlResponse);    // Extract relevant data  const options \= parsed.OptionInfoReply?.Option || \[\];    // Transform to application model  return Array.isArray(options)     ? options.map(mapOptionToTour)     : \[mapOptionToTour(options)\];} |
| :---- |

## 9\. Recommended Starting Points

## Based on the project knowledge and your migration goals, here are the recommended first steps:

1. ## Set up the Next.js project with the proper file structure

2. ## Create core UI components based on shadcn/ui

3. ## Implement the basic API client for Tourplan

4. ## Build the universal search form component

5. ## Create the search results display

6. ## Implement the product details page

7. ## Build the booking flow forms

## This approach will give Claude a clear understanding of the frontend architecture needed to implement the Tourplan API booking engine.

## 

## **1\. Simplified Initial Search Form**

The initial search form has been streamlined to include only:

* **Type** dropdown (Day Tours, Accommodation, etc.)  
* **Country** dropdown  
* **Destination** dropdown  
* **Search** button

This keeps the entry point simple and reduces friction for users starting their search.

## **2\. Enhanced Results Page with Filters**

Instead of collecting all details upfront, the more specific search parameters have been moved to the results page as filters:

* **Date Range**: Calendar selection for travel dates  
* **Travelers**: Adults and children counts  
* **Tour Level**: Basic, Standard, Luxury options  
* **Duration**: Options for different trip lengths  
* **Price Range**: Min/max price filtering  
* **Amenities**: Specific features to filter by

## **3\. Updated TypeScript Interfaces**

I've updated the interfaces to reflect this approach:

* Split the search criteria into basic initial search and more detailed filters  
* Added a `SearchFilters` interface for the refinement options  
* Enhanced the `SearchResultsResponse` interface to include more filter options

## **4\. Progressive Disclosure Pattern**

This approach follows a progressive disclosure pattern that makes sense for travel booking:

1. Start simple (just type, country, destination)  
2. Show results with filter options based on what's available  
3. Collect full details only during the actual booking process

This creates a more user-friendly flow that doesn't overwhelm users with too many options at the beginning, while still providing powerful filtering capabilities when needed.

1\. Search Types and Parameters

| // Search Typesexport type SearchType \= 'day-tours' | 'accommodation' | 'cruises' | 'rail' | 'packages' | 'special-offers';// Common Search Criteriaexport interface BaseSearchCriteria {  country?: string;  destination?: string;  tourLevel?: 'basic' | 'standard' | 'luxury';  startDate?: string;  endDate?: string;  adults?: number;  children?: number;  childrenAges?: ChildInfo\[\];}export interface ChildInfo {  id: string;  age: number;}// Day Tours Searchexport interface DayToursSearchCriteria extends BaseSearchCriteria {  type: 'day-tours';  // Any day-tour specific parameters}// Accommodation Searchexport interface AccommodationSearchCriteria extends BaseSearchCriteria {  type: 'accommodation';  roomType?: string;  roomConfigurations?: RoomConfiguration\[\];}export interface RoomConfiguration {  adults: number;  children?: number;  infants?: number;  roomType?: string;}// Combined Search Criteria Typeexport type SearchCriteria \=   | (BaseSearchCriteria & { type?: SearchType })  | DayToursSearchCriteria  | AccommodationSearchCriteria  // Add other search types as needed |
| :---- |

2\. Tour and Product Models

| // Base Tour Modelexport interface Tour {  id: string;  code: string;  name: string;  description: string;  destination: string;  country: string;  level: 'basic' | 'standard' | 'luxury';  duration: number; // in days  price: number;  currency: string;  images: string\[\];  rating?: number;  reviewCount?: number;  availableDates?: string\[\];  extras: TourExtra\[\];  amenities?: string\[\];  highlights?: string\[\];  inclusions?: string\[\];  exclusions?: string\[\];}export interface TourExtra {  id: string;  name: string;  description: string;  price: number;  isCompulsory: boolean;}// Accommodation specificexport interface Accommodation extends Tour {  roomTypes: RoomType\[\];  checkInTime?: string;  checkOutTime?: string;  location?: {    latitude: number;    longitude: number;    address: string;  };}export interface RoomType {  code: string;  name: string;  description: string;  maxAdults: number;  maxChildren: number;  price: number;  amenities?: string\[\];  images?: string\[\];} |
| :---- |

3\. Booking Models

| // Booking Statusexport type BookingStatus \= 'quote' | 'booked' | 'confirmed' | 'cancelled' | 'completed';// Booking Dataexport interface BookingData {  tour: Tour;  selectedExtras: string\[\];  customerDetails: CustomerDetails;  totalPrice: number;  depositAmount: number;  status?: BookingStatus;  paymentMethod?: string;}export interface CustomerDetails {  firstName: string;  lastName: string;  email: string;  phone: string;  address?: string;  country?: string;  specialRequests?: string;}// Complete Booking Referenceexport interface Booking {  id: string;  reference: string;  status: BookingStatus;  createdAt: string;  updatedAt: string;  tour: Tour;  extras: TourExtra\[\];  customerDetails: CustomerDetails;  travelerDetails: TravelerDetails\[\];  totalPrice: number;  depositAmount: number;  paidAmount: number;  balance: number;  currency: string;  paymentMethod: string;  voucherUrl?: string;}export interface TravelerDetails {  id: string;  title?: string;  firstName: string;  lastName: string;  dateOfBirth?: string;  passportNumber?: string;  passportExpiry?: string;  nationality?: string;  type: 'adult' | 'child' | 'infant';} |
| :---- |

4\. API Response Models

| // Base API Responseexport interface ApiResponse\<T\> {  success: boolean;  data?: T;  error?: string;  debug?: any;}// Search Results Responseexport interface SearchResultsResponse extends ApiResponse\<Tour\[\]\> {  totalResults: number;  pageSize: number;  currentPage: number;  totalPages: number;  filterOptions?: {    priceRange: \[number, number\];    durations: number\[\];    tourLevels: string\[\];    destinations: string\[\];  };}// Product Details Responseexport interface ProductDetailsResponse extends ApiResponse\<Tour\> {  availability?: {    dates: string\[\];    status: 'available' | 'limited' | 'sold-out';  };}// Booking Responseexport interface BookingResponse extends ApiResponse\<Booking\> {  confirmationNumber?: string;  paymentRequired?: boolean;  expiresAt?: string;} |
| :---- |

5\. Tourplan API Request Models

| // Core Requestexport interface TourplanRequestOptions {  agentID: string;  password: string;  requestType: string;  parameters: Record\<string, any\>;}// Option Info Requestexport interface OptionInfoRequestOptions {  buttonName: string;  destinationName?: string;  info?: string;  dateFrom?: string;  dateTo?: string;  rateConvert?: boolean;  roomConfigs?: RoomConfiguration\[\];}// Add Service Requestexport interface AddServiceRequestOptions {  optionCode: string;  dateFrom: string;  customerName: string;  isQuote: boolean;  email?: string;  phone?: string;  extras?: Array\<{    code: string;    quantity: number;  }\>;  travelerDetails?: TravelerDetails\[\];}// Get Booking Requestexport interface GetBookingRequestOptions {  bookingId?: number;  reference?: string;} |
| :---- |

