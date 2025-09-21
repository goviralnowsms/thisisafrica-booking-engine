import { NextRequest, NextResponse } from 'next/server'

const credentials = {
  agentId: process.env.TOURPLAN_AGENT_ID || 'SAMAGT',
  password: process.env.TOURPLAN_PASSWORD || 'S@MAgt01'
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const supplierCode = searchParams.get('supplierCode')
    
    if (!supplierCode) {
      return NextResponse.json({
        success: false,
        error: 'Supplier code is required'
      }, { status: 400 })
    }

    console.log(`🗺️ Fetching GPS for supplier: ${supplierCode}`)

    // Use SupplierInfoRequest to get supplier notes including GPS
    const xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <SupplierInfoRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <SupplierCode>${supplierCode}</SupplierCode>
  </SupplierInfoRequest>
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
      throw new Error(`TourPlan API error: ${response.status} ${response.statusText}`)
    }

    const xmlResponse = await response.text()

    // Extract GPS coordinates from response
    // Looking for pattern like: -33.905932, 18.418143
    const gpsPattern = /<SupplierNote>[\s\S]*?<NoteCategory>GPS<\/NoteCategory>[\s\S]*?<NoteText>([^<]+)<\/NoteText>[\s\S]*?<\/SupplierNote>/
    const directPattern = />(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)</
    
    let gpsCoordinates: { lat: number, lng: number } | null = null
    
    // Try structured extraction first
    const gpsMatch = xmlResponse.match(gpsPattern)
    if (gpsMatch) {
      const coords = gpsMatch[1].trim()
      const [lat, lng] = coords.split(/[,\s]+/).map(Number)
      if (!isNaN(lat) && !isNaN(lng)) {
        gpsCoordinates = { lat, lng }
        console.log(`✅ GPS found (structured): ${lat}, ${lng}`)
      }
    }
    
    // Fallback to direct pattern matching
    if (!gpsCoordinates) {
      const directMatch = xmlResponse.match(directPattern)
      if (directMatch) {
        const lat = parseFloat(directMatch[1])
        const lng = parseFloat(directMatch[2])
        if (!isNaN(lat) && !isNaN(lng)) {
          gpsCoordinates = { lat, lng }
          console.log(`✅ GPS found (direct): ${lat}, ${lng}`)
        }
      }
    }

    if (gpsCoordinates) {
      return NextResponse.json({
        success: true,
        supplierCode,
        coordinates: gpsCoordinates,
        message: 'GPS coordinates retrieved successfully'
      })
    } else {
      console.log(`⚠️ No GPS coordinates found for supplier ${supplierCode}`)
      return NextResponse.json({
        success: false,
        supplierCode,
        coordinates: null,
        message: 'No GPS coordinates found for this supplier'
      })
    }
    
  } catch (error) {
    console.error('❌ Supplier GPS API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch GPS coordinates'
    }, { status: 500 })
  }
}