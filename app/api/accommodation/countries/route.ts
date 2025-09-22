import { NextRequest, NextResponse } from 'next/server'

const credentials = {
  agentId: process.env.TOURPLAN_AGENT_ID || 'SAMAGT',
  password: process.env.TOURPLAN_PASSWORD || 'S@MAgt01'
}

// Cache for countries - TTL of 1 hour
let countriesCache: {
  data: Array<{value: string, label: string}> | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0
}

const CACHE_TTL = 60 * 60 * 1000 // 1 hour in milliseconds

// Countries to test for accommodation availability
const POTENTIAL_COUNTRIES = [
  'South Africa',
  'Kenya',
  'Tanzania',
  'Botswana',
  'Zimbabwe',
  'Namibia',
  'Zambia',
  'Rwanda',
  'Uganda'
]

export async function GET(request: NextRequest) {
  try {
    // Check cache first
    const now = Date.now()
    if (countriesCache.data && (now - countriesCache.timestamp) < CACHE_TTL) {
      console.log('🌍 Returning cached countries data')
      return NextResponse.json({
        success: true,
        countries: countriesCache.data,
        cached: true,
        message: `Returning ${countriesCache.data.length} countries from cache`
      })
    }

    console.log('🌍 Discovering countries with accommodation products...')

    const countriesWithAccommodation: Array<{value: string, label: string}> = []
    const apiEndpoint = process.env.TOURPLAN_API_URL || 'https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi'

    // Test each potential country for accommodation availability
    for (const country of POTENTIAL_COUNTRIES) {
      try {
        console.log(`🏨 Testing ${country} for accommodations...`)

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

        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/xml',
            'User-Agent': 'ThisIsAfrica/1.0'
          },
          body: xml,
          signal: AbortSignal.timeout(15000) // 15 second timeout per country
        })

        if (!response.ok) {
          console.warn(`⚠️ API error for ${country}: ${response.status}`)
          continue
        }

        const xmlResponse = await response.text()

        // Check if the response contains actual accommodation options
        const hasAccommodations = xmlResponse.includes('<Option>') &&
                                 xmlResponse.includes('<Opt>') &&
                                 !xmlResponse.includes('<Error>')

        if (hasAccommodations) {
          // Count the number of accommodation options found
          const optionMatches = xmlResponse.match(/<Option>/g)
          const optionCount = optionMatches ? optionMatches.length : 0

          console.log(`✅ ${country}: Found ${optionCount} accommodations`)

          countriesWithAccommodation.push({
            value: country.toLowerCase().replace(/\s+/g, '-'),
            label: country
          })
        } else {
          console.log(`❌ ${country}: No accommodations found`)
        }

        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100))

      } catch (error) {
        console.error(`❌ Error testing ${country}:`, error)
        continue
      }
    }

    // If no countries found or very few, include known working countries
    const knownWorkingCountries = [
      { value: 'south-africa', label: 'South Africa' },
      { value: 'kenya', label: 'Kenya' },
      { value: 'botswana', label: 'Botswana' }
    ]

    // Add known working countries that aren't already included
    const finalCountries = [...countriesWithAccommodation]
    for (const knownCountry of knownWorkingCountries) {
      if (!finalCountries.find(c => c.value === knownCountry.value)) {
        console.log(`🏨 Adding known working country: ${knownCountry.label}`)
        finalCountries.push(knownCountry)
      }
    }

    console.log(`🌍 Final result: ${finalCountries.length} countries with accommodations:`,
                finalCountries.map(c => c.label))

    // Cache the results
    countriesCache = {
      data: finalCountries,
      timestamp: now
    }

    return NextResponse.json({
      success: true,
      countries: finalCountries,
      cached: false,
      message: `Found ${finalCountries.length} countries with accommodation products`
    })

  } catch (error) {
    console.error('❌ Countries discovery error:', error)

    // Fallback to hardcoded list if API fails
    const fallbackCountries = [
      { value: 'south-africa', label: 'South Africa' },
      { value: 'kenya', label: 'Kenya' }
    ]

    return NextResponse.json({
      success: true,
      countries: fallbackCountries,
      fallback: true,
      message: 'Using fallback country list due to API error'
    })
  }
}