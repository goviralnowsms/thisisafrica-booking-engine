#!/usr/bin/env node
/**
 * Local API Testing Script
 * Tests all API endpoints using mock data while waiting for IP whitelisting
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:3000';
const MOCK_DIR = path.join(__dirname, 'lib', 'mocks');

// Test data
const testData = {
  searchRequest: {
    destination: 'Cape Town',
    checkIn: '2024-07-01',
    checkOut: '2024-07-03',
    adults: 2,
    children: 0
  },
  bookingRequest: {
    tourId: 'TEST_TOUR_001',
    customerInfo: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+27123456789'
    },
    participants: 2,
    selectedDate: '2024-07-01'
  },
  paymentRequest: {
    amount: 150000, // R1500.00 in cents
    currency: 'ZAR',
    bookingId: 'BOOKING_001'
  }
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

async function waitForServer(maxAttempts = 30) {
  log('\n🔄 Waiting for development server to start...', colors.yellow);
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await axios.get(`${BASE_URL}/api/test-db`);
      logSuccess('Development server is ready!');
      return true;
    } catch (error) {
      if (i === maxAttempts - 1) {
        logError('Development server failed to start');
        return false;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return false;
}

async function testEndpoint(name, url, method = 'GET', data = null) {
  try {
    log(`\n🧪 Testing ${name}...`, colors.blue);
    
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    
    logSuccess(`${name} - Status: ${response.status}`);
    
    if (response.data) {
      console.log('Response:', JSON.stringify(response.data, null, 2));
    }
    
    return { success: true, status: response.status, data: response.data };
    
  } catch (error) {
    if (error.response) {
      logError(`${name} - Status: ${error.response.status}`);
      console.log('Error Response:', JSON.stringify(error.response.data, null, 2));
      return { success: false, status: error.response.status, error: error.response.data };
    } else {
      logError(`${name} - Network Error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}

async function createMockData() {
  log('\n📁 Creating mock data for testing...', colors.yellow);
  
  // Ensure mock directory exists
  if (!fs.existsSync(MOCK_DIR)) {
    fs.mkdirSync(MOCK_DIR, { recursive: true });
    logInfo('Created mock directory');
  }
  
  // Mock tour search results
  const mockSearchResults = {
    request: testData.searchRequest,
    response: {
      tours: [
        {
          id: 'TOUR_001',
          name: 'Cape Town City Tour',
          description: 'Explore the beautiful city of Cape Town',
          price: 750,
          currency: 'ZAR',
          duration: '4 hours',
          availability: [
            { date: '2024-07-01', available: true, price: 750 },
            { date: '2024-07-02', available: true, price: 750 },
            { date: '2024-07-03', available: false, price: 750 }
          ]
        },
        {
          id: 'TOUR_002',
          name: 'Table Mountain Cable Car',
          description: 'Scenic cable car ride to Table Mountain summit',
          price: 450,
          currency: 'ZAR',
          duration: '2 hours',
          availability: [
            { date: '2024-07-01', available: true, price: 450 },
            { date: '2024-07-02', available: true, price: 450 },
            { date: '2024-07-03', available: true, price: 450 }
          ]
        }
      ],
      totalResults: 2
    },
    timestamp: new Date().toISOString()
  };
  
  // Mock availability check
  const mockAvailability = {
    request: { tourId: 'TOUR_001', date: '2024-07-01' },
    response: {
      available: true,
      price: 750,
      currency: 'ZAR',
      maxParticipants: 20,
      currentBookings: 5
    },
    timestamp: new Date().toISOString()
  };
  
  // Mock booking confirmation
  const mockBooking = {
    request: testData.bookingRequest,
    response: {
      bookingId: 'BOOKING_001',
      status: 'confirmed',
      totalAmount: 1500,
      currency: 'ZAR',
      bookingReference: 'TIA-2024-001',
      customerInfo: testData.bookingRequest.customerInfo,
      tourDetails: {
        id: 'TOUR_001',
        name: 'Cape Town City Tour',
        date: '2024-07-01',
        participants: 2
      }
    },
    timestamp: new Date().toISOString()
  };
  
  // Save mock files
  const mockFiles = [
    { name: 'tour_search.json', data: mockSearchResults },
    { name: 'tour_availability.json', data: mockAvailability },
    { name: 'booking_create.json', data: mockBooking }
  ];
  
  for (const file of mockFiles) {
    const filePath = path.join(MOCK_DIR, file.name);
    fs.writeFileSync(filePath, JSON.stringify(file.data, null, 2));
    logInfo(`Created mock file: ${file.name}`);
  }
  
  logSuccess('Mock data created successfully');
}

async function runTests() {
  log(`${colors.bold}🚀 LOCAL API TESTING SUITE${colors.reset}`, colors.blue);
  log('Testing all API endpoints with mock data\n');
  
  // Wait for server to be ready
  const serverReady = await waitForServer();
  if (!serverReady) {
    logError('Cannot proceed without development server');
    process.exit(1);
  }
  
  // Create mock data
  await createMockData();
  
  const results = [];
  
  // Test database connection
  results.push(await testEndpoint(
    'Database Connection',
    '/api/test-db'
  ));
  
  // Test tour search
  results.push(await testEndpoint(
    'Tour Search',
    '/api/tours/search',
    'POST',
    testData.searchRequest
  ));
  
  // Test tour availability
  results.push(await testEndpoint(
    'Tour Availability',
    '/api/tours/availability',
    'POST',
    { tourId: 'TOUR_001', date: '2024-07-01' }
  ));
  
  // Test booking creation
  results.push(await testEndpoint(
    'Create Booking',
    '/api/bookings/create',
    'POST',
    testData.bookingRequest
  ));
  
  // Test customer update
  results.push(await testEndpoint(
    'Update Customer',
    '/api/customers/update',
    'POST',
    {
      customerId: 'CUST_001',
      ...testData.bookingRequest.customerInfo
    }
  ));
  
  // Test payment processing
  results.push(await testEndpoint(
    'Process Payment',
    '/api/payments/process',
    'POST',
    testData.paymentRequest
  ));
  
  // Summary
  log(`\n${colors.bold}📊 TEST SUMMARY${colors.reset}`, colors.blue);
  log('=' * 50);
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  log(`Total Tests: ${total}`);
  logSuccess(`Successful: ${successful}`);
  
  if (successful < total) {
    logError(`Failed: ${total - successful}`);
  }
  
  log('\n💡 NEXT STEPS:');
  log('1. All endpoints are now testable locally with mock data');
  log('2. Use the browser to test the UI at http://localhost:3000');
  log('3. Mock responses can be customized in lib/mocks/ directory');
  log('4. Once IP is whitelisted, disable mocks in lib/api/config.js');
  
  if (successful === total) {
    logSuccess('\n🎉 All tests passed! Your API endpoints are working correctly.');
  } else {
    logWarning('\n⚠️  Some tests failed. Check the error messages above.');
  }
}

// Handle script execution
if (require.main === module) {
  runTests().catch(error => {
    logError(`Script failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { runTests, testEndpoint, createMockData };
