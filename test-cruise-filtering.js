// Test script to verify cruise filtering works correctly
// Run with: node test-cruise-filtering.js

const BASE_URL = 'http://localhost:3008';

async function testProductFiltering() {
  console.log('🧪 Testing product filtering with POST requests...\n');
  
  const testCases = [
    {
      name: 'Cruise: Botswana/Kasane Airport/Luxury (should return 2 cruises)',
      body: {
        productType: 'Cruises',
        destination: 'Kasane Airport',
        class: 'Luxury'
      },
      expectedCount: 2,
      expectedProducts: ['BBKCRTVT001ZAM2NS', 'BBKCRTVT001ZAM3NS']
    },
    {
      name: 'Cruise: Botswana/Kasane Airport/Standard (should return 2 cruises)',
      body: {
        productType: 'Cruises', 
        destination: 'Kasane Airport',
        class: 'Standard'
      },
      expectedCount: 2,
      expectedProducts: ['BBKCRCHO018TIACP2', 'BBKCRCHO018TIACP3']
    },
    {
      name: 'Group Tours: Kenya/Nairobi JKI Airport/Standard (test working type)',
      body: {
        productType: 'Group Tours',
        destination: 'Nairobi JKI Airport',
        class: 'Standard'
      },
      expectedCount: null, // Just check it works
      expectedProducts: null
    },
    {
      name: 'Packages: Botswana/Kasane Airport/Luxury (test working type)',
      body: {
        productType: 'Packages',
        destination: 'Kasane Airport', 
        class: 'Luxury'
      },
      expectedCount: null,
      expectedProducts: null
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n🧪 Testing: ${testCase.name}`);
    
    try {
      const url = `${BASE_URL}/api/tourplan/search`;
      console.log(`📡 POST to: ${url}`);
      console.log(`📋 Body: ${JSON.stringify(testCase.body)}`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testCase.body)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.log(`❌ API Error (${response.status}): ${data.error || 'Unknown error'}`);
        if (data.details) {
          console.log(`   Details: ${JSON.stringify(data.details)}`);
        }
        continue;
      }
      
      const actualCount = data.products?.length || 0;
      const actualProducts = data.products?.map(p => p.code || p.id) || [];
      
      console.log(`📊 Results: ${actualCount} products returned`);
      
      if (testCase.expectedCount !== null) {
        console.log(`🎯 Expected: ${testCase.expectedCount} products`);
        if (actualCount === testCase.expectedCount) {
          console.log('✅ Count matches expected');
        } else {
          console.log(`❌ Count mismatch: expected ${testCase.expectedCount}, got ${actualCount}`);
        }
      } else {
        console.log('📝 Just checking it works (no count expectation)');
        if (actualCount > 0) {
          console.log('✅ Got results');
        } else {
          console.log('❌ No results returned');
        }
      }
      
      if (actualProducts.length > 0) {
        console.log(`📦 Product codes: ${actualProducts.join(', ')}`);
      }
      
      // Check specific products if specified
      if (testCase.expectedProducts && actualProducts.length > 0) {
        const hasAllExpected = testCase.expectedProducts.every(expected => 
          actualProducts.some(actual => actual.includes(expected))
        );
        
        if (hasAllExpected) {
          console.log('✅ Contains all expected products');
        } else {
          console.log('❌ Missing expected products');
          console.log(`   Expected: ${testCase.expectedProducts.join(', ')}`);
        }
      }
      
    } catch (error) {
      console.log(`❌ Test failed: ${error.message}`);
    }
  }
  
  console.log('\n🏁 Test completed');
}

// Run the test
testProductFiltering().catch(console.error);