/**
 * Script to fetch all hotel product codes by country
 * This will help us build a complete mapping of hotels and their room types
 */

import { TourPlanXMLParser } from '../lib/tourplan/xml-parser'

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
  
  // Check product code suffix first
  if (codeSuffix === 'ST' || code.toUpperCase().endsWith('STD')) return 'Standard Room'
  if (codeSuffix === 'EX' || codeSuffix === 'EXE') return 'Executive Suite'
  if (codeSuffix === 'FM' || codeSuffix === 'FAM') return 'Family Suite'
  if (codeSuffix === 'DL' || codeSuffix === 'DLX') return 'Deluxe Room'
  if (codeSuffix === 'SU' || codeSuffix === 'SUI') return 'Suite'
  if (codeSuffix === 'LX' || codeSuffix === 'LUX') return 'Luxury Room'
  if (codeSuffix === 'VL' || codeSuffix === 'VIL') return 'Villa'
  if (codeSuffix === 'SP' || codeSuffix === 'SUP') return 'Superior Room'
  
  // Then check description
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

// Extract supplier code from product code
function extractSupplierCode(productCode: string): string | null {
  // Format: CPTACPOR002PORTST - extract POR002
  const match = productCode.match(/([A-Z]{3}\d{3})/i)
  return match ? match[1] : null
}

async function fetchHotelsForCountry(country: string): Promise<HotelRoom[]> {
  console.log(`\n🌍 Fetching hotels for ${country}...`)
  
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
      console.error(`❌ Failed to fetch ${country}: ${response.status}`)
      return []
    }

    const xmlResponse = await response.text()
    const xmlParser = new TourPlanXMLParser()
    const parsedResponse = xmlParser.parseResponse(xmlResponse)

    if (!parsedResponse.OptionInfoReply?.Option) {
      console.log(`⚠️ No accommodations found for ${country}`)
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
      
      // Only include accommodation products (not tours)
      if (productCode && supplierName && (
        productCode.includes('AC') || // Accommodation code pattern
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

    console.log(`✅ Found ${hotels.length} accommodation products in ${country}`)
    return hotels

  } catch (error) {
    console.error(`❌ Error fetching ${country}:`, error)
    return []
  }
}

async function main() {
  console.log('🏨 Starting hotel product code collection...')
  
  const allHotels: HotelRoom[] = []
  
  // Fetch hotels for each country
  for (const country of COUNTRIES) {
    const countryHotels = await fetchHotelsForCountry(country)
    allHotels.push(...countryHotels)
    
    // Add delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
  
  console.log(`\n📊 SUMMARY`)
  console.log(`Total hotels found: ${allHotels.length}`)
  
  // Group by hotel name to see available room types
  const hotelGroups = new Map<string, HotelRoom[]>()
  allHotels.forEach(hotel => {
    const key = hotel.hotelName.toLowerCase()
    if (!hotelGroups.has(key)) {
      hotelGroups.set(key, [])
    }
    hotelGroups.get(key)!.push(hotel)
  })
  
  console.log(`\n🏨 HOTELS WITH MULTIPLE ROOM TYPES:`)
  hotelGroups.forEach((rooms, hotelName) => {
    if (rooms.length > 1) {
      console.log(`\n${rooms[0].hotelName} (${rooms[0].country}):`)
      const uniqueRoomTypes = [...new Set(rooms.map(r => r.roomType))]
      uniqueRoomTypes.forEach(roomType => {
        const room = rooms.find(r => r.roomType === roomType)
        console.log(`  - ${roomType}: ${room?.productCode}`)
      })
    }
  })
  
  // Generate TypeScript mapping
  console.log(`\n📝 TYPESCRIPT MAPPING:`)
  console.log('const HOTEL_ROOM_CODES: Record<string, string[]> = {')
  
  hotelGroups.forEach((rooms, hotelName) => {
    if (rooms.length > 0) {
      const hotelKey = rooms[0].hotelName.toLowerCase()
      const productCodes = rooms.map(r => r.productCode)
      console.log(`  '${hotelKey}': [`)
      productCodes.forEach(code => {
        const room = rooms.find(r => r.productCode === code)
        console.log(`    '${code}', // ${room?.roomType}`)
      })
      console.log('  ],')
    }
  })
  
  console.log('}')
  
  // Generate supplier code mapping
  console.log(`\n🏢 SUPPLIER CODES:`)
  const supplierCodes = new Set<string>()
  allHotels.forEach(hotel => {
    const supplierCode = extractSupplierCode(hotel.productCode)
    if (supplierCode) {
      supplierCodes.add(supplierCode)
    }
  })
  
  Array.from(supplierCodes).sort().forEach(code => {
    const hotelsWithCode = allHotels.filter(h => h.productCode.includes(code))
    if (hotelsWithCode.length > 0) {
      console.log(`${code}: ${hotelsWithCode[0].hotelName}`)
    }
  })
}

// Run the script
main().catch(console.error)