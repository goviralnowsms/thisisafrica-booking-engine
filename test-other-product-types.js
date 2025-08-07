// Test other product types to see if any return accommodation-like products

const productTypes = [
  'Day Tours',
  'Group Tours', 
  'Packages',
  'Special Offers',
  'Cruises',
  'Rail'
];

async function testProductType(productType) {
  try {
    const params = new URLSearchParams({
      productType: productType,
      destination: 'Nairobi',
      adults: '2',
      children: '0'
    });
    
    const url = `http://localhost:3004/api/tourplan?${params.toString()}`;
    const response = await fetch(url);
    const result = await response.json();
    
    const count = result.tours?.length || 0;
    console.log(`\n${productType}: ${count} results`);
    
    if (count > 0) {
      // Look for accommodation-like products
      const accommodationKeywords = ['hotel', 'lodge', 'camp', 'resort', 'accommodation', 'stay'];
      const accommodationProducts = result.tours.filter(tour => {
        const text = (tour.name + ' ' + (tour.description || '')).toLowerCase();
        return accommodationKeywords.some(keyword => text.includes(keyword));
      });
      
      console.log(`  🏨 Accommodation-like products: ${accommodationProducts.length}/${count}`);
      
      if (accommodationProducts.length > 0) {
        console.log('  📋 Examples:');
        accommodationProducts.slice(0, 3).forEach(product => {
          console.log(`    - ${product.name} (${product.code})`);
        });
      }
      
      // Show first few regular products for context
      console.log('  📋 First 2 products:');
      result.tours.slice(0, 2).forEach(product => {
        console.log(`    - ${product.name} (${product.code})`);
      });
    }
    
    return count;
  } catch (error) {
    console.log(`${productType}: ERROR - ${error.message}`);
    return 0;
  }
}

async function testAllProductTypes() {
  console.log('🔍 Testing other product types to find accommodation options...');
  
  for (const productType of productTypes) {
    await testProductType(productType);
    await new Promise(resolve => setTimeout(resolve, 500)); // Delay between requests
  }
  
  console.log('\n🏨 If any product type above shows accommodation-like products,');
  console.log('that might be the ButtonName TourPlan uses for accommodation.');
}

testAllProductTypes();