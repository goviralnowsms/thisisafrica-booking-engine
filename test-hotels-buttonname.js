// Test if ButtonName="Hotels" returns accommodation results

async function testHotelsButtonName() {
  console.log('🏨 Testing ButtonName="Hotels" for accommodation products...\n');
  
  const destinations = [
    '',  // No destination - get all
    'Cape Town',
    'Nairobi',
    'Victoria Falls',
    'Johannesburg',
  ];
  
  for (const destination of destinations) {
    try {
      const params = new URLSearchParams({
        productType: 'Hotels',  // Try "Hotels" instead of "Accommodation"
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
      console.log(`${destination || 'All destinations'}: ${count} results`);
      
      if (count > 0) {
        console.log('  ✅ SUCCESS! Found hotels/accommodation');
        console.log(`  📋 First 3 results:`);
        result.tours.slice(0, 3).forEach((tour, i) => {
          console.log(`    ${i+1}. ${tour.name}`);
          console.log(`       Code: ${tour.code}`);
          console.log(`       Supplier: ${tour.supplier || tour.supplierName}`);
        });
        console.log('');
      }
      
    } catch (error) {
      console.log(`${destination || 'All destinations'}: ERROR - ${error.message}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n📊 Summary:');
  console.log('If any destinations returned results above, ButtonName="Hotels" works for accommodation.');
  console.log('Otherwise, we need to check with TourPlan for the correct ButtonName.');
}

testHotelsButtonName();