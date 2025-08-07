// Test various ButtonName values that might work for accommodation

const buttonNames = [
  'Hotels',
  'Hotel',
  'Lodging',
  'Lodgings',
  'Lodge',
  'Lodges',
  'Stay',
  'Stays',
  'Accommodations',  // Plural
  'Property',
  'Properties',
  'Resort',
  'Resorts',
  'Guest House',
  'Guesthouse',
];

async function testButtonName(buttonName) {
  try {
    const params = new URLSearchParams({
      productType: buttonName,
      destination: 'Cape Town',  // Test with a major city
      adults: '2',
      children: '0'
    });
    
    const url = `http://localhost:3004/api/tourplan?${params.toString()}`;
    const response = await fetch(url);
    const result = await response.json();
    
    const count = result.tours?.length || 0;
    
    if (count > 0) {
      console.log(`✅ ${buttonName}: ${count} results found!`);
      console.log(`   First result: ${result.tours[0].name} (${result.tours[0].code})`);
      return true;
    } else {
      console.log(`❌ ${buttonName}: 0 results`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${buttonName}: ERROR - ${error.message}`);
    return false;
  }
}

async function testAllButtonNames() {
  console.log('🏨 Testing various ButtonName values for accommodation...\n');
  console.log('Testing with destination: Cape Town\n');
  
  let foundWorking = false;
  
  for (const buttonName of buttonNames) {
    const works = await testButtonName(buttonName);
    if (works) {
      foundWorking = true;
    }
    await new Promise(resolve => setTimeout(resolve, 200)); // Small delay between requests
  }
  
  console.log('\n📊 Summary:');
  if (foundWorking) {
    console.log('✅ Found working ButtonName(s) above! Update the code to use these.');
  } else {
    console.log('❌ None of the common ButtonName values returned accommodation results.');
    console.log('This confirms that TourPlan either:');
    console.log('1. Does not have accommodation data');
    console.log('2. Uses a completely different ButtonName');
    console.log('3. Requires a different API approach for accommodation');
    console.log('\nRecommendation: Contact TourPlan support for the correct ButtonName or use a catalog approach.');
  }
}

testAllButtonNames();