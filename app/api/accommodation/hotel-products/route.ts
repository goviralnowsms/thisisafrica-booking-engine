import { NextRequest, NextResponse } from 'next/server'
import { TourPlanXMLParser } from '@/lib/tourplan/xml-parser'

const credentials = {
  agentId: process.env.TOURPLAN_AGENT_ID || 'SAMAGT',
  password: process.env.TOURPLAN_PASSWORD || 'S@MAgt01'
}

// Known hotel supplier codes and their room type suffixes
const KNOWN_HOTELS = {
  'The Portswood Hotel': {
    supplierCode: 'POR002',
    roomSuffixes: ['ST', 'EX', 'FM'], // Standard, Executive, Family
    prefix: 'CPTACPOR002PORT'
  },
  'Cape Grace': {
    supplierCode: 'GRA001', // Guessing - might need adjustment
    roomSuffixes: ['ST', 'DL', 'SU'], // Standard, Deluxe, Suite
    prefix: 'CPTACGRA001'
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const hotelName = searchParams.get('hotelName') || ''
    const dateFrom = searchParams.get('dateFrom') || '2026-07-15'
    const dateTo = searchParams.get('dateTo') || '2026-07-18'
    const adults = searchParams.get('adults') ? parseInt(searchParams.get('adults')!) : 2
    const children = searchParams.get('children') ? parseInt(searchParams.get('children')!) : 0

    console.log('🏨 Hotel products search:', { hotelName, dateFrom, dateTo })

    // Check if we have known product codes for this hotel
    const knownHotel = KNOWN_HOTELS[hotelName]
    const roomResults = []
    
    if (knownHotel) {
      console.log(`🏨 Using known supplier code ${knownHotel.supplierCode} for ${hotelName}`)
      
      // Search for each known room type individually
      for (const suffix of knownHotel.roomSuffixes) {
        const productCode = `${knownHotel.prefix}${suffix}`
        console.log(`🏨 Searching for product: ${productCode}`)
        
        const xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <Opt>${productCode}</Opt>
    <Info>G</Info>
    <DateFrom>${dateFrom}</DateFrom>
    <DateTo>${dateTo}</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>${adults}</Adults>
        ${children > 0 ? `<Children>${children}</Children>` : ''}
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
          
          if (response.ok) {
            const xmlResponse = await response.text()
            const xmlParser = new TourPlanXMLParser()
            const parsedResponse = xmlParser.parseResponse(xmlResponse)
            
            if (parsedResponse.OptionInfoReply?.Option) {
              const option = Array.isArray(parsedResponse.OptionInfoReply.Option) 
                ? parsedResponse.OptionInfoReply.Option[0] 
                : parsedResponse.OptionInfoReply.Option
                
              if (option) {
                // Determine room type from suffix
                let roomType = 'Standard Room'
                if (suffix === 'ST' || suffix === 'STD') roomType = 'Standard Room'
                else if (suffix === 'EX' || suffix === 'EXE') roomType = 'Executive Suite'
                else if (suffix === 'FM' || suffix === 'FAM') roomType = 'Family Suite'
                else if (suffix === 'DL' || suffix === 'DLX') roomType = 'Deluxe Room'
                else if (suffix === 'SU' || suffix === 'SUI') roomType = 'Suite'
                else if (suffix === 'LX' || suffix === 'LUX') roomType = 'Luxury Room'
                
                roomResults.push({
                  productCode: productCode,
                  roomType: roomType,
                  name: `${option.OptGeneral?.SupplierName || hotelName} - ${roomType}`,
                  description: option.OptGeneral?.Description || option.OptGeneral?.Comment || roomType,
                  supplier: option.OptGeneral?.SupplierName || hotelName,
                  available: true
                })
                
                console.log(`✅ Found: ${productCode} - ${roomType}`)
              }
            }
          }
        } catch (err) {
          console.log(`❌ Failed to fetch ${productCode}:`, err)
        }
      }
    }
    
    // If no known hotel or no results, fall back to general search
    if (roomResults.length === 0) {
      console.log('🏨 No known hotel config or no results, trying general search')
      
      // Try a single broad search
      const xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <ButtonDestinations>
      <ButtonDestination>
        <ButtonName>Accommodation</ButtonName>
        <DestinationName>South Africa</DestinationName>
      </ButtonDestination>
    </ButtonDestinations>
    <Info>G</Info>
    <DateFrom>${dateFrom}</DateFrom>
    <DateTo>${dateTo}</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>${adults}</Adults>
        ${children > 0 ? `<Children>${children}</Children>` : ''}
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
      
      if (response.ok) {
        const xmlResponse = await response.text()
        const xmlParser = new TourPlanXMLParser()
        const parsedResponse = xmlParser.parseResponse(xmlResponse)
        
        if (parsedResponse.OptionInfoReply?.Option) {
          const options = Array.isArray(parsedResponse.OptionInfoReply.Option) 
            ? parsedResponse.OptionInfoReply.Option 
            : [parsedResponse.OptionInfoReply.Option]
          
          // Filter for this hotel
          const mainHotelWord = hotelName.toLowerCase()
            .replace(/\bthe\b/g, '')
            .replace(/\bhotel\b/g, '')
            .trim()
            .split(/\s+/)[0]
          
          const hotelOptions = options.filter((opt: any) => {
            const supplier = (opt.OptGeneral?.SupplierName || '').toLowerCase()
            return supplier.includes(mainHotelWord)
          })
          
          hotelOptions.forEach((opt: any) => {
            const code = opt.Opt || ''
            const codeSuffix = code.slice(-2).toUpperCase()
            
            let roomType = 'Standard Room'
            if (codeSuffix === 'ST') roomType = 'Standard Room'
            else if (codeSuffix === 'EX') roomType = 'Executive Suite'
            else if (codeSuffix === 'FM') roomType = 'Family Suite'
            else if (codeSuffix === 'DL') roomType = 'Deluxe Room'
            else if (codeSuffix === 'SU') roomType = 'Suite'
            
            roomResults.push({
              productCode: code,
              roomType: roomType,
              name: `${opt.OptGeneral?.SupplierName || hotelName} - ${roomType}`,
              description: opt.OptGeneral?.Description || roomType,
              supplier: opt.OptGeneral?.SupplierName || hotelName,
              available: true
            })
          })
        }
      }
    }
    
    // Remove duplicates by room type
    const uniqueRooms = roomResults.reduce((acc: any[], room: any) => {
      if (!acc.find(r => r.roomType === room.roomType)) {
        acc.push(room)
      }
      return acc
    }, [])
    
    console.log(`🏨 Returning ${uniqueRooms.length} room types for ${hotelName}`)
    
    return NextResponse.json({
      success: true,
      rooms: uniqueRooms,
      message: `Found ${uniqueRooms.length} room types`
    })
    
  } catch (error) {
    console.error('❌ Hotel products search error:', error)
    return NextResponse.json({
      success: false,
      rooms: [],
      error: error instanceof Error ? error.message : 'Search failed'
    }, { status: 500 })
  }
}