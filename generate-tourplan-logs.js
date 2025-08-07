// Generate comprehensive TourPlan API logs for support email
const fs = require('fs');
const path = require('path');

async function makeRequest(productType, destination = '', dateFrom = '', dateTo = '') {
  try {
    const params = new URLSearchParams({
      productType: productType,
      adults: '2',
      children: '0'
    });
    
    if (destination) params.set('destination', destination);
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);
    
    const url = `http://localhost:3004/api/tourplan?${params.toString()}`;
    const response = await fetch(url);
    const result = await response.json();
    
    return {
      success: result.success,
      count: result.tours?.length || 0,
      firstProduct: result.tours?.[0] || null,
      error: result.error
    };
  } catch (error) {
    return {
      success: false,
      count: 0,
      error: error.message
    };
  }
}

async function generateLogs() {
  console.log('🔍 Generating TourPlan API test logs...\n');
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const logDir = path.join('tourplan-logs', `test-${timestamp}`);
  
  // Create log directory
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  const results = [];
  
  // Test 1: Accommodation with various destinations
  console.log('Testing Accommodation ButtonName...');
  const accommodationTests = [
    { destination: 'Cape Town', dateFrom: '2025-03-01', dateTo: '2025-03-07' },
    { destination: 'Nairobi', dateFrom: '2025-03-01', dateTo: '2025-03-07' },
    { destination: '', dateFrom: '', dateTo: '' }, // No filters
  ];
  
  for (const test of accommodationTests) {
    const result = await makeRequest('Accommodation', test.destination, test.dateFrom, test.dateTo);
    results.push({
      test: `Accommodation - ${test.destination || 'All'}`,
      ...result
    });
    console.log(`  ${test.destination || 'All destinations'}: ${result.count} results`);
  }
  
  // Test 2: Alternative ButtonNames for accommodation
  console.log('\nTesting alternative ButtonNames...');
  const alternativeNames = ['Hotels', 'Hotel', 'Lodge', 'Lodges', 'Resort', 'Resorts'];
  
  for (const buttonName of alternativeNames) {
    const result = await makeRequest(buttonName, 'Cape Town');
    results.push({
      test: `${buttonName} - Cape Town`,
      ...result
    });
    console.log(`  ${buttonName}: ${result.count} results`);
  }
  
  // Test 3: Working product types
  console.log('\nTesting known working product types...');
  const workingTypes = [
    { type: 'Cruises', destination: '' },
    { type: 'Rail', destination: '' },
    { type: 'Group Tours', destination: 'Kenya' },
    { type: 'Day Tours', destination: 'Cape Town' },
    { type: 'Packages', destination: 'Botswana' }
  ];
  
  for (const test of workingTypes) {
    const result = await makeRequest(test.type, test.destination);
    results.push({
      test: `${test.type} - ${test.destination || 'All'}`,
      ...result
    });
    console.log(`  ${test.type} (${test.destination || 'All'}): ${result.count} results`);
  }
  
  // Write summary log
  const summaryLog = {
    timestamp: new Date().toISOString(),
    testEnvironment: 'http://localhost:3004',
    totalTests: results.length,
    results: results,
    summary: {
      accommodationWorking: results.filter(r => r.test.includes('Accommodation') && r.count > 0).length > 0,
      alternativesWorking: results.filter(r => alternativeNames.some(n => r.test.includes(n)) && r.count > 0).length > 0,
      cruisesWorking: results.find(r => r.test.includes('Cruises'))?.count > 0,
      railWorking: results.find(r => r.test.includes('Rail'))?.count > 0,
    }
  };
  
  fs.writeFileSync(
    path.join(logDir, 'test-summary.json'),
    JSON.stringify(summaryLog, null, 2)
  );
  
  // Create human-readable report
  let report = `TourPlan API Test Report
Generated: ${new Date().toISOString()}
================================

ACCOMMODATION SEARCH TESTS
--------------------------
`;
  
  results.filter(r => r.test.includes('Accommodation') || alternativeNames.some(n => r.test.includes(n)))
    .forEach(r => {
      report += `${r.test}: ${r.count > 0 ? '✅' : '❌'} ${r.count} results\n`;
    });
  
  report += `
OTHER PRODUCT TYPES
-------------------
`;
  
  results.filter(r => !r.test.includes('Accommodation') && !alternativeNames.some(n => r.test.includes(n)))
    .forEach(r => {
      report += `${r.test}: ${r.count > 0 ? '✅' : '❌'} ${r.count} results\n`;
    });
  
  report += `
SUMMARY
-------
✅ Working ButtonNames: ${results.filter(r => r.count > 0).map(r => r.test.split(' - ')[0]).filter((v, i, a) => a.indexOf(v) === i).join(', ') || 'None'}
❌ Not Working: ${results.filter(r => r.count === 0).map(r => r.test.split(' - ')[0]).filter((v, i, a) => a.indexOf(v) === i).join(', ') || 'None'}

CONCLUSION
----------
`;
  
  if (summaryLog.summary.accommodationWorking) {
    report += 'Accommodation searches ARE returning results.\n';
  } else if (summaryLog.summary.alternativesWorking) {
    report += 'Alternative ButtonNames ARE working for accommodation.\n';
  } else {
    report += 'NO accommodation ButtonName variations are returning results.\n';
    report += 'TourPlan either uses a different ButtonName or doesn\'t support accommodation via API.\n';
  }
  
  fs.writeFileSync(path.join(logDir, 'test-report.txt'), report);
  
  console.log(`\n📁 Logs saved to: ${logDir}`);
  console.log('Files created:');
  console.log('  - test-summary.json (detailed results)');
  console.log('  - test-report.txt (human-readable report)');
  
  return summaryLog;
}

generateLogs().then(summary => {
  console.log('\n📊 Final Summary:');
  console.log(`Accommodation working: ${summary.summary.accommodationWorking ? '✅' : '❌'}`);
  console.log(`Alternative names working: ${summary.summary.alternativesWorking ? '✅' : '❌'}`);
  console.log(`Cruises working: ${summary.summary.cruisesWorking ? '✅' : '❌'}`);
  console.log(`Rail working: ${summary.summary.railWorking ? '✅' : '❌'}`);
});