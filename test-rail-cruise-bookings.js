#!/usr/bin/env node

// Test Rail and Cruise products to see which accept bookings
// Based on successful bookings found: TAWB100472, TAWB100475 (Rail), TAWB100471 (Cruise)

const railProducts = [
  // Rovos Rail codes (we know some of these work)
  'VFARLROV001VFPRDX',   // Victoria Falls to Pretoria (likely working based on findings)
  'VFARLROV001VFPRRY',   // Victoria Falls to Pretoria return
  'VFARLROV001VFPYPM',   // Victoria Falls other route
  'CPTRLROV001CTPRRO',   // Cape Town to Pretoria
  'CPTRLROV001RRCTPR',   // Return Cape Town to Pretoria  
  'CPTRLROV001CTPPUL',   // Cape Town to Pretoria Pullman
  'PRYRLROV001PRCPPM',   // Pretoria routes
  'PRYRLROV001PRCPRY',   
  'PRYRLROV001ROV004',   
];

const cruiseProducts = [
  // Chobe Princess/House Boat codes (we know some work based on TAWB100471)
  'BBKCRCHO018TIACP2',   // Chobe Princess 2 night
  'BBKCRCHO018TIACP3',   // Chobe Princess 3 night (likely the working one)
  'BBKCRCHO018TIACP4',   // Chobe Princess 4 night
  'BBKCRTVT001TIAZBQ2',  // Zambezi Queen 2 night
  'BBKCRTVT001TIAZBQ3',  // Zambezi Queen 3 night
  'BBKCRTVT001TIAZBQ4',  // Zambezi Queen 4 night
];

async function testProductBooking(productCode, productType) {
  console.log(`\n🔍 Testing ${productType}: ${productCode}...`);
  
  // Use dates that work for each product type
  let testDate;
  if (productType === 'RAIL') {
    testDate = '2025-10-10'; // Friday - based on successful booking for Oct 10
  } else if (productType === 'CRUISE') {
    testDate = '2025-11-21'; // Friday - based on successful booking for Nov 21
  }
  
  const bookingData = {
    customerName: "Test User",
    email: "test@example.com",
    productCode: productCode,
    dateFrom: testDate,
    adults: 2,
    bookingType: "quote",
    rateId: "Standard"
  };

  try {
    const response = await fetch('http://localhost:3007/api/tourplan/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      const status = result.data.tourplanStatus;
      const reference = result.data.tourplanReference;
      
      if (status && (status === 'RQ' || status === 'WQ' || status === '??') && reference && reference.startsWith('TAWB')) {
        console.log(`✅ ${productCode}: WORKS - Status: ${status}, Reference: ${reference}`);
        return { code: productCode, type: productType, works: true, status, reference, date: testDate };
      } else if (status === 'NO') {
        console.log(`❌ ${productCode}: DECLINED - Status: ${status}`);
        return { code: productCode, type: productType, works: false, status, reference: null, date: testDate };
      } else {
        console.log(`⚠️ ${productCode}: UNKNOWN - Status: ${status}, Reference: ${reference || 'none'}`);
        return { code: productCode, type: productType, works: false, status, reference, date: testDate };
      }
    } else {
      console.log(`💥 ${productCode}: ERROR - ${result.message || 'Unknown error'}`);
      return { code: productCode, type: productType, works: false, status: 'ERROR', reference: null, date: testDate };
    }
  } catch (error) {
    console.log(`💥 ${productCode}: FETCH ERROR - ${error.message}`);
    return { code: productCode, type: productType, works: false, status: 'FETCH_ERROR', reference: null, date: testDate };
  }
}

async function testAllProducts() {
  console.log('🚀 Testing Rail and Cruise products for booking capability...');
  console.log('🚂 Rail test date: 2025-10-10 (based on successful booking)');
  console.log('🚢 Cruise test date: 2025-11-21 (based on successful booking)');
  console.log('👥 Using test parameters: 2 adults, Standard rate, Quote mode');
  
  const results = [];
  
  // Test Rail products
  console.log('\n🚂 TESTING RAIL PRODUCTS:');
  for (const railCode of railProducts) {
    const result = await testProductBooking(railCode, 'RAIL');
    results.push(result);
    
    // Wait 1 second between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Test Cruise products  
  console.log('\n🚢 TESTING CRUISE PRODUCTS:');
  for (const cruiseCode of cruiseProducts) {
    const result = await testProductBooking(cruiseCode, 'CRUISE');
    results.push(result);
    
    // Wait 1 second between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 RAIL & CRUISE BOOKING TEST RESULTS');
  console.log('='.repeat(80));
  
  const workingRail = results.filter(r => r.type === 'RAIL' && r.works);
  const notWorkingRail = results.filter(r => r.type === 'RAIL' && !r.works);
  const workingCruise = results.filter(r => r.type === 'CRUISE' && r.works);
  const notWorkingCruise = results.filter(r => r.type === 'CRUISE' && !r.works);
  
  console.log(`\n🚂 RAIL RESULTS:`);
  console.log(`✅ WORKING Rail Products (${workingRail.length}):`);
  workingRail.forEach(r => {
    console.log(`   ${r.code} - ${r.reference} (Status: ${r.status})`);
  });
  
  console.log(`❌ NOT WORKING Rail Products (${notWorkingRail.length}):`);
  notWorkingRail.forEach(r => {
    console.log(`   ${r.code} - Status: ${r.status}`);
  });
  
  console.log(`\n🚢 CRUISE RESULTS:`);
  console.log(`✅ WORKING Cruise Products (${workingCruise.length}):`);
  workingCruise.forEach(r => {
    console.log(`   ${r.code} - ${r.reference} (Status: ${r.status})`);
  });
  
  console.log(`❌ NOT WORKING Cruise Products (${notWorkingCruise.length}):`);
  notWorkingCruise.forEach(r => {
    console.log(`   ${r.code} - Status: ${r.status}`);
  });
  
  console.log('\n🔧 RECOMMENDED ACTIONS:');
  
  if (workingRail.length > 0) {
    console.log(`✅ RAIL bookings ARE working for some products!`);
    console.log(`   Consider removing TIA-RAIL fallback for: ${workingRail.map(r => r.code).join(', ')}`);
  } else {
    console.log(`❌ No Rail products accepting bookings - keep TIA-RAIL fallback`);
  }
  
  if (workingCruise.length > 0) {
    console.log(`✅ CRUISE bookings ARE working for some products!`);
    console.log(`   Consider removing TIA-CRUISE fallback for: ${workingCruise.map(r => r.code).join(', ')}`);
  } else {
    console.log(`❌ No Cruise products accepting bookings - keep TIA-CRUISE fallback`);
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Update booking logic to only use TIA-xxx fallbacks for non-working products');
  console.log('2. Let working products go directly to TourPlan for TAWB references');
  console.log('3. Update CLAUDE.md documentation with working vs non-working product lists');
}

// Run the test
testAllProducts().catch(console.error);