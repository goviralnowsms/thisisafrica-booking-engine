import { NextRequest, NextResponse } from 'next/server'

const credentials = {
  agentId: process.env.TOURPLAN_AGENT_ID || 'SAMAGT',
  password: process.env.TOURPLAN_PASSWORD || 'S@MAgt01'
}

// Cache for destinations by country - TTL of 30 minutes
let destinationsCache: {
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
    if (destinationsCache[country] && (now - destinationsCache[country].timestamp) < CACHE_TTL) {
      console.log(`🏨 Returning cached destinations for ${country}`)
      return NextResponse.json({
        success: true,
        destinations: destinationsCache[country].data,
        country,
        cached: true,
        message: `Returning ${destinationsCache[country].data.length} destinations from cache`
      })
    }

    console.log(`🏨 Discovering actual accommodation destinations for ${country}...`)

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

    // Extract all unique localities (destinations) from actual accommodation results
    const destinationSet = new Set<string>()

    // Look for locality information within accommodation options
    const localityPattern = /<LocalityDescription>(.*?)<\/LocalityDescription>/g
    let match

    while ((match = localityPattern.exec(xmlResponse)) !== null) {
      const locality = match[1].trim()
      if (locality && locality.length > 0 && locality !== 'Not specified') {
        // Decode HTML entities like &amp; to &
        const decodedLocality = locality
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
        destinationSet.add(decodedLocality)
      }
    }

    // Also extract from name patterns to catch more destinations
    const namePattern = /<Name>(.*?)<\/Name>/g

    while ((match = namePattern.exec(xmlResponse)) !== null) {
      const name = match[1].trim()
      if (name && name.length > 0) {
        // Extract destination from hotel name patterns
        const lowerName = name.toLowerCase()

        // Common destination patterns in accommodation names
        const destinationKeywords = [
          'cape town', 'waterfront', 'stellenbosch', 'hermanus', 'knysna', 'plettenberg bay',
          'kruger', 'sabi sand', 'sabi sabi', 'thornybush', 'timbavati', 'kapama',
          'johannesburg', 'sandton', 'pretoria', 'sun city',
          'nairobi', 'masai mara', 'amboseli', 'samburu', 'tsavo', 'nakuru',
          'serengeti', 'ngorongoro', 'zanzibar', 'arusha', 'tarangire',
          'chobe', 'okavango', 'moremi', 'maun',
          'victoria falls', 'hwange', 'kariba',
          'windhoek', 'sossusvlei', 'etosha', 'damaraland', 'skeleton coast'
        ]

        destinationKeywords.forEach(keyword => {
          if (lowerName.includes(keyword)) {
            // Capitalize properly and decode HTML entities
            const properKeyword = keyword
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'")
            destinationSet.add(properKeyword)
          }
        })
      }
    }

    // Convert to array format
    const destinations = Array.from(destinationSet).map(destination => ({
      value: destination.toLowerCase().replace(/\s+/g, '-'),
      label: destination
    })).sort((a, b) => a.label.localeCompare(b.label))

    console.log(`🏨 Found ${destinations.length} destinations with accommodations for ${country}:`, destinations.map(d => d.label))

    // Cache the results
    destinationsCache[country] = {
      data: destinations,
      timestamp: now
    }

    return NextResponse.json({
      success: true,
      destinations,
      country,
      cached: false,
      message: `Found ${destinations.length} destinations with accommodations for ${country}`
    })

  } catch (error) {
    console.error(`❌ Destinations discovery error for ${request.nextUrl.searchParams.get('country')}:`, error)

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch destinations',
      destinations: []
    }, { status: 500 })
  }
}