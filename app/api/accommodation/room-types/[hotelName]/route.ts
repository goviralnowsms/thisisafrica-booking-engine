import { NextRequest, NextResponse } from 'next/server'
import { TourPlanXMLBuilder } from '@/lib/tourplan/xml-builder'
import { TourPlanXMLParser } from '@/lib/tourplan/xml-parser'

const credentials = {
  agentId: process.env.TOURPLAN_AGENT_ID || 'SAMAGT',
  password: process.env.TOURPLAN_PASSWORD || 'S@MAgt01'
}

export async function GET(
  request: NextRequest,
  { params }: { params: { hotelName: string } }
) {
  try {
    const hotelName = decodeURIComponent(params.hotelName)
    const { searchParams } = request.nextUrl
    const currentProductCode = searchParams.get('currentCode') || ''
    
    console.log('🏨 Getting room types for hotel:', hotelName)
    console.log('🏨 Current product code:', currentProductCode)

    // Search for all accommodations to find different room types for this hotel
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
    <DateFrom>2026-07-15</DateFrom>
    <DateTo>2026-07-18</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <Children>0</Children>
        <Type>DB</Type>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`

    console.log('🏨 Sending XML request to TourPlan...')
    
    const response = await fetch(process.env.TOURPLAN_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
      },
      body: xml
    })

    if (!response.ok) {
      throw new Error(`TourPlan API error: ${response.status}`)
    }

    const xmlResponse = await response.text()
    console.log('🏨 Got XML response from TourPlan')

    // Parse the XML response
    const parser = new TourPlanXMLParser()
    const parsedResponse = parser.parse(xmlResponse)

    if (!parsedResponse) {
      throw new Error('Failed to parse TourPlan response')
    }

    // Extract options and filter by hotel name
    const optionInfoReply = parsedResponse.OptionInfoReply
    let rawOptions = []
    
    if (optionInfoReply && optionInfoReply.Option) {
      rawOptions = Array.isArray(optionInfoReply.Option) ? optionInfoReply.Option : [optionInfoReply.Option]
    }

    // Filter options that match this hotel name
    const hotelOptions = rawOptions.filter((option: any) => {
      const supplierName = option.OptGeneral?.SupplierName || ''
      const description = option.OptGeneral?.Description || ''
      const productCode = option.Opt || option.OptCode || ''
      
      // More flexible matching for hotel variations
      const nameMatch = supplierName.toLowerCase().includes(hotelName.toLowerCase()) || 
                       hotelName.toLowerCase().includes(supplierName.toLowerCase())
      
      // Match by similar product code patterns (extract base pattern)
      let codeMatch = false
      if (currentProductCode) {
        // Extract the base pattern from current code (e.g., CPTACPOR from CPTACPOR002PORTST)
        const basePattern = currentProductCode.substring(0, 8) // First 8 chars usually identify the hotel
        codeMatch = productCode.startsWith(basePattern)
      }
      
      console.log(`🏨 Checking option: ${supplierName} | ${description} | ${productCode} | Match: ${nameMatch || codeMatch}`)
      
      return nameMatch || codeMatch
    })

    console.log(`🏨 Found ${hotelOptions.length} room types for ${hotelName}`)
    console.log('🏨 All hotel options found:', hotelOptions.map(opt => ({
      code: opt.Opt,
      supplier: opt.OptGeneral?.SupplierName,
      description: opt.OptGeneral?.Description
    })))

    // Transform to room type options
    const roomTypes = hotelOptions.map((option: any) => ({
      productCode: option.Opt || option.OptCode,
      roomType: option.OptGeneral?.Description || 'Standard Room',
      hotelName: option.OptGeneral?.SupplierName || hotelName,
      description: option.OptGeneral?.Comment || '',
      locality: option.OptGeneral?.LocalityDescription || ''
    }))

    // Remove duplicates based on room type
    const uniqueRoomTypes = roomTypes.filter((room: any, index: number, arr: any[]) => 
      index === arr.findIndex(r => r.roomType === room.roomType)
    )

    return NextResponse.json({
      success: true,
      hotelName,
      roomTypes: uniqueRoomTypes,
      totalFound: uniqueRoomTypes.length
    })

  } catch (error) {
    console.error('🏨 Error fetching room types:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch room types',
      hotelName: params.hotelName,
      roomTypes: []
    }, { status: 500 })
  }
}