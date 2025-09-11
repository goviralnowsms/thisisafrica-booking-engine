import { NextRequest, NextResponse } from 'next/server'

const credentials = {
  agentId: process.env.TOURPLAN_AGENT_ID || 'SAMAGT',
  password: process.env.TOURPLAN_PASSWORD || 'S@MAgt01'
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const destination = searchParams.get('destination') || ''
    
    console.log('🏨 Fetching suppliers for destination:', destination)
    
    // Build GetSupplierListRequest XML - this might work to get all suppliers
    const xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <GetServiceButtonDetailsRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <ButtonName>Accommodation</ButtonName>
    ${destination ? `<DestinationName>${destination}</DestinationName>` : ''}
  </GetServiceButtonDetailsRequest>
</Request>`

    console.log('🏨 Suppliers list XML request:', xml)
    
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
    console.log('🏨 Raw TourPlan suppliers response:', xmlResponse.substring(0, 1000))
    
    // Parse suppliers from response
    const suppliersRegex = /<SupplierCode>(.*?)<\/SupplierCode>.*?<SupplierName>(.*?)<\/SupplierName>/gs
    const suppliers = []
    let match
    
    while ((match = suppliersRegex.exec(xmlResponse)) !== null) {
      suppliers.push({
        code: match[1],
        name: match[2]
      })
    }
    
    return NextResponse.json({
      success: true,
      suppliers: suppliers,
      totalResults: suppliers.length
    })
    
  } catch (error) {
    console.error('❌ Suppliers list API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch suppliers list'
    }, { status: 500 })
  }
}