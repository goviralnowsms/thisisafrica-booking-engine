/**
 * Test actual TourPlan API searches for Cruise and Rail
 * Instead of using curated catalogs, test the real API calls
 */

const fetch = require('node-fetch');

async function testTourPlanApiSearch(buttonName, destination = null) {
  const agentId = 'SAMAGT';
  const password = 'S@MAgt01';
  
  let xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>${buttonName}</ButtonName>`;

  // Add destination if provided
  if (destination) {
    xml += `
    <DestinationName>${destination}</DestinationName>`;
  }

  xml += `
  </OptionInfoRequest>
</Request>`;

  console.log(`\n🔍 Testing ${buttonName} search${destination ? ` for ${destination}` : ' (no destination)'}`);
  console.log('📤 XML Request:');
  console.log(xml);

  try {
    // Use proxy if available
    const proxyUrl = 'http://13.210.224.119:3128';
    const { HttpsProxyAgent } = require('https-proxy-agent');
    const agent = new HttpsProxyAgent(proxyUrl);

    const response = await fetch('https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
      },
      body: xml,
      agent,
      timeout: 30000,
    });

    const xmlResponse = await response.text();
    console.log('📥 XML Response:');
    console.log(xmlResponse);

    // Basic analysis
    if (xmlResponse.includes('<ErrorReply>')) {
      console.log('❌ Error response received');
    } else if (xmlResponse.includes('<Option>')) {
      // Count options
      const optionMatches = xmlResponse.match(/<Option>/g);
      const optionCount = optionMatches ? optionMatches.length : 0;
      console.log(`✅ Success: ${optionCount} products found`);
      
      // Extract some product codes for reference
      const codeMatches = xmlResponse.match(/<Opt>([^<]+)<\/Opt>/g);
      if (codeMatches) {
        const codes = codeMatches.slice(0, 5).map(match => match.replace(/<\/?Opt>/g, ''));
        console.log('📋 Sample product codes:', codes);
      }
    } else {
      console.log('⚠️ No products found in response');
    }

    return {
      buttonName,
      destination,
      success: !xmlResponse.includes('<ErrorReply>'),
      productCount: xmlResponse.includes('<Option>') ? (xmlResponse.match(/<Option>/g) || []).length : 0,
      xmlResponse
    };

  } catch (error) {
    console.log('❌ Request failed:', error.message);
    return {
      buttonName,
      destination,
      success: false,
      error: error.message
    };
  }
}

async function runTests() {
  console.log('🧪 TESTING TOURPLAN API SEARCHES FOR CRUISE AND RAIL');
  console.log('=' .repeat(60));
  
  const results = [];

  // Test Cruise searches
  console.log('\n🚢 TESTING CRUISE SEARCHES');
  results.push(await testTourPlanApiSearch('Cruises')); // No destination
  results.push(await testTourPlanApiSearch('Cruises', 'Kenya')); // With Kenya
  results.push(await testTourPlanApiSearch('Cruises', 'Botswana')); // With Botswana
  results.push(await testTourPlanApiSearch('Cruises', 'Namibia')); // With Namibia

  // Test Rail searches  
  console.log('\n🚂 TESTING RAIL SEARCHES');
  results.push(await testTourPlanApiSearch('Rail')); // No destination
  results.push(await testTourPlanApiSearch('Rail', 'Kenya')); // With Kenya
  results.push(await testTourPlanApiSearch('Rail', 'South Africa')); // With South Africa
  results.push(await testTourPlanApiSearch('Rail', 'Zimbabwe')); // With Zimbabwe

  // Summary
  console.log('\n📊 SUMMARY OF RESULTS');
  console.log('=' .repeat(60));
  
  const workingSearches = results.filter(r => r.success && r.productCount > 0);
  const emptySearches = results.filter(r => r.success && r.productCount === 0);
  const failedSearches = results.filter(r => !r.success);

  console.log(`✅ Working searches: ${workingSearches.length}`);
  workingSearches.forEach(r => {
    console.log(`   - ${r.buttonName}${r.destination ? ` (${r.destination})` : ''}: ${r.productCount} products`);
  });

  console.log(`⚠️ Empty results: ${emptySearches.length}`);
  emptySearches.forEach(r => {
    console.log(`   - ${r.buttonName}${r.destination ? ` (${r.destination})` : ''}: No products`);
  });

  console.log(`❌ Failed searches: ${failedSearches.length}`);
  failedSearches.forEach(r => {
    console.log(`   - ${r.buttonName}${r.destination ? ` (${r.destination})` : ''}: ${r.error}`);
  });

  console.log('\n🎯 CONCLUSION:');
  if (workingSearches.length === 0) {
    console.log('❌ NO CRUISE OR RAIL SEARCHES WORK - This confirms why we needed curated catalogs');
  } else {
    console.log('✅ Some searches work - We can potentially use API searches for some cases');
  }

  return results;
}

// Run the tests
runTests().catch(console.error);