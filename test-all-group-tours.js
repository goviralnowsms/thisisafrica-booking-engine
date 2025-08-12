#!/usr/bin/env node

// Test all Group Tour products to see which accept bookings
// Using built-in fetch (Node.js 18+)

const groupTours = [
  'NBOGTARP001CKEKEE', // Classic Kenya - Keekorok (we know this works)
  'NBOGTARP001CKSE',   // Classic Kenya - Serena (we know this fails)
  'NBOGTARP001CKSNPK', // Classic Kenya - Sweet Nights Package
  'NBOGTARP001CKSO',   // Classic Kenya - Serena Options
  'NBOGTARP001EAESE',  // East Africa Explorer
  'NBOGTARP001THRKE3', // Three Kings Kenya
  'NBOGTARP001THRSE3', // Three Serena Kenya
  'NBOGTARP001THRSM3', // Three Samburu Kenya
  'NBOGTARP001THRSO3', // Three Safari Options Kenya
];

async function testGroupTourBooking(productCode) {
  console.log(`\n🔍 Testing ${productCode}...`);
  
  const bookingData = {
    customerName: "Test User",
    email: "test@example.com",
    productCode: productCode,
    dateFrom: "2025-12-21", // Sunday in December 2025
    adults: 2,
    bookingType: "quote",
    rateId: "Standard"
  };

  try {
    const response = await fetch('http://localhost:3100/api/tourplan/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      const status = result.data.tourplanStatus;
      const reference = result.data.tourplanReference;
      
      if (status === 'RQ' && reference && reference.startsWith('TAWB')) {
        console.log(`✅ ${productCode}: WORKS - Status: ${status}, Reference: ${reference}`);
        return { code: productCode, works: true, status, reference };
      } else if (status === 'NO') {
        console.log(`❌ ${productCode}: DECLINED - Status: ${status}`);
        return { code: productCode, works: false, status, reference: null };
      } else {
        console.log(`⚠️ ${productCode}: UNKNOWN - Status: ${status}, Reference: ${reference}`);
        return { code: productCode, works: false, status, reference };
      }
    } else {
      console.log(`💥 ${productCode}: ERROR - ${result.message || 'Unknown error'}`);
      return { code: productCode, works: false, status: 'ERROR', reference: null };
    }
  } catch (error) {
    console.log(`💥 ${productCode}: FETCH ERROR - ${error.message}`);
    return { code: productCode, works: false, status: 'FETCH_ERROR', reference: null };
  }
}

async function testAllGroupTours() {
  console.log('🚀 Testing all Group Tour products for booking capability...');
  console.log('📅 Using test date: 2025-12-21 (Sunday)');
  console.log('👥 Using test parameters: 2 adults, Standard rate, Quote mode');
  
  const results = [];
  
  for (const tourCode of groupTours) {
    const result = await testGroupTourBooking(tourCode);
    results.push(result);
    
    // Wait 1 second between requests to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY REPORT');
  console.log('='.repeat(60));
  
  const working = results.filter(r => r.works);
  const notWorking = results.filter(r => !r.works);
  
  console.log(`\n✅ WORKING Group Tours (${working.length}):`);
  working.forEach(r => {
    console.log(`   ${r.code} - ${r.reference}`);
  });
  
  console.log(`\n❌ NOT WORKING Group Tours (${notWorking.length}):`);
  notWorking.forEach(r => {
    console.log(`   ${r.code} - Status: ${r.status}`);
  });
  
  console.log('\n📝 For TourPlan Support:');
  console.log('The following Group Tour products have identical configurations');
  console.log('but different booking behavior. Please check what configuration');
  console.log('setting allows the WORKING ones to accept bookings while the');
  console.log('NOT WORKING ones return Status="NO":');
  console.log('');
  console.log('WORKING: ' + working.map(r => r.code).join(', '));
  console.log('NOT WORKING: ' + notWorking.map(r => r.code).join(', '));
}

// Run the test
testAllGroupTours().catch(console.error);