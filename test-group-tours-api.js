// Test the group tours API endpoint
const fetch = require('node-fetch');

async function testGroupToursAPI() {
  try {
    console.log('🧪 Testing group tours API endpoint...');
    
    // Test the exact same request the website makes
    const params = new URLSearchParams();
    params.set('productType', 'Guided group tours');
    params.set('destination', 'kenya');
    
    const url = `http://localhost:3000/api/tourplan?${params.toString()}`;
    console.log('📞 Calling:', url);
    
    const response = await fetch(url);
    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      return;
    }
    
    const result = await response.json();
    console.log('✅ API Response:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log(`🎯 Found ${result.tours?.length || 0} tours`);
      if (result.tours && result.tours.length > 0) {
        console.log('🔍 First tour:', result.tours[0]);
      }
    } else {
      console.error('❌ API returned error:', result.error);
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

testGroupToursAPI();