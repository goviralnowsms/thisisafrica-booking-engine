#!/usr/bin/env node

// Check raw date data from API

async function checkProduct(code) {
  console.log(`\nChecking ${code}:`);
  
  const response = await fetch(`http://localhost:3100/api/tourplan/pricing/${code}?dateFrom=2025-10-01&dateTo=2025-10-31`);
  const data = await response.json();
  
  if (data.success && data.data.calendar) {
    // Get first 5 available dates
    const available = data.data.calendar
      .filter(day => day.validDay)
      .slice(0, 5)
      .map(day => {
        // Parse date parts manually to avoid timezone issues
        const parts = day.date.split('-');
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // 0-indexed
        const dayNum = parseInt(parts[2]);
        
        // Create date in local timezone
        const date = new Date(year, month, dayNum);
        const dayOfWeek = date.getDay();
        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
        
        return `  ${day.date} = ${dayName} (day ${dayOfWeek})`;
      });
    
    console.log(available.join('\n'));
  }
}

async function test() {
  console.log('Raw date checking - October 2025');
  console.log('Expected from WordPress:');
  console.log('  NBOGTARP001THRKE3: Mondays (6, 13, 20, 27)');
  console.log('  NBOGTARP001CKSM: Saturdays (4, 11, 18, 25)');
  console.log('  NBOGTARP001CKSE: Sundays');
  
  await checkProduct('NBOGTARP001THRKE3');
  await checkProduct('NBOGTARP001CKSM');
  await checkProduct('NBOGTARP001CKSE');
}

test().catch(console.error);