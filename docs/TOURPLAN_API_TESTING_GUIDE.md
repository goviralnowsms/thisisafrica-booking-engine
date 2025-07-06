# Tourplan API Testing Guide

This guide provides comprehensive documentation for testing the Tourplan HostConnect API integration in your booking engine.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [API Configuration](#api-configuration)
4. [Testing Methods](#testing-methods)
5. [API Endpoints](#api-endpoints)
6. [Test Scenarios](#test-scenarios)
7. [Troubleshooting](#troubleshooting)
8. [Mock vs Live Testing](#mock-vs-live-testing)

## 🔍 Overview

Your booking engine integrates with the Tourplan HostConnect API (Version 5.05.000) for:
- Tour search and availability
- Booking creation and management
- Customer data management
- Payment processing integration

**Current API Endpoint:** `https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi`

## ✅ Prerequisites

### 1. IP Whitelisting & VPN Configuration
- **Current Status:** Your static IP address is whitelisted with Tourplan
- **Important:** Do NOT connect to South Africa VPN as this will change your IP and lose whitelisting
- **Recommended Action:** Contact NordVPN to request your static IP be changed to a South African IP address
- **Alternative:** Ask Tourplan to whitelist your current static IP (if not already done)
- **Test:** Run `python verify_ip.py` to confirm your current IP is whitelisted

### 2. Authentication Credentials
\`\`\`env
TOURPLAN_API_URL=https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi
TOURPLAN_USERNAME=your_username
TOURPLAN_PASSWORD=your_password
TOURPLAN_AGENT_ID=SAMAGT
\`\`\`

### 3. Development Server
\`\`\`bash
npm run dev
\`\`\`
Server should be running on `http://localhost:3000`

## ⚙️ API Configuration

### Environment Variables
Create/update your `.env.local` file:

\`\`\`env
# Tourplan API Configuration
TOURPLAN_API_URL=https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi
TOURPLAN_USERNAME=your_username
TOURPLAN_PASSWORD=your_password
TOURPLAN_AGENT_ID=SAMAGT

# Testing Configuration
USE_MOCKS=true  # Set to false for live API testing
NODE_ENV=development
\`\`\`

### API Client Configuration
The API client is configured in [`lib/tourplan-api.ts`](../lib/tourplan-api.ts) with:
- Automatic fallback to mock data
- XML request/response handling
- Error handling and retry logic
- Caching for performance

## 🧪 Testing Methods

### Method 1: Python Test Script
**File:** [`test_tourplan_api.py`](../test_tourplan_api.py)

\`\`\`bash
python test_tourplan_api.py
\`\`\`

**Features:**
- Authentication testing
- Connectivity verification
- XML request/response validation
- Error handling verification

### Method 2: Web Testing Interface
**File:** [`test-api-interface.html`](../test-api-interface.html)

1. Open in browser: `http://localhost:3000/test-api-interface.html`
2. Test endpoints interactively
3. View formatted responses
4. Monitor server status

### Method 3: Direct API Testing
Using your Next.js API routes:

\`\`\`bash
# Test database connection
curl http://localhost:3000/api/test-db

# Test tour search
curl -X POST http://localhost:3000/api/tours/search \
  -H "Content-Type: application/json" \
  -d '{"destination": "Cape Town", "adults": 2}'
\`\`\`

## 🎯 API Endpoints

### 1. Tour Search
**Endpoint:** `POST /api/tours/search`

**Request:**
\`\`\`json
{
  "destination": "Cape Town",
  "country": "South Africa",
  "tourLevel": "standard",
  "startDate": "2024-07-01",
  "endDate": "2024-07-03",
  "adults": 2,
  "children": 0
}
\`\`\`

**Response:**
\`\`\`json
{
  "tours": [
    {
      "tourId": "tour-001",
      "tourName": "Kruger National Park Safari",
      "description": "Experience the Big Five...",
      "duration": 3,
      "priceFrom": 1200,
      "currency": "USD",
      "availability": "OK",
      "extras": [...]
    }
  ]
}
\`\`\`

### 2. Tour Availability
**Endpoint:** `POST /api/tours/availability`

**Request:**
\`\`\`json
{
  "tourId": "tour-001",
  "date": "2024-07-01",
  "adults": 2,
  "children": 0
}
\`\`\`

### 3. Create Booking
**Endpoint:** `POST /api/bookings/create`

**Request:**
\`\`\`json
{
  "tourId": "tour-001",
  "startDate": "2024-07-01",
  "endDate": "2024-07-03",
  "adults": 2,
  "children": 0,
  "selectedExtras": ["extra-001"],
  "customerDetails": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+27123456789",
    "address": "123 Main St, Cape Town"
  },
  "createAsProvisional": true
}
\`\`\`

## 🔬 Test Scenarios

### Scenario 1: Basic Authentication Test
\`\`\`python
# Run the authentication test
python test_tourplan_api.py
\`\`\`

**Expected Results:**
- ✅ Connection successful
- ✅ Authentication accepted
- ✅ Agent info retrieved

### Scenario 2: Tour Search Test
\`\`\`bash
# Test with web interface
# 1. Open test-api-interface.html
# 2. Use "Tour Search" endpoint
# 3. Modify search criteria
\`\`\`

**Test Cases:**
- Search by destination
- Search by country
- Search by tour level
- Search with date range
- Empty search (should return all tours)

### Scenario 3: Error Handling Test
\`\`\`json
// Invalid tour ID
{
  "tourId": "INVALID_TOUR",
  "date": "2024-07-01"
}
\`\`\`

**Expected Results:**
- Graceful error handling
- Fallback to mock data
- Proper error messages

### Scenario 4: Mock vs Live Data Comparison
1. Set `USE_MOCKS=true` and test
2. Set `USE_MOCKS=false` and test
3. Compare responses

## 🐛 Troubleshooting

### Common Issues

#### 1. Connection Timeout
**Symptoms:** Request times out after 30 seconds
**Solutions:**
- Verify your current IP is whitelisted with Tourplan
- Do NOT connect VPN to South Africa (this changes your IP)
- Contact NordVPN to change your static IP to South Africa if needed
- Test basic connectivity first

#### 2. Authentication Failed
**Symptoms:** Error response with authentication failure
**Solutions:**
- Verify credentials in `.env.local`
- Check agent ID format
- Ensure password is correct

#### 3. XML Parsing Errors
**Symptoms:** Malformed XML responses
**Solutions:**
- Check API endpoint URL
- Verify request format
- Review XML DTD compliance

#### 4. Mock Data Always Returned
**Symptoms:** Same mock data regardless of search criteria
**Solutions:**
- Set `USE_MOCKS=false` in environment
- Verify API credentials are configured
- Check network connectivity

### Debug Commands

\`\`\`bash
# Check VPN and IP
python verify_ip.py

# Test basic connectivity
python test_tourplan_api.py

# Check environment variables
node -e "console.log(process.env.TOURPLAN_API_URL)"

# Test local API endpoints
curl http://localhost:3000/api/test-db
\`\`\`

## 🎭 Mock vs Live Testing

### Mock Testing (Default)
**When to use:** Development, testing, when API is unavailable

**Configuration:**
\`\`\`env
USE_MOCKS=true
\`\`\`

**Features:**
- Instant responses
- Predictable data
- No network dependencies
- Configurable via [`lib/mocks/`](../lib/mocks/) files

### Live API Testing
**When to use:** Integration testing, production validation

**Configuration:**
\`\`\`env
USE_MOCKS=false
TOURPLAN_API_URL=https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi
TOURPLAN_USERNAME=your_username
TOURPLAN_PASSWORD=your_password
TOURPLAN_AGENT_ID=SAMAGT
\`\`\`

**Requirements:**
- VPN connection to South Africa
- Valid API credentials
- IP whitelisting

## 📚 Additional Resources

### Documentation Files
- [`docs/HostConnect-Versions-5.05.000-Interface.pdf`](./HostConnect-Versions-5.05.000-Interface.pdf) - Complete API specification
- [`docs/Request-Examples.pdf`](./Request-Examples.pdf) - XML request/response examples
- [`docs/HostConnect-Error-Codes-Version-5.05.000.pdf`](./HostConnect-Error-Codes-Version-5.05.000.pdf) - Error code reference
- [`docs/tourplan-api-examples.txt`](./tourplan-api-examples.txt) - Quick reference examples

### Code Files
- [`lib/tourplan-api.ts`](../lib/tourplan-api.ts) - Main API client
- [`lib/mocks/`](../lib/mocks/) - Mock data files
- [`test_tourplan_api.py`](../test_tourplan_api.py) - Python test script
- [`test-api-interface.html`](../test-api-interface.html) - Web testing interface

## 🚀 Quick Start Testing

1. **Setup Environment**
   \`\`\`bash
   # Copy environment template
   cp .env.example .env.local
   # Edit with your credentials
   \`\`\`

2. **Start Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Test Basic Connectivity**
   \`\`\`bash
   python test_tourplan_api.py
   \`\`\`

4. **Open Web Testing Interface**
   \`\`\`
   http://localhost:3000/test-api-interface.html
   \`\`\`

5. **Run Test Scenarios**
   - Test each endpoint
   - Verify responses
   - Check error handling

## 📞 Support

If you encounter issues:
1. Check this troubleshooting guide
2. Verify VPN connection and IP whitelisting
3. Review API documentation in [`docs/`](./docs/) folder
4. Test with mock data first to isolate issues
