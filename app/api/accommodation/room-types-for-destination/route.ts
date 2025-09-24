import { NextRequest, NextResponse } from 'next/server'

const credentials = {
  agentId: process.env.TOURPLAN_AGENT_ID || 'SAMAGT',
  password: process.env.TOURPLAN_PASSWORD || 'S@MAgt01'
}

// Cache for room types by country+destination - TTL of 30 minutes
let roomTypesCache: {
  [key: string]: {
    data: Array<{value: string, label: string}>;
    timestamp: number;
  }
} = {}

const CACHE_TTL = 30 * 60 * 1000 // 30 minutes in milliseconds

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const country = searchParams.get('country')
    const destination = searchParams.get('destination')

    if (!country) {
      return NextResponse.json({
        success: false,
        error: 'Country parameter is required'
      }, { status: 400 })
    }

    // Create cache key - if no destination, use country only
    const cacheKey = destination ? `${country}-${destination}` : country

    // Check cache first
    const now = Date.now()
    if (roomTypesCache[cacheKey] && (now - roomTypesCache[cacheKey].timestamp) < CACHE_TTL) {
      console.log(`🏨 Returning cached room types for ${cacheKey}`)
      return NextResponse.json({
        success: true,
        roomTypes: roomTypesCache[cacheKey].data,
        country,
        destination,
        cached: true,
        message: `Returning ${roomTypesCache[cacheKey].data.length} room types from cache`
      })
    }

    console.log(`🏨 Discovering room types for ${cacheKey}...`)

    const xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <ButtonDestinations>
      <ButtonDestination>
        <ButtonName>Accommodation</ButtonName>
        <DestinationName>${country}</DestinationName>
      </ButtonDestination>
    </ButtonDestinations>
    <Info>G</Info>
    <DateFrom>2026-07-15</DateFrom>
    <DateTo>2026-07-18</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <Type>DB</Type>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`

    const apiEndpoint = process.env.TOURPLAN_API_URL || 'https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi'

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml',
        'User-Agent': 'ThisIsAfrica/1.0'
      },
      body: xml
    })

    if (!response.ok) {
      throw new Error(`TourPlan API error: ${response.status} ${response.statusText}`)
    }

    const xmlResponse = await response.text()

    // Parse the full TourPlan API response using the standard XML parser
    const xmlParser = new (await import('@/lib/tourplan/xml-parser')).TourPlanXMLParser()

    let parsedResponse
    try {
      parsedResponse = xmlParser.parseResponse(xmlResponse)
    } catch (error) {
      console.error('🏨 XML parsing error for room types:', error)
      return NextResponse.json({
        success: false,
        roomTypes: [],
        error: 'Failed to parse TourPlan response'
      }, { status: 500 })
    }

    // Extract options from parsed response
    const optionInfoReply = parsedResponse.OptionInfoReply
    let rawOptions = []

    if (optionInfoReply && optionInfoReply.Option) {
      rawOptions = Array.isArray(optionInfoReply.Option) ? optionInfoReply.Option : [optionInfoReply.Option]
    }

    console.log(`🏨 Found ${rawOptions.length} total accommodation options for room type extraction`)

    // Filter by destination if provided
    let filteredOptions = rawOptions
    if (destination && destination !== 'all-destinations') {
      console.log(`🏨 Filtering room types by destination: ${destination}`)

      filteredOptions = rawOptions.filter((option: any) => {
        const locality = option.OptGeneral?.LocalityDescription || ''
        const address1 = option.OptGeneral?.Address1 || ''
        const address2 = option.OptGeneral?.Address2 || ''
        const address3 = option.OptGeneral?.Address3 || ''
        const supplierName = option.OptGeneral?.SupplierName || ''

        const searchText = `${locality} ${address1} ${address2} ${address3} ${supplierName}`.toLowerCase()
        const searchDestination = destination.toLowerCase().replace(/[-&]/g, ' ').replace(/\s+/g, ' ').trim()

        // Handle Victoria & Alfred Waterfront variations
        if (searchDestination.includes('victoria') && searchDestination.includes('alfred')) {
          return searchText.includes('victoria') && searchText.includes('alfred') ||
                 searchText.includes('v&a') || searchText.includes('v & a') ||
                 searchText.includes('waterfront')
        }

        // Handle Sabi Sand/Sabi Sabi variations
        if (searchDestination.includes('sabi')) {
          return searchText.includes('sabi')
        }

        // General matching
        return locality.toLowerCase().includes(searchDestination) ||
               searchDestination.includes(locality.toLowerCase()) ||
               searchText.includes(searchDestination)
      })

      console.log(`🏨 Filtered to ${filteredOptions.length} options for destination: ${destination}`)
    }

    // Extract room types from filtered options
    const roomTypeSet = new Set<string>()

    // Extract room types directly from the parsed API data
    filteredOptions.forEach((option: any) => {
      const description = option.OptGeneral?.Description || ''
      const productCode = option.Opt || ''
      const supplierName = option.OptGeneral?.SupplierName || ''

      // Use the same room type extraction logic as the hotel-rooms API
      if (description && description.trim() !== '') {
        // Clean and normalize the description
        const cleanDescription = description
          .replace(/\s+/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .trim()

        if (cleanDescription.length > 0) {
          roomTypeSet.add(cleanDescription)
        }
      }

      // Also extract from product codes as fallback
      if (productCode.includes('AC')) {
        const acIndex = productCode.indexOf('AC')
        const afterAC = productCode.substring(acIndex + 2)

        // Extract room type from code patterns
        if (afterAC.includes('LS') || afterAC.endsWith('LS')) roomTypeSet.add('Luxury Suite')
        else if (afterAC.includes('LV') || afterAC.endsWith('LV')) roomTypeSet.add('Luxury Villa')
        else if (afterAC.includes('LM') || afterAC.endsWith('LM')) roomTypeSet.add('Manor Suite')
        else if (afterAC.includes('DL') || afterAC.endsWith('DL')) roomTypeSet.add('Deluxe Suite')
        else if (afterAC.includes('EX') || afterAC.endsWith('EX')) roomTypeSet.add('Executive Suite')
        else if (afterAC.includes('SU') || afterAC.endsWith('SU')) roomTypeSet.add('Suite')
        else if (afterAC.includes('ST') || afterAC.endsWith('ST')) roomTypeSet.add('Standard Room')
        else if (afterAC.includes('TN') || afterAC.endsWith('TN')) roomTypeSet.add('Luxury Tent')
        else if (afterAC.includes('FM') || afterAC.endsWith('FM')) roomTypeSet.add('Family Room')
      }
    })

    // Convert to array format
    const roomTypes = Array.from(roomTypeSet).map(roomType => ({
      value: roomType.toLowerCase().replace(/\s+/g, '-'),
      label: roomType
    })).sort((a, b) => a.label.localeCompare(b.label))

    const locationDesc = destination ? `${country} > ${destination}` : country
    console.log(`🏨 Found ${roomTypes.length} room types for ${locationDesc}:`, roomTypes.map(rt => rt.label))

    // Cache the results
    roomTypesCache[cacheKey] = {
      data: roomTypes,
      timestamp: now
    }

    return NextResponse.json({
      success: true,
      roomTypes,
      country,
      destination,
      cached: false,
      message: `Found ${roomTypes.length} room types for ${locationDesc}`
    })

  } catch (error) {
    console.error(`❌ Room types discovery error:`, error)

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch room types',
      roomTypes: []
    }, { status: 500 })
  }
}