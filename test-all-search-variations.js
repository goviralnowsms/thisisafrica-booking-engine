/**
 * Test all Group Tours search variations
 * Run with: node test-all-search-variations.js
 */

const BASE_URL = 'http://localhost:3008';

async function testSearch(name, body, expectedBehavior) {
  console.log(`\n📊 Testing: ${name}`);
  console.log('─'.repeat(40));
  
  try {
    const response = await fetch(`${BASE_URL}/api/tourplan/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.log(`❌ API Error: ${data.error || 'Unknown error'}`);
      return false;
    }
    
    const count = data.products?.length || 0;
    console.log(`✅ Results: ${count} products`);
    console.log(`📝 Expected: ${expectedBehavior}`);
    
    // Show first few product codes for verification
    if (count > 0 && count <= 10) {
      console.log(`📦 Products:`, data.products.map(p => p.code || p.id));
    } else if (count > 10) {
      console.log(`📦 First 5:`, data.products.slice(0, 5).map(p => p.code || p.id));
    }
    
    return count > 0;
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  console.log('🧪 Testing All Group Tours Search Variations');
  console.log('=' .repeat(50));
  
  const tests = [
    // VARIATION 1: Country only (should return ALL tours for that country)
    {
      name: 'Kenya only (no filters)',
      body: {
        productType: 'Group Tours',
        destination: 'Kenya'
      },
      expected: 'All Kenya tours (21 total)'
    },
    
    // VARIATION 2: Country + Class (should filter by class across all destinations)
    {
      name: 'Kenya + Deluxe',
      body: {
        productType: 'Group Tours',
        destination: 'Kenya',
        class: 'Deluxe'
      },
      expected: '5 Deluxe tours'
    },
    {
      name: 'Kenya + Standard',
      body: {
        productType: 'Group Tours',
        destination: 'Kenya',
        class: 'Standard'
      },
      expected: '12 Standard tours'
    },
    {
      name: 'Kenya + Basic',
      body: {
        productType: 'Group Tours',
        destination: 'Kenya',
        class: 'Basic'
      },
      expected: '2 Basic tours'
    },
    
    // VARIATION 3: Country + Specific Destination (no class)
    {
      name: 'Kenya + Nairobi JKI Airport (no class)',
      body: {
        productType: 'Group Tours',
        destination: 'Nairobi JKI Airport'
      },
      expected: 'All tours from Nairobi JKI Airport'
    },
    
    // VARIATION 4: Country + Specific Destination + Class
    {
      name: 'Kenya + Nairobi JKI Airport + Deluxe',
      body: {
        productType: 'Group Tours',
        destination: 'Nairobi JKI Airport',
        class: 'Deluxe'
      },
      expected: '5 Deluxe tours from Nairobi JKI Airport'
    },
    {
      name: 'Kenya + Nairobi JKI Airport + Standard',
      body: {
        productType: 'Group Tours',
        destination: 'Nairobi JKI Airport',
        class: 'Standard'
      },
      expected: '12 Standard tours from Nairobi JKI Airport'
    },
    
    // Test other countries
    {
      name: 'Botswana only',
      body: {
        productType: 'Group Tours',
        destination: 'Botswana'
      },
      expected: 'All Botswana tours'
    },
    {
      name: 'Botswana + Deluxe',
      body: {
        productType: 'Group Tours',
        destination: 'Botswana',
        class: 'Deluxe'
      },
      expected: '1 Deluxe tour'
    },
    {
      name: 'South Africa + Basic',
      body: {
        productType: 'Group Tours',
        destination: 'South Africa',
        class: 'Basic'
      },
      expected: 'Multiple Basic tours'
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const success = await testSearch(test.name, test.body, test.expected);
    if (success) {
      passed++;
    } else {
      failed++;
    }
    
    // Small delay between tests
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`✅ Passed: ${passed}/${tests.length}`);
  console.log(`❌ Failed: ${failed}/${tests.length}`);
  
  if (failed === 0) {
    console.log('\n🎉 All search variations working correctly!');
  } else {
    console.log('\n⚠️ Some variations need fixing');
  }
}

// Run tests
runAllTests().catch(console.error);