import { NextRequest, NextResponse } from 'next/server'

const credentials = {
  agentId: process.env.TOURPLAN_AGENT_ID || 'SAMAGT',
  password: process.env.TOURPLAN_PASSWORD || 'S@MAgt01'
}

export async function GET(
  request: NextRequest,
  { params }: { params: { supplierCode: string } }
) {
  try {
    const supplierCode = params.supplierCode
    
    console.log('🏨 Fetching supplier info for:', supplierCode)
    
    // Build SupplierInfoRequest XML
    const xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <SupplierInfoRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <SupplierCode>${supplierCode}</SupplierCode>
    <Info>S</Info>
    <NoteCategory>DDW</NoteCategory>
    <NoteCategory>DI2</NoteCategory>
  </SupplierInfoRequest>
</Request>`

    console.log('🏨 Supplier XML request:', xml)
    
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
    console.log('🏨 Raw TourPlan supplier response:', xmlResponse)
    
    // Parse XML response manually to extract supplier details
    const supplierMatch = xmlResponse.match(/<SupplierName>(.*?)<\/SupplierName>/)
    const supplierName = supplierMatch ? supplierMatch[1] : supplierCode
    
    // Extract notes (DDW = Web Short Description, DI2 = Image 2)
    const notesRegex = /<SupplierNote>.*?<NoteCategory>(.*?)<\/NoteCategory>.*?<NoteText>(.*?)<\/NoteText>.*?<\/SupplierNote>/gs
    const notes: any = {}
    let match
    
    while ((match = notesRegex.exec(xmlResponse)) !== null) {
      notes[match[1]] = match[2]
    }
    
    return NextResponse.json({
      success: true,
      supplier: {
        code: supplierCode,
        name: supplierName,
        webDescription: notes.DDW || '',
        image: notes.DI2 || '',
        notes: notes
      }
    })
    
  } catch (error) {
    console.error('❌ Supplier info API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch supplier info'
    }, { status: 500 })
  }
}