// Test the 2-night Zambezi Queen products to see their day restrictions

async function test2NightProducts() {
  const products = [
    { code: 'BBKCRTVT001ZAM2NS', name: 'Zambezi Queen 2-night standard' },
    { code: 'BBKCRTVT001ZAM2NM', name: 'Zambezi Queen 2-night master' },
    { code: 'BBKCRCHO018TIACP3', name: 'Chobe Princess 3-night (for comparison)' }
  ];
  
  for (const product of products) {
    console.log(`\n🚢 Testing ${product.name} (${product.code})...`);
    
    try {
      // Call the pricing API which should show day restrictions
      const response = await fetch(`http://localhost:3005/api/tourplan/pricing/${product.code}?dateFrom=2025-09-01&dateTo=2025-09-30`);
      const result = await response.json();
      
      if (result.success && result.data) {
        // Check the dateRanges for AppliesDaysOfWeek
        const dateRanges = result.data.dateRanges || [];
        console.log(`   Found ${dateRanges.length} date ranges`);
        
        dateRanges.forEach((range, index) => {
          console.log(`\n   Range ${index + 1}: ${range.dateFrom} to ${range.dateTo}`);
          
          if (range.appliesDaysOfWeek) {
            const days = Object.keys(range.appliesDaysOfWeek)
              .filter(key => key.startsWith('@_') && range.appliesDaysOfWeek[key] === 'Y')
              .map(key => key.replace('@_', ''));
            
            if (days.length > 0) {
              console.log(`   ✓ Day restrictions: ${days.join(', ')} only`);
            } else {
              console.log(`   ⚠️ AppliesDaysOfWeek exists but no days marked as 'Y'`);
            }
          } else {
            console.log(`   ❌ No AppliesDaysOfWeek - showing all days as available`);
          }
        });
        
        // Check calendar data to see what's actually shown
        const calendar = result.data.calendar || [];
        const septemberDates = calendar.filter(d => d.date && d.date.startsWith('2025-09'));
        
        // Count available days
        const availableDays = septemberDates.filter(d => d.validDay).length;
        const totalDays = septemberDates.length;
        
        console.log(`\n   Calendar summary for September 2025:`);
        console.log(`   ${availableDays} of ${totalDays} days shown as available`);
        
        if (availableDays === totalDays) {
          console.log(`   ⚠️ WARNING: All days showing as available!`);
        }
        
        // Show which days of week are available
        const dayStats = {};
        septemberDates.forEach(d => {
          if (d.validDay) {
            const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.dayOfWeek];
            dayStats[dayName] = (dayStats[dayName] || 0) + 1;
          }
        });
        
        if (Object.keys(dayStats).length > 0) {
          console.log(`   Days available by weekday:`, dayStats);
        }
      } else {
        console.log(`   Error: ${result.error || 'Failed to get pricing'}`);
      }
    } catch (error) {
      console.log(`   Error: ${error.message}`);
    }
  }
  
  console.log('\n📋 Summary:');
  console.log('The 2-night Zambezi Queen products likely have no AppliesDaysOfWeek restrictions');
  console.log('in the TourPlan API response, causing them to show all days as available.');
  console.log('This needs to be fixed in TourPlan configuration.');
}

test2NightProducts().catch(console.error);