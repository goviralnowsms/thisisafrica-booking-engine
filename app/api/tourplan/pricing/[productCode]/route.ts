import { type NextRequest, NextResponse } from "next/server"
import { getPricingForDateRange } from "@/lib/tourplan/services"

// Helper function to format pricing for display
function formatDisplayPrice(productCode: string, pricing: any): string {
  // For Sabi Sabi and Savanna Lodge, rates are already corrected in dollars
  if (productCode === 'GKPSPSABBLDSABBLS' || productCode === 'GKPSPSAV002SAVLHM') {
    if (pricing.twinRate > 0) {
      // Twin rate is total for room, show per person
      return `${pricing.currency} $${Math.round(pricing.twinRate / 2).toLocaleString()}`
    }
    if (pricing.singleRate > 0) {
      return `${pricing.currency} $${Math.round(pricing.singleRate).toLocaleString()}`
    }
    return 'POA'
  }
  
  // For other products, rates are in cents, convert to dollars
  if (pricing.twinRate > 0) {
    // Twin rate is total for 2 people in cents, divide by 2 for per person, then by 100 for dollars
    return `${pricing.currency} $${Math.round(pricing.twinRate / 2 / 100).toLocaleString()}`
  }
  if (pricing.singleRate > 0) {
    return `${pricing.currency} $${Math.round(pricing.singleRate / 100).toLocaleString()}`
  }
  return 'POA'
}

/**
 * API route for getting pricing calendar data for a specific product
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ productCode: string }> }) {
  try {
    const { productCode } = await params
    const { searchParams } = new URL(request.url)
    
    // Check if request is coming from cruise page via referer
    const referer = request.headers.get('referer') || ''
    const isFromCruisePage = referer.includes('/cruise') || referer.includes('/cruises')
    
    // Get date range from query params or default to next 6 months
    const dateFromParam = searchParams.get('dateFrom')
    const dateToParam = searchParams.get('dateTo')
    const adults = parseInt(searchParams.get('adults') || '2')
    const children = parseInt(searchParams.get('children') || '0')
    const roomType = searchParams.get('roomType') || 'DB'
    
    // Check if this is a rail product first
    const isRail = productCode.includes('RLROV') ||     // Rovos Rail codes like CPTRLROV001CTPPUL
                   productCode.includes('RAIL') ||      // General rail codes
                   productCode.toLowerCase().includes('rail') ||
                   productCode.includes('BLUE') ||      // Blue Train codes
                   productCode.includes('PREMIER')      // Premier Classe codes
    
    // Check if this is an accommodation product (should be available every day)
    const isAccommodation = productCode.includes('GKPSPSABBLDSABBLS') || // Sabi Sabi Bush Lodge
                            productCode.includes('GKPSPSAV002SAVLHM') ||   // Savanna Lodge
                            productCode.includes('ACCOMMODATION') ||
                            productCode.includes('LODGE') ||
                            productCode.includes('HOTEL')
    
    // For rail products, extend the date range to get more availability data
    // WordPress might be requesting a longer time period to show all available dates
    const currentDate = new Date()
    const defaultMonths = isRail ? 12 : 6 // 12 months for rail, 6 months for others
    const defaultDateTo = new Date(currentDate.getFullYear(), currentDate.getMonth() + defaultMonths, currentDate.getDate())
    
    const dateFrom = dateFromParam || currentDate.toISOString().split('T')[0]
    const dateTo = dateToParam || defaultDateTo.toISOString().split('T')[0]
    
    console.log(`📅 Using date range for ${isRail ? 'rail' : 'standard'} product:`, { dateFrom, dateTo, months: defaultMonths })
    
    console.log('Getting pricing calendar for:', { productCode, dateFrom, dateTo, adults, children, roomType })
    
    const result = await getPricingForDateRange(productCode, dateFrom, dateTo, adults, children, roomType)
    
    console.log('🚂 TourPlan API result:', {
      success: !!result,
      hasDateRanges: !!result.dateRanges,
      dateRangesLength: result.dateRanges?.length || 0,
      error: result.error,
      firstRange: result.dateRanges?.[0]
    })
    
    // Process and fix pricing data from TourPlan API
    let pricingData = result.dateRanges
    
    // Extract OptAvail data for WordPress-style availability processing
    const optAvailData = result.optAvail || null
    
    // Detect product types based on code patterns and referer
    const isCruise = productCode.includes('CRCHO') ||   // Chobe cruise codes like BBKCRCHO018TIACP2
                     productCode.includes('CRTVT') ||   // Victoria Falls cruise codes like BBKCRTVT001ZAM3NS
                     productCode.includes('CRUISE') ||  // General cruise codes
                     productCode.toLowerCase().includes('cruise') ||
                     isFromCruisePage  // Any product accessed from cruise page should be treated as cruise

    // Check if request is for rail products
    const isFromRailPage = referer.includes('/rail') || referer.includes('/products/') // Product details page for rail codes
    
    // Determine the correct departure day for different product types
    let correctDepartureDay = null
    
    if (isCruise) {
      // For cruise products, use OptAvail data for accurate availability
      // Don't override with hardcoded departure days - let WordPress-style logic handle it
      correctDepartureDay = null
    } else if (isRail) {
      // FORCE HARDCODED DATES FOR RAIL PRODUCTS
      // TourPlan is not returning the correct specific departure dates
      console.log('🚂 Rail product detected - FORCING use of hardcoded dates instead of TourPlan data')
      
      // Clear any existing pricing data for rail products
      pricingData = []
      correctDepartureDay = null
      
      console.log('🚂 Cleared TourPlan data for rail product - will force hardcoded fallback')
    }
    
    console.log('🔍 Checking product type and departure pattern:', { 
      productCode, 
      isCruise, 
      isRail,
      correctDepartureDay,
      isFromCruisePage,
      isFromRailPage, 
      referer, 
      pricingDataLength: pricingData.length,
      containsCRTVT: productCode.includes('CRTVT'),
      containsCRCHO: productCode.includes('CRCHO'),
      containsRLROV: productCode.includes('RLROV')
    })
    
    // Apply departure day fixes for both cruise and rail products
    if ((isCruise || isRail) && correctDepartureDay && pricingData.length > 0) {
      const productType = isCruise ? 'cruise' : 'rail'
      const emoji = isCruise ? '🚢' : '🚂'
      
      console.log(`${emoji} BEFORE ${productType} fix - appliesDaysOfWeek from first range:`, pricingData[0]?.appliesDaysOfWeek)
      
      pricingData = pricingData.map((range: any, index: number) => {
        console.log(`${emoji} Range ${index} BEFORE fix:`, {
          dateFrom: range.dateFrom,
          dateTo: range.dateTo,
          appliesDaysOfWeek: range.appliesDaysOfWeek
        })
        
        const fixedRange = {
          ...range,
          appliesDaysOfWeek: correctDepartureDay // Use detected departure day
        }
        
        console.log(`${emoji} Range ${index} AFTER fix:`, {
          dateFrom: fixedRange.dateFrom,
          dateTo: fixedRange.dateTo,
          appliesDaysOfWeek: fixedRange.appliesDaysOfWeek
        })
        
        return fixedRange
      })
      
      // Log the departure days for confirmation
      const departureDays = Object.keys(correctDepartureDay)
        .filter(key => correctDepartureDay[key] === 'Y')
        .map(key => key.replace('@_', ''))
        .join(', ')
      console.log(`${emoji} Successfully fixed ${productType} pricing data to enforce ${departureDays} departures`)
    }
    
    if (pricingData.length === 0) {
      console.log('No date range data, checking if rail product needs hardcoded dates')
      
      if (isRail) {
        console.log('🚂 Rail product with no TourPlan data - using hardcoded available dates for product:', productCode)
        
        // Get hardcoded rail dates based on product code
        const railProductData = getRailProductDates(productCode)
        
        // Create pricing data for each specific date
        pricingData = railProductData.dates.map(date => ({
          dateFrom: date,
          dateTo: date,
          currency: 'AUD',
          singleRate: railProductData.singleRate,
          doubleRate: railProductData.doubleRate,
          twinRate: railProductData.twinRate,
          rateName: `${railProductData.name} - Hardcoded`,
          appliesDaysOfWeek: null, // No weekly pattern - specific dates only
          available: true
        }))
        
        console.log('🚂 Created hardcoded rail pricing data for', railProductData.dates.length, 'specific dates for', railProductData.name)
      } else {
        console.log('No date range data, falling back to product details')
        const { getProductDetails } = require('@/lib/tourplan/services')
        const productDetails = await getProductDetails(productCode)
        
        console.log('Product details fallback:', {
          hasRates: !!productDetails.rates,
          ratesLength: productDetails.rates?.length,
          firstRate: productDetails.rates?.[0]
        })
        
        if (productDetails.rates && productDetails.rates.length > 0) {
        // Convert product rates to pricing data format
        pricingData = productDetails.rates.map((rate: any) => ({
          dateFrom: rate.dateFrom || dateFrom,
          dateTo: rate.dateTo || dateFrom,
          currency: rate.currency || 'AUD',
          singleRate: rate.singleRate || 0,
          doubleRate: rate.doubleRate || rate.twinRate || 0,
          twinRate: rate.twinRate || rate.doubleRate || 0,
          rateName: rate.rateName || 'Standard',
          appliesDaysOfWeek: correctDepartureDay || (isRail ? null : { '@_Sun': 'Y' }), // For rail, don't use weekly patterns as fallback
          available: true // Rail products always show as available since they require manual confirmation
        }))
        
        console.log('Converted pricing data:', pricingData.length, 'items')
        } else {
          console.log('No rates found in product details either')
        }
      }
    }
    
    if (pricingData.length === 0) {
      // Create a minimal single date entry so the calendar shows something
      console.log('No pricing data found, creating minimal fallback entry')
      pricingData = [{
        dateFrom: dateFrom,
        dateTo: dateFrom,
        currency: 'AUD',
        singleRate: 0,
        doubleRate: 0,
        twinRate: 0,
        rateName: 'Contact for Pricing',
        appliesDaysOfWeek: correctDepartureDay || (isRail ? null : { '@_Sun': 'Y' }),
        available: true // Always show as available for manual confirmation products
      }]
    }
    
    // Process the date ranges to create calendar-friendly data
    console.log('Processing calendar data with', pricingData.length, 'pricing items')
    console.log('OptAvail data available:', !!optAvailData, optAvailData?.length || 0, 'codes')
    // Pass the API's actual dateFrom for OptAvail indexing
    const apiDateFrom = pricingData.length > 0 ? pricingData[0].dateFrom : dateFrom
    const calendarData = processCalendarData(pricingData, dateFrom, dateTo, productCode, isAccommodation, optAvailData, apiDateFrom)
    console.log('Generated calendar data:', calendarData.length, 'days')
    
    const response = NextResponse.json({ 
      success: true, 
      data: {
        productCode,
        dateRange: { from: dateFrom, to: dateTo },
        travelers: { adults, children, roomType },
        calendar: calendarData,
        dateRanges: pricingData
      }
    })
    
    // Prevent caching to ensure fixes are applied immediately
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error("API error getting pricing calendar:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace')
    console.error("Error message:", error instanceof Error ? error.message : error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to get pricing calendar",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

/**
 * Process date ranges into calendar-friendly format
 * Fixed to handle timezone consistently and avoid UTC date shifts
 */
function processCalendarData(dateRanges: any[], startDate: string, endDate: string, productCode: string, isAccommodation: boolean, optAvailData?: string[] | null, apiDateFrom?: string) {
  const calendar: any[] = []
  
  // Helper function to create local date from YYYY-MM-DD string
  const createLocalDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(year, month - 1, day) // Month is 0-indexed
  }
  
  // Helper function to format date as YYYY-MM-DD in local timezone
  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  const start = createLocalDate(startDate)
  const end = createLocalDate(endDate)
  
  // Create a map of dates to pricing
  const dateMap = new Map()
  
  dateRanges.forEach(range => {
    const rangeStart = createLocalDate(range.dateFrom)
    const rangeEnd = createLocalDate(range.dateTo)
    
    // For each date in the range, store the pricing
    const current = new Date(rangeStart)
    while (current <= rangeEnd) {
      const dateKey = formatLocalDate(current)
      dateMap.set(dateKey, {
        date: dateKey,
        available: range.available,
        singleRate: range.singleRate,
        doubleRate: range.doubleRate, 
        twinRate: range.twinRate,
        currency: range.currency,
        rateName: range.rateName,
        appliesDaysOfWeek: range.appliesDaysOfWeek,
        optAvail: optAvailData // Pass WordPress-style availability data
      })
      current.setDate(current.getDate() + 1)
    }
  })
  
  // Check if this is a rail product
  const isRailProduct = productCode.includes('RLROV') || 
                         productCode.includes('RAIL') || 
                         productCode.toLowerCase().includes('rail') ||
                         productCode.includes('BLUE') || 
                         productCode.includes('PREMIER')

  if (isRailProduct) {
    // For rail products, ONLY add dates that are in our dateMap (specific departure dates)
    console.log('🚂 Processing rail product - only showing specific departure dates')
    console.log('🚂 Available dates in dateMap:', Array.from(dateMap.keys()).sort())
    
    dateMap.forEach((pricing, dateKey) => {
      const date = createLocalDate(dateKey)
      const dayOfWeek = date.getDay()
      
      console.log(`🚂 Adding rail departure date: ${dateKey} (${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek]})`)
      
      calendar.push({
        ...pricing,
        dayOfWeek,
        validDay: pricing.available,
        displayPrice: formatDisplayPrice(productCode, pricing)
      })
    })
  } else {
    // For non-rail products, generate calendar data for the full requested period
    const current = new Date(start)
    while (current <= end) {
      const dateKey = formatLocalDate(current)
      const dayOfWeek = current.getDay() // 0 = Sunday, 1 = Monday, etc.
      
      console.log('🗓️ Processing date:', {
        dateKey,
        dayOfWeek,
        dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
        hasDateData: dateMap.has(dateKey)
      })
      
      if (dateMap.has(dateKey)) {
        const pricing = dateMap.get(dateKey)
        console.log('🔍 Pricing object for', dateKey, 'has optAvail:', !!pricing.optAvail)
        
        // Check if this day is valid using WordPress-style OptAvail data
        let validDay = true
        
        if (isAccommodation) {
          // For accommodation products, every day is valid
          validDay = true
          console.log(`🏨 Accommodation product - all days valid: ${dateKey}`)
        } else if (pricing.optAvail && Array.isArray(pricing.optAvail)) {
          console.log('🎯 Using WordPress-style availability logic for', dateKey);
          // Use WordPress-style availability processing instead of appliesDaysOfWeek
          // Calculate days since start using WordPress-compatible logic (handles AEST/AEDT transition)
          // Use apiDateFrom for OptAvail indexing (the actual start date of the API response)
          const optAvailStartDate = apiDateFrom || startDate;
          
          // WordPress uses DateTime->diff()->days which counts calendar days, not 24-hour periods
          // This handles DST transitions correctly (Oct 5, 2025 AEST->AEDT in Australia)
          const startDateParts = optAvailStartDate.split('-').map(Number);
          const currentDateParts = dateKey.split('-').map(Number);
          
          // Create dates at noon to avoid DST transition issues (WordPress equivalent)
          const startDate_WP = new Date(startDateParts[0], startDateParts[1] - 1, startDateParts[2], 12, 0, 0);
          const currentDate_WP = new Date(currentDateParts[0], currentDateParts[1] - 1, currentDateParts[2], 12, 0, 0);
          
          // Calculate difference in calendar days (WordPress DateTime->diff()->days equivalent)
          const daysSinceStart = Math.round((currentDate_WP.getTime() - startDate_WP.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysSinceStart >= 0 && daysSinceStart < pricing.optAvail.length) {
            const availCode = pricing.optAvail[daysSinceStart];
            
            // WordPress availability logic from tourplan-api-classes.php line 382-387
            // -1 = Not available, -2 = On free sell, -3 = On request, >0 = Available (number of units)
            
            // Check if this is a Group Tour product
            const isGroupTour = productCode.includes('NBOGTARP') || productCode.includes('GROUPTOUR');
            
            if (isGroupTour) {
              // For Group Tours, WordPress productdetails.php only shows days with Status "Available"
              // This means only positive availability codes (>0), not "On request" (-3) days
              validDay = parseInt(availCode) > 0;  // Only show positive availability for Group Tours
            } else {
              // For other products (Cruise, Rail, etc.), use the general logic
              validDay = availCode !== '-1';  // Everything except -1 is considered available
            }
            
            let statusText = 'Unknown';
            if (availCode === '-1') statusText = 'Not available';
            else if (availCode === '-3') statusText = 'On request';
            else if (availCode === '-2') statusText = 'On free sell';
            else if (parseInt(availCode) > 0) statusText = `Available (${availCode} units)`;
            
            console.log('📊 WordPress-style availability check:', {
              dateKey,
              optAvailStartDate,
              daysSinceStart,
              availCode,
              statusText,
              validDay,
              dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
              isDSTTransitionMonth: dateKey.includes('2025-10'), // October 2025 has DST transition
              productCode: productCode.includes('NBOGTARP') ? '(Group Tour)' : '(Other)'
            });
          } else {
            console.log('⚠️ Day index out of range for OptAvail:', { daysSinceStart, optAvailLength: pricing.optAvail.length });
          }
        } else if (pricing.appliesDaysOfWeek) {
          // Fallback to old logic if no OptAvail data
          const dayKeys = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
          const dayKey = dayKeys[dayOfWeek]
          validDay = pricing.appliesDaysOfWeek[`@_${dayKey}`] === 'Y'
          
          console.log('⚠️ Using fallback appliesDaysOfWeek logic (should be using OptAvail):', {
            dateKey, dayKey, validDay
          })
        }
        
        calendar.push({
          ...pricing,
          dayOfWeek,
          validDay: validDay && pricing.available,
          displayPrice: formatDisplayPrice(productCode, pricing)
        })
      } else {
        calendar.push({
          date: dateKey,
          dayOfWeek,
          available: false,
          validDay: false,
          displayPrice: 'N/A'
        })
      }
      
      current.setDate(current.getDate() + 1)
    }
  }
  
  return calendar
}

/**
 * Get hardcoded rail product dates and pricing
 * Based on documentation files in docs/booking-files-to-tourplan/
 */
function getRailProductDates(productCode: string) {
  // Cape Town to Pretoria dates (Mon/Tue pattern)
  const capeTownToPretoriaDates = [
    // August 2025
    '2025-08-04', '2025-08-11', '2025-08-26',
    // September 2025  
    '2025-09-08', '2025-09-12', '2025-09-15', '2025-09-29',
    // October 2025
    '2025-10-06', '2025-10-10', '2025-10-27', '2025-10-28',
    // November 2025
    '2025-11-03', '2025-11-10', '2025-11-25',
    // December 2025
    '2025-12-09', '2025-12-20', '2025-12-27',
    // January 2026
    '2026-01-13', '2026-01-20', '2026-01-27',
    // February 2026
    '2026-02-10', '2026-02-14', '2026-02-23',
    // March 2026
    '2026-03-10', '2026-03-13', '2026-03-24',
    // April 2026
    '2026-04-03', '2026-04-07', '2026-04-14', '2026-04-21',
    // May 2026
    '2026-05-05', '2026-05-08', '2026-05-19',
    // June 2026
    '2026-06-02', '2026-06-16',
    // July 2026
    '2026-07-14', '2026-07-28',
    // August 2026
    '2026-08-08', '2026-08-11', '2026-08-25',
    // September 2026
    '2026-09-08', '2026-09-22', '2026-09-25'
  ]

  // Pretoria to Cape Town dates (mostly Fridays)
  const pretoriaToCapeTownDates = [
    // August 2025
    '2025-08-01', '2025-08-08', '2025-08-22',
    // September 2025
    '2025-09-05', '2025-09-19', '2025-09-26',
    // October 2025
    '2025-10-03', '2025-10-07', '2025-10-24', '2025-10-31',
    // November 2025
    '2025-11-07', '2025-11-20', '2025-11-21',
    // December 2025
    '2025-12-05', '2025-12-23',
    // January 2026
    '2026-01-05', '2026-01-09', '2026-01-16', '2026-01-23',
    // February 2026
    '2026-02-06', '2026-02-18', '2026-02-20',
    // March 2026
    '2026-03-06', '2026-03-20',
    // April 2026
    '2026-04-03', '2026-04-17',
    // May 2026
    '2026-05-01', '2026-05-15', '2026-05-29',
    // June 2026
    '2026-06-12', '2026-06-26',
    // July 2026
    '2026-07-10', '2026-07-24',
    // August 2026
    '2026-08-07', '2026-08-14', '2026-08-21',
    // September 2026
    '2026-09-04', '2026-09-18'
  ]

  switch (productCode) {
    // Cape Town to Pretoria routes
    case 'CPTRLROV001CTPPUL':
      return {
        name: 'Cape Town to Pretoria (Pullman)',
        dates: capeTownToPretoriaDates,
        singleRate: 331900, // $3,319 in cents
        doubleRate: 497800, // $4,978 in cents
        twinRate: 497800
      }
      
    case 'CPTRLROV001CTPRRO':
      return {
        name: 'Cape Town to Pretoria (Royal)',
        dates: capeTownToPretoriaDates,
        singleRate: 637200, // $6,372 in cents  
        doubleRate: 955800, // $9,558 in cents
        twinRate: 955800
      }
      
    case 'CPTRLROV001RRCTPR':
      return {
        name: 'Cape Town to Pretoria (RRCTPR)',
        dates: capeTownToPretoriaDates,
        singleRate: 477900, // $4,779 in cents
        doubleRate: 716900, // $7,169 in cents
        twinRate: 716900
      }

    // Pretoria to Cape Town routes
    case 'PRYRLROV001PRCPPM':
      return {
        name: 'Pretoria to Cape Town (Pullman)',
        dates: pretoriaToCapeTownDates,
        singleRate: 331900, // $3,319 in cents
        doubleRate: 497800, // $4,978 in cents
        twinRate: 497800
      }
      
    case 'PRYRLROV001PRCPRY':
      return {
        name: 'Pretoria to Cape Town (Royal)',
        dates: pretoriaToCapeTownDates,
        singleRate: 637200, // $6,372 in cents  
        doubleRate: 955800, // $9,558 in cents
        twinRate: 955800
      }
      
    case 'PRYRLROV001ROV004':
      return {
        name: 'Pretoria to Cape Town (ROV004)',
        dates: pretoriaToCapeTownDates,
        singleRate: 477900, // $4,779 in cents
        doubleRate: 716900, // $7,169 in cents
        twinRate: 716900
      }
      
    default:
      console.log('🚂 Unknown rail product code:', productCode, '- using default')
      return {
        name: 'Unknown Rail Product',
        dates: capeTownToPretoriaDates, // Default to Cape Town route dates
        singleRate: 0,
        doubleRate: 0,
        twinRate: 0
      }
  }
}