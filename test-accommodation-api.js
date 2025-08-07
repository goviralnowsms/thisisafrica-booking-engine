// Test accommodation API to see raw TourPlan response

async function testAccommodationAPI() {
  try {
    console.log('🏨 Testing accommodation API with detailed logging...');
    
    const testUrl = 'http://localhost:3004/api/tourplan?productType=Accommodation&destination=Nairobi&adults=2&children=0';
    console.log('🔗 Test URL:', testUrl);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const result = await response.json();
    
    console.log('\n📋 Full API Response:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.searchCriteria) {
      console.log('\n🔍 Search Criteria Used:');
      console.log(JSON.stringify(result.searchCriteria, null, 2));
    }
    
    if (result.error) {
      console.log('\n❌ Error Details:', result.error);
    }
    
  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
  }
}

testAccommodationAPI();