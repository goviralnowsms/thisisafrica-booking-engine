/**
 * Compare XML requests for working vs non-working searches
 * This will help identify what TourPlan needs to configure for Cruise searches
 */

const fetch = require('node-fetch');

// Function to build and log different search requests
function buildSearchRequests() {
  const agentId = 'SAMAGT';
  const password = 'S@MAgt01';
  const destination = 'Kenya';  // Use same destination for all tests

  const searches = {
    'Group Tours (WORKING)': `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>Group Tours</ButtonName>
    <DestinationName>${destination}</DestinationName>
    <Info>GMFTD</Info>
  </OptionInfoRequest>
</Request>`,

    'Rail South Africa (WORKING)': `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>Rail</ButtonName>
    <DestinationName>South Africa</DestinationName>
  </OptionInfoRequest>
</Request>`,

    'Cruises (NOT WORKING)': `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>Cruises</ButtonName>
    <DestinationName>Botswana</DestinationName>
  </OptionInfoRequest>
</Request>`,

    'Cruises No Destination (NOT WORKING)': `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>Cruises</ButtonName>
  </OptionInfoRequest>
</Request>`,

    'Day Tours (WORKING)': `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>Day Tours</ButtonName>
    <DestinationName>${destination}</DestinationName>
    <Info>D</Info>
  </OptionInfoRequest>
</Request>`,

    'Packages (WORKING)': `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>Packages</ButtonName>
    <DestinationName>${destination}</DestinationName>
    <Info>P</Info>
  </OptionInfoRequest>
</Request>`,

    'Special Offers (NOT WORKING)': `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>Special Offers</ButtonName>
    <DestinationName>${destination}</DestinationName>
  </OptionInfoRequest>
</Request>`,

    'Accommodation (NOT WORKING)': `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>Accommodation</ButtonName>
    <DestinationName>${destination}</DestinationName>
  </OptionInfoRequest>
</Request>`
  };

  return searches;
}

async function testSearchRequest(name, xml) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🔍 TESTING: ${name}`);
  console.log(`${'='.repeat(60)}`);
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

    // Analyze the response
    const analysis = analyzeResponse(xmlResponse);
    console.log('\n📊 ANALYSIS:');
    console.log(`Status: ${analysis.status}`);
    console.log(`Product Count: ${analysis.productCount}`);
    console.log(`Has Error: ${analysis.hasError}`);
    console.log(`Error Message: ${analysis.errorMessage || 'None'}`);
    console.log(`Response Size: ${xmlResponse.length} characters`);

    return {
      name,
      xml,
      response: xmlResponse,
      analysis
    };

  } catch (error) {
    console.log('❌ Request failed:', error.message);
    return {
      name,
      xml,
      error: error.message
    };
  }
}

function analyzeResponse(xmlResponse) {
  const analysis = {
    status: 'UNKNOWN',
    productCount: 0,
    hasError: false,
    errorMessage: null,
    responseSize: xmlResponse.length
  };

  // Check for errors
  if (xmlResponse.includes('<ErrorReply>')) {
    analysis.hasError = true;
    analysis.status = 'ERROR';
    const errorMatch = xmlResponse.match(/<Error[^>]*>([^<]*)<\/Error>/);
    if (errorMatch) {
      analysis.errorMessage = errorMatch[1];
    }
  }
  // Check for empty reply
  else if (xmlResponse.includes('<OptionInfoReply />') || xmlResponse.includes('<OptionInfoReply></OptionInfoReply>')) {
    analysis.status = 'EMPTY';
    analysis.productCount = 0;
  }
  // Check for products
  else if (xmlResponse.includes('<Option>')) {
    analysis.status = 'SUCCESS';
    const optionMatches = xmlResponse.match(/<Option>/g);
    analysis.productCount = optionMatches ? optionMatches.length : 0;
  }
  else {
    analysis.status = 'UNKNOWN_FORMAT';
  }

  return analysis;
}

async function runComparison() {
  console.log('🔬 TOURPLAN SEARCH REQUEST COMPARISON');
  console.log('Analyzing differences between working and non-working searches');
  console.log('This will help identify what TourPlan needs to configure\n');

  const searches = buildSearchRequests();
  const results = [];

  // Test each search type
  for (const [name, xml] of Object.entries(searches)) {
    const result = await testSearchRequest(name, xml);
    results.push(result);
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Generate comparison analysis
  console.log('\n' + '='.repeat(80));
  console.log('📊 COMPARISON SUMMARY');
  console.log('='.repeat(80));

  const working = results.filter(r => r.analysis?.status === 'SUCCESS');
  const empty = results.filter(r => r.analysis?.status === 'EMPTY');
  const errors = results.filter(r => r.analysis?.status === 'ERROR');

  console.log('\n✅ WORKING SEARCHES:');
  working.forEach(r => {
    console.log(`   - ${r.name}: ${r.analysis.productCount} products`);
  });

  console.log('\n⚠️ EMPTY RESULTS:');
  empty.forEach(r => {
    console.log(`   - ${r.name}: No products returned`);
  });

  console.log('\n❌ ERROR RESPONSES:');
  errors.forEach(r => {
    console.log(`   - ${r.name}: ${r.analysis?.errorMessage || r.error || 'Unknown error'}`);
  });

  // Identify patterns
  console.log('\n🔍 PATTERN ANALYSIS:');
  console.log('='.repeat(50));

  // Info parameter analysis
  const withInfo = results.filter(r => r.xml.includes('<Info>'));
  const withoutInfo = results.filter(r => !r.xml.includes('<Info>'));
  
  console.log('\nSearches WITH Info parameter:');
  withInfo.forEach(r => {
    const infoMatch = r.xml.match(/<Info>([^<]*)<\/Info>/);
    const info = infoMatch ? infoMatch[1] : 'N/A';
    console.log(`   - ${r.name} (Info="${info}"): ${r.analysis?.status || 'ERROR'}`);
  });

  console.log('\nSearches WITHOUT Info parameter:');
  withoutInfo.forEach(r => {
    console.log(`   - ${r.name}: ${r.analysis?.status || 'ERROR'}`);
  });

  // ButtonName analysis
  console.log('\n📋 BUTTONNAME ANALYSIS:');
  const buttonNames = {};
  results.forEach(r => {
    const buttonMatch = r.xml.match(/<ButtonName>([^<]*)<\/ButtonName>/);
    if (buttonMatch) {
      const buttonName = buttonMatch[1];
      if (!buttonNames[buttonName]) {
        buttonNames[buttonName] = [];
      }
      buttonNames[buttonName].push({
        name: r.name,
        status: r.analysis?.status || 'ERROR',
        productCount: r.analysis?.productCount || 0
      });
    }
  });

  Object.entries(buttonNames).forEach(([buttonName, searches]) => {
    console.log(`\n${buttonName}:`);
    searches.forEach(s => {
      console.log(`   - ${s.name}: ${s.status} (${s.productCount} products)`);
    });
  });

  // Generate TourPlan configuration recommendations
  console.log('\n' + '='.repeat(80));
  console.log('🎯 TOURPLAN CONFIGURATION RECOMMENDATIONS');
  console.log('='.repeat(80));

  console.log('\n1. WORKING BUTTONNAMES (No configuration needed):');
  console.log('   - Group Tours (with Info="GMFTD")');
  console.log('   - Rail (for South Africa/Zimbabwe destinations)');
  console.log('   - Day Tours (with Info="D")');
  console.log('   - Packages (with Info="P")');

  console.log('\n2. NON-WORKING BUTTONNAMES (Need TourPlan configuration):');
  console.log('   - Cruises: Always returns empty - needs Service Button setup');
  console.log('   - Special Offers: Returns empty - needs Service Button setup');  
  console.log('   - Accommodation: Returns empty - needs Service Button setup');

  console.log('\n3. SPECIFIC ISSUES TO REPORT TO TOURPLAN:');
  console.log('   - Cruises ButtonName exists but returns no products');
  console.log('   - Need to check if cruise products have ButtonName="Cruises" mapping');
  console.log('   - Need to verify Service Button configuration in TourPlan admin');
  console.log('   - May need Info parameter for Cruises (similar to Group Tours)');

  // Save detailed results
  const fs = require('fs');
  fs.writeFileSync('search-comparison-results.json', JSON.stringify(results, null, 2));
  console.log('\n📁 Detailed results saved to: search-comparison-results.json');

  return results;
}

// Run the comparison
runComparison().catch(console.error);