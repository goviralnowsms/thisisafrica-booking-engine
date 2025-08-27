// Test script to verify TourPlan API cruise search with proper format
// Tests the documented <RoomConfigs> format against actual API
// Run with: node test-tourplan-cruise-api.js

const BASE_URL = 'http://localhost:3008';

async function testTourPlanCruiseAPI() {
  console.log('🚢 Testing TourPlan API cruise search with documented format...\n');
  
  const testCases = [
    {
      name: 'TourPlan API: Cruise search with Luxury class',
      body: {
        productType: 'Cruises',
        destination: 'Kasane Airport',
        class: 'Luxury',
        dateFrom: '2025-09-01',
        cabinConfigs: [
          {
            Adults: 2,
            Children: 0,
            Type: 'DB',
            Quantity: 1
          }
        ]
      },
      expectTourPlanResults: true // We expect TourPlan API to return results now
    },
    {
      name: 'TourPlan API: Cruise search with Standard class',
      body: {
        productType: 'Cruises',
        destination: 'Kasane Airport', 
        class: 'Standard',
        dateFrom: '2025-09-01',
        cabinConfigs: [
          {
            Adults: 2,
            Children: 0,
            Type: 'DB',
            Quantity: 1
          }
        ]
      },
      expectTourPlanResults: true
    },
    {
      name: 'TourPlan API: Cruise search with Superior class',
      body: {
        productType: 'Cruises',
        destination: 'Kasane Airport',
        class: 'Superior', 
        dateFrom: '2025-09-01',
        cabinConfigs: [
          {
            Adults: 2,
            Children: 0,
            Type: 'DB',
            Quantity: 1
          }
        ]
      },
      expectTourPlanResults: true
    },
    {
      name: 'TourPlan API: Basic cruise search (no class filter)',
      body: {
        productType: 'Cruises',
        dateFrom: '2025-09-01',
        cabinConfigs: [
          {
            Adults: 2,
            Children: 0,
            Type: 'DB',
            Quantity: 1
          }
        ]
      },
      expectTourPlanResults: true
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n🧪 Testing: ${testCase.name}`);
    
    try {
      const url = `${BASE_URL}/api/tourplan/search`;
      console.log(`📡 POST to: ${url}`);
      console.log(`📋 Body: ${JSON.stringify(testCase.body, null, 2)}`);
      
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
      
      if (testCase.expectTourPlanResults) {
        if (actualCount > 0) {
          console.log('✅ TourPlan API returned results (success!)');
          console.log(`📦 Product codes: ${actualProducts.join(', ')}`);
          
          // Check if these look like real TourPlan results vs catalog fallback
          const hasRealTourPlanData = data.products?.some(p => 
            p.rates && p.rates.length > 0 && 
            (p.supplier || p.supplierName) && 
            p.description
          );
          
          if (hasRealTourPlanData) {
            console.log('🎉 Appears to be real TourPlan API data with rates and supplier info!');
          } else {
            console.log('📋 May be catalog fallback data (no rates/supplier info)');
          }
          
        } else {
          console.log('⚠️ TourPlan API returned no results - check if API format is correct');
        }
      }
      
      // Show first product details for analysis
      if (data.products && data.products.length > 0) {
        const firstProduct = data.products[0];
        console.log(`🔍 First product sample:`);
        console.log(`   Code: ${firstProduct.code || firstProduct.id}`);
        console.log(`   Name: ${firstProduct.name}`);
        console.log(`   Supplier: ${firstProduct.supplier || firstProduct.supplierName || 'N/A'}`);
        console.log(`   Rates: ${firstProduct.rates?.length || 0} rate periods`);
      }
      
    } catch (error) {
      console.log(`❌ Test failed: ${error.message}`);
    }
  }
  
  console.log('\n🏁 TourPlan API test completed');
  console.log('\n📝 Summary:');
  console.log('- If results returned: TourPlan API cruise search is working!');
  console.log('- If no results: We may need to adjust the API format or revert to catalog');
  console.log('- Check dev server logs for XML requests and TourPlan responses');
}

// Run the test
testTourPlanCruiseAPI().catch(console.error);