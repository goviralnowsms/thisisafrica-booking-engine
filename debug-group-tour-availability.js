#!/usr/bin/env node

// Debug NBOGTARP001CKEKEE departure days issue

async function debugGroupTourAvailability() {
  const productCode = 'NBOGTARP001CKEKEE'
  
  try {
    console.log('🔍 Debugging Group Tour availability for', productCode)
    
    // Test October 2025 date range
    const response = await fetch(`http://localhost:3100/api/tourplan/pricing/${productCode}?dateFrom=2025-10-01&dateTo=2025-10-31`, {
      timeout: 30000
    })
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 30000)
    )
    
    const data = await Promise.race([response.json(), timeoutPromise])
    
    if (data.success && data.data.calendar) {
      console.log('\n📅 Available dates in October 2025:')
      
      const availableDates = data.data.calendar
        .filter(day => day.validDay)
        .slice(0, 10) // First 10 available dates
        
      availableDates.forEach(day => {
        const date = new Date(day.date)
        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]
        console.log(`  ${day.date} (${dayName}) - ${day.displayPrice}`)
      })
      
      if (availableDates.length > 0) {
        console.log('\n🎯 Analysis:')
        const firstAvailable = availableDates[0]
        const firstDate = new Date(firstAvailable.date)
        const firstDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][firstDate.getDay()]
        
        console.log(`First available date: ${firstAvailable.date} (${firstDayName})`)
        console.log(`Expected: Should be Sunday departures for NBOGTARP001CKEKEE`)
        console.log(`Actual: Showing ${firstDayName} departures`)
        
        if (firstDayName !== 'Sunday') {
          console.log('❌ ISSUE CONFIRMED: Wrong departure day!')
        } else {
          console.log('✅ Departure day appears correct')
        }
      }
      
      // Check raw TourPlan data
      if (data.data.dateRanges && data.data.dateRanges[0]) {
        const range = data.data.dateRanges[0]
        console.log('\n📊 Raw TourPlan data:')
        console.log(`  AppliesDaysOfWeek:`, range.appliesDaysOfWeek)
        console.log(`  OptAvail length:`, range.optAvail?.length || 0)
        console.log(`  First few OptAvail codes:`, range.optAvail?.slice(0, 10) || [])
      }
      
    } else {
      console.log('❌ Failed to get pricing data:', data.error || 'Unknown error')
    }
    
  } catch (error) {
    console.log('❌ Debug failed:', error.message)
  }
}

debugGroupTourAvailability()