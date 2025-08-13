// Test Zambezi Queen availability issue
// Product shows Friday availability but fails on Friday bookings

async function getProductAvailability(productCode) {
  try {
    console.log(`\n📊 Fetching availability calendar for ${productCode}...`);
    
    const response = await fetch(`http://localhost:3005/api/tourplan/pricing/${productCode}`);
    const result = await response.json();
    
    if (result.success && result.calendar) {
      console.log(`Found ${result.calendar.length} dates with availability`);
      
      // Check the first 10 available dates
      const availableDates = result.calendar
        .filter(date => date.available)
        .slice(0, 10);
      
      console.log('\n📅 First 10 available dates:');
      availableDates.forEach(date => {
        const dayName = new Date(date.date).toLocaleDateString('en-US', { weekday: 'long' });
        console.log(`   ${date.date} (${dayName}) - Price: $${date.price}`);
      });
      
      // Check day pattern
      const dayCount = {};
      result.calendar
        .filter(date => date.available)
        .forEach(date => {
          const dayName = new Date(date.date).toLocaleDateString('en-US', { weekday: 'long' });
          dayCount[dayName] = (dayCount[dayName] || 0) + 1;
        });
      
      console.log('\n📊 Availability by day of week:');
      Object.entries(dayCount).forEach(([day, count]) => {
        console.log(`   ${day}: ${count} dates`);
      });
      
      return availableDates;
    } else {
      console.log('❌ Failed to get availability');
      return [];
    }
  } catch (error) {
    console.log('💥 Error:', error.message);
    return [];
  }
}

async function testBookingOnDate(productCode, dateFrom) {
  const dayName = new Date(dateFrom).toLocaleDateString('en-US', { weekday: 'long' });
  console.log(`\n🚢 Testing booking on ${dateFrom} (${dayName})...`);
  
  const bookingData = {
    customerName: "Test Customer",
    email: "test@example.com",
    mobile: "+61400000000",
    productCode: productCode,
    rateId: "Standard",
    dateFrom: dateFrom,
    adults: 2,
    children: 0,
    isQuote: false
  };

  try {
    const response = await fetch('http://localhost:3005/api/tourplan/booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ BOOKING SUCCESS!`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Reference: ${result.reference || result.bookingId}`);
    } else {
      console.log(`❌ BOOKING FAILED`);
      console.log(`   Error: ${result.error}`);
      if (result.debugInfo) {
        console.log(`   Debug: ${JSON.stringify(result.debugInfo)}`);
      }
    }
    
    return result;
  } catch (error) {
    console.log(`💥 ERROR: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function investigateZambeziIssue() {
  console.log('🔍 INVESTIGATING ZAMBEZI QUEEN BOOKING ISSUE');
  console.log('============================================');
  console.log('Product: BBKCRTVT001ZAM3NS');
  console.log('Expected: Friday departures only');
  console.log('Problem: Failing even on Fridays');
  
  // First, get the availability calendar
  const availableDates = await getProductAvailability('BBKCRTVT001ZAM3NS');
  
  if (availableDates.length > 0) {
    console.log('\n🧪 Testing bookings on available dates:');
    console.log('========================================');
    
    // Test the first 3 available dates
    for (let i = 0; i < Math.min(3, availableDates.length); i++) {
      const date = availableDates[i].date;
      await testBookingOnDate('BBKCRTVT001ZAM3NS', date);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between tests
    }
  }
  
  console.log('\n🔍 HYPOTHESIS:');
  console.log('The issue might be:');
  console.log('1. Specific date ranges are blocked (e.g., dates too far in future)');
  console.log('2. The product requires specific configurations TourPlan hasn\'t set up');
  console.log('3. Rate validity issues (even though it shows as available)');
  console.log('4. TourPlan internal configuration that differs from availability display');
}

// Run the investigation
investigateZambeziIssue().catch(console.error);