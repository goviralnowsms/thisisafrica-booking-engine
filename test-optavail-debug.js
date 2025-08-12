#!/usr/bin/env node

// Debug OptAvail array alignment

async function debugProduct(code) {
  console.log(`\nDebugging ${code}:`);
  
  const response = await fetch(`http://localhost:3100/api/tourplan/pricing/${code}?dateFrom=2025-10-01&dateTo=2025-10-31`);
  const data = await response.json();
  
  if (data.success && data.data.dateRanges && data.data.dateRanges[0]) {
    const range = data.data.dateRanges[0];
    console.log(`  API DateFrom: ${range.dateFrom}`);
    console.log(`  API DateTo: ${range.dateTo}`);
    console.log(`  OptAvail length: ${range.optAvail ? range.optAvail.length : 'N/A'}`);
    
    if (range.optAvail) {
      // Show first 31 days of October availability
      console.log('\n  October 2025 OptAvail (index 0-30):');
      const oct = range.optAvail.slice(0, 31);
      
      // Find positive availability
      oct.forEach((code, index) => {
        if (code !== '-1' && code !== '-3') {
          const dayNum = index + 1; // Day of month
          const date = new Date(2025, 9, dayNum); // October is month 9 (0-indexed)
          const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
          console.log(`    Day ${index} (Oct ${dayNum}, ${dayName}): ${code}`);
        }
      });
    }
  }
}

async function test() {
  console.log('OptAvail Array Debug');
  console.log('=' .repeat(50));
  
  await debugProduct('NBOGTARP001THRKE3'); // Should be Mondays
  await debugProduct('NBOGTARP001CKSM');   // Should be Saturdays
}

test().catch(console.error);