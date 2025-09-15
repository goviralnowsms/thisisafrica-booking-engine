import { NextRequest, NextResponse } from 'next/server'
import { TourPlanXMLParser } from '@/lib/tourplan/xml-parser'

const credentials = {
  agentId: process.env.TOURPLAN_AGENT_ID || 'SAMAGT',
  password: process.env.TOURPLAN_PASSWORD || 'S@MAgt01'
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    
    // Extract search parameters
    const hotelName = searchParams.get('hotelName') || ''
    const destination = searchParams.get('destination') || 'South Africa'
    const dateFrom = searchParams.get('dateFrom') || '2026-07-15'
    const dateTo = searchParams.get('dateTo') || '2026-07-18'
    const adults = searchParams.get('adults') ? parseInt(searchParams.get('adults')!) : 2
    const children = searchParams.get('children') ? parseInt(searchParams.get('children')!) : 0

    console.log('🏨 Hotel rooms search request:', {
      hotelName,
      destination,
      dateFrom,
      dateTo,
      adults,
      children
    })

    // Strategy: Search for all accommodation in the destination
    // Then filter client-side for the specific hotel
    // This ensures we get ALL room products, not grouped
    const xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <ButtonDestinations>
      <ButtonDestination>
        <ButtonName>Accommodation</ButtonName>
        <DestinationName>${destination}</DestinationName>
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

    console.log('🏨 Hotel rooms XML request:', xml)
    
    // Make API call to TourPlan
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
    console.log('🏨 Raw TourPlan response length:', xmlResponse.length)
    
    // Parse response
    const xmlParser = new TourPlanXMLParser()
    let parsedResponse;
    try {
      parsedResponse = xmlParser.parseResponse(xmlResponse)
    } catch (error) {
      console.error('🏨 XML parsing error:', error)
      return NextResponse.json({
        success: false,
        rooms: [],
        error: 'Failed to parse TourPlan response'
      }, { status: 500 })
    }
    
    // Extract options
    const optionInfoReply = parsedResponse.OptionInfoReply
    let rawOptions = []
    
    if (optionInfoReply && optionInfoReply.Option) {
      rawOptions = Array.isArray(optionInfoReply.Option) ? optionInfoReply.Option : [optionInfoReply.Option]
    }
    
    console.log(`🏨 Total raw options found: ${rawOptions.length}`)
    
    // First, try to find ANY product for this hotel to get the supplier code
    let supplierCode = ''
    const hotelNameLower = hotelName.toLowerCase()
    
    // Extract the main hotel name word for searching (e.g., "portswood" from "The Portswood Hotel")
    const mainHotelWord = hotelNameLower
      .replace(/\bthe\b/g, '')
      .replace(/\bhotel\b/g, '')
      .replace(/\band\b/g, '')
      .trim()
      .split(/\s+/)[0] // Get first significant word
    
    console.log(`🏨 Searching for hotel with main word: "${mainHotelWord}"`)
    
    // Find a product that matches the hotel name to extract supplier code
    for (const option of rawOptions) {
      const supplier = (option.OptGeneral?.SupplierName || '').toLowerCase()
      const code = option.Opt || option.OptCode || ''
      
      if (supplier.includes(mainHotelWord)) {
        // Extract supplier code from product code
        // Format: CPTACPOR002PORTST - POR002 is the supplier code
        const codeMatch = code.match(/([A-Z]{3}\d{3})/i)
        if (codeMatch) {
          supplierCode = codeMatch[1]
          console.log(`🏨 Found supplier code ${supplierCode} from product ${code} (supplier: ${option.OptGeneral?.SupplierName})`)
          break
        }
      }
    }
    
    // Now find ALL products with this supplier code
    let hotelRooms = []
    
    if (supplierCode) {
      // Search by supplier code
      console.log(`🏨 Searching for all products with supplier code: ${supplierCode}`)
      hotelRooms = rawOptions.filter((option: any) => {
        const code = option.Opt || option.OptCode || ''
        return code.includes(supplierCode)
      })
      
      console.log(`🏨 Found ${hotelRooms.length} products with supplier code ${supplierCode}:`)
      hotelRooms.forEach((opt: any) => {
        console.log(`  - ${opt.Opt}: ${opt.OptGeneral?.SupplierName} - ${opt.OptGeneral?.Description}`)
      })
    } else {
      // Fallback to name matching
      console.log(`🏨 No supplier code found, falling back to name matching for "${hotelName}"`)
      
      hotelRooms = rawOptions.filter((option: any) => {
        const supplier = option.OptGeneral?.SupplierName || ''
        const description = option.OptGeneral?.Description || ''
        
        // Extract key words from hotel name
        const keyWords = hotelNameLower
          .replace(/\bthe\b/g, '')
          .replace(/\bhotel\b/g, '')
          .replace(/\band\b/g, '')
          .trim()
          .split(/\s+/)
          .filter(w => w.length > 2)
        
        // Check if supplier matches the hotel name
        const supplierLower = supplier.toLowerCase()
        const isMatch = keyWords.some(word => supplierLower.includes(word)) ||
                       supplierLower === hotelNameLower ||
                       hotelNameLower.includes(supplierLower.replace(' hotel', '').trim())
        
        if (isMatch) {
          console.log(`🏨 Matched by name: ${option.Opt} - ${supplier} - ${description}`)
        }
        
        return isMatch
      })
    }
    
    console.log(`🏨 Found ${hotelRooms.length} rooms for ${hotelName}`)
    
    // Transform to room format with proper room type extraction
    const rooms = hotelRooms.map((option: any) => {
      const code = option.Opt || option.OptCode || ''
      const supplier = option.OptGeneral?.SupplierName || ''
      const description = option.OptGeneral?.Description || ''
      const name = `${supplier}${description ? ` - ${description}` : ''}`
      
      // Extract room type from code suffix and description
      let roomType = 'Standard Room'
      
      // First check the product code suffix (last part after supplier code)
      // Format: CPTACPOR002PORTST where ST = Standard, EX = Executive, FM = Family, etc.
      const codeSuffix = code.slice(-2).toUpperCase()
      
      // Common room type suffixes
      if (codeSuffix === 'ST' || code.toUpperCase().endsWith('STD')) roomType = 'Standard Room'
      else if (codeSuffix === 'EX' || codeSuffix === 'EXE') roomType = 'Executive Suite'
      else if (codeSuffix === 'FM' || codeSuffix === 'FAM') roomType = 'Family Suite'
      else if (codeSuffix === 'DL' || codeSuffix === 'DLX') roomType = 'Deluxe Room'
      else if (codeSuffix === 'SU' || codeSuffix === 'SUI') roomType = 'Suite'
      else if (codeSuffix === 'LX' || codeSuffix === 'LUX') roomType = 'Luxury Room'
      else if (codeSuffix === 'VL' || codeSuffix === 'VIL') roomType = 'Villa'
      else if (codeSuffix === 'SP' || codeSuffix === 'SUP') roomType = 'Superior Room'
      
      // If suffix didn't match, try description
      else {
        const descLower = description.toLowerCase()
        if (descLower.includes('executive')) roomType = 'Executive Suite'
        else if (descLower.includes('family')) roomType = 'Family Suite'
        else if (descLower.includes('deluxe')) roomType = 'Deluxe Room'
        else if (descLower.includes('luxury') && !descLower.includes('tent')) roomType = 'Luxury Room'
        else if (descLower.includes('suite')) roomType = 'Suite'
        else if (descLower.includes('villa')) roomType = 'Villa'
        else if (descLower.includes('standard')) roomType = 'Standard Room'
        else if (descLower.includes('superior')) roomType = 'Superior Room'
      }
      
      console.log(`🏨 Room type for ${code}: ${roomType} (suffix: ${codeSuffix})`)
      
      return {
        productCode: code,
        roomType: roomType,
        name: name,
        description: option.OptGeneral?.Comment || description,
        hotelName: supplier,
        supplier: supplier,
        locality: option.OptGeneral?.LocalityDescription || ''
      }
    })
    
    // Remove duplicates based on room type
    const uniqueRooms = rooms.reduce((acc: any[], room: any) => {
      const existing = acc.find(r => r.roomType === room.roomType)
      if (!existing || !existing.productCode) {
        // If no existing room with this type, or existing has no code, use this one
        return [...acc.filter(r => r.roomType !== room.roomType), room]
      }
      return acc
    }, [])
    
    console.log(`🏨 Returning ${uniqueRooms.length} unique room types`)
    
    return NextResponse.json({
      success: true,
      rooms: uniqueRooms,
      totalRooms: hotelRooms.length,
      message: `Found ${uniqueRooms.length} room types for ${hotelName}`
    })
    
  } catch (error) {
    console.error('❌ Hotel rooms search API error:', error)
    return NextResponse.json({
      success: false,
      rooms: [],
      error: error instanceof Error ? error.message : 'Search failed'
    }, { status: 500 })
  }
}