import { NextRequest, NextResponse } from 'next/server'

const credentials = {
  agentId: process.env.TOURPLAN_AGENT_ID || 'SAMAGT',
  password: process.env.TOURPLAN_PASSWORD || 'S@MAgt01'
}

const apiEndpoint = process.env.TOURPLAN_API_URL || 'https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const productCode = searchParams.get('code') || 'CPTGTSUNWAYSUNA21'
  
  console.log('🔍 Testing tour availability for:', productCode)
  
  // Get tour data with availability
  const xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <Opt>${productCode}</Opt>
    <Info>GDMA</Info>
    <DateFrom>2025-09-09</DateFrom>
    <DateTo>2026-12-31</DateTo>
  </OptionInfoRequest>
</Request>`

  console.log('📤 XML Request:', xml)
  
  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml',
        'User-Agent': 'ThisIsAfrica/1.0'
      },
      body: xml
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const xmlResponse = await response.text()
    console.log('📥 Response length:', xmlResponse.length)

    // Parse OptAvail data manually
    const optAvailMatch = xmlResponse.match(/<OptAvail>(.*?)<\/OptAvail>/s)
    const optAvailString = optAvailMatch ? optAvailMatch[1] : ''
    const optAvailCodes = optAvailString ? optAvailString.split(' ').filter(code => code.trim()) : []
    
    console.log('📊 OptAvail codes found:', optAvailCodes.length)
    
    // Parse date ranges
    const dateRanges = []
    const dateRangeMatches = xmlResponse.matchAll(/<OptDateRange>.*?<DateFrom>(.*?)<\/DateFrom>.*?<DateTo>(.*?)<\/DateTo>.*?<AppliesDaysOfWeek\s+([^>]+)\/?>.*?<\/OptDateRange>/gs)
    
    for (const match of dateRangeMatches) {
      const [, dateFrom, dateTo, daysOfWeek] = match
      const departureDays = []
      
      if (daysOfWeek.includes('Mon="Y"')) departureDays.push('Monday')
      if (daysOfWeek.includes('Tues="Y"')) departureDays.push('Tuesday')
      if (daysOfWeek.includes('Weds="Y"')) departureDays.push('Wednesday')
      if (daysOfWeek.includes('Thurs="Y"')) departureDays.push('Thursday')
      if (daysOfWeek.includes('Fri="Y"')) departureDays.push('Friday')
      if (daysOfWeek.includes('Sat="Y"')) departureDays.push('Saturday')
      if (daysOfWeek.includes('Sun="Y"')) departureDays.push('Sunday')
      
      dateRanges.push({
        dateFrom,
        dateTo,
        departureDays
      })
    }
    
    // Calculate available dates
    const availableDates = []
    const startDate = new Date('2025-09-09')
    
    for (let i = 0; i < optAvailCodes.length; i++) {
      const code = optAvailCodes[i]
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      
      // Check if date is available (positive number means available)
      if (parseInt(code) > 0) {
        availableDates.push({
          date: currentDate.toISOString().split('T')[0],
          availability: parseInt(code),
          dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDate.getDay()]
        })
      }
    }
    
    // Get product name
    const nameMatch = xmlResponse.match(/<Description>(.*?)<\/Description>/)
    const productName = nameMatch ? nameMatch[1] : 'Unknown'
    
    return NextResponse.json({
      success: true,
      productCode,
      productName,
      dateRanges,
      optAvailCodesCount: optAvailCodes.length,
      availableDatesCount: availableDates.length,
      availableDates: availableDates.slice(0, 50), // First 50 for readability
      issue: 'The XML parser is not extracting OptAvail data, causing all dates to show as available',
      solution: 'Need to update XML parser to extract and use OptAvail field for availability'
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}