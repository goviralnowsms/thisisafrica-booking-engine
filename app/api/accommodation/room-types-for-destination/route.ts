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
        <Children>0</Children>
        <RoomType>DB</RoomType>
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

    // Extract star ratings from filtered options
    const starRatingSet = new Set<string>()

    // Extract star ratings from the parsed API data
    filteredOptions.forEach((option: any, index: number) => {
      const starRating = option.OptGeneral?.Class || ''
      const optCode = option.Opt || 'Unknown'
      const supplierName = option.OptGeneral?.SupplierName || 'Unknown'

      console.log(`🏨 Option ${index + 1}: Code=${optCode}, Supplier=${supplierName}, Class="${starRating}"`)

      // Debug: Check what other fields might contain star rating info
      if (option.OptGeneral) {
        const keys = Object.keys(option.OptGeneral)
        console.log(`🏨   Available OptGeneral fields:`, keys)

        // Look for any field that might contain rating info
        keys.forEach(key => {
          const value = option.OptGeneral[key]
          if (typeof value === 'string' && /\d/.test(value)) {
            console.log(`🏨   ${key}: "${value}"`)
          }
        })
      }

      // Check ClassDescription first (more reliable)
      const classDescription = option.OptGeneral?.ClassDescription || ''

      // Extract star rating from ClassDescription (e.g., "5 Star" → "5")
      if (classDescription) {
        const starMatch = classDescription.match(/(\d+)\s*[Ss]tar/)
        if (starMatch) {
          const starNumber = starMatch[1]
          starRatingSet.add(starNumber)
          console.log(`🏨   ✅ Added star rating from ClassDescription: ${starNumber} (from "${classDescription}")`)
        } else {
          console.log(`🏨   ❌ ClassDescription "${classDescription}" doesn't match star pattern`)
        }
      }
      // Fallback: Handle Class field with various formats
      else if (starRating) {
        // Handle "5S" format
        const starSMatch = starRating.match(/(\d+)S/)
        if (starSMatch) {
          const starNumber = starSMatch[1]
          starRatingSet.add(starNumber)
          console.log(`🏨   ✅ Added star rating from Class: ${starNumber} (from "${starRating}")`)
        }
        // Handle numeric codes (15, 25, 35, 45, 55, 65)
        else if (['15', '25', '35', '45', '55', '65'].includes(starRating.toString())) {
          const starNumber = Math.floor(parseInt(starRating) / 10).toString()
          starRatingSet.add(starNumber)
          console.log(`🏨   ✅ Added star rating from numeric code: ${starNumber} (from code "${starRating}")`)
        }
        // Handle descriptive codes
        else {
          const descriptiveToStar: { [key: string]: string } = {
            'BA': '2',   // Basic → 2 Star
            'DL': '3',   // Deluxe → 3 Star
            'DL+': '4',  // Deluxe plus → 4 Star
            'LU': '5',   // Luxury → 5 Star
            'ST': '3',   // Standard → 3 Star
          }

          const mappedStar = descriptiveToStar[starRating.toString().toUpperCase()]
          if (mappedStar) {
            starRatingSet.add(mappedStar)
            console.log(`🏨   ✅ Mapped class "${starRating}" to star rating: ${mappedStar}`)
          } else {
            console.log(`🏨   ❌ Star rating "${starRating}" not recognized`)
          }
        }
      } else {
        console.log(`🏨   ❌ No Class or ClassDescription field found`)
      }
    })

    // Map star numbers to labels
    const starRatingMap: { [key: string]: string } = {
      '1': '1 Star',
      '2': '2 Star',
      '3': '3 Star',
      '4': '4 Star',
      '5': '5 Star',
      '6': 'Luxury (6 Star)'
    }

    // Convert to array format, ordered by star rating
    const roomTypes = Array.from(starRatingSet)
      .sort() // This will sort '15', '25', '35', etc. in order
      .map(code => ({
        value: code,  // Keep the TourPlan code as value for filtering
        label: starRatingMap[code] || `${code} Star`
      }))

    const locationDesc = destination ? `${country} > ${destination}` : country
    console.log(`🏨 Found ${roomTypes.length} star ratings for ${locationDesc}:`, roomTypes.map(rt => rt.label))

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
      message: `Found ${roomTypes.length} star ratings for ${locationDesc}`
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