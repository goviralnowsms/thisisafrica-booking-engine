import { NextRequest, NextResponse } from 'next/server'
import { TourPlanXMLBuilder } from '@/lib/tourplan/xml-builder'
import { TourPlanXMLParser } from '@/lib/tourplan/xml-parser'

const credentials = {
  agentId: process.env.TOURPLAN_AGENT_ID || 'SAMAGT',
  password: process.env.TOURPLAN_PASSWORD || 'S@MAgt01'
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    
    // Extract search parameters
    const destination = searchParams.get('destination') || undefined
    const productCode = searchParams.get('productCode') || undefined
    const dateFrom = searchParams.get('dateFrom') || '2025-07-15'
    const dateTo = searchParams.get('dateTo') || '2025-07-18'
    const adults = searchParams.get('adults') ? parseInt(searchParams.get('adults')!) : 2
    const children = searchParams.get('children') ? parseInt(searchParams.get('children')!) : 0
    const useButtonDestinations = searchParams.get('useButtonDestinations') === 'true'

    console.log('🏨 Accommodation search request:', {
      destination,
      productCode,
      dateFrom,
      dateTo,
      adults,
      children,
      useButtonDestinations
    })

    // Build room configuration
    const roomConfigs = [{
      Adults: adults,
      Children: children,
      Type: 'DB' as const, // Default to double room
      Quantity: 1
    }]
    
    // Build XML request using working template format
    // Since ButtonName="Accommodation" always returns empty, we'll use different strategies
    let xml = '';
    
    if (productCode) {
      // Strategy 1: Direct product code search (most reliable)
      xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <Opt>${productCode}</Opt>
    <Info>GSI</Info>
    <DateFrom>${dateFrom}</DateFrom>
    <DateTo>${dateTo}</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>${adults}</Adults>
        ${children > 0 ? `<Children>${children}</Children>` : ''}
        <Type>DB</Type>
        <Quantity>1</Quantity>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`;
    } else {
      // Strategy 2: Since ButtonName="Accommodation" returns empty, 
      // let's try searching for tours/packages that include accommodation
      // This matches the approach used in the existing accommodation catalog
      xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <ButtonName>Group Tours</ButtonName>
    <DestinationName>${destination}</DestinationName>
    <Info>GMFTD</Info>
    <DateFrom>${dateFrom}</DateFrom>
    <DateTo>${dateTo}</DateTo>
  </OptionInfoRequest>
</Request>`;
    }

    console.log('🏨 Accommodation XML request:', xml)
    
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
    console.log('🏨 Raw TourPlan response:', xmlResponse)
    
    // Parse response using standard XML parser
    const xmlParser = new TourPlanXMLParser()
    
    // First, let's parse the raw XML to see what we're getting
    let parsedResponse;
    try {
      parsedResponse = xmlParser.parseResponse(xmlResponse)
      console.log('🏨 Parsed XML structure:', JSON.stringify(parsedResponse, null, 2))
    } catch (error) {
      console.error('🏨 XML parsing error:', error)
      return NextResponse.json({
        success: false,
        accommodations: [],
        totalResults: 0,
        error: 'Failed to parse TourPlan response'
      }, { status: 500 })
    }
    
    // Extract data directly from parsed response since structure is different
    const optionInfoReply = parsedResponse.OptionInfoReply
    let rawOptions = []
    
    if (optionInfoReply && optionInfoReply.Option) {
      rawOptions = Array.isArray(optionInfoReply.Option) ? optionInfoReply.Option : [optionInfoReply.Option]
    }
    
    console.log('🏨 Raw options found:', rawOptions.length)
    
    if (rawOptions.length === 0) {
      console.log('🏨 No options found in TourPlan response')
      return NextResponse.json({
        success: false,
        accommodations: [],
        totalResults: 0,
        error: 'No accommodation options found for your search'
      }, { status: 200 })
    }
    
    // Transform options to accommodations using actual TourPlan structure
    let accommodations = rawOptions.map((option: any) => ({
      id: option.Opt || option.OptCode,
      code: option.Opt || option.OptCode,
      name: option.OptGeneral?.Description || option.Description || 'Safari Tour',
      supplier: option.OptGeneral?.SupplierName || option.SupplierName || '',
      description: option.OptGeneral?.Comment || option.Comment || option.OptGeneral?.Description || '',
      destination: destination || '',
      country: extractCountryFromDestination(destination || ''),
      type: determineAccommodationType(option.OptGeneral?.Description || '', option.OptGeneral?.Comment || ''),
      category: 'standard',
      image: option.OptGeneral?.Image || '/images/safari-lodge.png',
      rates: [], // Will be populated from OptDateRanges if available
      hasAvailability: true, // Assume available if returned by TourPlan
      // Accommodation-specific fields
      roomType: option.OptGeneral?.Description || 'Safari Package',
      hotelName: option.OptGeneral?.SupplierName || 'Safari Lodge'
    }))

    // If we searched for Group Tours (because Accommodation returns empty),
    // filter results to focus on accommodation-heavy tours
    if (!productCode) {
      console.log('🏨 Filtering Group Tours results for accommodation-focused tours')
      const beforeFilter = accommodations.length
      accommodations = accommodations.filter((acc: any) => {
        const name = acc.name?.toLowerCase() || ''
        const description = acc.description?.toLowerCase() || ''
        const supplier = acc.supplier?.toLowerCase() || ''
        
        return (
          name.includes('lodge') ||
          name.includes('camp') ||
          name.includes('hotel') ||
          name.includes('resort') ||
          name.includes('serena') ||
          name.includes('keekorok') ||
          name.includes('accommodation') ||
          description.includes('lodge') ||
          description.includes('camp') ||
          description.includes('hotel') ||
          description.includes('accommodation') ||
          supplier.includes('serena') ||
          supplier.includes('safari') ||
          // Also include classic safari packages that typically include accommodation
          name.includes('classic') ||
          name.includes('safari') ||
          description.includes('safari')
        )
      })
      console.log(`🏨 Filtered from ${beforeFilter} to ${accommodations.length} accommodation-focused results`)
    }

    console.log(`🏨 Successfully found ${accommodations.length} accommodations`)

    return NextResponse.json({
      success: true,
      accommodations: accommodations,
      totalResults: accommodations.length,
      message: `Found ${accommodations.length} accommodation options`
    })
    
  } catch (error) {
    console.error('❌ Accommodation search API error:', error)
    return NextResponse.json({
      success: false,
      accommodations: [],
      totalResults: 0,
      error: error instanceof Error ? error.message : 'Search failed'
    }, { status: 500 })
  }
}

// Helper function to extract country from destination
function extractCountryFromDestination(destination: string): string {
  const dest = destination.toLowerCase()
  
  if (dest.includes('kenya') || dest.includes('nairobi') || dest.includes('masai mara')) return 'kenya'
  if (dest.includes('tanzania') || dest.includes('serengeti') || dest.includes('ngorongoro')) return 'tanzania'
  if (dest.includes('south africa') || dest.includes('cape town') || dest.includes('kruger')) return 'south-africa'
  if (dest.includes('botswana') || dest.includes('okavango') || dest.includes('chobe')) return 'botswana'
  if (dest.includes('zimbabwe') || dest.includes('victoria falls')) return 'zimbabwe'
  if (dest.includes('namibia') || dest.includes('windhoek') || dest.includes('sossusvlei')) return 'namibia'
  if (dest.includes('zambia')) return 'zambia'
  
  return 'other'
}

// Helper function to determine accommodation type from name/description
function determineAccommodationType(name: string, description: string): string {
  const text = (name + ' ' + description).toLowerCase()
  
  if (text.includes('camp') || text.includes('camping')) return 'camp'
  if (text.includes('hotel')) return 'hotel'
  if (text.includes('lodge') || text.includes('safari')) return 'lodge'
  if (text.includes('resort')) return 'resort'
  if (text.includes('guest house') || text.includes('guesthouse')) return 'guesthouse'
  
  // Default to lodge for safari accommodations
  return 'lodge'
}

// Helper function to extract room type from product code (based on client's example)
function extractRoomTypeFromCode(code: string): string {
  if (!code) return 'Standard Room'
  
  // Based on client example: GKPACSAB019SABSUI
  // Format: [DEST][AC][SUPPLIER][ROOMTYPE]
  
  const roomTypePart = code.substring(code.length - 6) // Last 6 characters
  
  // Common room type mappings
  if (roomTypePart.includes('SUI')) return 'Luxury Suite'
  if (roomTypePart.includes('LUX')) return 'Luxury Room'
  if (roomTypePart.includes('STD')) return 'Standard Room'
  if (roomTypePart.includes('FAM')) return 'Family Room'
  if (roomTypePart.includes('VIL')) return 'Villa'
  if (roomTypePart.includes('TEN')) return 'Tented Suite'
  
  // Default based on product name patterns
  return 'Safari Room'
}