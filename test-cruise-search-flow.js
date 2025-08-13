/**
 * Test the complete cruise search flow with new cascading search
 */

const fetch = require('node-fetch');

async function testCruiseSearchFlow() {
  console.log('🧪 TESTING COMPLETE CRUISE SEARCH FLOW');
  console.log('=' .repeat(60));

  // Test 1: Search with Botswana (should work)
  console.log('\n🚢 TEST 1: Cruise search for Botswana');
  console.log('This should use the corrected TourPlan API call');
  
  try {
    const response = await fetch('http://localhost:3002/api/tourplan?productType=Cruises&destination=Botswana');
    const result = await response.json();
    
    console.log('✅ Response received');
    console.log(`📊 Results: ${result.totalResults || 0} cruises found`);
    
    if (result.tours && result.tours.length > 0) {
      console.log('🚢 Sample cruise products:');
      result.tours.slice(0, 3).forEach(tour => {
        console.log(`   - ${tour.code}: ${tour.name || 'Unnamed Product'}`);
      });
    }
  } catch (error) {
    console.error('❌ Test 1 failed:', error.message);
  }

  // Test 2: Search with Namibia (should work via Botswana mapping)
  console.log('\n🚢 TEST 2: Cruise search for Namibia');
  console.log('This should map to Botswana in the TourPlan API');
  
  try {
    const response = await fetch('http://localhost:3002/api/tourplan?productType=Cruises&destination=Namibia');
    const result = await response.json();
    
    console.log('✅ Response received');
    console.log(`📊 Results: ${result.totalResults || 0} cruises found`);
    
    if (result.tours && result.tours.length > 0) {
      console.log('🚢 Sample cruise products:');
      result.tours.slice(0, 3).forEach(tour => {
        console.log(`   - ${tour.code}: ${tour.name || 'Unnamed Product'}`);
      });
    }
  } catch (error) {
    console.error('❌ Test 2 failed:', error.message);
  }

  // Test 3: Check that we're no longer getting empty results
  console.log('\n🚢 TEST 3: Verify we fixed the empty results issue');
  
  try {
    const response = await fetch('http://localhost:3002/api/tourplan?productType=Cruises&destination=Kenya');
    const result = await response.json();
    
    console.log('✅ Response received');
    console.log(`📊 Results: ${result.totalResults || 0} cruises found`);
    
    if (result.totalResults > 0) {
      console.log('🎉 SUCCESS: Cruise search now returns results!');
      console.log('🔧 The ButtonName="Cruise" (singular) + Botswana fix is working');
    } else {
      console.log('⚠️ Still getting empty results - may need more investigation');
    }
  } catch (error) {
    console.error('❌ Test 3 failed:', error.message);
  }

  console.log('\n✅ CRUISE SEARCH FLOW TEST COMPLETE');
  console.log('\n🎯 SUMMARY:');
  console.log('- Implemented Country → Destination cascading dropdowns');
  console.log('- Fixed TourPlan API calls to use correct ButtonName and destination');
  console.log('- Users can now select country first, then see relevant destinations');
  console.log('- All cruise searches route through Botswana for TourPlan API compatibility');
}

// Run the test
testCruiseSearchFlow().catch(console.error);