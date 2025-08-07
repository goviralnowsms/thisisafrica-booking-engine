// Test script to find real tours using the WordPress approach
// Using built-in fetch (Node.js 18+)

async function testTourplanAPI() {
  console.log('🔍 Testing Tourplan API with WordPress approach...');
  
  const apiUrl = 'https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi';
  
  // Test both agent IDs to compare results
  const agentConfigs = [
    { agentId: 'TIA', password: 'S@MAgt01', name: 'This Is Africa (TIA)' },
    { agentId: 'SAMAGT', password: 'S@MAgt01', name: 'Sample Agent (SAMAGT)' }
  ];
  
  for (const config of agentConfigs) {
    console.log(`\n🔑 Testing with ${config.name}...`);
  
  // Test 1: GetServiceButtonDetails (like WordPress does)
  console.log('\n=== TEST 1: GetServiceButtonDetails ===');
  const serviceButtonXML = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <GetServiceButtonDetailsRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>Group Tours</ButtonName>
  </GetServiceButtonDetailsRequest>
</Request>`;

  try {
    const response1 = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/xml; charset=utf-8' },
      body: serviceButtonXML
    });
    
    const result1 = await response1.text();
    console.log('GetServiceButtonDetails Response:', result1.substring(0, 500) + '...');
    
    // Parse countries from response
    if (result1.includes('<Country>')) {
      console.log('✅ Found countries in response!');
    }
  } catch (error) {
    console.error('❌ GetServiceButtonDetails failed:', error.message);
  }
  
  // Test 2: OptionInfo with ButtonName + DestinationName (WordPress approach)
  console.log('\n=== TEST 2: OptionInfo with ButtonName + DestinationName ===');
  const optionInfoXML = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>Group Tours</ButtonName>
    <DestinationName>South Africa</DestinationName>
    <Info>G</Info>
  </OptionInfoRequest>
</Request>`;

  try {
    const response2 = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/xml; charset=utf-8' },
      body: optionInfoXML
    });
    
    const result2 = await response2.text();
    console.log('OptionInfo Response:', result2.substring(0, 500) + '...');
    
    // Check for Option elements
    if (result2.includes('<Option>')) {
      console.log('✅ Found Option elements in response!');
      
      // Count options
      const optionCount = (result2.match(/<Option>/g) || []).length;
      console.log(`📊 Found ${optionCount} tours`);
    } else {
      console.log('❌ No Option elements found');
    }
  } catch (error) {
    console.error('❌ OptionInfo failed:', error.message);
  }
  
  // Test 3: Try different countries
  console.log('\n=== TEST 3: Try Different Countries ===');
  const countries = ['Kenya', 'Tanzania', 'Botswana', 'Namibia', 'Zimbabwe'];
  
  for (const country of countries) {
    console.log(`\n🌍 Testing ${country}...`);
    const countryXML = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>Group Tours</ButtonName>
    <DestinationName>${country}</DestinationName>
    <Info>G</Info>
  </OptionInfoRequest>
</Request>`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/xml; charset=utf-8' },
        body: countryXML
      });
      
      const result = await response.text();
      const optionCount = (result.match(/<Option>/g) || []).length;
      
      if (optionCount > 0) {
        console.log(`✅ ${country}: Found ${optionCount} tours!`);
        
        // Extract first tour name for verification
        const nameMatch = result.match(/<Description>(.*?)<\/Description>/);
        if (nameMatch) {
          console.log(`   First tour: ${nameMatch[1]}`);
        }
        
        // Save successful response for analysis
        require('fs').writeFileSync(`tourplan-${country.toLowerCase()}-response.xml`, result);
        console.log(`   Saved response to tourplan-${country.toLowerCase()}-response.xml`);
        
        break; // Stop at first successful country
      } else {
        console.log(`❌ ${country}: No tours found`);
      }
    } catch (error) {
      console.log(`❌ ${country}: Error - ${error.message}`);
    }
  }
  
  console.log('\n🎯 Test complete!');
}

// Run the test
testTourplanAPI().catch(console.error);
