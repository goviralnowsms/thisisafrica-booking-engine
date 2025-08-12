#!/usr/bin/env node

// Test South Africa Group Tours for booking capability

const southAfricaTours = [
  { code: 'CPTGTSUNWAYSUNA21', name: 'Cape & Southern Africa', day: 'Wednesday', testDate: '2025-08-13' },
  { code: 'JNBGTSUNWAYSUNZBA', name: 'Johannesburg Tours', day: 'Saturday', testDate: '2025-08-16' },
  { code: 'CPTGTSUNWAYSUCV21', name: 'Cape & Victoria Falls', day: 'Unknown', testDate: '2025-08-17' }, // Sunday test
  { code: 'HDSSPMAKUTSMSSCLS', name: 'Classic Kruger Package', day: 'Unknown', testDate: '2025-08-17' },
  { code: 'JNBGTSUNWAYSUNA14', name: 'Johannesburg based tours', day: 'Unknown', testDate: '2025-08-17' },
  { code: 'JNBGTSATOURSAJOUR', name: 'SA Journey', day: 'Unknown', testDate: '2025-08-17' }
];

async function testBooking(product) {
  const bookingData = {
    customerName: "Test User",
    email: "test@example.com",
    productCode: product.code,
    dateFrom: product.testDate,
    adults: 2,
    bookingType: "quote",
    rateId: "Standard"
  };

  try {
    console.log(`\n📍 Testing ${product.code} (${product.name})...`);
    console.log(`   Expected day: ${product.day}, Test date: ${product.testDate}`);
    
    const response = await fetch('http://localhost:3100/api/tourplan/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
      timeout: 30000
    });
    
    // Set a timeout for the response
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 30000)
    );
    
    const result = await Promise.race([response.json(), timeoutPromise]);
    
    if (result.success) {
      const status = result.data.tourplanStatus;
      const reference = result.data.tourplanReference;
      
      if (status === 'RQ' && reference && reference.startsWith('TAWB')) {
        console.log(`   ✅ WORKS - Status: ${status}, Reference: ${reference}`);
        return { ...product, works: true, status, reference };
      } else if (status === 'NO') {
        console.log(`   ❌ DECLINED - Status: ${status}, Manual processing required`);
        return { ...product, works: false, status, reference: null };
      } else {
        console.log(`   ⚠️ UNKNOWN - Status: ${status}, Reference: ${reference || 'none'}`);
        return { ...product, works: false, status, reference };
      }
    } else {
      console.log(`   💥 ERROR - ${result.message || 'Unknown error'}`);
      return { ...product, works: false, status: 'ERROR', error: result.message };
    }
  } catch (error) {
    if (error.message === 'Request timeout') {
      console.log(`   ⏱️ TIMEOUT - Request took too long`);
      return { ...product, works: false, status: 'TIMEOUT' };
    }
    console.log(`   💥 FETCH ERROR - ${error.message}`);
    return { ...product, works: false, status: 'FETCH_ERROR', error: error.message };
  }
}

async function checkAvailability(product) {
  try {
    const response = await fetch(`http://localhost:3100/api/tourplan/pricing/${product.code}?dateFrom=2025-08-01&dateTo=2025-08-31`);
    const data = await response.json();
    
    if (data.success && data.data.calendar) {
      const availableDates = data.data.calendar
        .filter(day => day.validDay)
        .slice(0, 3)
        .map(day => {
          const date = new Date(day.date);
          const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
          return `${day.date} (${dayName})`;
        });
      
      if (availableDates.length > 0) {
        console.log(`   Available dates: ${availableDates.join(', ')}`);
        
        // Get pricing from first available date
        const firstAvailable = data.data.calendar.find(day => day.validDay);
        if (firstAvailable && firstAvailable.displayPrice) {
          console.log(`   Price: ${firstAvailable.displayPrice} per person`);
        }
      } else {
        console.log(`   No available dates found in August 2025`);
      }
    }
  } catch (error) {
    console.log(`   Could not check availability: ${error.message}`);
  }
}

async function testAll() {
  console.log('🇿🇦 Testing South Africa Group Tours');
  console.log('=' .repeat(60));
  console.log('Testing booking capability for South African products');
  console.log('Products from WordPress with known patterns:');
  console.log('  - CPTGTSUNWAYSUNA21: Wednesdays');
  console.log('  - JNBGTSUNWAYSUNZBA: Saturdays');
  
  const results = [];
  
  for (const product of southAfricaTours) {
    // First check availability
    await checkAvailability(product);
    
    // Then test booking
    const result = await testBooking(product);
    results.push(result);
    
    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 SOUTH AFRICA SUMMARY');
  console.log('=' .repeat(60));
  
  const working = results.filter(r => r.works);
  const notWorking = results.filter(r => !r.works);
  
  console.log(`\nTotal tested: ${results.length}`);
  console.log(`Working (accept bookings): ${working.length}`);
  console.log(`Not working (manual processing): ${notWorking.length}`);
  
  if (working.length > 0) {
    console.log(`\n✅ Products that accept TourPlan bookings:`);
    working.forEach(r => {
      console.log(`   ${r.code} - ${r.name} (${r.reference})`);
    });
  }
  
  if (notWorking.length > 0) {
    console.log(`\n❌ Products requiring manual processing:`);
    notWorking.forEach(r => {
      console.log(`   ${r.code} - ${r.name} (Status: ${r.status})`);
    });
  }
  
  console.log('\n📝 Configuration for TourPlan support:');
  if (working.length > 0) {
    console.log('The following South Africa products accept XML bookings:');
    console.log(working.map(r => `'${r.code}'`).join(', '));
  } else {
    console.log('No South Africa products currently accept XML bookings.');
    console.log('All bookings will get TIA-xxx references for manual processing.');
  }
}

// Run the test
testAll().catch(console.error);