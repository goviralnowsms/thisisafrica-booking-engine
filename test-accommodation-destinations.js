// Test accommodation search with different destinations to see if any return results

const destinations = [
  'Cape Town',
  'Johannesburg',
  'Victoria Falls',
  'Kruger National Park',
  'Botswana',
  'Kenya',
  'South Africa',
  '', // No destination
];

async function testDestination(destination) {
  try {
    const params = new URLSearchParams({
      productType: 'Accommodation',
      adults: '2',
      children: '0'
    });
    
    if (destination) {
      params.set('destination', destination);
    }
    
    const url = `http://localhost:3004/api/tourplan?${params.toString()}`;
    const response = await fetch(url);
    const result = await response.json();
    
    const count = result.tours?.length || 0;
    console.log(`${destination || 'No destination'}: ${count} results`);
    
    if (count > 0) {
      console.log(`  📋 First result: ${result.tours[0].name}`);
      console.log(`  📋 Code: ${result.tours[0].code}`);
    }
    
    return count;
  } catch (error) {
    console.log(`${destination || 'No destination'}: ERROR - ${error.message}`);
    return 0;
  }
}

async function testAllDestinations() {
  console.log('🏨 Testing accommodation search with different destinations...\n');
  
  let totalResults = 0;
  for (const destination of destinations) {
    const count = await testDestination(destination);
    totalResults += count;
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between requests
  }
  
  console.log(`\n📊 Total results found: ${totalResults}`);
  
  if (totalResults === 0) {
    console.log('\n⚠️  No accommodation results found for any destination.');
    console.log('This suggests ButtonName="Accommodation" may not be working as expected with TourPlan API.');
  }
}

testAllDestinations();