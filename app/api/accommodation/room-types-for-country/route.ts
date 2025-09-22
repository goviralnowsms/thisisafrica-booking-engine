import { NextRequest, NextResponse } from 'next/server'

const credentials = {
  agentId: process.env.TOURPLAN_AGENT_ID || 'SAMAGT',
  password: process.env.TOURPLAN_PASSWORD || 'S@MAgt01'
}

// Cache for room types by country - TTL of 30 minutes
let roomTypesCache: {
  [country: string]: {
    data: Array<{value: string, label: string}>;
    timestamp: number;
  }
} = {}

const CACHE_TTL = 30 * 60 * 1000 // 30 minutes in milliseconds

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const country = searchParams.get('country')

    if (!country) {
      return NextResponse.json({
        success: false,
        error: 'Country parameter is required'
      }, { status: 400 })
    }

    // Check cache first
    const now = Date.now()
    if (roomTypesCache[country] && (now - roomTypesCache[country].timestamp) < CACHE_TTL) {
      console.log(`🏨 Returning cached room types for ${country}`)
      return NextResponse.json({
        success: true,
        roomTypes: roomTypesCache[country].data,
        country,
        cached: true,
        message: `Returning ${roomTypesCache[country].data.length} room types from cache`
      })
    }

    console.log(`🏨 Discovering room types for ${country}...`)

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

    // Extract all unique room types from the accommodation results
    const roomTypeSet = new Set<string>()

    // Look for all <Description> tags within accommodation options
    const descriptionPattern = /<Description>(.*?)<\/Description>/g
    let match

    while ((match = descriptionPattern.exec(xmlResponse)) !== null) {
      const description = match[1].trim()
      if (description && description.length > 0 && description !== 'No description available') {
        // Clean up the description to use as room type
        const cleanDescription = description
          .replace(/\s+/g, ' ') // normalize whitespace
          .replace(/^.*?-\s*/, '') // remove prefix before dash
          .trim()

        if (cleanDescription.length > 0) {
          roomTypeSet.add(cleanDescription)
        }
      }
    }

    // Also look for product names that might indicate room types
    const optPattern = /<Opt>(.*?)<\/Opt>/g
    const namePattern = /<Name>(.*?)<\/Name>/g

    // Extract from product codes - look for room type patterns
    while ((match = optPattern.exec(xmlResponse)) !== null) {
      const productCode = match[1]
      // Extract potential room type from product code
      if (productCode.includes('AC')) {
        const acIndex = productCode.indexOf('AC')
        const afterAC = productCode.substring(acIndex + 2)

        // Look for common room type patterns
        if (afterAC.includes('LS')) roomTypeSet.add('Luxury Suite')
        if (afterAC.includes('LM')) roomTypeSet.add('Manor Suite')
        if (afterAC.includes('LV')) roomTypeSet.add('Villa')
        if (afterAC.includes('DL')) roomTypeSet.add('Deluxe Room')
        if (afterAC.includes('ST')) roomTypeSet.add('Standard Room')
        if (afterAC.includes('EX')) roomTypeSet.add('Executive Suite')
        if (afterAC.includes('SU')) roomTypeSet.add('Suite')
        if (afterAC.includes('TN')) roomTypeSet.add('Tent')
      }
    }

    // Extract from names/descriptions
    while ((match = namePattern.exec(xmlResponse)) !== null) {
      const name = match[1].trim()
      if (name && name.length > 0) {
        // Extract room type from name
        const lowerName = name.toLowerCase()
        if (lowerName.includes('luxury') && lowerName.includes('suite')) roomTypeSet.add('Luxury Suite')
        else if (lowerName.includes('deluxe') && lowerName.includes('suite')) roomTypeSet.add('Deluxe Suite')
        else if (lowerName.includes('executive') && lowerName.includes('suite')) roomTypeSet.add('Executive Suite')
        else if (lowerName.includes('manor') && (lowerName.includes('suite') || lowerName.includes('house'))) roomTypeSet.add('Manor Suite')
        else if (lowerName.includes('villa')) roomTypeSet.add('Villa')
        else if (lowerName.includes('tent')) roomTypeSet.add('Luxury Tent')
        else if (lowerName.includes('suite')) roomTypeSet.add('Suite')
        else if (lowerName.includes('deluxe')) roomTypeSet.add('Deluxe Room')
        else if (lowerName.includes('standard')) roomTypeSet.add('Standard Room')
        else if (lowerName.includes('family')) roomTypeSet.add('Family Room')
      }
    }

    // Convert to array format
    const roomTypes = Array.from(roomTypeSet).map(roomType => ({
      value: roomType.toLowerCase().replace(/\s+/g, '-'),
      label: roomType
    })).sort((a, b) => a.label.localeCompare(b.label))

    console.log(`🏨 Found ${roomTypes.length} room types for ${country}:`, roomTypes.map(rt => rt.label))

    // Cache the results
    roomTypesCache[country] = {
      data: roomTypes,
      timestamp: now
    }

    return NextResponse.json({
      success: true,
      roomTypes,
      country,
      cached: false,
      message: `Found ${roomTypes.length} room types for ${country}`
    })

  } catch (error) {
    console.error(`❌ Room types discovery error for ${request.nextUrl.searchParams.get('country')}:`, error)

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch room types',
      roomTypes: []
    }, { status: 500 })
  }
}