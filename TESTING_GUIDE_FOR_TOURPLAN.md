# Testing Guide - Capture Cruise & Rail Booking Status="NO" Responses

## Quick Test Steps

### 1. Test a CRUISE Booking

1. Go to: http://localhost:3004/products/BBKCRCHO018TIACP2
2. Click "Book Now" 
3. Fill in:
   - Name: Test Cruise User
   - Email: test@example.com
   - Date: Any future date (e.g., October 15, 2025)
   - Travelers: 2 Adults
4. Click "Book Now" to submit
5. Wait for the booking to process
6. You should see it fall back to TIA-CRUISE reference

**Check logs**: Look in `tourplan-logs/booking-attempts/` for:
- `cruise-booking-request-[timestamp].xml`
- `cruise-booking-response-[timestamp].xml`

### 2. Test a RAIL Booking

1. Go to: http://localhost:3004/products/CPTRLROV001CTPPUL
2. Click "Book Now"
3. Fill in:
   - Name: Test Rail User
   - Email: test@example.com
   - Date: Any future date (e.g., October 10, 2025)
   - Travelers: 2 Adults
4. Click "Book Now" to submit
5. Wait for the booking to process
6. You should see it fall back to TIA-RAIL reference

**Check logs**: Look in `tourplan-logs/booking-attempts/` for:
- `rail-booking-request-[timestamp].xml`
- `rail-booking-response-[timestamp].xml`

## What to Look For

In the console/terminal, you should see:
```
================================================================================
📝 CAPTURING CRUISE BOOKING ATTEMPT FOR TOURPLAN SUPPORT
================================================================================
Product Code: BBKCRCHO018TIACP2
Date: 2025-10-15
Customer: Test Cruise User
Timestamp: 2025-08-07T...

📤 SENDING CreateBooking XML with proper RateId: [full XML]
📁 Saved cruise booking request to: tourplan-logs/booking-attempts/cruise-booking-request-...
📥 Raw TourPlan response: {"Status": "NO", ...}
📁 Saved cruise booking response to: tourplan-logs/booking-attempts/cruise-booking-response-...
```

## Alternative Products to Test

### More Cruise Products:
- BBKCRCHO018TIACP3 (Chobe Princess 3 Night)
- BBKCRTVT001ZAM2NM (Zambezi Queen 2 Night)

### More Rail Products:
- VFARLROV001VFPRDX (Victoria Falls to Pretoria)
- CPTRLROV001CTPRRO (Cape Town to Pretoria Royal)

## Files to Send to TourPlan

After testing, you'll have fresh XML logs showing:
1. The exact booking request being sent
2. The Status="NO" response from TourPlan

These files will be in: `tourplan-logs/booking-attempts/`

Include these with your email to TourPlan as they show the actual booking attempts failing.