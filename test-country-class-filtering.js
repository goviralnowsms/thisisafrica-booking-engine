/**
 * Test script to verify country+class filtering matches WordPress
 * Run with: node test-country-class-filtering.js
 */

const BASE_URL = 'http://localhost:3008';

async function testCountryClassFiltering() {
  console.log('🧪 Testing Country+Class Filtering for Group Tours\n');
  console.log('=' .repeat(50) + '\n');
  
  const testCases = [
    {
      name: 'Kenya + Deluxe (should return 5 tours)',
      body: {
        productType: 'Group Tours',
        destination: 'Kenya',  // Country only, no specific destination
        class: 'Deluxe'
      },
      expectedCount: 5,
      expectedProducts: [
        'NBOGTARP001CKEKEE', 'NBOGTARP001CKSE', 'NBOGTARP001EAEKE',
        'NBOGTARP001THRKE3', 'NBOGTARP001THRSE3'
      ]
    },
    {
      name: 'Kenya + Standard (should return 12 tours)',
      body: {
        productType: 'Group Tours',
        destination: 'Kenya',
        class: 'Standard'
      },
      expectedCount: 12,
      expectedProducts: [
        'NBOGTARP001CKSO', 'NBOGTARP001THRSO3', 'NBOGTSOAEASKTNM21',
        'NBOGTSOAEASSNM022', 'NBOGTSOAEASSNM031', 'NBOGTSOAEASSNM041',
        'NBOGTSOAEASSNM061', 'NBOGTSOAEASSNM062', 'NBOGTSOAEASSNM071',
        'NBOGTSOAEASSNM091', 'NBOGTSOAEASSNM111', 'NBOGTSOAEASSNM131'
      ]
    },
    {
      name: 'Kenya + Basic (should return 2 tours)',
      body: {
        productType: 'Group Tours',
        destination: 'Kenya',
        class: 'Basic'
      },
      expectedCount: 2,
      expectedProducts: ['NBOGTARP001CKSM', 'NBOGTARP001THRSM3']
    },
    {
      name: 'Kenya + Deluxe Plus (should return 1 tour)',
      body: {
        productType: 'Group Tours',
        destination: 'Kenya',
        class: 'Deluxe Plus'
      },
      expectedCount: 1,
      expectedProducts: ['NBOGTARP001EAESE']
    },
    {
      name: 'Botswana + Deluxe (should return 1 tour)',
      body: {
        productType: 'Group Tours',
        destination: 'Botswana',
        class: 'Deluxe'
      },
      expectedCount: 1,
      expectedProducts: ['MUBGTJENMANJENBSE']
    },
    {
      name: 'South Africa + Basic (should return multiple tours)',
      body: {
        productType: 'Group Tours',
        destination: 'South Africa',
        class: 'Basic'
      },
      expectedCount: 10, // Approximate count based on catalog
      expectedProducts: null // Too many to list
    },
    {
      name: 'Tanzania + Standard (should return 3 tours)',
      body: {
        productType: 'Group Tours',
        destination: 'Tanzania',
        class: 'Standard'
      },
      expectedCount: 3,
      expectedProducts: ['JROGTARP001SIMTW7', 'JROGTSOAEASSNM024', 'JROGTSOAEASSNM042']
    }
  ];
  
  let passedTests = 0;
  let failedTests = 0;
  
  for (const testCase of testCases) {
    console.log(`\n📊 Testing: ${testCase.name}`);
    console.log('─'.repeat(40));
    
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
        failedTests++;
        continue;
      }
      
      const actualCount = data.products?.length || 0;
      const actualProducts = data.products?.map(p => p.code || p.id) || [];
      
      console.log(`📊 Results: ${actualCount} products returned`);
      console.log(`🎯 Expected: ${testCase.expectedCount} products`);
      
      // Check count
      let countMatch = false;
      if (testCase.expectedCount !== null) {
        if (actualCount === testCase.expectedCount) {
          console.log('✅ Count matches expected');
          countMatch = true;
        } else {
          console.log(`❌ Count mismatch: expected ${testCase.expectedCount}, got ${actualCount}`);
        }
      }
      
      // Check specific products if specified
      let productsMatch = true;
      if (testCase.expectedProducts) {
        const missingProducts = testCase.expectedProducts.filter(expected => 
          !actualProducts.some(actual => actual.includes(expected))
        );
        
        const extraProducts = actualProducts.filter(actual => 
          !testCase.expectedProducts.some(expected => actual.includes(expected))
        );
        
        if (missingProducts.length === 0 && extraProducts.length === 0) {
          console.log('✅ All expected products found (exact match)');
        } else {
          productsMatch = false;
          if (missingProducts.length > 0) {
            console.log('❌ Missing products:', missingProducts);
          }
          if (extraProducts.length > 0) {
            console.log('❌ Extra products:', extraProducts);
          }
        }
      }
      
      // Show actual products for debugging
      if (actualProducts.length > 0 && actualProducts.length <= 15) {
        console.log(`📦 Actual product codes:`, actualProducts);
      } else if (actualProducts.length > 15) {
        console.log(`📦 First 5 products:`, actualProducts.slice(0, 5));
      }
      
      // Determine test result
      if (countMatch && productsMatch) {
        console.log('✅ TEST PASSED');
        passedTests++;
      } else {
        console.log('❌ TEST FAILED');
        failedTests++;
      }
      
    } catch (error) {
      console.log(`❌ Test failed with error: ${error.message}`);
      failedTests++;
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Summary:');
  console.log(`✅ Passed: ${passedTests}/${testCases.length}`);
  console.log(`❌ Failed: ${failedTests}/${testCases.length}`);
  
  if (failedTests === 0) {
    console.log('\n🎉 All tests passed! Country+class filtering is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the filtering logic.');
  }
}

// Run the test
testCountryClassFiltering().catch(console.error);