# Product Requirements Document: This Is Africa Booking Engine

## Executive Summary

The This Is Africa Booking Engine is a modern web application that integrates with Tourplan's XML API to provide real-time tour search, booking, and payment processing for African safari and adventure tours. The system replaces legacy WordPress-based booking functionality with a React/Next.js application that offers improved performance, user experience, and maintainability.

## Project Overview

### Vision
Create a seamless, user-friendly booking experience for customers searching and booking African tours, with real-time inventory from Tourplan and integrated payment processing.

### Goals
1. Enable customers to search tours across multiple categories without requiring destination knowledge
2. Display real-time pricing and availability from Tourplan inventory
3. Process secure payments via Stripe
4. Create bookings in Tourplan after payment confirmation
5. Provide a responsive, modern UI that works on all devices

### Success Metrics
- Search-to-booking conversion rate > 5%
- Page load time < 3 seconds
- Zero payment processing errors
- 99.9% uptime for booking functionality

## Technical Architecture

### Technology Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **API Integration**: Tourplan XML API (XML over HTTP/HTTPS)
- **Payment Processing**: Stripe
- **Deployment**: Vercel
- **Database**: Supabase/Neon (optional for booking records)
- **Email**: Resend API (optional for confirmations)

### Key Components

#### 1. TourplanClient Class
A comprehensive client for handling Tourplan API communications with:
- XML request building
- Response parsing with error handling
- Retry logic for failed requests
- Price extraction from multiple XML locations
- WordPress-compatible pricing calculations

#### 2. Search Interface
- Multiple tour type selection (Group Tours, Day Tours, Rail, Cruise, Special Deals, Packages)
- Optional destination search (browse all or filter by location)
- Real-time search with loading states
- Responsive grid layout for results

#### 3. Booking Flow
- Tour selection from search results
- Customer information collection
- Payment processing via Stripe
- Booking creation in Tourplan post-payment
- Confirmation display

## Tourplan API Integration

### Authentication
```xml
<AgentID>SAMAGT</AgentID>
<Password>S@MAgt01</Password>
```

### Base Configuration
- **Endpoint**: `https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi`
- **Protocol**: XML over HTTPS (REST-style, not SOAP)
- **Content-Type**: `text/xml; charset=utf-8`
- **DTD**: hostConnect_5_05_000.dtd
- **Timeout**: 15 seconds per request
- **Retry**: 3 attempts with exponential backoff

### API Implementation Notes
- The Tourplan API uses plain XML over HTTP/HTTPS, NOT SOAP
- All requests are POST requests to the same endpoint
- Request type is determined by the XML root element (e.g., `<OptionInfoRequest>`, `<AddServiceRequest>`)
- Responses are XML documents that need to be parsed client-side
- No WSDL or SOAP envelopes are used

### Required API Endpoints

#### 1. OptionInfoRequest - Tour Search
**Purpose**: Search for available tours by destination and category

**Request Format**:
```xml
<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>AGENT_ID</AgentID>
    <Password>PASSWORD</Password>
    <ButtonName>{tourType}</ButtonName>
    <DestinationName>{destination}</DestinationName> <!-- Optional -->
    <Info>{infoCode}</Info>
    <DateFrom>{YYYY-MM-DD}</DateFrom>
    <DateTo>{YYYY-MM-DD}</DateTo>
  </OptionInfoRequest>
</Request>
```

**Button Names and Info Codes**:
- Group Tours: ButtonName="Group Tours", Info="GMFTD"
- Day Tours: ButtonName="Day tours", Info="D"
- Rail: ButtonName="Rail", Info="G"
- Cruise: ButtonName="Cruise", Info="CR"
- Special Deals: ButtonName="Special Deals", Info="SO"
- Packages: ButtonName="Packages", Info="P"

**Response Elements**:
- `<Option>` - Tour container
- `<Opt>` - Tour code
- `<Description>` - Tour name
- `<SupplierName>` - Supplier name
- `<OptGeneral>` - General information
  - `<Periods>` - Number of nights
  - `<ClassDescription>` - Tour class/category
  - `<Comment>` - Detailed description
- `<OptDateRanges>` - Pricing information
  - `<RoomRates>` - Accommodation-based pricing
    - `<TwinRate>` - Twin/double room rate
    - `<SingleRate>` - Single room rate
    - `<TripleRate>` - Triple room rate
  - `<PersonRates>` - Individual person pricing (for tours/activities)
    - `<AdultRate>` - Adult price
    - `<ChildRate>` - Child price
    - `<InfantRate>` - Infant price
- `<OptDetailedAvails>` - Availability status

#### 2. GetServiceButtonDetails - Get Available Tour Categories
**Purpose**: Retrieve all available tour categories and buttons

**Request Format**:
```xml
<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <GetServiceButtonDetailsRequest>
    <AgentID>AGENT_ID</AgentID>
    <Password>PASSWORD</Password>
  </GetServiceButtonDetailsRequest>
</Request>
```

**Response**: List of available service buttons with names and codes

#### 3. GetSystemSettings - Get Countries and Destinations
**Purpose**: Retrieve list of available countries and destinations

**Request Format**:
```xml
<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <GetSystemSettingsRequest>
    <AgentID>AGENT_ID</AgentID>
    <Password>PASSWORD</Password>
  </GetSystemSettingsRequest>
</Request>
```

**Response Elements**:
- `<Country>` - Country container
  - `<CountryName>` - Country name
  - `<DestinationName>` - Destination within country

#### 4. OptionInfoRequest with OptionNumber - Get Tour Details
**Purpose**: Get detailed information for a specific tour

**Request Format**:
```xml
<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>AGENT_ID</AgentID>
    <Password>PASSWORD</Password>
    <OptionNumber>{tourCode}</OptionNumber>
    <Info>GMFTD</Info>
  </OptionInfoRequest>
</Request>
```

**Response**: Detailed tour information including full pricing, dates, inclusions

#### 5. AddServiceRequest - Create Booking
**Purpose**: Create a new booking after payment confirmation

**Request Format**:
```xml
<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <AddServiceRequest>
    <AgentID>AGENT_ID</AgentID>
    <Password>PASSWORD</Password>
    <NewBookingInfo>
      <Name>{customerName}</Name>
      <QB>{bookingReference}</QB>
      <Email>{customerEmail}</Email>
      <AgentRef>{internalReference}</AgentRef>
    </NewBookingInfo>
    <ServiceLineId>1</ServiceLineId>
    <OptionNumber>{tourCode}</OptionNumber>
    <DateFrom>{startDate}</DateFrom>
    <SCUqty>{numberOfRooms}</SCUqty>
    <RoomConfigs>
      <RoomConfig>
        <Adults>{adultsPerRoom}</Adults>
        <Children>{childrenPerRoom}</Children>
        <Infants>{infantsPerRoom}</Infants>
        <RoomType>{roomType}</RoomType>
      </RoomConfig>
    </RoomConfigs>
    <PaxConfigs>
      <!-- Adult passenger -->
      <PaxConfig>
        <PaxType>A</PaxType>
        <Title>{title}</Title>
        <Forename>{firstName}</Forename>
        <Surname>{lastName}</Surname>
        <DateOfBirth>{DOB}</DateOfBirth>
        <PaxSex>{M/F}</PaxSex>
      </PaxConfig>
      <!-- Child passenger (if applicable) -->
      <PaxConfig>
        <PaxType>C</PaxType>
        <Forename>{childFirstName}</Forename>
        <Surname>{childLastName}</Surname>
        <DateOfBirth>{childDOB}</DateOfBirth>
        <Age>{childAge}</Age>
        <PaxSex>{M/F}</PaxSex>
      </PaxConfig>
    </PaxConfigs>
  </AddServiceRequest>
</Request>
```

**Response**: Booking confirmation with SCN (Service Confirmation Number)

#### 6. GetBookingRequest - Retrieve Booking Details
**Purpose**: Get booking information using booking reference

**Request Format**:
```xml
<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <GetBookingRequest>
    <AgentID>AGENT_ID</AgentID>
    <Password>PASSWORD</Password>
    <BookingNumber>{SCN}</BookingNumber>
  </GetBookingRequest>
</Request>
```

## Pricing Logic

### WordPress-Compatible Pricing Formula
```javascript
// Raw price from Tourplan is in cents
// Display price calculation:
const displayPrice = Math.ceil(rawTwinRate / 200);
```

### Price Extraction Hierarchy
1. Check `<OptDateRanges>` for date-specific rates
2. For accommodation products:
   - Primary: `<RoomRates>/<TwinRate>` (twin/double room)
   - Also available: `<SingleRate>`, `<TripleRate>`
3. For activity/tour products:
   - Primary: `<PersonRates>/<AdultRate>` (adult pricing)
   - Also available: `<ChildRate>`, `<InfantRate>`
4. Use lowest available rate when multiple date ranges exist
5. Child pricing should be extracted and used in the booking form for accurate family pricing

## User Interface Requirements

### Search Page
- Tour type selector (6 buttons)
- Destination input (optional, with placeholder text)
- Search button (changes to "Browse All Tours" when no destination)
- Loading spinner during search
- Error messages for failed searches

### Results Display
- Grid layout (responsive: 1 col mobile, 2 col tablet, 3 col desktop)
- Tour cards showing:
  - Tour name and supplier
  - Duration (nights/days)
  - Price (formatted with currency)
  - Availability status
  - Class/category badge
  - "Book This Tour" button
- Results count in header
- Debug info in development (raw price, tour code)

### Booking Form
- Tour summary with selected tour details
- Passenger configuration:
  - Number of adults (with increment/decrement controls)
  - Number of children (with increment/decrement controls)
  - Child age selection (dropdown for each child, ages 0-17)
  - Room configuration based on passenger count
- Customer information fields:
  - Lead passenger details (name, email, phone)
  - Additional passenger details for each person
- Price calculation:
  - Dynamic pricing based on adult/child count
  - Child pricing applied based on age
  - Total price display
- Payment integration
- Confirmation page

## Error Handling

### API Errors
- Network timeouts: Retry 3 times with exponential backoff
- XML parsing errors: Log and show user-friendly message
- No results: Clear message with suggestions
- Authentication failures: Log and alert admin

### User Errors
- Invalid form input: Inline validation messages
- Payment failures: Clear error with retry option
- Booking failures: Store locally and retry

## Performance Requirements

### Response Times
- Search results: < 3 seconds
- Page navigation: < 1 second
- Payment processing: < 5 seconds

### Optimization
- Client-side caching of search results
- Debounced search input
- Lazy loading of images
- Code splitting by route

## Security Requirements

### API Security
- Never expose Tourplan credentials to client
- All API calls through server-side proxy
- Rate limiting on API endpoints
- Request validation and sanitization

### Payment Security
- PCI compliance via Stripe
- No card details stored
- SSL/TLS encryption
- Payment verification before booking

## Deployment Configuration

### Environment Variables
```env
# Tourplan API
TOURPLAN_API_URL=https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi
TOURPLAN_USERNAME=SAMAGT
TOURPLAN_PASSWORD=S@MAgt01
TOURPLAN_AGENT_ID=SAMAGT

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Stripe (Production)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Optional Services
RESEND_API_KEY=re_...
DATABASE_URL=postgresql://...
```

### Vercel Configuration
```json
{
  "functions": {
    "app/api/tourplan/route.ts": {
      "maxDuration": 30
    }
  },
  "regions": ["iad1"]
}
```

## Testing Requirements

### Unit Tests
- TourplanClient XML parsing
- Price calculation logic
- Form validation

### Integration Tests
- API endpoint responses
- Payment flow
- Booking creation

### End-to-End Tests
- Complete booking flow
- Search variations
- Error scenarios

## Future Enhancements

### Phase 2
- Multi-language support
- Saved searches
- User accounts
- Booking management
- Email confirmations
- Enhanced family booking features (multi-room allocation)

### Phase 3
- Mobile app
- Advanced filtering
- Package builders
- Group bookings
- Loyalty program

## Migration Considerations

### From WordPress
- Maintain URL structure for SEO
- Import existing bookings
- Redirect old URLs
- Preserve pricing logic

### Data Migration
- Customer records
- Booking history
- Email templates
- Static content

## Success Criteria

### Launch Requirements
1. ✅ Search functionality with all 6 tour types
2. ✅ Optional destination search
3. ✅ Real-time Tourplan integration
4. ✅ Responsive design
5. ⏳ Payment processing
6. ⏳ Booking creation
7. ⏳ Email confirmations

### Performance Metrics
- 95% API success rate
- < 3s average search time
- 0% payment errors
- 99.9% uptime

## Documentation Requirements

### Technical Documentation
- API integration guide
- Deployment instructions
- Environment setup
- Troubleshooting guide

### User Documentation
- Search tips
- Booking process
- FAQ section
- Contact support

## Appendix: Common Issues and Solutions

### SCN Errors
- **Issue**: "You need to create a new booking first and supply a SCN to this element"
- **Solution**: Use AddServiceRequest to create booking before attempting modifications

### Pricing Display
- **Issue**: Prices showing as too high
- **Solution**: Apply WordPress formula: Math.ceil(rawPrice / 200)

### Empty Search Results
- **Issue**: No tours returned for valid destination
- **Solution**: Check Info parameter matches ButtonName, verify date range

### Timeout Errors
- **Issue**: API requests timing out
- **Solution**: Implement retry logic, increase timeout to 30s for complex searches

---

**Document Version**: 1.0
**Last Updated**: December 2024
**Status**: In Development