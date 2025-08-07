// Using built-in fetch (Node 18+)

async function testAccommodationSearch() {
  try {
    console.log('🏨 Testing accommodation search with TourPlan API...');
    
    const response = await fetch('http://localhost:3004/api/tourplan?productType=Accommodation&destination=nairobi&adults=2&children=0', {
      method: 'GET',
    });
    
    const result = await response.json();
    
    console.log('\n✅ Response received:');
    console.log('Success:', result.success);
    console.log('Total tours:', result.tours?.length || 0);
    
    if (result.tours && result.tours.length > 0) {
      console.log('\n📋 First 3 products returned:');
      result.tours.slice(0, 3).forEach((tour, index) => {
        console.log(`\n${index + 1}. ${tour.name}`);
        console.log(`   Code: ${tour.code}`);
        console.log(`   Description: ${tour.description?.substring(0, 100)}...`);
        console.log(`   Supplier: ${tour.supplier}`);
        console.log(`   Duration: ${tour.duration}`);
      });
      
      // Check if these look like accommodation or packages
      const packageKeywords = ['safari', 'tour', 'adventure', 'expedition', 'journey'];
      const accommodationKeywords = ['hotel', 'lodge', 'camp', 'resort', 'accommodation'];
      
      let packageCount = 0;
      let accommodationCount = 0;
      
      result.tours.forEach(tour => {
        const text = (tour.name + ' ' + tour.description).toLowerCase();
        const hasPackageKeywords = packageKeywords.some(keyword => text.includes(keyword));
        const hasAccommodationKeywords = accommodationKeywords.some(keyword => text.includes(keyword));
        
        if (hasPackageKeywords) packageCount++;
        if (hasAccommodationKeywords) accommodationCount++;
      });
      
      console.log(`\n📊 Analysis of ${result.tours.length} products:`);
      console.log(`   Products with package keywords: ${packageCount}`);
      console.log(`   Products with accommodation keywords: ${accommodationCount}`);
      
      if (packageCount > accommodationCount) {
        console.log('⚠️  WARNING: Most products appear to be packages/tours, not pure accommodation');
      } else {
        console.log('✅ Most products appear to be accommodation-focused');
      }
      
    } else {
      console.log('❌ No tours returned');
      console.log('Error:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAccommodationSearch();