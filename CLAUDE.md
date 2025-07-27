# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**This is Africa** - Modern travel booking platform for African destinations
- **Current State**: Migrating from WordPress to Next.js with integrated TourPlan booking engine
- **Goal**: Unified platform on thisisafrica.com.au (no subdomain separation)
- **Status**: Booking engine previously built and tested - now rebuilding with cleaner architecture

## Tech Stack

- **Framework**: Next.js 15.2.4 with App Router
- **UI**: React 19 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Forms**: React Hook Form + Zod validation
- **API**: TourPlan HostConnect XML API v5.05.000
- **Hosting**: Vercel with FixieIP for static IP (required by TourPlan)

## Commands

```bash
# Install dependencies (using pnpm)
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

## Architecture & Directory Structure

```
app/
├── (website)/              # Public website pages
│   ├── page.tsx           # Homepage
│   ├── about/             # About pages
│   └── destinations/      # Destination content
├── (booking)/             # Booking engine pages
│   ├── search/           # Search forms for all product types
│   ├── results/          # Search results display
│   ├── product/[code]/   # Product details (/product/NBOGTARP001CKSE)
│   ├── checkout/         # Booking checkout flow
│   └── confirmation/     # Booking confirmation
├── api/
│   └── tourplan/         # TourPlan API route handlers
│       ├── search/       # Search endpoints
│       ├── booking/      # Booking operations
│       └── auth/         # Authentication
└── layout.tsx            # Root layout with providers

components/
├── ui/                   # shadcn/ui base components
├── website/              # Website-specific components
├── booking/              # Booking engine components
│   ├── search/          # Search form components
│   ├── results/         # Result card components
│   └── checkout/        # Checkout flow components
└── shared/              # Shared between website & booking

lib/
├── tourplan/
│   ├── client.ts        # TourPlan API client
│   ├── xml-builder.ts   # XML request builders
│   ├── xml-parser.ts    # XML response parsers
│   ├── types.ts         # TypeScript types
│   └── constants.ts     # API constants & codes
├── hooks/               # Custom React hooks
└── utils.ts            # Utility functions
```

## TourPlan API Integration

### WordPress Migration Context

**Key WordPress Functions to Replicate**:
- `tourplan_query()`: Core XML request function via cURL
- `WPXMLREQUEST()`: XML to JSON converter  
- `get_destination_ajax_handler()`: Gets localities/classes for destinations
- TourPlan PHP classes: TourplanProductsInCountry, TourplanOptionRequest, etc.

**Next.js Migration Pattern**:
- Replace cURL with fetch() in API routes
- Use fast-xml-parser for XML handling
- Create service functions for destinations, products, suppliers
- Build custom React hooks for UI integration

### API Configuration

**Endpoint**: Single XML endpoint for all operations
```
https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi
```

**Authentication**: Every request requires:
- AgentID: SAMAGT
- Password: S@MAgt01  
- IP Whitelisting (via FixieIP on Vercel)

### Core Request Structure

All requests follow this XML structure:
```xml
<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <RequestType>
    <AgentID>SAMAGT</AgentID>
    <Password>S@MAgt01</Password>
    <!-- Request-specific parameters -->
  </RequestType>
</Request>
```

### Key API Operations

#### 1. Search Products (OptionInfoRequest)

**Product Types & ButtonNames**:
- Day Tours: `ButtonName="Day Tours"` with `Info="D"`
- Group Tours: `ButtonName="Group Tours"` with `Info="GMFTD"`
- Accommodation: `ButtonName="Accommodation"` with `Info="GS"`
- Cruises: `ButtonName="Cruises"`
- Rail: `ButtonName="Rail"`
- Packages: `ButtonName="Packages"` with `Info="P"`
- Special Offers: `ButtonName="Special Offers"`

#### 2. Booking Operations

- **Create Booking**: `AddServiceRequest` with `QB="B"` (or "Q" for quote)
- **Get Booking**: `GetBookingRequest` with BookingId
- **Update Booking**: `UpdateBookingRequest`
- **Convert Quote**: `QuoteToBookRequest`
- **Record Payment**: `RecordBookingPaymentRequest`
- **Cancel Booking**: `CancelServicesRequest`

### Room/Cabin Codes

- SG: Single
- DB: Double  
- TW: Twin
- TR: Triple
- QU: Quadruple

### Error Codes

- 1000: General error (e.g., "Date is not in yyyy-MM-dd form")
- 1001: Missing input
- 1002: Illegal input
- 1050: Booking not found
- 1051: Agent auth failed
- 1052: Option not found

### API Response Structure

TourPlan returns XML responses with this structure:
```xml
<?xml version="1.0" encoding="utf-8"?>
<Reply>
  <OptionInfoReply>
    <Option>
      <Opt>NBOGTARP001CKSE</Opt>
      <OptGeneral>
        <SupplierName>Alpha Travel (UK) Ltd</SupplierName>
        <Description>Classic Kenya - Serena lodges</Description>
        <Comment>Departs Sundays</Comment>
        <Locality>NBO</Locality>
        <LocalityDescription>Nairobi JKI Airport</LocalityDescription>
        <!-- Rich product data including pricing, dates, descriptions -->
      </OptGeneral>
      <OptDateRanges>
        <OptDateRange>
          <DateFrom>2025-07-26</DateFrom>
          <Currency>AUD</Currency>
          <RateSets>
            <RateSet>
              <OptRate>
                <RoomRates>
                  <SingleRate>911569</SingleRate>
                  <DoubleRate>1497241</DoubleRate>
                  <TwinRate>1497241</TwinRate>
                </RoomRates>
              </OptRate>
            </RateSet>
          </RateSets>
        </OptDateRange>
      </OptDateRanges>
      <OptionNotes>
        <!-- Detailed inclusions, itinerary, terms -->
      </OptionNotes>
    </Option>
  </OptionInfoReply>
</Reply>
```

### Important API Notes

- **Date Format**: Must be YYYY-MM-DD (strictly enforced)
- **Empty vs Missing Fields**: Empty `<DateFrom></DateFrom>` causes errors - omit entirely if not needed
- **Product Search**: Use `<Opt>PRODUCTCODE</Opt>` to search for specific products
- **Rich Data**: API returns comprehensive product details, pricing, availability, inclusions
- **Currency**: Prices returned in cents/smallest currency unit (e.g., 911569 = AUD $9,115.69)

## Key TypeScript Interfaces

### Search Types

```typescript
export type SearchType = 'day-tours' | 'accommodation' | 'cruises' | 'rail' | 'packages' | 'special-offers';

export interface BaseSearchCriteria {
  country?: string;
  destination?: string;
  tourLevel?: 'basic' | 'standard' | 'luxury';
  startDate?: string;
  endDate?: string;
  adults?: number;
  children?: number;
}

export interface RoomConfiguration {
  adults: number;
  children?: number;
  infants?: number;
  roomType?: string;
}
```

### Product Models

```typescript
export interface Tour {
  id: string;
  code: string;
  name: string;
  description: string;
  destination: string;
  country: string;
  level: 'basic' | 'standard' | 'luxury';
  duration: number;
  price: number;
  currency: string;
  images: string[];
  extras: TourExtra[];
  inclusions?: string[];
  exclusions?: string[];
}

export interface TourExtra {
  id: string;
  name: string;
  description: string;
  price: number;
  isCompulsory: boolean;
}
```

### Booking Models

```typescript
export type BookingStatus = 'quote' | 'booked' | 'confirmed' | 'cancelled';

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface Booking {
  id: string;
  reference: string;
  status: BookingStatus;
  tour: Tour;
  customerDetails: CustomerDetails;
  totalPrice: number;
  currency: string;
}
```

## Search UX Pattern

**Progressive Disclosure Approach**:
1. **Initial Search**: Simple form (type, country, destination)
2. **Results Page**: Add filters (dates, travelers, price range, tour level)
3. **Booking**: Collect full passenger details

This reduces initial form complexity while providing powerful filtering when needed.

## Core Service Functions

Based on testing with live TourPlan API:

### Destination Service
```typescript
// Replaces get_destination_ajax_handler()
export async function getDestinations(country: string, productType: string) {
  // Uses GetServiceButtonDetailsRequest to get localities/classes
  return {
    reqType: string,
    countryName: string,
    LocalityDescription: string[],
    ClassDescription: string[],
    localityCount: number,
    classesCount: number
  }
}
```

### Product Search Service
```typescript
// Replaces TourplanProductSearchOptions class
export async function searchProducts(criteria: {
  productType: string;
  destination?: string;
  dateFrom?: string; // Must be YYYY-MM-DD
  dateTo?: string;
  adults?: number;
  children?: number;
  roomConfigs?: RoomConfig[];
}) {
  // Returns structured product data with pricing
  return {
    products: Array<{
      id: string;
      code: string;
      name: string;
      description: string;
      supplier: string;
      duration: string;
      rates: Array<{
        currency: string;
        singleRate: number; // In cents
        doubleRate: number;
        twinRate: number;
      }>;
    }>;
    totalResults: number;
    searchCriteria: object;
  }
}
```

### Product Details Service
```typescript
// Replaces TourplanOptionRequest class - works with specific product codes
export async function getProductDetails(productCode: string) {
  // Returns comprehensive product information including:
  // - Full itinerary and descriptions
  // - Pricing by room type and date ranges
  // - Inclusions/exclusions
  // - Supplier details
  // - Booking terms and conditions
}
```

### Booking Services
```typescript
// Create bookings that flow back to TourPlan
export async function createBooking(bookingData: {
  customerName: string;
  productCode: string;
  rateId: string;
  dateFrom: string;
  isQuote?: boolean; // QB="Q" vs QB="B"
  email?: string;
  mobile?: string;
}) {
  // Returns booking confirmation with TourPlan booking ID
}
```

## Environment Variables

```env
# TourPlan API
TOURPLAN_API_URL=https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi
TOURPLAN_AGENT_ID=SAMAGT
TOURPLAN_PASSWORD=S@MAgt01

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Database (Supabase)
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Optional: Payments (Stripe)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Optional: Email (Resend)
RESEND_API_KEY=
EMAIL_FROM=noreply@thisisafrica.com.au
```

## Implementation Guidelines

### 1. API Client Pattern

```typescript
// lib/tourplan/client.ts
export class TourPlanClient {
  // Singleton instance
  // XML building/parsing
  // Error handling with retries
  // Response caching (5-10 min)
}
```

### 2. Search Implementation

Each product type needs:
- Dedicated search form component
- Type-specific validation
- Results display component
- Filter/sort functionality

### 3. Booking Flow

1. Search → Results → Product Details → Availability Check
2. Passenger Details → Review → Payment → Confirmation
3. Quote option available (QB="Q" vs QB="B")

### 4. State Management

Use React Context + Custom Hooks:
- Search state (filters, results)
- Booking state (selections, passengers)
- UI state (loading, errors)

### 5. Error Handling

- XML parse errors
- API timeout/retry logic
- User-friendly error messages
- Fallback to cached data

## Code Quality Standards

### Components

- TypeScript for all components
- Proper error boundaries
- Loading states
- Mobile-first responsive
- Accessibility (ARIA labels)

### API Integration

- Never expose credentials client-side
- Use API routes for all TourPlan calls
- Implement request queuing
- Add comprehensive logging

### Performance

- Implement search result caching
- Lazy load heavy components
- Optimize images
- Use React.memo where appropriate

## Testing Approach

When implemented:
- Unit tests for XML builders/parsers
- Integration tests for API routes
- E2E tests for booking flow
- Component tests for forms

## Deployment Notes

- Vercel deployment requires FixieIP setup
- Environment variables in Vercel dashboard
- Monitor API rate limits
- Set up error tracking (Sentry)

## Quick Commands

### QNEW
Understand all guidelines in CLAUDE.md before coding

### QPLAN  
Analyze existing patterns before implementing

### QCODE
Implement following established patterns

### QCHECK
Review code quality against guidelines

### QGIT
Commit with conventional commits format