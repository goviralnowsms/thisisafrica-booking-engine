#!/usr/bin/env node

/**
 * Script to capture XML request/response pairs for TourPlan support
 * Tests working vs non-working Rail products for booking attempts
 */

const fs = require('fs');
const path = require('path');

// TourPlan API configuration
const TOURPLAN_CONFIG = {
  endpoint: 'https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi',
  agentId: 'SAMAGT',
  password: 'S@MAgt01'
};

// Test products based on CLAUDE.md documentation
const RAIL_PRODUCTS = {
  working: [
    { code: 'VFARLROV001VFPRDX', name: 'Victoria Falls to Pretoria', description: 'Working Rail - Status OK' },
    { code: 'VFARLROV001VFPRRY', name: 'Victoria Falls to Pretoria return', description: 'Working Rail - Status OK' },
    { code: 'CPTRLROV001RRCTPR', name: 'Return Cape Town to Pretoria', description: 'Working Rail - Status OK' }
  ],
  notWorking: [
    { code: 'CPTRLROV001BLUETR', name: 'Blue Train Cape Town', description: 'Non-working Rail - Status NO' },
    { code: 'CPTRLROV001SHTRLG', name: 'Shongololo Express', description: 'Non-working Rail - Status NO' },
    { code: 'DURRLROV001DURPR1', name: 'Durban to Pretoria', description: 'Non-working Rail - Status NO' }
  ]
};

// Function to make XML request to TourPlan
async function makeXmlRequest(xml, description) {
  console.log(`\n🚂 Testing: ${description}`);
  
  try {
    const response = await fetch(TOURPLAN_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
        'User-Agent': 'This-Is-Africa-Booking-Engine/1.0'
      },
      body: xml
    });
    
    const responseXml = await response.text();
    
    console.log(`✅ Response received (${response.status})`);
    
    return {
      request: xml,
      response: responseXml,
      status: response.status,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`❌ Request failed:`, error.message);
    return {
      request: xml,
      response: null,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Build XML for AddServiceRequest (booking attempt)
function buildBookingXml(productCode, description) {
  const xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <AddServiceRequest>
    <AgentID>${TOURPLAN_CONFIG.agentId}</AgentID>
    <Password>${TOURPLAN_CONFIG.password}</Password>
    <QB>B</QB>
    <Notes>Test booking for TourPlan support - ${description}</Notes>
    <Service>
      <ServiceType>Rail</ServiceType>
      <OptionalService>
        <Opt>${productCode}</Opt>
        <DateFrom>2025-10-15</DateFrom>
        <SCUqty>2</SCUqty>
        <RoomConfigs>
          <RoomConfig>
            <Adults>2</Adults>
          </RoomConfig>
        </RoomConfigs>
        <RateId>Standard</RateId>
      </OptionalService>
      <Passengers>
        <Passenger>
          <Title>Mr</Title>
          <FirstName>John</FirstName>
          <LastName>Test</LastName>
          <DateOfBirth>1980-05-15</DateOfBirth>
        </Passenger>
        <Passenger>
          <Title>Mrs</Title>
          <FirstName>Jane</FirstName>
          <LastName>Test</LastName>
          <DateOfBirth>1982-08-22</DateOfBirth>
        </Passenger>
      </Passengers>
    </Service>
    <BookingCustomer>
      <PersonName>
        <Title>Mr</Title>
        <FirstName>John</FirstName>
        <LastName>Test</LastName>
      </PersonName>
      <Address>
        <AddressLine>123 Test Street</AddressLine>
        <CityName>Sydney</CityName>
        <StateProv>NSW</StateProv>
        <PostalCode>2000</PostalCode>
        <CountryName>Australia</CountryName>
      </Address>
      <Email>test@thisisafrica.com.au</Email>
      <Telephone PhoneNumber="+61400123456" />
    </BookingCustomer>
  </AddServiceRequest>
</Request>`;

  return xml;
}

// Save XML to file
function saveXmlToFile(data, filename) {
  const logsDir = path.join(__dirname, 'tourplan-logs', 'rail-support-examples');
  
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  
  const filePath = path.join(logsDir, filename);
  fs.writeFileSync(filePath, data, 'utf8');
  console.log(`📁 Saved to: ${filePath}`);
}

// Main execution function
async function runRailTests() {
  console.log('🎯 TourPlan Rail Booking Test - XML Capture for Support');
  console.log('=' .repeat(60));
  
  const results = {
    working: [],
    notWorking: [],
    summary: {
      timestamp: new Date().toISOString(),
      purpose: 'XML request/response pairs for TourPlan support - Rail booking status analysis'
    }
  };
  
  // Test 1 working Rail product
  const workingProduct = RAIL_PRODUCTS.working[0]; // VFARLROV001VFPRDX
  console.log(`\n🟢 TESTING WORKING RAIL: ${workingProduct.code}`);
  
  const workingXml = buildBookingXml(workingProduct.code, workingProduct.description);
  const workingResult = await makeXmlRequest(workingXml, `${workingProduct.name} (${workingProduct.code})`);
  
  // Save working example
  saveXmlToFile(workingResult.request, `working-rail-${workingProduct.code}-request.xml`);
  saveXmlToFile(workingResult.response, `working-rail-${workingProduct.code}-response.xml`);
  
  results.working.push({
    product: workingProduct,
    ...workingResult
  });
  
  // Test 1 non-working Rail product  
  const nonWorkingProduct = RAIL_PRODUCTS.notWorking[0]; // CPTRLROV001BLUETR
  console.log(`\n🔴 TESTING NON-WORKING RAIL: ${nonWorkingProduct.code}`);
  
  const nonWorkingXml = buildBookingXml(nonWorkingProduct.code, nonWorkingProduct.description);
  const nonWorkingResult = await makeXmlRequest(nonWorkingXml, `${nonWorkingProduct.name} (${nonWorkingProduct.code})`);
  
  // Save non-working example
  saveXmlToFile(nonWorkingResult.request, `nonworking-rail-${nonWorkingProduct.code}-request.xml`);
  saveXmlToFile(nonWorkingResult.response, `nonworking-rail-${nonWorkingProduct.code}-response.xml`);
  
  results.notWorking.push({
    product: nonWorkingProduct,
    ...nonWorkingResult
  });
  
  // Save summary report
  const summaryReport = `TourPlan Rail Booking Analysis Report
Generated: ${results.summary.timestamp}
Purpose: ${results.summary.purpose}

WORKING RAIL PRODUCT TEST:
Product: ${workingProduct.code} - ${workingProduct.name}
Status: ${workingResult.error ? 'ERROR' : 'SUCCESS'}
${workingResult.error ? `Error: ${workingResult.error}` : ''}

NON-WORKING RAIL PRODUCT TEST:
Product: ${nonWorkingProduct.code} - ${nonWorkingProduct.name} 
Status: ${nonWorkingResult.error ? 'ERROR' : 'SUCCESS'}
${nonWorkingResult.error ? `Error: ${nonWorkingResult.error}` : ''}

FILES GENERATED:
- working-rail-${workingProduct.code}-request.xml
- working-rail-${workingProduct.code}-response.xml
- nonworking-rail-${nonWorkingProduct.code}-request.xml
- nonworking-rail-${nonWorkingProduct.code}-response.xml

These files can be sent to TourPlan support for analysis.
`;
  
  saveXmlToFile(summaryReport, 'rail-support-analysis-report.txt');
  
  console.log('\n📋 SUMMARY REPORT:');
  console.log('=' .repeat(40));
  console.log(summaryReport);
  
  console.log('\n✅ XML capture completed! Files saved to tourplan-logs/rail-support-examples/');
  console.log('📧 Send these files to TourPlan support for analysis.');
  
  return results;
}

// Run the tests
runRailTests().catch(console.error);