/**
 * Test script to compare search performance
 * Run with: node test-search-performance.js
 */

const BASE_URL = 'http://localhost:3008';

async function measureSearchTime(endpoint, body, label) {
  const start = Date.now();
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    const elapsed = Date.now() - start;
    
    return {
      success: response.ok,
      time: elapsed,
      resultCount: data.products?.length || 0,
      cached: data._cached || false,
      label
    };
  } catch (error) {
    const elapsed = Date.now() - start;
    return {
      success: false,
      time: elapsed,
      error: error.message,
      label
    };
  }
}

async function runPerformanceTests() {
  console.log('🚀 TourPlan Search Performance Test\n');
  console.log('================================\n');
  
  const testCases = [
    {
      name: 'Group Tours - Kenya/Nairobi',
      body: {
        productType: 'Group Tours',
        destination: 'Nairobi JKI Airport',
        class: 'Standard'
      }
    },
    {
      name: 'Cruises - Botswana',
      body: {
        productType: 'Cruises',
        destination: 'Kasane Airport',
        class: 'Luxury',
        cabinConfigs: [{
          Adults: 2,
          Children: 0,
          Type: 'DB',
          Quantity: 1
        }]
      }
    },
    {
      name: 'Rail - South Africa',
      body: {
        productType: 'Rail',
        destination: 'Cape Town Rail Station'
      }
    },
    {
      name: 'Packages - Kenya',
      body: {
        productType: 'Packages',
        destination: 'Kenya',
        dateFrom: '2025-09-01',
        dateTo: '2025-09-07'
      }
    }
  ];
  
  // Test both endpoints
  const endpoints = [
    { path: '/api/tourplan/search', label: 'Original' },
    { path: '/api/tourplan/search-fast', label: 'Optimized' }
  ];
  
  console.log('Testing each search type on both endpoints...\n');
  
  for (const testCase of testCases) {
    console.log(`\n📊 ${testCase.name}`);
    console.log('─'.repeat(40));
    
    const results = [];
    
    for (const endpoint of endpoints) {
      // Run each test 3 times to get average
      const times = [];
      
      for (let i = 0; i < 3; i++) {
        const result = await measureSearchTime(
          endpoint.path,
          testCase.body,
          endpoint.label
        );
        times.push(result.time);
        
        if (i === 0) {
          // Report first run details
          if (result.success) {
            console.log(`${endpoint.label}: ${result.time}ms (${result.resultCount} results${result.cached ? ', cached' : ''})`);
          } else {
            console.log(`${endpoint.label}: Failed - ${result.error}`);
          }
        }
        
        // Small delay between requests
        await new Promise(r => setTimeout(r, 500));
      }
      
      const avgTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
      results.push({ endpoint: endpoint.label, avgTime });
    }
    
    // Compare results
    if (results.length === 2) {
      const improvement = Math.round(
        ((results[0].avgTime - results[1].avgTime) / results[0].avgTime) * 100
      );
      
      if (improvement > 0) {
        console.log(`\n⚡ Optimized is ${improvement}% faster`);
      } else if (improvement < 0) {
        console.log(`\n⚠️ Original is ${Math.abs(improvement)}% faster`);
      } else {
        console.log(`\n➡️ Similar performance`);
      }
      
      console.log(`Average times: Original ${results[0].avgTime}ms vs Optimized ${results[1].avgTime}ms`);
    }
  }
  
  console.log('\n\n🏁 Performance test complete!');
  
  // Test cache stats
  console.log('\n📊 Cache Statistics:');
  try {
    const statsResponse = await fetch(`${BASE_URL}/api/tourplan/search-fast?stats=true`);
    const stats = await statsResponse.json();
    console.log(`Cache entries: ${stats.cache?.size || 0}`);
    console.log(`Cache enabled: ${stats.config?.cacheEnabled || false}`);
  } catch (error) {
    console.log('Unable to fetch cache stats');
  }
}

// Run the tests
runPerformanceTests().catch(console.error);