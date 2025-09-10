import { NextRequest, NextResponse } from 'next/server'

const credentials = {
  agentId: process.env.TOURPLAN_AGENT_ID || 'SAMAGT',
  password: process.env.TOURPLAN_PASSWORD || 'S@MAgt01'
}

const apiEndpoint = process.env.TOURPLAN_API_URL || 'https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const destination = searchParams.get('destination') || 'Kenya'
  
  console.log('🧪 Testing accommodation with corrected RoomConfig structure')
  
  const results = []

  // Test 1: Accommodation with proper RoomConfigs structure (correcting the Type vs RoomType issue)
  const xml1 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <ButtonName>Accommodation</ButtonName>
    <DestinationName>${destination}</DestinationName>
    <Info>S</Info>
    <DateFrom>2025-10-15</DateFrom>
    <DateTo>2025-10-18</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <Type>DB</Type>
        <Quantity>1</Quantity>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`

  const result1 = await testXML('Accommodation with corrected RoomConfig', xml1)
  results.push(result1)

  // Test 2: Hotels with proper RoomConfigs structure  
  const xml2 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <ButtonName>Hotels</ButtonName>
    <DestinationName>${destination}</DestinationName>
    <Info>GS</Info>
    <DateFrom>2025-10-15</DateFrom>
    <DateTo>2025-10-18</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <Type>DB</Type>
        <Quantity>1</Quantity>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`

  const result2 = await testXML('Hotels with corrected RoomConfig', xml2)
  results.push(result2)

  // Test 3: ButtonDestinations with proper RoomConfig
  const xml3 = `<?xml version="1.0"?>
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
    <Info>S</Info>
    <DateFrom>2025-10-15</DateFrom>
    <DateTo>2025-10-18</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <Type>DB</Type>
        <Quantity>1</Quantity>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`

  const result3 = await testXML('ButtonDestinations with Accommodation', xml3)
  results.push(result3)

  // Test 4: Lodges (in case accommodation is called lodges in TourPlan)
  const xml4 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <ButtonName>Lodges</ButtonName>
    <DestinationName>${destination}</DestinationName>
    <Info>GS</Info>
    <DateFrom>2025-10-15</DateFrom>
    <DateTo>2025-10-18</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <Type>DB</Type>
        <Quantity>1</Quantity>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`

  const result4 = await testXML('Lodges ButtonName', xml4)
  results.push(result4)

  // Test 5: Group Tours with destination (we know this should work)
  const xml5 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <ButtonName>Group Tours</ButtonName>
    <DestinationName>${destination}</DestinationName>
    <Info>GMFTD</Info>
    <DateFrom>2025-10-15</DateFrom>
    <DateTo>2025-10-18</DateTo>
  </OptionInfoRequest>
</Request>`

  const result5 = await testXML('Group Tours (should work as baseline)', xml5)
  results.push(result5)

  // Test 6: Try without any ButtonName - just accommodation search by info type
  const xml6 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <DestinationName>${destination}</DestinationName>
    <Info>GS</Info>
    <DateFrom>2025-10-15</DateFrom>
    <DateTo>2025-10-18</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <Type>DB</Type>
        <Quantity>1</Quantity>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`

  const result6 = await testXML('No ButtonName - Just GS Info with RoomConfig', xml6)
  results.push(result6)

  return NextResponse.json({
    destination,
    totalTests: results.length,
    results: results,
    summary: {
      successful: results.filter(r => r.success && !r.hasError).length,
      withOptions: results.filter(r => r.optionCount > 0).length,
      errors: results.filter(r => r.hasError).length
    },
    xmlRequestsToSendToTourPlan: results.map(r => ({
      testName: r.testName,
      optionCount: r.optionCount,
      hasError: r.hasError,
      errorMessage: r.errorMessage,
      xmlRequest: r.xmlRequest
    }))
  })
}

async function testXML(testName: string, xml: string) {
  console.log(`\n🧪 Testing: ${testName}`)
  console.log(`📤 XML: ${xml}`)
  
  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml',
        'User-Agent': 'ThisIsAfrica/1.0'
      },
      body: xml
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const xmlResponse = await response.text()
    console.log(`📥 Response: ${xmlResponse}`)

    // Parse to count options
    let optionCount = 0
    let hasError = false
    let errorMessage = ''

    if (xmlResponse.includes('<Option>')) {
      const optionMatches = xmlResponse.match(/<Option>/g)
      optionCount = optionMatches ? optionMatches.length : 0
    }

    if (xmlResponse.includes('<Errors>') || xmlResponse.includes('<Error>')) {
      hasError = true
      const errorMatch = xmlResponse.match(/<ErrorDescription>(.*?)<\/ErrorDescription>/s)
      errorMessage = errorMatch ? errorMatch[1] : 'Unknown error'
    }

    const statusEmoji = hasError ? '❌' : (optionCount > 0 ? '✅' : '⚠️')
    console.log(`${statusEmoji} ${testName}: ${optionCount} options found ${hasError ? `(Error: ${errorMessage})` : ''}`)

    return {
      testName,
      success: true,
      optionCount,
      hasError,
      errorMessage,
      xmlRequest: xml,
      xmlResponse: xmlResponse.substring(0, 1000) + (xmlResponse.length > 1000 ? '...' : ''),
      responseLength: xmlResponse.length
    }

  } catch (error) {
    console.log(`❌ ${testName}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    
    return {
      testName,
      success: false,
      optionCount: 0,
      hasError: true,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      xmlRequest: xml,
      xmlResponse: '',
      responseLength: 0
    }
  }
}