import { NextRequest, NextResponse } from 'next/server'
import { TourPlanXMLParser } from '@/lib/tourplan/xml-parser'

const credentials = {
  agentId: process.env.TOURPLAN_AGENT_ID || 'SAMAGT',
  password: process.env.TOURPLAN_PASSWORD || 'S@MAgt01'
}

// Real hotel product codes from TourPlan API collection
const HOTEL_ROOM_CODES: Record<string, string[]> = {
  'chobe bakwena': ['BBKACCHOBAKBAK4DY', 'BBKACCHOBAKBAKDAY'],
  'entumoto private safari camp': ['MMRACENTDIRENTMC'],
  'crowne plaza nairobi (lazizi)': ['NBOACCRNALPCRNSUP'],
  'house of waine': ['NBOACHOU1  HOUSTD'],
  'intercontinental hotel nairobi': ['NBOACINT001INTN', 'NBOACINT001NBINDX'],
  'giraffe manor': ['NBOACSCGM  FINCH', 'NBOACSCGM  GMSUP', 'NBOACSCGM  KAREN'],
  'the cape grace': ['CPTACCAP001CAPLUX'],
  'cape grace': ['CPTACCAP001CAPLUX'], // Alternative name
  'the portswood hotel': ['CPTACPOR002PORTST'], // Only Standard Room available in TourPlan
  'portswood hotel': ['CPTACPOR002PORTST'], // Alternative name
  'protea hotel breakwater lodge': ['CPTACPRO087BREABB'],
  'the table bay hotel': ['CPTACTAB000TAAC01', 'CPTACTAB000TABEXS', 'CPTACTAB000TABLKP'],
  'table bay hotel': ['CPTACTAB000TAAC01', 'CPTACTAB000TABEXS', 'CPTACTAB000TABLKP'], // Alternative name
  'becks safari lodge': ['GKPACBEC002BECDEL'],
  'kapama buffalo camp': ['GKPACKPMBUFKPMBU1'],
  'kapama karula': ['GKPACKPMKARKPMKR1', 'GKPACKPMKARKPMKR2'],
  'kapama river lodge': ['GKPACKPMKRLKPMDX', 'GKPACKPMKRLKPMRL1', 'GKPACKPMKRLKPMRL2', 'GKPACKPMKRLKPMRL3', 'GKPACKPMKRLKPMRL4'],
  'kapama southern camp': ['GKPACKPMSTHKPMST1', 'GKPACKPMSTHKPMST2', 'GKPACKPMSTHKPMST3'],
  'kuname river lodge': ['GKPACKUN001KUNLUX', 'GKPACKUN001KUNMAN', 'GKPACKUN001KUNPRS'],
  'sabi sabi bush lodge': ['GKPACSAB019MANSUI', 'GKPACSAB019SABSUI', 'GKPACSAB019SABVIL'],
  'sabi sabi bush lodge - direct': ['GKPACSABBLDSABBLM', 'GKPACSABBLDSABBLV', 'GKPACSABBLDSABDLS'],
  'sabi sabi earth lodge - direct': ['GKPACSABEALSABEAV', 'GKPACSABEALSABELX'],
  'sabi sabi little bush - direct': ['GKPACSABLBDSABLBL'],
  'sabi sabi selati camp - direct': ['GKPACSABSCDSABSCL', 'GKPACSABSCDSABSIV', 'GKPACSABSCDSABSLM'],
  'simbavati hilltop lodge': ['GKPACSIM018SIMHTS'],
  'karongwe river lodge': ['HDSACKAR015KARFAM', 'HDSACKAR015KARLUX'],
  'peermont d\'oreale grande (emperors palace)': ['JNBACDOR005DORCLS'],
  'breezes beach club and spa': ['ZNZACALPBREBREDLX', 'ZNZACALPBREBRESTD'],
  'zanzibar serena inn hotel': ['ZNZACALPZSEZSERST']
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const hotelName = searchParams.get('hotelName') || ''
    const dateFrom = searchParams.get('dateFrom') || '2026-07-15'
    const dateTo = searchParams.get('dateTo') || '2026-07-18'
    
    console.log('🏨 Fetching room types for:', hotelName)
    console.log('🏨 Available hotel keys:', Object.keys(HOTEL_ROOM_CODES))
    
    const hotelNameLower = hotelName.toLowerCase()
    const knownCodes = HOTEL_ROOM_CODES[hotelNameLower] || []
    
    console.log(`🏨 Looking for "${hotelNameLower}", found ${knownCodes.length} codes:`, knownCodes)
    
    if (knownCodes.length === 0) {
      console.log('🏨 No known product codes for this hotel, checking alternative names...')
      
      // Try alternative names
      const alternativeKeys = Object.keys(HOTEL_ROOM_CODES).filter(key => 
        key.includes(hotelNameLower.replace('the ', '').replace(' hotel', '')) ||
        hotelNameLower.includes(key.replace('the ', '').replace(' hotel', ''))
      )
      
      console.log('🏨 Alternative keys found:', alternativeKeys)
      
      if (alternativeKeys.length > 0) {
        const altCodes = HOTEL_ROOM_CODES[alternativeKeys[0]] || []
        console.log(`🏨 Using alternative "${alternativeKeys[0]}" with ${altCodes.length} codes`)
        knownCodes.push(...altCodes)
      }
      
      if (knownCodes.length === 0) {
        console.log('🏨 No codes found, returning default room')
        return NextResponse.json({
          success: true,
          rooms: [{
            productCode: '',
            roomType: 'Standard Room',
            name: `${hotelName} - Standard Room`,
            description: 'Contact us for availability',
            available: false
          }],
          message: 'No specific room types configured for this hotel'
        })
      }
    }
    
    const roomResults = []
    
    // Try to fetch each known product code
    for (const productCode of knownCodes) {
      console.log(`🏨 Checking product: ${productCode}`)
      
      try {
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
          console.log(`❌ Failed to fetch ${productCode}: ${response.status}`)
          continue
        }
        
        const xmlResponse = await response.text()
        const xmlParser = new TourPlanXMLParser()
        let parsedResponse
        
        try {
          parsedResponse = xmlParser.parseResponse(xmlResponse)
        } catch (parseErr) {
          console.log(`❌ Failed to parse response for ${productCode}`)
          continue
        }
        
        if (parsedResponse.OptionInfoReply?.Option) {
          const option = Array.isArray(parsedResponse.OptionInfoReply.Option) 
            ? parsedResponse.OptionInfoReply.Option[0] 
            : parsedResponse.OptionInfoReply.Option
          
          if (option) {
            // Use the TourPlan description as the room type name for display
            // This ensures it matches exactly what's in TourPlan
            const description = option.OptGeneral?.Description || ''
            let roomType = description || 'Standard Room'

            // If no description, fall back to suffix-based naming
            if (!description || description.trim() === '') {
              const codeSuffix = productCode.slice(-2).toUpperCase()

              // Check specific codes first
              if (productCode === 'CPTACTAB000TAAC01') roomType = 'Standard Room'
              else if (productCode === 'CPTACTAB000TABEXS') roomType = 'Executive Suite'
              else if (productCode === 'CPTACTAB000TABLKP') roomType = 'Luxury Room'

              // General suffix patterns
              else if (codeSuffix === 'ST') roomType = 'Standard Room'
              else if (codeSuffix === 'EX' || codeSuffix === 'XS') roomType = 'Executive Suite'
              else if (codeSuffix === 'FM') roomType = 'Family Suite'
              else if (codeSuffix === 'DL') roomType = 'Deluxe Suite'
              else if (codeSuffix === 'SU') roomType = 'Suite'
              else if (codeSuffix === 'LS') roomType = 'Luxury Suite'
              else if (codeSuffix === 'LM') roomType = 'Manor Suite'
              else if (codeSuffix === 'LV' || codeSuffix === 'IL') roomType = 'Villa'
              else if (codeSuffix === 'LX' || codeSuffix === 'KP') roomType = 'Luxury Room'
              else if (codeSuffix === '01') roomType = 'Standard Room'
            }

            console.log(`🏨 Room type mapping: ${productCode} → "${roomType}" (from: ${description ? 'description' : 'suffix'})`)
            
            roomResults.push({
              productCode: productCode,
              roomType: roomType,
              name: `${option.OptGeneral?.SupplierName || hotelName} - ${roomType}`,
              description: option.OptGeneral?.Description || roomType,
              supplier: option.OptGeneral?.SupplierName || hotelName,
              available: true
            })
            
            console.log(`✅ Found: ${productCode} - ${roomType}`)
          }
        } else {
          console.log(`⚠️ No data returned for ${productCode}`)
        }
      } catch (err) {
        console.log(`❌ Error fetching ${productCode}:`, err)
      }
    }
    
    // If we found no rooms but have known codes, return them anyway as placeholders
    if (roomResults.length === 0 && knownCodes.length > 0) {
      console.log('🏨 No API results, using fallback room types')
      knownCodes.forEach(code => {
        const codeSuffix = code.slice(-2).toUpperCase()
        let roomType = 'Standard Room'

        if (codeSuffix === 'ST') roomType = 'Standard Room'
        else if (codeSuffix === 'EX') roomType = 'Executive Suite'
        else if (codeSuffix === 'FM') roomType = 'Family Suite'
        else if (codeSuffix === 'DL') roomType = 'Deluxe Suite'  // Changed to Suite
        else if (codeSuffix === 'SU') roomType = 'Suite'
        else if (codeSuffix === 'LS') roomType = 'Luxury Suite'
        else if (codeSuffix === 'LM') roomType = 'Manor Suite'
        else if (codeSuffix === 'LV' || codeSuffix === 'IL') roomType = 'Villa'
        
        roomResults.push({
          productCode: code,
          roomType: roomType,
          name: `${hotelName} - ${roomType}`,
          description: roomType,
          supplier: hotelName,
          available: false // Mark as not available since API didn't return them
        })
      })
    }
    
    // Remove duplicates by room type (keep the one with a valid product code)
    const uniqueRooms = roomResults.reduce((acc: any[], room: any) => {
      const existing = acc.find(r => r.roomType === room.roomType)
      if (!existing) {
        acc.push(room)
      } else if (room.productCode && !existing.productCode) {
        // Replace if this room has a product code and existing doesn't
        const index = acc.findIndex(r => r.roomType === room.roomType)
        acc[index] = room
      }
      return acc
    }, [])
    
    console.log(`🏨 Returning ${uniqueRooms.length} unique room types (from ${roomResults.length} total)`)
    
    return NextResponse.json({
      success: true,
      rooms: uniqueRooms,
      message: `Found ${uniqueRooms.length} room types`
    })
    
  } catch (error) {
    console.error('❌ Room types API error:', error)
    return NextResponse.json({
      success: false,
      rooms: [],
      error: error instanceof Error ? error.message : 'Failed to fetch room types'
    }, { status: 500 })
  }
}