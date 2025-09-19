import { NextRequest, NextResponse } from 'next/server'
import { TourPlanXMLParser } from '@/lib/tourplan/xml-parser'

const credentials = {
  agentId: process.env.TOURPLAN_AGENT_ID || 'SAMAGT',
  password: process.env.TOURPLAN_PASSWORD || 'S@MAgt01'
}

// Countries to search
const COUNTRIES = [
  'Botswana',
  'Kenya', 
  'Namibia',
  'South Africa',
  'Tanzania',
  'Uganda',
  'Zambia',
  'Zimbabwe'
]

interface HotelRoom {
  productCode: string
  hotelName: string
  roomType: string
  supplierName: string
  description: string
  country: string
}

// Extract room type from product code suffix
function extractRoomType(code: string, description: string): string {
  const codeSuffix = code.slice(-2).toUpperCase()
  const descLower = description.toLowerCase()
  
  if (codeSuffix === 'ST' || code.toUpperCase().endsWith('STD')) return 'Standard Room'
  if (codeSuffix === 'EX' || codeSuffix === 'EXE') return 'Executive Suite'
  if (codeSuffix === 'FM' || codeSuffix === 'FAM') return 'Family Suite'
  if (codeSuffix === 'DL' || codeSuffix === 'DLX') return 'Deluxe Room'
  if (codeSuffix === 'SU' || codeSuffix === 'SUI') return 'Suite'
  if (codeSuffix === 'LX' || codeSuffix === 'LUX') return 'Luxury Room'
  if (codeSuffix === 'VL' || codeSuffix === 'VIL') return 'Villa'
  if (codeSuffix === 'SP' || codeSuffix === 'SUP') return 'Superior Room'
  
  if (descLower.includes('executive')) return 'Executive Suite'
  if (descLower.includes('family')) return 'Family Suite'
  if (descLower.includes('deluxe')) return 'Deluxe Room'
  if (descLower.includes('luxury') && !descLower.includes('tent')) return 'Luxury Room'
  if (descLower.includes('suite')) return 'Suite'
  if (descLower.includes('villa')) return 'Villa'
  if (descLower.includes('standard')) return 'Standard Room'
  if (descLower.includes('superior')) return 'Superior Room'
  
  return 'Standard Room'
}

async function fetchHotelsForCountry(country: string): Promise<HotelRoom[]> {
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

  try {
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
      return []
    }

    const xmlResponse = await response.text()
    const xmlParser = new TourPlanXMLParser()
    const parsedResponse = xmlParser.parseResponse(xmlResponse)

    if (!parsedResponse.OptionInfoReply?.Option) {
      return []
    }

    const options = Array.isArray(parsedResponse.OptionInfoReply.Option)
      ? parsedResponse.OptionInfoReply.Option
      : [parsedResponse.OptionInfoReply.Option]

    const hotels: HotelRoom[] = []

    options.forEach((option: any) => {
      const productCode = option.Opt || ''
      const supplierName = option.OptGeneral?.SupplierName || ''
      const description = option.OptGeneral?.Description || ''
      
      // Only include accommodation products
      if (productCode && supplierName && (
        productCode.includes('AC') ||
        supplierName.toLowerCase().includes('hotel') ||
        supplierName.toLowerCase().includes('lodge') ||
        supplierName.toLowerCase().includes('resort') ||
        supplierName.toLowerCase().includes('camp')
      )) {
        const roomType = extractRoomType(productCode, description)
        
        hotels.push({
          productCode,
          hotelName: supplierName,
          roomType,
          supplierName,
          description,
          country
        })
      }
    })

    return hotels

  } catch (error) {
    console.error(`Error fetching ${country}:`, error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🏨 Starting hotel code collection...')
    
    const allHotels: HotelRoom[] = []
    
    // Fetch hotels for each country
    for (const country of COUNTRIES) {
      console.log(`Fetching ${country}...`)
      const countryHotels = await fetchHotelsForCountry(country)
      allHotels.push(...countryHotels)
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    // Group by hotel name
    const hotelGroups = new Map<string, HotelRoom[]>()
    allHotels.forEach(hotel => {
      const key = hotel.hotelName.toLowerCase()
      if (!hotelGroups.has(key)) {
        hotelGroups.set(key, [])
      }
      hotelGroups.get(key)!.push(hotel)
    })
    
    // Generate mapping object
    const hotelMapping: Record<string, string[]> = {}
    hotelGroups.forEach((rooms, hotelName) => {
      if (rooms.length > 0) {
        const hotelKey = rooms[0].hotelName.toLowerCase()
        hotelMapping[hotelKey] = rooms.map(r => r.productCode)
      }
    })
    
    return NextResponse.json({
      success: true,
      totalHotels: allHotels.length,
      uniqueHotels: hotelGroups.size,
      hotelMapping: hotelMapping,
      summary: Array.from(hotelGroups.entries()).map(([name, rooms]) => ({
        hotelName: rooms[0].hotelName,
        country: rooms[0].country,
        roomCount: rooms.length,
        roomTypes: [...new Set(rooms.map(r => r.roomType))],
        productCodes: rooms.map(r => r.productCode)
      }))
    })
    
  } catch (error) {
    console.error('Collection error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Collection failed'
    }, { status: 500 })
  }
}