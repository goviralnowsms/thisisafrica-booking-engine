#!/usr/bin/env node

// Test Group Tour pricing display

const groupTours = [
  'NBOGTARP001CKEKEE',  // Classic Kenya - Keekorok
  'NBOGTARP001CKSE',    // Classic Kenya - Serena lodges
  'NBOGTARP001CKSM',    // Classic Kenya - Sentrim lodges
  'NBOGTARP001CKSO',    // Classic Kenya - other variant
  'NBOGTARP001THRKE3',  // Three parks Kenya
];

async function testPricing(productCode) {
  try {
    console.log(`\nTesting ${productCode}...`);
    
    // Test product endpoint
    const productResponse = await fetch(`http://localhost:3100/api/tourplan/product/${productCode}`);
    const productData = await productResponse.json();
    
    if (productData.success && productData.data.rates && productData.data.rates.length > 0) {
      const rate = productData.data.rates[0];
      console.log(`  Raw rates from API:`, {
        singleRate: rate.singleRate,
        twinRate: rate.twinRate,
        currency: rate.currency
      });
      
      // Calculate displayed prices
      const singlePrice = rate.singleRate ? `$${(rate.singleRate / 100).toLocaleString()}` : 'N/A';
      const twinPrice = rate.twinRate ? `$${(rate.twinRate / 100).toLocaleString()}` : 'N/A';
      const twinPerPerson = rate.twinRate ? `$${(rate.twinRate / 200).toLocaleString()}` : 'N/A';
      
      console.log(`  Formatted prices:`, {
        single: singlePrice,
        twin: twinPrice,
        twinPerPerson: twinPerPerson,
        currency: rate.currency
      });
      
      // Check for potential issues
      if (rate.singleRate && rate.singleRate < 10000) {
        console.log(`  ⚠️ WARNING: Unusually low single rate - might be missing conversion!`);
      }
      if (rate.twinRate && rate.twinRate < 10000) {
        console.log(`  ⚠️ WARNING: Unusually low twin rate - might be missing conversion!`);
      }
    } else {
      console.log(`  No pricing data available`);
    }
    
    // Test pricing calendar endpoint
    const calendarResponse = await fetch(`http://localhost:3100/api/tourplan/pricing/${productCode}?dateFrom=2025-08-10&dateTo=2025-08-30`);
    const calendarData = await calendarResponse.json();
    
    if (calendarData.success && calendarData.data.calendar && calendarData.data.calendar.length > 0) {
      // Find first available date
      const availableDate = calendarData.data.calendar.find(day => day.validDay);
      if (availableDate) {
        console.log(`  Calendar display price: ${availableDate.displayPrice}`);
        console.log(`  Calendar raw rates:`, {
          single: availableDate.singleRate,
          twin: availableDate.twinRate
        });
      }
    }
    
  } catch (error) {
    console.log(`  Error: ${error.message}`);
  }
}

async function testAll() {
  console.log('Testing Group Tour Pricing Display');
  console.log('=' .repeat(50));
  
  for (const code of groupTours) {
    await testPricing(code);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('Test complete');
}

testAll().catch(console.error);