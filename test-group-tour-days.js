#!/usr/bin/env node

// Test Group Tour departure days match WordPress

const groupTourDays = {
  monday: ['NBOGTARP001THRKE3'],
  saturday: ['NBOGTARP001CKSM'],
  sunday: ['NBOGTARP001THRSE3', 'NBOGTARP001CKEKEE', 'NBOGTARP001CKSE'],
  friday: ['NBOGTSOAEASSNM061', 'NBOGTSOAEASSNM091', 'NBOGTSOAEASSNM131']
};

async function checkAvailability(productCode, expectedDay) {
  try {
    const response = await fetch(`http://localhost:3100/api/tourplan/pricing/${productCode}?dateFrom=2025-10-01&dateTo=2025-10-31`);
    const data = await response.json();
    
    if (data.success && data.data.calendar) {
      // Find available dates
      const availableDates = data.data.calendar
        .filter(day => day.validDay)
        .map(day => {
          const date = new Date(day.date);
          const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
          return {
            date: day.date,
            dayName,
            price: day.displayPrice
          };
        });
      
      return {
        productCode,
        expectedDay,
        availableDates,
        correct: availableDates.length > 0 && availableDates.every(d => d.dayName === expectedDay)
      };
    }
    return { productCode, expectedDay, error: 'No data' };
  } catch (error) {
    return { productCode, expectedDay, error: error.message };
  }
}

async function testAll() {
  console.log('Checking Group Tour Departure Days vs WordPress');
  console.log('=' .repeat(60));
  
  for (const [dayName, products] of Object.entries(groupTourDays)) {
    const expectedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    console.log(`\n${expectedDay} departures:`);
    
    for (const code of products) {
      const result = await checkAvailability(code, expectedDay);
      
      if (result.error) {
        console.log(`  ❌ ${code}: ${result.error}`);
      } else if (result.correct) {
        console.log(`  ✅ ${code}: Correct - ${result.availableDates.length} ${expectedDay} dates found`);
        if (result.availableDates.length > 0) {
          console.log(`     Price: ${result.availableDates[0].price}`);
        }
      } else {
        console.log(`  ❌ ${code}: WRONG - Expected ${expectedDay} but found:`);
        result.availableDates.slice(0, 3).forEach(d => {
          console.log(`     ${d.date} (${d.dayName})`);
        });
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}

testAll().catch(console.error);