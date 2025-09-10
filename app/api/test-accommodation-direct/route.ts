import { NextRequest, NextResponse } from 'next/server'

const credentials = {
  agentId: process.env.TOURPLAN_AGENT_ID || 'SAMAGT',
  password: process.env.TOURPLAN_PASSWORD || 'S@MAgt01'
}

const apiEndpoint = process.env.TOURPLAN_API_URL || 'https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const productCode = searchParams.get('code') || 'CPTACPOR002PORTST'
  
  console.log('🏨 Testing direct accommodation product code search')
  console.log('Product Code:', productCode)
  
  const results = []

  // Test 1: Direct product code search with GSI (General + Stay + Supplier Info)
  // This should get us the supplier data (hotel description) + product data (room details)
  const xml1 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <Opt>${productCode}</Opt>
    <Info>GSI</Info>
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

  const result1 = await testXML('Direct Product Code - GSI (General+Stay+SupplierInfo)', xml1)
  results.push(result1)

  // Test 2: Direct product code search with DI (Day Tour + Supplier Info)
  // Based on client mentioning "DI2 image" - maybe DI gets supplier details
  const xml2 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <Opt>${productCode}</Opt>
    <Info>DI</Info>
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

  const result2 = await testXML('Direct Product Code - DI (Day+SupplierInfo)', xml2)
  results.push(result2)

  // Test 3: Just General info to see basic product structure
  const xml3 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <Opt>${productCode}</Opt>
    <Info>G</Info>
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

  const result3 = await testXML('Direct Product Code - G (General only)', xml3)
  results.push(result3)

  // Test 4: Stay pricing only to see rate structure
  const xml4 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <Opt>${productCode}</Opt>
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

  const result4 = await testXML('Direct Product Code - S (Stay pricing only)', xml4)
  results.push(result4)

  // Test 5: Try without dates to see if accommodation has different availability logic
  const xml5 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <Opt>${productCode}</Opt>
    <Info>GSI</Info>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <Type>DB</Type>
        <Quantity>1</Quantity>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`

  const result5 = await testXML('Direct Product Code - GSI without dates', xml5)
  results.push(result5)

  return NextResponse.json({
    productCode,
    clientInsights: {
      message: "Testing based on client email insights about accommodation data structure",
      dataStructure: {
        groupTours: "Data at Product level (Classic Kenya Keekorok)",
        accommodation: "Data at Supplier level (The Portswood Hotel) + Product level (Standard room)"
      },
      supplierData: ["Web Short description (DDW)", "DI2 image"],
      productData: ["Inclusions (INC)"]
    },
    totalTests: results.length,
    results: results,
    summary: {
      successful: results.filter(r => r.success && !r.hasError).length,
      withOptions: results.filter(r => r.optionCount > 0).length,
      errors: results.filter(r => r.hasError).length
    }
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
    console.log(`📥 Response: ${xmlResponse.substring(0, 500)}...`)

    // Parse to count options and check for supplier/accommodation data
    let optionCount = 0
    let hasError = false
    let errorMessage = ''
    let hasSupplierData = false
    let hasRoomData = false

    if (xmlResponse.includes('<Option>')) {
      const optionMatches = xmlResponse.match(/<Option>/g)
      optionCount = optionMatches ? optionMatches.length : 0
    }

    // Check for accommodation-specific data structures
    if (xmlResponse.includes('<SupplierName>')) {
      hasSupplierData = true
    }

    if (xmlResponse.includes('<RoomRates>') || xmlResponse.includes('<Type>DB</Type>')) {
      hasRoomData = true
    }

    if (xmlResponse.includes('<Errors>') || xmlResponse.includes('<Error>')) {
      hasError = true
      const errorMatch = xmlResponse.match(/<ErrorDescription>(.*?)<\/ErrorDescription>/s)
      errorMessage = errorMatch ? errorMatch[1] : 'Unknown error'
    }

    const statusEmoji = hasError ? '❌' : (optionCount > 0 ? '✅' : '⚠️')
    const dataTypes = []
    if (hasSupplierData) dataTypes.push('Supplier')
    if (hasRoomData) dataTypes.push('Room')

    console.log(`${statusEmoji} ${testName}: ${optionCount} options found ${dataTypes.length > 0 ? `(${dataTypes.join(', ')} data)` : ''} ${hasError ? `(Error: ${errorMessage})` : ''}`)

    return {
      testName,
      success: true,
      optionCount,
      hasError,
      errorMessage,
      hasSupplierData,
      hasRoomData,
      dataTypes,
      xmlRequest: xml,
      xmlResponse: xmlResponse.substring(0, 2000) + (xmlResponse.length > 2000 ? '...' : ''),
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
      hasSupplierData: false,
      hasRoomData: false,
      dataTypes: [],
      xmlRequest: xml,
      xmlResponse: '',
      responseLength: 0
    }
  }
}