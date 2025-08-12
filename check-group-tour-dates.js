const fs = require('fs');
const path = require('path');

// TourPlan API configuration
const API_URL = 'https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi';
const AGENT_ID = 'SAMAGT';
const PASSWORD = 'S@MAgt01';

// Group tours to check
const groupTours = [
  'NBOGTARP001CKEKEE', // Working tour - Classic Kenya Keekorok
  'NBOGTARP001THRSE3'  // Non-working tour - Three Serengeti
];

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'tourplan-logs', 'group-tour-dates');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Function to get product pricing/availability
function createPricingXML(productCode) {
  // Request dates from now until 6 months ahead to see available dates
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 6);
  
  const dateFrom = startDate.toISOString().split('T')[0];
  const dateTo = endDate.toISOString().split('T')[0];
  
  return `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${AGENT_ID}</AgentID>
    <Password>${PASSWORD}</Password>
    <Opt>${productCode}</Opt>
    <DateFrom>${dateFrom}</DateFrom>
    <DateTo>${dateTo}</DateTo>
    <Adults>2</Adults>
  </OptionInfoRequest>
</Request>`;
}

// Function to extract available dates from XML response
function extractAvailableDates(responseXML) {
  const availableDates = [];
  
  // Look for OptDateRange elements
  const dateRangePattern = /<OptDateRange>(.*?)<\/OptDateRange>/gs;
  let match;
  
  while ((match = dateRangePattern.exec(responseXML)) !== null) {
    const dateRangeContent = match[1];
    
    // Extract DateFrom
    const dateFromMatch = dateRangeContent.match(/<DateFrom>(.*?)<\/DateFrom>/);
    if (dateFromMatch) {
      const date = dateFromMatch[1];
      // Check if there are actual rates (not just empty rates)
      const hasRates = dateRangeContent.includes('<RoomRates>') || dateRangeContent.includes('<Rate>');
      if (hasRates) {
        availableDates.push(date);
      }
    }
  }
  
  return availableDates;
}

// Function to check dates for a product
async function checkProductDates(productCode) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Checking available dates for: ${productCode}`);
  console.log(`${'='.repeat(60)}`);
  
  const requestXML = createPricingXML(productCode);
  
  // Save request XML
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const requestFile = path.join(logsDir, `${productCode}-dates-request-${timestamp}.xml`);
  fs.writeFileSync(requestFile, requestXML, 'utf8');
  
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
    const responseFile = path.join(logsDir, `${productCode}-dates-response-${timestamp}.xml`);
    fs.writeFileSync(responseFile, responseXML, 'utf8');
    
    console.log(`📝 Request saved: ${path.basename(requestFile)}`);
    console.log(`📝 Response saved: ${path.basename(responseFile)}`);
    
    // Extract available dates
    const availableDates = extractAvailableDates(responseXML);
    
    console.log(`\n📅 Available departure dates:`);
    if (availableDates.length > 0) {
      availableDates.forEach((date, index) => {
        const dateObj = new Date(date);
        const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        console.log(`   ${index + 1}. ${date} (${dayOfWeek})`);
      });
      
      // Analyze pattern
      const daysOfWeek = availableDates.map(date => {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('en-US', { weekday: 'long' });
      });
      
      const uniqueDays = [...new Set(daysOfWeek)];
      console.log(`\n📊 Departure pattern: ${uniqueDays.join(', ')}`);
      
      return availableDates;
    } else {
      console.log(`   No available dates found or product has pricing issues`);
      
      // Check for errors
      if (responseXML.includes('<Error>')) {
        const errorMatch = responseXML.match(/<Error>(.*?)<\/Error>/);
        if (errorMatch) {
          console.log(`   Error: ${errorMatch[1]}`);
        }
      }
      
      return [];
    }
    
  } catch (error) {
    console.error(`❌ Request failed: ${error.message}`);
    return [];
  }
}

// Main function
async function checkAllDates() {
  console.log('🔍 Checking Group Tour Available Dates');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Logs directory: ${logsDir}`);
  
  const results = {};
  
  for (const productCode of groupTours) {
    const dates = await checkProductDates(productCode);
    results[productCode] = dates;
    
    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log(`\n${'='.repeat(80)}`);
  console.log('SUMMARY - AVAILABLE DATES FOR BOOKING TESTS');
  console.log(`${'='.repeat(80)}`);
  
  Object.keys(results).forEach(productCode => {
    console.log(`\n${productCode}:`);
    const dates = results[productCode];
    if (dates.length > 0) {
      console.log(`✅ ${dates.length} available dates found`);
      console.log(`   First available: ${dates[0]}`);
      console.log(`   Use this date for booking test: ${dates[0]}`);
    } else {
      console.log(`❌ No available dates found`);
    }
  });
  
  console.log(`\n💡 Use the "First available" dates above for your booking tests`);
  console.log(`📁 All XML files saved to: ${logsDir}`);
}

// Run the check
checkAllDates().catch(console.error);