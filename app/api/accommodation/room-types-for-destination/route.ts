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

    // Extract room types, filtering by destination if provided
    const roomTypeSet = new Set<string>()
    const shouldFilterByDestination = destination && destination !== 'all-destinations'

    // Split response into Option sections for destination filtering
    const optionSections = xmlResponse.split('<Option>')

    for (const section of optionSections) {
      if (!section.includes('</Option>')) continue

      // Check if this section matches our destination filter
      if (shouldFilterByDestination) {
        const localityMatch = section.match(/<LocalityDescription>(.*?)<\/LocalityDescription>/)
        if (localityMatch) {
          const sectionLocality = localityMatch[1].trim().toLowerCase()
          const searchDestination = destination.toLowerCase().replace(/-/g, ' ')

          // Skip if this section doesn't match our destination
          if (!sectionLocality.includes(searchDestination) &&
              !searchDestination.includes(sectionLocality) &&
              sectionLocality !== searchDestination) {
            continue
          }
        } else {
          continue // Skip sections without locality info when filtering
        }
      }

      // Extract room types from this section
      const descriptionMatches = section.matchAll(/<Description>(.*?)<\/Description>/g)
      for (const match of descriptionMatches) {
        const description = match[1].trim()
        if (description && description.length > 0 && description !== 'No description available') {
          const cleanDescription = description
            .replace(/\s+/g, ' ')
            .replace(/^.*?-\s*/, '')
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
      }

      // Extract from product codes
      const optMatches = section.matchAll(/<Opt>(.*?)<\/Opt>/g)
      for (const match of optMatches) {
        const productCode = match[1]
        if (productCode.includes('AC')) {
          const acIndex = productCode.indexOf('AC')
          const afterAC = productCode.substring(acIndex + 2)

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

      // Extract from names
      const nameMatches = section.matchAll(/<Name>(.*?)<\/Name>/g)
      for (const match of nameMatches) {
        const name = match[1].trim()
        if (name && name.length > 0) {
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
    }

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