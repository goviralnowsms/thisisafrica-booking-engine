/**
 * Test Cruise vs Cruises ButtonName to see if singular/plural matters
 */

const fetch = require('node-fetch');

async function testCruiseButtonName(buttonName, destination = null) {
  const agentId = 'SAMAGT';
  const password = 'S@MAgt01';
  
  let xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>${buttonName}</ButtonName>`;

  if (destination) {
    xml += `
    <DestinationName>${destination}</DestinationName>`;
  }

  xml += `
  </OptionInfoRequest>
</Request>`;

  console.log(`\n🔍 Testing ButtonName="${buttonName}"${destination ? ` for ${destination}` : ''}`);
  console.log('📤 XML Request:');
  console.log(xml);

  try {
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

    // Analyze response
    if (xmlResponse.includes('<ErrorReply>')) {
      console.log('❌ Error response received');
      return { buttonName, destination, status: 'ERROR', response: xmlResponse };
    } else if (xmlResponse.includes('<Option>')) {
      const optionMatches = xmlResponse.match(/<Option>/g);
      const optionCount = optionMatches ? optionMatches.length : 0;
      console.log(`✅ Success: ${optionCount} products found`);
      
      // Extract product codes
      const codeMatches = xmlResponse.match(/<Opt>([^<]+)<\/Opt>/g);
      if (codeMatches) {
        const codes = codeMatches.slice(0, 5).map(match => match.replace(/<\/?Opt>/g, ''));
        console.log('📋 Product codes:', codes);
      }
      
      return { buttonName, destination, status: 'SUCCESS', productCount: optionCount, response: xmlResponse };
    } else {
      console.log('⚠️ No products found');
      return { buttonName, destination, status: 'EMPTY', productCount: 0, response: xmlResponse };
    }

  } catch (error) {
    console.log('❌ Request failed:', error.message);
    return { buttonName, destination, status: 'FAILED', error: error.message };
  }
}

async function runTests() {
  console.log('🧪 TESTING CRUISE BUTTONNAME VARIATIONS');
  console.log('Testing singular vs plural and different destinations');
  console.log('=' .repeat(60));
  
  const tests = [
    // Test singular vs plural
    { buttonName: 'Cruise', destination: null },
    { buttonName: 'Cruises', destination: null },
    
    // Test with Botswana (where cruises actually operate)
    { buttonName: 'Cruise', destination: 'Botswana' },
    { buttonName: 'Cruises', destination: 'Botswana' },
    
    // Test with Namibia (cruises visit Namibian waters)
    { buttonName: 'Cruise', destination: 'Namibia' },
    { buttonName: 'Cruises', destination: 'Namibia' },
    
    // Test other variations
    { buttonName: 'River Cruise', destination: null },
    { buttonName: 'River Cruises', destination: null },
    { buttonName: 'Cruise Tours', destination: null },
    
    // Test case variations
    { buttonName: 'cruise', destination: null },
    { buttonName: 'cruises', destination: null },
    { buttonName: 'CRUISE', destination: null },
    { buttonName: 'CRUISES', destination: null },
  ];

  const results = [];
  
  for (const test of tests) {
    const result = await testCruiseButtonName(test.buttonName, test.destination);
    results.push(result);
    
    // Delay between requests
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 SUMMARY OF CRUISE BUTTONNAME TESTS');
  console.log('='.repeat(80));
  
  const working = results.filter(r => r.status === 'SUCCESS');
  const empty = results.filter(r => r.status === 'EMPTY');
  const errors = results.filter(r => r.status === 'ERROR');
  const failed = results.filter(r => r.status === 'FAILED');

  console.log(`\n✅ WORKING (${working.length}):`)
  working.forEach(r => {
    console.log(`   - "${r.buttonName}"${r.destination ? ` (${r.destination})` : ''}: ${r.productCount} products`);
  });

  console.log(`\n⚠️ EMPTY RESULTS (${empty.length}):`)
  empty.forEach(r => {
    console.log(`   - "${r.buttonName}"${r.destination ? ` (${r.destination})` : ''}`);
  });

  console.log(`\n❌ ERRORS (${errors.length}):`)
  errors.forEach(r => {
    console.log(`   - "${r.buttonName}"${r.destination ? ` (${r.destination})` : ''}`);
  });

  console.log(`\n💥 FAILED (${failed.length}):`)
  failed.forEach(r => {
    console.log(`   - "${r.buttonName}"${r.destination ? ` (${r.destination})` : ''}: ${r.error}`);
  });

  console.log('\n🎯 CONCLUSION:');
  if (working.length > 0) {
    console.log('✅ Found working ButtonName variations! Use these:');
    working.forEach(r => {
      console.log(`   → "${r.buttonName}"${r.destination ? ` with destination "${r.destination}"` : ''}`);
    });
  } else {
    console.log('❌ No ButtonName variations work - this confirms TourPlan configuration issue');
    console.log('   → All cruise products likely missing ButtonName mapping in TourPlan');
    console.log('   → Need to ask TourPlan support to configure Service Button for cruises');
  }

  return results;
}

runTests().catch(console.error);