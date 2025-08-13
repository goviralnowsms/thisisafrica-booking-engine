/**
 * TourPlan Configuration Diagnostic Script
 * Audits TourPlan setup to identify configuration issues preventing bookings
 */

const fs = require('fs');
const path = require('path');

// All product codes from your catalog that should be working
const ALL_PRODUCT_CODES = {
  'Group Tours': [
    'NBOGTARP001CKEKEE', // Classic Kenya - Keekorok lodges
    'NBOGTARP001THRKE3', // Three Kings Kenya
    'NBOGTARP001CKFSKE', // Classic Kenya - Four Seasons
    'NBOGTARP001CKENSE', // Classic Kenya - Endoro
    'NBOGTARP001CKTSKE', // Classic Kenya - Tortilis
    // Add more as needed
  ],
  'Cruises': [
    'BBKCRCHO018TIACP2', // Chobe Princess 2-night
    'BBKCRCHO018TIACP3', // Chobe Princess 3-night
    'BBKCRTVT001ZAM2NS', // Zambezi Queen 2-night standard
    'BBKCRTVT001ZAM2NM', // Zambezi Queen 2-night master
    'BBKCRTVT001ZAM3NS', // Zambezi Queen 3-night standard
    'BBKCRTVT001ZAM3NM', // Zambezi Queen 3-night master
  ],
  'Rail': [
    'VFARLROV001VFPRDX', // Victoria Falls to Pretoria
    'VFARLROV001VFPRRY', // Victoria Falls to Pretoria return
    'VFARLROV001VFPYPM', // Victoria Falls route
    'CPTRLROV001RRCTPR', // Return Cape Town to Pretoria
    'CPTRLROV001CTPPUL', // Cape Town to Pretoria
    // Add more as needed
  ],
  'Day Tours': [
    // Add day tour codes if needed
  ],
  'Packages': [
    // Add package codes if needed
  ],
  'Special Offers': [
    'GKPSPSABBLDSABBLS', // Sabi Sabi Bush Lodge Stay 4 pay 3
    'GKPSPSAV002SAVLHM', // Savanna Lodge special
    'HDSSPMAKUTSMSSCLS', // Classic Kruger Package
  ]
};

// Create audit results directory
const auditDir = path.join(__dirname, 'tourplan-audit-results');
if (!fs.existsSync(auditDir)) {
  fs.mkdirSync(auditDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

// Utility function to make API calls to localhost
async function makeLocalApiCall(endpoint, data = {}) {
  try {
    const baseUrl = 'http://localhost:3000'; // Use port 3000
    const url = data && Object.keys(data).length > 0 
      ? `${baseUrl}${endpoint}?${new URLSearchParams(data)}`
      : `${baseUrl}${endpoint}`;
      
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: Object.keys(data).length > 0 ? JSON.stringify(data) : '{}',
    });
    
    const result = await response.json();
    return { success: response.ok, data: result, httpStatus: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// 1. Test GetProductSearchDataRequest to see what Service Buttons are configured
async function auditServiceButtons() {
  console.log('\n🔍 AUDITING SERVICE BUTTONS CONFIGURATION');
  console.log('=' .repeat(60));
  
  // This diagnostic call will show us what Service Buttons exist in TourPlan
  const diagnosticXml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <GetProductSearchDataRequest>
    <AgentID>SAMAGT</AgentID>
    <Password>S@MAgt01</Password>
  </GetProductSearchDataRequest>
</Request>`;

  const result = await makeLocalApiCall('/api/tourplan/raw-xml', { xml: diagnosticXml });
  
  const auditResult = {
    test: 'Service Buttons Configuration',
    timestamp: new Date().toISOString(),
    success: result.success,
    findings: {}
  };

  if (result.success && result.data.success) {
    console.log('✅ GetProductSearchDataRequest successful');
    
    // Parse the XML response to extract Service Buttons
    try {
      const xmlData = result.data.xmlResponse || result.data.response;
      
      // Look for ServiceButtons in the response
      if (xmlData.includes('ServiceButton') || xmlData.includes('ButtonName')) {
        console.log('📋 Service Buttons found in TourPlan configuration');
        auditResult.findings.hasServiceButtons = true;
        auditResult.findings.rawXml = xmlData;
      } else {
        console.log('⚠️  No Service Buttons found in response');
        auditResult.findings.hasServiceButtons = false;
      }
    } catch (error) {
      console.log('❌ Error parsing XML response:', error.message);
      auditResult.findings.parseError = error.message;
    }
  } else {
    console.log('❌ GetProductSearchDataRequest failed:', result.error || result.data?.error);
    auditResult.findings.error = result.error || result.data?.error;
  }

  // Save results
  fs.writeFileSync(
    path.join(auditDir, `service-buttons-audit-${timestamp}.json`),
    JSON.stringify(auditResult, null, 2)
  );

  return auditResult;
}

// 2. Test each product type search to see what returns results
async function auditProductTypeSearches() {
  console.log('\n🔍 AUDITING PRODUCT TYPE SEARCHES');
  console.log('=' .repeat(60));

  const productTypes = ['Day Tours', 'Group Tours', 'Cruises', 'Rail', 'Packages', 'Special Offers'];
  const searchResults = {};

  for (const productType of productTypes) {
    console.log(`\n📊 Testing ${productType} search...`);
    
    const searchCriteria = {
      productType,
      destination: 'Kenya', // Use Kenya as test destination
    };

    const result = await makeLocalApiCall('/api/tourplan', searchCriteria);
    
    searchResults[productType] = {
      success: result.success,
      productCount: result.success && result.data.products ? result.data.products.length : 0,
      error: result.error || result.data?.error,
      sampleProducts: result.success && result.data.products ? 
        result.data.products.slice(0, 3).map(p => ({ code: p.code, name: p.name })) : []
    };

    if (result.success && result.data.products?.length > 0) {
      console.log(`✅ ${productType}: ${result.data.products.length} products found`);
    } else {
      console.log(`❌ ${productType}: No products found`);
      if (result.data?.error) {
        console.log(`   Error: ${result.data.error}`);
      }
    }
  }

  // Save results
  fs.writeFileSync(
    path.join(auditDir, `product-type-searches-${timestamp}.json`),
    JSON.stringify(searchResults, null, 2)
  );

  return searchResults;
}

// 3. Test individual product details to check ButtonName and configuration
async function auditIndividualProducts() {
  console.log('\n🔍 AUDITING INDIVIDUAL PRODUCT CONFIGURATIONS');
  console.log('=' .repeat(60));

  const productAudit = {};

  for (const [productType, productCodes] of Object.entries(ALL_PRODUCT_CODES)) {
    if (productCodes.length === 0) continue;
    
    console.log(`\n📦 Testing ${productType} products...`);
    productAudit[productType] = {};

    for (const productCode of productCodes) {
      console.log(`  🔍 ${productCode}...`);
      
      const result = await makeLocalApiCall(`/api/tourplan/pricing/${productCode}`);
      
      productAudit[productType][productCode] = {
        success: result.success,
        hasAvailability: result.success && result.data.availability ? result.data.availability.length > 0 : false,
        error: result.error || result.data?.error,
        sampleDates: result.success && result.data.availability ? 
          result.data.availability.slice(0, 5).map(d => ({ date: d.date, available: d.available })) : []
      };

      if (result.success) {
        console.log(`    ✅ Loads successfully`);
        if (result.data.availability && result.data.availability.length > 0) {
          const availableDays = result.data.availability.filter(d => d.available).length;
          console.log(`    📅 ${availableDays}/${result.data.availability.length} days available`);
        }
      } else {
        console.log(`    ❌ Failed: ${result.error || result.data?.error}`);
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Save results
  fs.writeFileSync(
    path.join(auditDir, `individual-products-${timestamp}.json`),
    JSON.stringify(productAudit, null, 2)
  );

  return productAudit;
}

// 4. Test booking creation for known working products
async function auditBookingCapabilities() {
  console.log('\n🔍 AUDITING BOOKING CAPABILITIES');
  console.log('=' .repeat(60));

  // Test products that should work for bookings
  const testProducts = [
    'NBOGTARP001CKEKEE', // Group tour that should work
    'BBKCRCHO018TIACP3', // Cruise that should work on Fridays
    'VFARLROV001VFPRDX', // Rail that should work
  ];

  const bookingResults = {};

  for (const productCode of testProducts) {
    console.log(`\n📝 Testing booking for ${productCode}...`);
    
    // Test with a future Friday (cruise products work on Fridays)
    const testDate = '2025-08-22'; // This should be a Friday
    
    const bookingData = {
      customerName: 'Test Customer Audit',
      productCode: productCode,
      rateId: 'Default',
      dateFrom: testDate,
      isQuote: true, // Create quote, not actual booking
      email: 'test@example.com',
      mobile: '+61 400 000 000',
      roomConfigs: [{ Adults: 2, Children: 0, Type: 'DB', Quantity: 1 }]
    };

    const result = await makeLocalApiCall('/api/tourplan/booking', bookingData);
    
    bookingResults[productCode] = {
      success: result.success,
      reference: result.success && result.data.booking ? result.data.booking.reference : null,
      status: result.success && result.data.booking ? result.data.booking.status : null,
      isManualProcessing: result.success && result.data.booking ? 
        result.data.booking.reference?.startsWith('TIA') : false,
      isTourPlanBooking: result.success && result.data.booking ? 
        result.data.booking.reference?.startsWith('TAWB') : false,
      error: result.error || result.data?.error,
      testDate: testDate
    };

    if (result.success && result.data.booking) {
      const ref = result.data.booking.reference;
      if (ref?.startsWith('TAWB')) {
        console.log(`    ✅ TOURPLAN BOOKING: ${ref} - Auto-processed`);
      } else if (ref?.startsWith('TIA')) {
        console.log(`    ⚠️  MANUAL BOOKING: ${ref} - Needs manual processing`);
      } else {
        console.log(`    ❓ UNKNOWN BOOKING: ${ref}`);
      }
    } else {
      console.log(`    ❌ BOOKING FAILED: ${result.error || result.data?.error}`);
    }

    // Longer delay for booking tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Save results
  fs.writeFileSync(
    path.join(auditDir, `booking-capabilities-${timestamp}.json`),
    JSON.stringify(bookingResults, null, 2)
  );

  return bookingResults;
}

// 5. Generate comprehensive audit report
function generateAuditReport(serviceButtons, productSearches, individualProducts, bookingResults) {
  console.log('\n📊 GENERATING AUDIT REPORT');
  console.log('=' .repeat(60));

  const report = {
    auditDate: new Date().toISOString(),
    summary: {
      serviceButtonsConfigured: serviceButtons.findings.hasServiceButtons || false,
      workingProductTypes: Object.keys(productSearches).filter(pt => productSearches[pt].success && productSearches[pt].productCount > 0),
      failingProductTypes: Object.keys(productSearches).filter(pt => !productSearches[pt].success || productSearches[pt].productCount === 0),
      totalProductsTested: Object.values(individualProducts).reduce((acc, products) => acc + Object.keys(products).length, 0),
      workingProducts: [],
      failingProducts: [],
      bookingCapable: Object.keys(bookingResults).filter(p => bookingResults[p].isTourPlanBooking),
      manualProcessing: Object.keys(bookingResults).filter(p => bookingResults[p].isManualProcessing),
    },
    details: {
      serviceButtons,
      productSearches,
      individualProducts,
      bookingResults
    },
    recommendations: []
  };

  // Analyze individual products
  for (const [type, products] of Object.entries(individualProducts)) {
    for (const [code, result] of Object.entries(products)) {
      if (result.success) {
        report.summary.workingProducts.push({ type, code, hasAvailability: result.hasAvailability });
      } else {
        report.summary.failingProducts.push({ type, code, error: result.error });
      }
    }
  }

  // Generate recommendations
  if (!serviceButtons.findings.hasServiceButtons) {
    report.recommendations.push({
      priority: 'HIGH',
      issue: 'Service Buttons not properly configured',
      solution: 'Configure Service Buttons in TourPlan: Day Tours, Group Tours, Cruises, Rail, Packages, Special Offers'
    });
  }

  for (const [type, result] of Object.entries(productSearches)) {
    if (!result.success || result.productCount === 0) {
      report.recommendations.push({
        priority: 'HIGH',
        issue: `${type} search returns no results`,
        solution: `Check ButtonName mapping for ${type} products in TourPlan. Products must have ButtonName="${type}" exactly.`
      });
    }
  }

  const failingProducts = report.summary.failingProducts;
  if (failingProducts.length > 0) {
    report.recommendations.push({
      priority: 'MEDIUM',
      issue: `${failingProducts.length} individual products not loading`,
      solution: 'Check product codes, rate configurations, and date ranges in TourPlan'
    });
  }

  const manualProcessing = report.summary.manualProcessing;
  if (manualProcessing.length > 0) {
    report.recommendations.push({
      priority: 'MEDIUM',
      issue: `${manualProcessing.length} products require manual processing`,
      solution: 'Review booking configuration in TourPlan - may need service status or rate setup changes'
    });
  }

  // Save comprehensive report
  fs.writeFileSync(
    path.join(auditDir, `tourplan-audit-report-${timestamp}.json`),
    JSON.stringify(report, null, 2)
  );

  // Generate human-readable summary
  const summaryText = `
TOURPLAN CONFIGURATION AUDIT REPORT
Generated: ${new Date().toLocaleString()}

SUMMARY:
✅ Working Product Types: ${report.summary.workingProductTypes.join(', ') || 'None'}
❌ Failing Product Types: ${report.summary.failingProductTypes.join(', ') || 'None'}
✅ Products Loading: ${report.summary.workingProducts.length}/${report.summary.totalProductsTested}
✅ Auto-Booking Capable: ${report.summary.bookingCapable.length} products
⚠️  Manual Processing: ${report.summary.manualProcessing.length} products

CRITICAL RECOMMENDATIONS:
${report.recommendations.filter(r => r.priority === 'HIGH').map(r => `• ${r.issue}: ${r.solution}`).join('\n')}

DETAILED RESULTS:
- Service Buttons Configured: ${report.summary.serviceButtonsConfigured ? 'Yes' : 'No'}
- Working Product Types: ${report.summary.workingProductTypes.join(', ')}
- Failing Product Types: ${report.summary.failingProductTypes.join(', ')}

See JSON files for detailed technical data.
`;

  fs.writeFileSync(
    path.join(auditDir, `audit-summary-${timestamp}.txt`),
    summaryText
  );

  console.log('\n📋 AUDIT COMPLETE');
  console.log('📁 Results saved to:', auditDir);
  console.log('\n' + summaryText);

  return report;
}

// Main audit function
async function runTourPlanAudit() {
  console.log('🏥 TOURPLAN CONFIGURATION DIAGNOSTIC AUDIT');
  console.log('='.repeat(60));
  console.log('This audit will identify TourPlan configuration issues');
  console.log('preventing successful product searches and bookings.\n');

  try {
    // Run all audit tests
    const serviceButtons = await auditServiceButtons();
    const productSearches = await auditProductTypeSearches();
    const individualProducts = await auditIndividualProducts();
    const bookingResults = await auditBookingCapabilities();

    // Generate comprehensive report
    const report = generateAuditReport(serviceButtons, productSearches, individualProducts, bookingResults);

    console.log('\n🎯 AUDIT COMPLETED SUCCESSFULLY');
    console.log('📊 Use these results to identify specific TourPlan configuration issues');
    console.log('📧 Send the JSON files to TourPlan support for configuration assistance');

    return report;

  } catch (error) {
    console.error('❌ AUDIT FAILED:', error);
    process.exit(1);
  }
}

// Run the audit if called directly
if (require.main === module) {
  runTourPlanAudit().catch(console.error);
}

module.exports = { runTourPlanAudit };