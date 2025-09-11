import { NextRequest, NextResponse } from 'next/server'

const credentials = {
  agentId: process.env.TOURPLAN_AGENT_ID || 'SAMAGT',
  password: process.env.TOURPLAN_PASSWORD || 'S@MAgt01'
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const destination = searchParams.get('destination') || 'Cape Town'
    const dateFrom = searchParams.get('dateFrom') || '2025-07-15'
    const dateTo = searchParams.get('dateTo') || '2025-07-18'
    
    console.log('🏨 Testing accommodation search with proper parameters:', {
      destination,
      dateFrom,
      dateTo
    })
    
    // Try different Info parameters based on documentation
    const testType = searchParams.get('test') || 'S'
    let xml = ''
    
    if (testType === 'supplier') {
      // Test searching for suppliers directly
      xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <SupplierInfoRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <SupplierCode>POR002</SupplierCode>
    <Info>S</Info>
  </SupplierInfoRequest>
</Request>`
    } else if (testType === 'product') {
      // Test with specific product code
      xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <Opt>CPTACPOR002PORTST</Opt>
    <Info>GSI</Info>
    <DateFrom>${dateFrom}</DateFrom>
    <DateTo>${dateTo}</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <RoomType>DB</RoomType>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`
    } else if (testType === 'wildcard') {
      // Test with wildcard search for all Portswood products
      xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <Opt>CPTACPOR002??????</Opt>
    <Info>GSI</Info>
    <DateFrom>${dateFrom}</DateFrom>
    <DateTo>${dateTo}</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <RoomType>DB</RoomType>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`
    } else if (testType === 'deals') {
      // Test with Special Deals which often contains accommodation
      xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <ButtonName>Special Deals</ButtonName>
    <DestinationName>${destination}</DestinationName>
    <Info>GSI</Info>
    <DateFrom>${dateFrom}</DateFrom>
    <DateTo>${dateTo}</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <RoomType>DB</RoomType>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`
    } else {
      // Test with different Info codes
      xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <ButtonName>Accommodation</ButtonName>
    <DestinationName>${destination}</DestinationName>
    <Info>${testType}</Info>
    <DateFrom>${dateFrom}</DateFrom>
    <DateTo>${dateTo}</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <RoomType>DB</RoomType>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`
    }

    console.log('🏨 Accommodation test XML:', xml)
    
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
    console.log('🏨 Raw accommodation response (first 2000 chars):', xmlResponse.substring(0, 2000))
    
    // Parse options
    const optionsRegex = /<Option>[\s\S]*?<\/Option>/g
    const options = xmlResponse.match(optionsRegex) || []
    
    const accommodations = options.map(optionXml => {
      const codeMatch = optionXml.match(/<Opt>(.*?)<\/Opt>/)
      const descMatch = optionXml.match(/<Description>(.*?)<\/Description>/)
      const supplierMatch = optionXml.match(/<SupplierName>(.*?)<\/SupplierName>/)
      const commentMatch = optionXml.match(/<Comment>(.*?)<\/Comment>/)
      const localityMatch = optionXml.match(/<LocalityDescription>(.*?)<\/LocalityDescription>/)
      
      return {
        code: codeMatch ? codeMatch[1] : '',
        roomType: descMatch ? descMatch[1] : '',
        hotelName: supplierMatch ? supplierMatch[1] : '',
        description: commentMatch ? commentMatch[1] : '',
        location: localityMatch ? localityMatch[1] : ''
      }
    })
    
    return NextResponse.json({
      success: true,
      message: `Found ${accommodations.length} accommodations`,
      accommodations: accommodations,
      searchParams: {
        destination,
        dateFrom,
        dateTo,
        info: testType,
        rawResponse: xmlResponse.substring(0, 500)
      }
    })
    
  } catch (error) {
    console.error('❌ Accommodation test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Test failed'
    }, { status: 500 })
  }
}