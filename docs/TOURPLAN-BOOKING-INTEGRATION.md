# TourPlan Booking Integration

## Overview

The booking engine now successfully integrates with TourPlan's HostConnect API to automatically send customer bookings for staff approval and processing.

## How It Works

### 1. Customer Booking Flow
1. Customer fills out booking form on website
2. Form submits to `/api/tourplan/booking`
3. System creates real booking in TourPlan via XML API
4. Customer sees confirmation page with booking reference
5. Staff receives booking in TourPlan for manual approval

### 2. TourPlan Integration Details

**API Endpoint**: `https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi`
**Credentials**: 
- AgentID: SAMAGT
- Password: S@MAgt01

**Working Tour Codes**:
- `NBOGTARP001CKEKEE` - Classic Kenya - Keekorok lodges
- `NBOGTARP001CKSE` - Classic Kenya - Serena lodges  
- `NBOGTARP001CKSO` - Classic Kenya - Serena lodges

### 3. Booking Status Codes

- **Status: OK** - Booking confirmed automatically
- **Status: ??** - Booking created, needs manual approval (common)
- **Status: RQ** - On request, requires manual confirmation
- **Status: WQ** - Website quote, requires manual confirmation

All statuses except errors result in successful booking creation.

## Live Test Results

✅ **Successfully tested with real bookings**:
- Booking ID 1464 - Reference: TAWB100459
- Booking ID 1465 - Reference: TAWB100460
- Status: ?? (successful, awaiting staff approval)

## For Staff

### Where to Find Bookings
1. Log into TourPlan system
2. Look for booking references starting with `TAWB100XXX`
3. Bookings will have status ?? or RQ requiring approval
4. Customer details, tour code, and dates will be populated

### Booking Information Sent
- **Customer Details**: Name, email, phone
- **Tour Details**: Product code, departure date, travelers
- **Room Configuration**: Adults, children, room type (DB)
- **Special Requests**: Any customer notes

## API Endpoints

### Main Booking API
```
POST /api/tourplan/booking
```

**Required Fields**:
- `customerName` - Full name
- `productCode` - Tour code (e.g., NBOGTARP001CKEKEE)
- `dateFrom` - Departure date (YYYY-MM-DD)
- `adults` - Number of adults
- `email` - Customer email

**Optional Fields**:
- `mobile` - Phone number
- `children` - Number of children
- `bookingType` - 'booking' or 'quote'
- `rateId` - Rate identifier

### Test Endpoint
```
POST /api/test-booking-creation
```
Simple endpoint for testing bookings without full form validation.

## Error Handling

The system provides user-friendly error messages:
- **1052 Error** → "The selected tour is not available"
- **1000 Error** → "Invalid date format"
- **1001 Error** → "Missing required information"
- **1051 Error** → "Authentication failed"

## Customer Experience

### Success Flow
1. Customer completes booking form
2. Sees "Booking sent to TourPlan for confirmation" message
3. Receives confirmation with reference number
4. Staff contacts within 48 hours to confirm

### Error Flow
1. If tour unavailable → User-friendly error message
2. If invalid data → Clear validation messages
3. System gracefully handles all TourPlan errors

## Technical Notes

- **XML Format**: Uses TourPlan HostConnect 5.05.000 DTD
- **Request Type**: AddServiceRequest with QB=B (booking)
- **Date Format**: Must be YYYY-MM-DD (strictly enforced)
- **Room Type**: Uses DB (double) as default
- **Sunday Departures**: Kenya tours require Sunday departure dates

## Maintenance

The integration uses proven XML structures from the working old booking engine. No changes should be needed unless TourPlan changes their API structure.

**Key Files**:
- `lib/tourplan/core.ts` - Main TourPlan API client
- `lib/tourplan/services.ts` - Booking service functions  
- `app/api/tourplan/booking/route.ts` - Booking API endpoint
- `app/booking-confirmation/page.tsx` - Confirmation page

## Support

If bookings stop working:
1. Check TourPlan system status
2. Verify tour codes are still valid
3. Test with `/api/test-booking-creation` endpoint
4. Check server logs for XML errors

The integration follows the exact same pattern as the working old booking engine but with clean, maintainable code architecture.