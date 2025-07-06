# 🚀 Tourplan API Testing - Quick Reference

## 📋 Testing Methods Overview

| Method | File | Purpose | Best For |
|--------|------|---------|----------|
| **Web Dashboard** | [`docs/tourplan-api-dashboard.html`](./tourplan-api-dashboard.html) | Interactive testing interface | Visual testing, demos |
| **Python Complete** | [`test_tourplan_complete.py`](../test_tourplan_complete.py) | Comprehensive test suite | Full validation, CI/CD |
| **Python Basic** | [`test_tourplan_api.py`](../test_tourplan_api.py) | Authentication testing | Quick connectivity check |
| **Web Interface** | [`test-api-interface.html`](../test-api-interface.html) | Simple endpoint testing | Basic API testing |

## ⚡ Quick Start Commands

\`\`\`bash
# 1. Start development server
npm run dev

# 2. Test basic connectivity
python test_tourplan_api.py

# 3. Run comprehensive tests
python test_tourplan_complete.py

# 4. Open web dashboard
# Navigate to: file:///path/to/docs/tourplan-api-dashboard.html
\`\`\`

## 🎯 API Endpoints Reference

### Local Development Endpoints

| Endpoint | Method | Purpose | Sample Payload |
|----------|--------|---------|----------------|
| `/api/test-db` | GET | Database health check | None |
| `/api/tours/search` | POST | Search tours | `{"destination": "Cape Town", "adults": 2}` |
| `/api/tours/availability` | POST | Check availability | `{"tourId": "tour-001", "date": "2024-07-01"}` |
| `/api/bookings/create` | POST | Create booking | See [booking payload](#booking-payload) |
| `/api/payments/process` | POST | Process payment | `{"amount": 150000, "currency": "ZAR"}` |

### Tourplan Direct API

| Endpoint | Purpose | Authentication |
|----------|---------|----------------|
| `https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi` | HostConnect API | Agent ID + Password |

## 📝 Sample Payloads

### Tour Search
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

### Tour Availability
\`\`\`json
{
  "tourId": "tour-001",
  "date": "2024-07-01",
  "adults": 2,
  "children": 0
}
\`\`\`

### <a id="booking-payload"></a>Booking Creation
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

### Payment Processing
\`\`\`json
{
  "amount": 150000,
  "currency": "ZAR",
  "bookingId": "booking-001",
  "paymentMethod": "card"
}
\`\`\`

## 🔧 Environment Configuration

### Required Environment Variables
\`\`\`env
# Tourplan API
TOURPLAN_API_URL=https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi
TOURPLAN_USERNAME=your_username
TOURPLAN_PASSWORD=your_password
TOURPLAN_AGENT_ID=SAMAGT

# Testing Mode
USE_MOCKS=true  # Set to false for live API testing
NODE_ENV=development
\`\`\`

### IP Whitelisting & VPN Configuration
- **Current Status:** Your static IP is whitelisted with Tourplan
- **Critical:** Do NOT connect to South Africa VPN (changes your IP)
- **Options:**
  1. Contact NordVPN to change static IP to South Africa
  2. Ask Tourplan to whitelist your current static IP
- **Test:** `python verify_ip.py`

## 🧪 Testing Scenarios

### 1. Quick Health Check
\`\`\`bash
# Test local server
curl http://localhost:3000/api/test-db

# Test authentication
python test_tourplan_api.py
\`\`\`

### 2. Full API Testing
\`\`\`bash
# Run comprehensive test suite
python test_tourplan_complete.py

# Choose option 2 for full suite
\`\`\`

### 3. Interactive Testing
1. Open [`docs/tourplan-api-dashboard.html`](./tourplan-api-dashboard.html) in browser
2. Configure API settings
3. Test endpoints interactively
4. View real-time logs

### 4. Error Testing
\`\`\`json
// Test invalid tour ID
{"tourId": "INVALID", "date": "2024-07-01"}

// Test invalid date
{"tourId": "tour-001", "date": "invalid-date"}

// Test missing fields
{"tourId": "tour-001"}
\`\`\`

## 🐛 Common Issues & Solutions

| Issue | Symptoms | Solution |
|-------|----------|----------|
| **Connection Timeout** | Request hangs for 30s | Verify IP whitelisting, do NOT use SA VPN |
| **Authentication Failed** | Error in XML response | Verify credentials in `.env.local` |
| **Mock Data Only** | Same data regardless of search | Set `USE_MOCKS=false` |
| **Server Offline** | Connection refused | Run `npm run dev` |

## 📊 Test Results Interpretation

### Success Indicators
- ✅ HTTP 200 responses
- ✅ Valid JSON structure
- ✅ Required fields present
- ✅ Response time < 5 seconds

### Warning Signs
- ⚠️ Response time > 5 seconds
- ⚠️ Mock data when expecting live data
- ⚠️ Missing optional fields

### Error Indicators
- ❌ HTTP 4xx/5xx responses
- ❌ Connection timeouts
- ❌ Invalid JSON responses
- ❌ Missing required fields

## 🔍 Debugging Commands

\`\`\`bash
# Check environment variables
node -e "console.log(process.env.TOURPLAN_API_URL)"

# Test VPN and IP
python verify_ip.py

# Check local server status
curl -I http://localhost:3000

# Test specific endpoint
curl -X POST http://localhost:3000/api/tours/search \
  -H "Content-Type: application/json" \
  -d '{"destination": "Cape Town"}'
\`\`\`

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [`TOURPLAN_API_TESTING_GUIDE.md`](./TOURPLAN_API_TESTING_GUIDE.md) | Complete testing guide |
| [`tourplan-api-dashboard.html`](./tourplan-api-dashboard.html) | Interactive testing dashboard |
| [`HostConnect-Versions-5.05.000-Interface.pdf`](./HostConnect-Versions-5.05.000-Interface.pdf) | Official API specification |
| [`Request-Examples.pdf`](./Request-Examples.pdf) | XML request examples |
| [`tourplan-api-examples.txt`](./tourplan-api-examples.txt) | Quick reference examples |

## 🎯 Testing Checklist

### Before Testing
- [ ] Development server running (`npm run dev`)
- [ ] VPN connected to South Africa
- [ ] Environment variables configured
- [ ] IP address whitelisted

### Basic Tests
- [ ] Database connection test
- [ ] Authentication test
- [ ] Tour search test
- [ ] Availability check test

### Advanced Tests
- [ ] Booking creation test
- [ ] Payment processing test
- [ ] Error handling test
- [ ] Performance test

### Production Readiness
- [ ] All tests passing with live API
- [ ] Error handling working correctly
- [ ] Response times acceptable
- [ ] Data validation working

## 🚀 Next Steps

1. **Start with Quick Health Check** - Verify basic connectivity
2. **Run Authentication Test** - Ensure API credentials work
3. **Test Core Functionality** - Search, availability, booking
4. **Validate Error Handling** - Test edge cases
5. **Performance Testing** - Check response times
6. **Production Testing** - Test with `USE_MOCKS=false`

---

💡 **Tip:** Start with the web dashboard for visual testing, then use the Python scripts for automated validation.
