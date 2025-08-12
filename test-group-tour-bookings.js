const fs = require('fs');
const path = require('path');

// TourPlan API configuration
const API_URL = 'https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi';
const AGENT_ID = 'SAMAGT';
const PASSWORD = 'S@MAgt01';

// Test data for bookings
const testBookings = [
  {
    productCode: 'NBOGTARP001CKEKEE',
    name: 'Classic Kenya - Keekorok lodges (WORKING)',
    expectedStatus: 'TAWB'
  },
  {
    productCode: 'NBOGTARP001THRSE3',
    name: 'Three Serengeti Safari (NOT WORKING)',
    expectedStatus: 'TIA'
  }
];

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'tourplan-logs', 'group-tour-booking-tests');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Function to get next Sunday date
function getNextSunday() {
  const today = new Date();
  const nextSunday = new Date();
  
  // Find next Sunday (0 = Sunday)
  const daysUntilSunday = (7 - today.getDay()) % 7;
  nextSunday.setDate(today.getDate() + (daysUntilSunday === 0 ? 7 : daysUntilSunday));
  
  return nextSunday.toISOString().split('T')[0];
}

// Function to create booking XML request
function createBookingXML(productCode, dateFrom = getNextSunday()) {
  return `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <AddServiceRequest>
    <AgentID>${AGENT_ID}</AgentID>
    <Password>${PASSWORD}</Password>
    <NewBookingInfo>
      <n>Test Customer</n>
      <QB>B</QB>
      <Email>test@thisisafrica.com.au</Email>
      <Mobile>+61 400 123 456</Mobile>
    </NewBookingInfo>
    <Opt>${productCode}</Opt>
    <DateFrom>${dateFrom}</DateFrom>
    <Adults>2</Adults>
  </AddServiceRequest>
</Request>`;
}

// Function to make API request
async function makeBookingRequest(productCode, testName) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`Testing: ${testName}`);
  console.log(`Product Code: ${productCode}`);
  console.log(`${'='.repeat(80)}`);
  
  const dateFrom = getNextSunday(); // Use next Sunday for group tours
  console.log(`Using departure date: ${dateFrom} (Sunday)`)
  const requestXML = createBookingXML(productCode, dateFrom);
  
  // Save request XML
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const requestFile = path.join(logsDir, `${productCode}-request-${timestamp}.xml`);
  fs.writeFileSync(requestFile, requestXML, 'utf8');
  console.log(`📝 Request saved to: ${requestFile}`);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
      },
      body: requestXML
    });
    
    const responseXML = await response.text();
    
    // Save response XML
    const responseFile = path.join(logsDir, `${productCode}-response-${timestamp}.xml`);
    fs.writeFileSync(responseFile, responseXML, 'utf8');
    console.log(`📝 Response saved to: ${responseFile}`);
    
    // Parse and display key information
    console.log('\n📋 Response Summary:');
    
    // Check for booking reference
    if (responseXML.includes('<BookingRef>')) {
      const bookingRef = responseXML.match(/<BookingRef>(.*?)<\/BookingRef>/)?.[1];
      console.log(`✅ Booking Reference: ${bookingRef}`);
      
      // Check status
      const status = responseXML.match(/<Status>(.*?)<\/Status>/)?.[1];
      console.log(`   Status: ${status}`);
      
      if (bookingRef?.startsWith('TAWB')) {
        console.log(`   Result: SUCCESS - API booking created (TAWB reference)`);
      } else {
        console.log(`   Result: PARTIAL - Booking created but may need manual confirmation`);
      }
    } else if (responseXML.includes('Status="NO"')) {
      console.log(`❌ Booking DECLINED (Status="NO")`);
      console.log(`   Result: Tour does not accept API bookings`);
      
      // Extract error details if available
      const message = responseXML.match(/<Message>(.*?)<\/Message>/)?.[1];
      if (message) {
        console.log(`   Message: ${message}`);
      }
    } else if (responseXML.includes('<Error>')) {
      const errorCode = responseXML.match(/<ErrorCode>(.*?)<\/ErrorCode>/)?.[1];
      const errorText = responseXML.match(/<ErrorText>(.*?)<\/ErrorText>/)?.[1];
      console.log(`❌ Error Code: ${errorCode}`);
      console.log(`   Error Text: ${errorText}`);
    } else {
      console.log(`⚠️  Unexpected response format`);
    }
    
    // Display first 500 chars of response for debugging
    console.log('\n📄 Response Preview (first 500 chars):');
    console.log(responseXML.substring(0, 500) + '...');
    
    return {
      productCode,
      testName,
      requestFile,
      responseFile,
      success: responseXML.includes('<BookingRef>') && !responseXML.includes('Status="NO"')
    };
    
  } catch (error) {
    console.error(`❌ Request failed: ${error.message}`);
    return {
      productCode,
      testName,
      error: error.message,
      success: false
    };
  }
}

// Run all tests
async function runTests() {
  console.log('Starting Group Tour Booking Tests');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Logs directory: ${logsDir}`);
  
  const results = [];
  
  for (const test of testBookings) {
    const result = await makeBookingRequest(test.productCode, test.name);
    results.push(result);
    
    // Wait a bit between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Summary
  console.log(`\n${'='.repeat(80)}`);
  console.log('TEST SUMMARY');
  console.log(`${'='.repeat(80)}`);
  
  results.forEach(result => {
    const status = result.success ? '✅ SUCCESS' : '❌ FAILED';
    console.log(`${status} - ${result.testName}`);
    if (result.requestFile) {
      console.log(`  Request:  ${path.basename(result.requestFile)}`);
      console.log(`  Response: ${path.basename(result.responseFile)}`);
    }
    if (result.error) {
      console.log(`  Error: ${result.error}`);
    }
  });
  
  console.log(`\n✅ All test files saved to: ${logsDir}`);
  console.log('\nYou can now review the XML files to see the exact differences between working and non-working tours.');
}

// Run the tests
runTests().catch(console.error);