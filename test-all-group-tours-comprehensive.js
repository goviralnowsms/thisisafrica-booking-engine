#!/usr/bin/env node

// Comprehensive test for all Group Tour products by country
// Tests booking capability and notes pricing

const groupToursByCountry = {
  kenya: [
    'NBOGTARP001CKEKEE',  // Classic Kenya - Keekorok
    'NBOGTARP001CKSE',    // Classic Kenya - Serena lodges
    'NBOGTARP001CKSO',    // Classic Kenya - other variant
    'NBOGTARP001CKSLP',   // Classic Kenya luxury package
    'NBOGTARP001THRKE3',  // Three parks Kenya
    'NBOGTARP001THRSE3',  // Three parks Serena
    'NBOGTARP001THRSM3',  // Three parks mixed
    'NBOGTARP001THRSO3',  // Three parks other
    'NBOGTARP001EAESE',   // East Africa Serena
    'NBOGTSOAEASN13124',  // East Africa Safari Network
  ],
  tanzania: [
    'JROGTARP001SIMSE7',  // Serengeti 7 days
    'JROGTARP001SIMTW7',  // Tanzania wildlife
    'JROGTARP001SIMWEP',  // Wilderness experience
  ],
  southAfrica: [
    'CPTGTSUNWAYSUCV21',  // Cape & Victoria Falls
    'CPTGTSUNWAYSUNA21',  // Southern Africa tour
    'JNBGTSUNWAYSUNA14',  // Johannesburg based tours
    'JNBGTSATOURSAJOUR',  // SA Journey
  ],
  zimbabwe: [
    'VFAGTJENMANJENW12',  // Victoria Falls 12 days
    'VFAGTJENMANJENW15',  // Victoria Falls 15 days
  ],
  namibia: [
    'WDHGTSOANAMHINAMC',  // Namibia classic
    'WDHGTULTSAFULTNAM',  // Ultimate Namibia
  ],
  botswana: [
    'MUBGTSUNWAYSUNA13',  // Botswana tours
  ]
};

// Test dates by day of week (Group Tours usually have specific departure days)
const testDates = {
  sunday: '2025-12-21',
  monday: '2025-12-22',
  tuesday: '2025-12-23',
  wednesday: '2025-12-24',
  thursday: '2025-12-25',
  friday: '2025-12-26',
  saturday: '2025-12-27'
};

async function testGroupTourBooking(productCode, dateFrom) {
  const bookingData = {
    customerName: "Test User",
    email: "test@example.com",
    productCode: productCode,
    dateFrom: dateFrom,
    adults: 2,
    bookingType: "quote",
    rateId: "Standard"
  };

  try {
    const response = await fetch('http://localhost:3000/api/tourplan/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      const status = result.data.tourplanStatus;
      const reference = result.data.tourplanReference;
      
      if (status === 'RQ' && reference && reference.startsWith('TAWB')) {
        return { 
          code: productCode, 
          works: true, 
          status, 
          reference,
          dateFrom 
        };
      } else if (status === 'NO') {
        return { 
          code: productCode, 
          works: false, 
          status, 
          reference: null,
          dateFrom 
        };
      } else {
        return { 
          code: productCode, 
          works: false, 
          status, 
          reference,
          dateFrom 
        };
      }
    } else {
      return { 
        code: productCode, 
        works: false, 
        status: 'ERROR', 
        reference: null,
        error: result.message,
        dateFrom 
      };
    }
  } catch (error) {
    return { 
      code: productCode, 
      works: false, 
      status: 'FETCH_ERROR', 
      reference: null,
      error: error.message,
      dateFrom 
    };
  }
}

async function getPricingInfo(productCode) {
  try {
    const response = await fetch(`http://localhost:3000/api/tourplan/product/${productCode}`);
    const result = await response.json();
    
    if (result.success && result.data.rates && result.data.rates.length > 0) {
      const rate = result.data.rates[0];
      return {
        currency: rate.currency || 'AUD',
        singleRate: rate.singleRate,
        twinRate: rate.twinRate,
        hasRates: true
      };
    }
    return { hasRates: false };
  } catch (error) {
    return { hasRates: false, error: error.message };
  }
}

async function testAllGroupTours() {
  console.log('🚀 Comprehensive Group Tour Testing');
  console.log('=' .repeat(80));
  console.log('Testing all Group Tour products for:');
  console.log('1. Booking capability (which products accept bookings)');
  console.log('2. Pricing display (checking for missing digits issue)');
  console.log('3. Departure day patterns\n');
  
  const allResults = {};
  
  // Test each country's products
  for (const [country, products] of Object.entries(groupToursByCountry)) {
    console.log(`\n🌍 Testing ${country.toUpperCase()} Group Tours (${products.length} products)`);
    console.log('-'.repeat(60));
    
    const countryResults = [];
    
    for (const productCode of products) {
      console.log(`\n📍 Testing ${productCode}...`);
      
      // Get pricing info first
      const pricing = await getPricingInfo(productCode);
      
      // Test booking on Sunday first (most common for Group Tours)
      let bookingResult = await testGroupTourBooking(productCode, testDates.sunday);
      
      // If Sunday doesn't work, try Saturday
      if (!bookingResult.works && bookingResult.status === 'NO') {
        console.log('   Sunday failed, trying Saturday...');
        bookingResult = await testGroupTourBooking(productCode, testDates.saturday);
      }
      
      // Log results
      if (bookingResult.works) {
        console.log(`   ✅ WORKS - Reference: ${bookingResult.reference}`);
      } else {
        console.log(`   ❌ DECLINED - Status: ${bookingResult.status}`);
      }
      
      if (pricing.hasRates) {
        const singlePrice = pricing.singleRate ? 
          `$${(pricing.singleRate / 100).toLocaleString()}` : 'N/A';
        const twinPrice = pricing.twinRate ? 
          `$${(pricing.twinRate / 100).toLocaleString()}` : 'N/A';
        console.log(`   💰 Pricing: Single ${singlePrice}, Twin ${twinPrice} ${pricing.currency}`);
        
        // Check for potential pricing display issues
        if (pricing.singleRate && pricing.singleRate < 10000) {
          console.log(`   ⚠️ WARNING: Unusually low price detected - might be missing digits!`);
        }
      } else {
        console.log(`   💰 Pricing: Not available`);
      }
      
      countryResults.push({
        ...bookingResult,
        pricing
      });
      
      // Wait between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    allResults[country] = countryResults;
  }
  
  // Generate comprehensive report
  console.log('\n' + '='.repeat(80));
  console.log('📊 COMPREHENSIVE SUMMARY REPORT');
  console.log('='.repeat(80));
  
  for (const [country, results] of Object.entries(allResults)) {
    const working = results.filter(r => r.works);
    const notWorking = results.filter(r => !r.works);
    
    console.log(`\n🌍 ${country.toUpperCase()}`);
    console.log(`   Total: ${results.length} products`);
    console.log(`   Working: ${working.length}`);
    console.log(`   Not Working: ${notWorking.length}`);
    
    if (working.length > 0) {
      console.log(`\n   ✅ Working Products:`);
      working.forEach(r => {
        console.log(`      ${r.code} - ${r.reference}`);
      });
    }
    
    if (notWorking.length > 0) {
      console.log(`\n   ❌ Not Working Products:`);
      notWorking.forEach(r => {
        console.log(`      ${r.code} - Status: ${r.status}`);
      });
    }
  }
  
  // Overall statistics
  const allProducts = Object.values(allResults).flat();
  const totalWorking = allProducts.filter(r => r.works).length;
  const totalNotWorking = allProducts.filter(r => !r.works).length;
  
  console.log('\n' + '='.repeat(80));
  console.log('📈 OVERALL STATISTICS');
  console.log('='.repeat(80));
  console.log(`Total Products Tested: ${allProducts.length}`);
  console.log(`Working (Accept Bookings): ${totalWorking} (${Math.round(totalWorking/allProducts.length*100)}%)`);
  console.log(`Not Working (Decline Bookings): ${totalNotWorking} (${Math.round(totalNotWorking/allProducts.length*100)}%)`);
  
  // List all working products for easy reference
  console.log('\n' + '='.repeat(80));
  console.log('🎯 ALL WORKING GROUP TOUR PRODUCTS');
  console.log('='.repeat(80));
  console.log('Add these to your WORKING_PRODUCTS configuration:\n');
  
  const allWorkingCodes = allProducts
    .filter(r => r.works)
    .map(r => `'${r.code}'`)
    .join(',\n  ');
  
  console.log(`const WORKING_GROUP_TOURS = [\n  ${allWorkingCodes}\n];`);
}

// Run the comprehensive test
testAllGroupTours().catch(console.error);