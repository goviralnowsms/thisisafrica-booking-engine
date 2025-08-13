// Test cruise availability patterns to understand booking success/failure
// Using built-in fetch (Node.js 18+)

// From CLAUDE.md: Cruise bookings only work on Mondays and Wednesdays
const testDates = [
  // August 2025 - Test multiple Mondays and Wednesdays
  '2025-08-18', // Monday
  '2025-08-20', // Wednesday  
  '2025-08-25', // Monday
  '2025-08-27', // Wednesday
  
  // September 2025
  '2025-09-01', // Monday
  '2025-09-03', // Wednesday
  '2025-09-08', // Monday
  '2025-09-10', // Wednesday
  
  // October 2025
  '2025-10-06', // Monday
  '2025-10-08', // Wednesday
  '2025-10-13', // Monday
  '2025-10-15', // Wednesday
  '2025-10-20', // Monday
  '2025-10-22', // Wednesday
  '2025-10-27', // Monday
  '2025-10-29', // Wednesday
  
  // Test some non-working days for comparison
  '2025-08-19', // Tuesday
  '2025-08-21', // Thursday
  '2025-08-23', // Saturday
  '2025-08-24', // Sunday
];

// Test the working cruise product: BBKCRCHO018TIACP3 - Chobe Princess 3 night
const cruiseProduct = 'BBKCRCHO018TIACP3';

async function testCruiseBookingOnDate(dateFrom) {
  try {
    const dayName = new Date(dateFrom).toLocaleDateString('en-US', { weekday: 'long' });
    console.log(`\n🚢 Testing ${cruiseProduct} on ${dateFrom} (${dayName})`);
    
    const bookingData = {
      customerName: "Test Customer",
      email: "test@example.com", 
      mobile: "+61400000000",
      productCode: cruiseProduct,
      rateId: "Standard",
      dateFrom: dateFrom,
      adults: 2,
      children: 0,
      isQuote: false
    };

    const response = await fetch('http://localhost:3005/api/tourplan/booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ BOOKING SUCCESSFUL on ${dateFrom} (${dayName})`);
      console.log(`   Booking ID: ${result.bookingId}`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Reference: ${result.reference}`);
    } else {
      console.log(`❌ BOOKING FAILED on ${dateFrom} (${dayName})`);
      console.log(`   Error: ${result.error}`);
    }
    
    return {
      date: dateFrom,
      dayName,
      success: result.success,
      status: result.status || 'FAILED',
      reference: result.reference || null,
      error: result.error || null
    };
    
  } catch (error) {
    console.log(`💥 TEST ERROR on ${dateFrom}: ${error.message}`);
    return {
      date: dateFrom,
      dayName: new Date(dateFrom).toLocaleDateString('en-US', { weekday: 'long' }),
      success: false,
      status: 'ERROR',
      error: error.message
    };
  }
}

async function runAvailabilityTest() {
  console.log('🔍 CRUISE AVAILABILITY PATTERN TEST');
  console.log('=====================================');
  console.log(`Testing cruise product: ${cruiseProduct}`);
  console.log(`Total test dates: ${testDates.length}`);
  console.log('\nFrom CLAUDE.md: "Only Monday and Wednesday departures work"');
  
  const results = [];
  
  // Test each date
  for (const date of testDates) {
    const result = await testCruiseBookingOnDate(date);
    results.push(result);
    
    // Wait 1 second between requests to avoid overwhelming API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Analyze results
  console.log('\n📊 RESULTS ANALYSIS');
  console.log('==================');
  
  const successByDay = {};
  const failureByDay = {};
  
  results.forEach(result => {
    const day = result.dayName;
    if (result.success) {
      successByDay[day] = (successByDay[day] || 0) + 1;
    } else {
      failureByDay[day] = (failureByDay[day] || 0) + 1;
    }
  });
  
  console.log('\n✅ Successful bookings by day:');
  Object.keys(successByDay).forEach(day => {
    console.log(`   ${day}: ${successByDay[day]} successes`);
  });
  
  console.log('\n❌ Failed bookings by day:');
  Object.keys(failureByDay).forEach(day => {
    console.log(`   ${day}: ${failureByDay[day]} failures`);
  });
  
  // Check if pattern matches CLAUDE.md documentation
  const mondaySuccesses = successByDay['Monday'] || 0;
  const wednesdaySuccesses = successByDay['Wednesday'] || 0;
  const otherDaySuccesses = Object.keys(successByDay)
    .filter(day => day !== 'Monday' && day !== 'Wednesday')
    .reduce((sum, day) => sum + successByDay[day], 0);
  
  console.log('\n🎯 PATTERN VALIDATION:');
  console.log(`Monday successes: ${mondaySuccesses}`);
  console.log(`Wednesday successes: ${wednesdaySuccesses}`);
  console.log(`Other day successes: ${otherDaySuccesses}`);
  
  if (mondaySuccesses > 0 && wednesdaySuccesses > 0 && otherDaySuccesses === 0) {
    console.log('✅ CONFIRMED: Pattern matches documentation - only Monday/Wednesday work');
  } else if (mondaySuccesses > 0 || wednesdaySuccesses > 0) {
    console.log('⚠️ PARTIAL: Some Monday/Wednesday bookings work, investigating...');
  } else {
    console.log('❌ UNEXPECTED: No successful bookings found');
  }
  
  // Show specific successful dates
  const successfulDates = results.filter(r => r.success);
  if (successfulDates.length > 0) {
    console.log('\n📅 Successful booking dates:');
    successfulDates.forEach(result => {
      console.log(`   ${result.date} (${result.dayName}) - Status: ${result.status} - Ref: ${result.reference}`);
    });
  }
  
  // Show failure patterns
  const failedDates = results.filter(r => !r.success);
  if (failedDates.length > 0) {
    console.log('\n🚫 Failed booking dates (first 5):');
    failedDates.slice(0, 5).forEach(result => {
      console.log(`   ${result.date} (${result.dayName}) - Error: ${result.error}`);
    });
  }
}

// Run the test
runAvailabilityTest().catch(console.error);