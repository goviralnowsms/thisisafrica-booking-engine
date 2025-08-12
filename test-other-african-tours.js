#!/usr/bin/env node

// Test other African countries' Group Tours for booking capability

const toursByCountry = {
  tanzania: [
    { code: 'JROGTARP001SIMSE7', name: 'Serengeti 7 days', testDate: '2025-08-17' },
    { code: 'JROGTARP001SIMTW7', name: 'Tanzania wildlife', testDate: '2025-08-17' },
    { code: 'JROGTARP001SIMWEP', name: 'Wilderness experience', testDate: '2025-08-17' }
  ],
  zimbabwe: [
    { code: 'VFAGTJENMANJENW12', name: 'Victoria Falls 12 days', testDate: '2025-08-17' },
    { code: 'VFAGTJENMANJENW15', name: 'Victoria Falls 15 days', testDate: '2025-08-17' }
  ],
  namibia: [
    { code: 'WDHGTSOANAMHINAMC', name: 'Namibia classic', testDate: '2025-08-17' },
    { code: 'WDHGTULTSAFULTNAM', name: 'Ultimate Namibia', testDate: '2025-08-17' }
  ],
  botswana: [
    { code: 'MUBGTSUNWAYSUNA13', name: 'Botswana tours', testDate: '2025-08-17' }
  ]
};

async function testBooking(product, country) {
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
    
    const response = await fetch('http://localhost:3100/api/tourplan/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
      timeout: 30000
    });
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 30000)
    );
    
    const result = await Promise.race([response.json(), timeoutPromise]);
    
    if (result.success) {
      const status = result.data.tourplanStatus;
      const reference = result.data.tourplanReference;
      
      if (status === 'RQ' && reference && reference.startsWith('TAWB')) {
        console.log(`   ✅ WORKS - Status: ${status}, Reference: ${reference}`);
        return { ...product, country, works: true, status, reference };
      } else if (status === 'NO') {
        console.log(`   ❌ DECLINED - Status: ${status}, Manual processing required`);
        return { ...product, country, works: false, status, reference: null };
      } else {
        console.log(`   ⚠️ UNKNOWN - Status: ${status}, Reference: ${reference || 'none'}`);
        return { ...product, country, works: false, status, reference };
      }
    } else {
      console.log(`   💥 ERROR - ${result.message || 'Unknown error'}`);
      return { ...product, country, works: false, status: 'ERROR', error: result.message };
    }
  } catch (error) {
    if (error.message === 'Request timeout') {
      console.log(`   ⏱️ TIMEOUT - Request took too long`);
      return { ...product, country, works: false, status: 'TIMEOUT' };
    }
    console.log(`   💥 FETCH ERROR - ${error.message}`);
    return { ...product, country, works: false, status: 'FETCH_ERROR', error: error.message };
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
  console.log('🌍 Testing Group Tours for Tanzania, Zimbabwe, Namibia & Botswana');
  console.log('=' .repeat(70));
  
  const allResults = [];
  
  for (const [country, products] of Object.entries(toursByCountry)) {
    console.log(`\n${country.toUpperCase()} (${products.length} products)`);
    console.log('-'.repeat(40));
    
    for (const product of products) {
      await checkAvailability(product);
      const result = await testBooking(product, country);
      allResults.push(result);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Overall summary
  console.log('\n' + '=' .repeat(70));
  console.log('📊 COMPREHENSIVE AFRICAN TOURS SUMMARY');
  console.log('=' .repeat(70));
  
  for (const country of Object.keys(toursByCountry)) {
    const countryResults = allResults.filter(r => r.country === country);
    const working = countryResults.filter(r => r.works);
    const notWorking = countryResults.filter(r => !r.works);
    
    console.log(`\n${country.toUpperCase()}`);
    console.log(`  Total: ${countryResults.length}`);
    console.log(`  Working: ${working.length}`);
    console.log(`  Not Working: ${notWorking.length}`);
    
    if (working.length > 0) {
      console.log(`  ✅ Accept bookings:`);
      working.forEach(r => {
        console.log(`     ${r.code} - ${r.reference}`);
      });
    }
  }
  
  // List all working products across Africa
  const allWorking = allResults.filter(r => r.works);
  console.log('\n' + '=' .repeat(70));
  console.log('🎯 ALL WORKING AFRICAN GROUP TOUR PRODUCTS');
  console.log('=' .repeat(70));
  
  if (allWorking.length > 0) {
    console.log('\nProducts that accept TourPlan XML bookings:');
    const workingCodes = allWorking.map(r => `'${r.code}'`).join(',\n  ');
    console.log(`const WORKING_AFRICAN_TOURS = [\n  ${workingCodes}\n];`);
  } else {
    console.log('\nNo products from these countries accept XML bookings.');
    console.log('All will receive TIA-xxx references for manual processing.');
  }
  
  // Summary statistics
  const total = allResults.length;
  const working = allWorking.length;
  const percentage = total > 0 ? Math.round(working / total * 100) : 0;
  
  console.log(`\n📈 Overall: ${working} of ${total} products accept bookings (${percentage}%)`);
}

// Run the test
testAll().catch(console.error);