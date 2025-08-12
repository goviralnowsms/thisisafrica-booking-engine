#!/usr/bin/env node

// Debug BBKCRCHO018TIACP2 cruise availability issue

async function debugCruiseAvailability() {
  const productCode = 'BBKCRCHO018TIACP2'
  
  try {
    console.log('🚢 Debugging Cruise availability for', productCode)
    console.log('Expected: Monday and Wednesday departures only')
    console.log('Current issue: Showing every day available')
    
    // Test November 2025 (should show only Mon/Wed)
    const response = await fetch(`http://localhost:3100/api/tourplan/pricing/${productCode}?dateFrom=2025-11-01&dateTo=2025-11-14`, {
      timeout: 30000
    })
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 30000)
    )
    
    const data = await Promise.race([response.json(), timeoutPromise])
    
    if (data.success && data.data.calendar) {
      console.log('\n📅 Available dates in first 2 weeks of November 2025:')
      
      const availableDates = data.data.calendar
        .filter(day => day.validDay)
        .slice(0, 20) // First 20 available dates
        
      availableDates.forEach(day => {
        const date = new Date(day.date)
        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]
        console.log(`  ${day.date} (${dayName}) - ${day.displayPrice}`)
      })
      
      // Analyze the pattern
      console.log('\n🔍 Analysis:')
      const dayPattern = {}
      availableDates.forEach(day => {
        const date = new Date(day.date)
        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]
        dayPattern[dayName] = (dayPattern[dayName] || 0) + 1
      })
      
      console.log('Day frequency:', dayPattern)
      
      const hasOnlyMonWed = Object.keys(dayPattern).length === 2 && dayPattern.Monday && dayPattern.Wednesday
      console.log(`Expected pattern (Mon/Wed only): ${hasOnlyMonWed ? '✅ CORRECT' : '❌ INCORRECT'}`)
      
      if (!hasOnlyMonWed) {
        console.log('❌ ISSUE: Cruise is showing availability on days other than Monday/Wednesday')
      }
      
      // Check raw TourPlan data
      if (data.data.dateRanges && data.data.dateRanges[0]) {
        const range = data.data.dateRanges[0]
        console.log('\n📊 Raw TourPlan data:')
        console.log(`  Product: ${productCode}`)
        console.log(`  AppliesDaysOfWeek:`, range.appliesDaysOfWeek)
        console.log(`  OptAvail available:`, !!range.optAvail)
        console.log(`  OptAvail length:`, range.optAvail?.length || 0)
        if (range.optAvail) {
          console.log(`  First 20 OptAvail codes:`, range.optAvail.slice(0, 20))
        }
      }
      
    } else {
      console.log('❌ Failed to get pricing data:', data.error || 'Unknown error')
    }
    
  } catch (error) {
    console.log('❌ Debug failed:', error.message)
  }
}

debugCruiseAvailability()