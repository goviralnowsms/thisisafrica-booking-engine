/**
 * Comprehensive Cruise Booking Test Script
 * Tests all cruise products systematically to identify working vs. non-working ones
 * Captures XML requests/responses for TourPlan support
 */

const fs = require('fs');
const path = require('path');

// All cruise products to test (from CLAUDE.md documentation)
const CRUISE_PRODUCTS = [
  {
    code: 'BBKCRCHO018TIACP2',
    name: 'Chobe Princess 2-night',
    expected: 'Monday & Wednesday departures only',
    testDates: [
      '2025-08-18', // Monday - should work
      '2025-08-20', // Wednesday - should work  
      '2025-08-22', // Friday - should fail
      '2025-08-24', // Sunday - should fail
    ]
  },
  {
    code: 'BBKCRCHO018TIACP3',
    name: 'Chobe Princess 3-night',
    expected: 'Friday departures only',
    testDates: [
      '2025-08-22', // Friday - should work
      '2025-08-18', // Monday - should fail
      '2025-08-20', // Wednesday - should fail
      '2025-08-24', // Sunday - should fail
    ]
  },
  {
    code: 'BBKCRTVT001ZAM2NS',
    name: 'Zambezi Queen 2-night standard',
    expected: 'Works but shows all days as available (should have restrictions)',
    testDates: [
      '2025-08-22', // Friday
      '2025-08-18', // Monday
      '2025-08-20', // Wednesday
      '2025-08-24', // Sunday
    ]
  },
  {
    code: 'BBKCRTVT001ZAM2NM',
    name: 'Zambezi Queen 2-night master',
    expected: 'Works but shows all days as available (should have restrictions)',
    testDates: [
      '2025-08-22', // Friday
      '2025-08-18', // Monday
      '2025-08-20', // Wednesday
      '2025-08-24', // Sunday
    ]
  },
  {
    code: 'BBKCRTVT001ZAM3NS',
    name: 'Zambezi Queen 3-night standard',
    expected: 'Shows Fridays correctly but bookings fail',
    testDates: [
      '2025-08-22', // Friday - shows available but booking fails
      '2025-08-18', // Monday - should not show available
      '2025-08-20', // Wednesday - should not show available
      '2025-08-24', // Sunday - should not show available
    ]
  }
];

// Booking test customer data
const TEST_CUSTOMER = {
  name: 'Test Customer',
  email: 'test@example.com',
  mobile: '+61 400 000 000'
};

// Create logs directory
const logsDir = path.join(__dirname, 'tourplan-logs', 'systematic-cruise-test');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Utility function to make TourPlan API calls
async function makeTourPlanCall(endpoint, data, testId) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const logFile = path.join(logsDir, `${testId}-${timestamp}.json`);
  
  try {
    console.log(`🧪 Testing ${testId}...`);
    
    const response = await fetch(`http://localhost:3000/api/tourplan/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    // Log the complete test result
    const logData = {
      testId,
      timestamp,
      endpoint,
      request: data,
      response: result,
      success: response.ok && result.success,
      httpStatus: response.status
    };
    
    fs.writeFileSync(logFile, JSON.stringify(logData, null, 2));
    
    console.log(`📝 Logged to: ${logFile}`);
    return result;
    
  } catch (error) {
    const errorLog = {
      testId,
      timestamp,
      endpoint,
      request: data,
      error: error.message,
      success: false
    };
    
    fs.writeFileSync(logFile, JSON.stringify(errorLog, null, 2));
    console.error(`❌ Error in ${testId}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Test product availability calendar
async function testProductAvailability(productCode, productName) {
  console.log(`\n🗓️  Testing availability calendar for ${productName} (${productCode})`);
  
  const result = await makeTourPlanCall(
    `pricing/${productCode}`,
    {}, // Empty body for GET-style request
    `availability-${productCode}`
  );
  
  if (result.success && result.availability) {
    console.log(`✅ Availability calendar loaded - ${result.availability.length} days returned`);
    const availableDays = result.availability.filter(day => day.available);
    console.log(`   📅 Available days: ${availableDays.length}`);
    if (availableDays.length <= 10) {
      console.log(`   📋 Days: ${availableDays.map(d => d.date).join(', ')}`);
    }
  } else {
    console.log(`❌ Failed to load availability calendar`);
  }
  
  return result;
}

// Test booking creation
async function testBookingCreation(productCode, productName, dateFrom, dayName) {
  console.log(`\n📝 Testing booking creation for ${productName} on ${dateFrom} (${dayName})`);
  
  const bookingData = {
    customerName: TEST_CUSTOMER.name,
    productCode: productCode,
    rateId: 'Default',
    dateFrom: dateFrom,
    isQuote: false, // Create actual booking, not quote
    email: TEST_CUSTOMER.email,
    mobile: TEST_CUSTOMER.mobile,
    roomConfigs: [
      {
        Adults: 2,
        Children: 0,
        Type: 'DB',
        Quantity: 1
      }
    ]
  };
  
  const result = await makeTourPlanCall(
    'booking',
    bookingData,
    `booking-${productCode}-${dateFrom}`
  );
  
  if (result.success && result.booking) {
    const ref = result.booking.reference || result.booking.bookingId || 'Unknown';
    const status = result.booking.status || 'Unknown';
    
    if (ref.startsWith('TAWB')) {
      console.log(`✅ BOOKING SUCCESS: ${ref} (Status: ${status}) - TourPlan accepted`);
    } else if (ref.startsWith('TIA')) {
      console.log(`⚠️  BOOKING FALLBACK: ${ref} (Status: ${status}) - Manual processing required`);
    } else {
      console.log(`❓ BOOKING UNKNOWN: ${ref} (Status: ${status})`);
    }
  } else {
    console.log(`❌ BOOKING FAILED: ${result.error || 'Unknown error'}`);
  }
  
  return result;
}

// Main test function
async function runSystematicCruiseTests() {
  console.log('🚢 Starting Systematic Cruise Product Tests');
  console.log('='.repeat(60));
  
  const results = {
    timestamp: new Date().toISOString(),
    tests: []
  };
  
  for (const product of CRUISE_PRODUCTS) {
    console.log(`\n🎯 TESTING: ${product.name} (${product.code})`);
    console.log(`📋 Expected behavior: ${product.expected}`);
    console.log('-'.repeat(50));
    
    const productTest = {
      productCode: product.code,
      productName: product.name,
      expected: product.expected,
      availabilityTest: null,
      bookingTests: []
    };
    
    // Test 1: Availability Calendar
    productTest.availabilityTest = await testProductAvailability(product.code, product.name);
    
    // Test 2: Booking attempts on different days
    for (const testDate of product.testDates) {
      const dayName = new Date(testDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' });
      const bookingResult = await testBookingCreation(product.code, product.name, testDate, dayName);
      
      productTest.bookingTests.push({
        date: testDate,
        dayName,
        result: bookingResult
      });
      
      // Small delay between booking attempts
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    results.tests.push(productTest);
    
    console.log(`\n✅ Completed testing ${product.name}`);
    
    // Delay between products to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Save comprehensive results
  const summaryFile = path.join(logsDir, `cruise-test-summary-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(summaryFile, JSON.stringify(results, null, 2));
  
  console.log('\n🎯 SYSTEMATIC CRUISE TESTS COMPLETED');
  console.log('='.repeat(60));
  console.log(`📊 Summary saved to: ${summaryFile}`);
  
  // Generate analysis
  generateTestAnalysis(results);
}

// Generate analysis of test results
function generateTestAnalysis(results) {
  console.log('\n📊 TEST ANALYSIS');
  console.log('='.repeat(30));
  
  const workingProducts = [];
  const failingProducts = [];
  const inconsistentProducts = [];
  
  for (const test of results.tests) {
    const successfulBookings = test.bookingTests.filter(bt => 
      bt.result.success && 
      bt.result.booking && 
      bt.result.booking.reference && 
      bt.result.booking.reference.startsWith('TAWB')
    );
    
    const failedBookings = test.bookingTests.filter(bt => 
      !bt.result.success || 
      !bt.result.booking || 
      !bt.result.booking.reference ||
      bt.result.booking.reference.startsWith('TIA')
    );
    
    if (successfulBookings.length > 0 && failedBookings.length === 0) {
      workingProducts.push({
        code: test.productCode,
        name: test.productName,
        successfulDays: successfulBookings.map(b => `${b.date} (${b.dayName})`).join(', ')
      });
    } else if (successfulBookings.length === 0) {
      failingProducts.push({
        code: test.productCode,
        name: test.productName,
        allFailed: true
      });
    } else {
      inconsistentProducts.push({
        code: test.productCode,
        name: test.productName,
        successful: successfulBookings.length,
        failed: failedBookings.length,
        successfulDays: successfulBookings.map(b => `${b.date} (${b.dayName})`).join(', '),
        failedDays: failedBookings.map(b => `${b.date} (${b.dayName})`).join(', ')
      });
    }
  }
  
  console.log(`\n✅ CONSISTENTLY WORKING PRODUCTS (${workingProducts.length}):`);
  workingProducts.forEach(p => {
    console.log(`   - ${p.name} (${p.code}) - Works on: ${p.successfulDays}`);
  });
  
  console.log(`\n❌ CONSISTENTLY FAILING PRODUCTS (${failingProducts.length}):`);
  failingProducts.forEach(p => {
    console.log(`   - ${p.name} (${p.code}) - All booking attempts failed`);
  });
  
  console.log(`\n⚠️  INCONSISTENT PRODUCTS (${inconsistentProducts.length}):`);
  inconsistentProducts.forEach(p => {
    console.log(`   - ${p.name} (${p.code})`);
    console.log(`     ✅ Works on: ${p.successfulDays}`);
    console.log(`     ❌ Fails on: ${p.failedDays}`);
  });
  
  console.log(`\n📁 All detailed logs saved to: ${logsDir}`);
  console.log('\n💡 Send the log files to TourPlan support with:');
  console.log('   - Working products: XML requests/responses that get TAWB references');
  console.log('   - Failing products: XML requests/responses that get TIA references or errors');
  console.log('   - Inconsistent products: Show same product code working sometimes, failing other times');
}

// Run the tests
if (require.main === module) {
  runSystematicCruiseTests().catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = { runSystematicCruiseTests };