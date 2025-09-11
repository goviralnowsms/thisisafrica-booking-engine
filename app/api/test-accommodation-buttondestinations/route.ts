import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const destination = searchParams.get('destination') || 'Kenya';
    const dateFrom = searchParams.get('dateFrom') || '2025-07-15';
    const dateTo = searchParams.get('dateTo') || '2025-07-18';
    const adults = parseInt(searchParams.get('adults') || '2');
    const children = parseInt(searchParams.get('children') || '0');
    const roomType = searchParams.get('roomType') || 'DB';
    
    console.log('🏨 Testing TourPlan ButtonDestinations structure');
    console.log('Parameters:', { destination, dateFrom, dateTo, adults, children, roomType });
    
    const agentId = process.env.TOURPLAN_AGENT_ID || 'SAMAGT';
    const password = process.env.TOURPLAN_PASSWORD || 'S@MAgt01';
    
    // Test 1: EXACT XML structure from TourPlan support email (copy/paste)
    const xml1 = `<?xml version="1.0"?>

<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">

<Request>
<OptionInfoRequest>
<AgentID>${agentId}</AgentID>
<Password>${password}</Password>
<ButtonDestinations>
<ButtonDestination>
<ButtonName>Accommodation</ButtonName>
<DestinationName>${destination}</DestinationName>
</ButtonDestination>
</ButtonDestinations>
<Info>GS</Info>
<DateFrom>${dateFrom}</DateFrom>
<DateTo>${dateTo}</DateTo>
<RoomConfigs>
<RoomConfig>
<Adults>${adults}</Adults>
<Children>${children}</Children>
<RoomType>${roomType}</RoomType>
</RoomConfig>
</RoomConfigs>
</OptionInfoRequest>
</Request>`;

    console.log('📤 Test 1 - ButtonDestinations with Info=GS');
    console.log('Request XML:', xml1);
    
    const apiEndpoint = process.env.TOURPLAN_API_URL || 'https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi';
    const response1 = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml',
        'User-Agent': 'ThisIsAfrica/1.0'
      },
      body: xml1
    });
    
    if (!response1.ok) {
      throw new Error(`TourPlan API error: ${response1.status} ${response1.statusText}`);
    }
    
    const xmlResponse1 = await response1.text();
    console.log('📥 Test 1 - Raw Response:', xmlResponse1);
    
    // Test 2: Try with Info="S" as mentioned in email (confirmed rates only)
    const xml2 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
<OptionInfoRequest>
<AgentID>${agentId}</AgentID>
<Password>${password}</Password>
<ButtonDestinations>
<ButtonDestination>
<ButtonName>Accommodation</ButtonName>
<DestinationName>${destination}</DestinationName>
</ButtonDestination>
</ButtonDestinations>
<Info>S</Info>
<DateFrom>${dateFrom}</DateFrom>
<DateTo>${dateTo}</DateTo>
<RoomConfigs>
<RoomConfig>
<Adults>${adults}</Adults>
<Children>${children}</Children>
<RoomType>${roomType}</RoomType>
</RoomConfig>
</RoomConfigs>
</OptionInfoRequest>
</Request>`;

    console.log('📤 Test 2 - ButtonDestinations with Info=S (confirmed rates only)');
    console.log('Request XML:', xml2);
    
    const response2 = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml',
        'User-Agent': 'ThisIsAfrica/1.0'
      },
      body: xml2
    });
    
    if (!response2.ok) {
      throw new Error(`TourPlan API error: ${response2.status} ${response2.statusText}`);
    }
    
    const xmlResponse2 = await response2.text();
    console.log('📥 Test 2 - Raw Response:', xmlResponse2);
    
    // Test multiple destinations
    const destinations = ['Kenya', 'Tanzania', 'South Africa', 'Botswana'];
    const destinationTests = [];
    
    for (const dest of destinations) {
      const xmlDest = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
<OptionInfoRequest>
<AgentID>${agentId}</AgentID>
<Password>${password}</Password>
<ButtonDestinations>
<ButtonDestination>
<ButtonName>Accommodation</ButtonName>
<DestinationName>${dest}</DestinationName>
</ButtonDestination>
</ButtonDestinations>
<Info>GS</Info>
<DateFrom>${dateFrom}</DateFrom>
<DateTo>${dateTo}</DateTo>
<RoomConfigs>
<RoomConfig>
<Adults>2</Adults>
<Children>0</Children>
<RoomType>DB</RoomType>
</RoomConfig>
</RoomConfigs>
</OptionInfoRequest>
</Request>`;

      console.log(`📤 Testing destination: ${dest}`);
      
      const responseDest = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml',
          'User-Agent': 'ThisIsAfrica/1.0'
        },
        body: xmlDest
      });
      
      const xmlResponseDest = await responseDest.text();
      console.log(`📥 ${dest} - Raw Response:`, xmlResponseDest);
      
      // Quick check for results
      const hasOptions = xmlResponseDest.includes('<Option>') || xmlResponseDest.includes('<Option ');
      const optionCount = (xmlResponseDest.match(/<Option[\s>]/g) || []).length;
      
      destinationTests.push({
        destination: dest,
        hasResults: hasOptions,
        optionCount,
        responseLength: xmlResponseDest.length,
        containsError: xmlResponseDest.includes('<ErrorReply>') || xmlResponseDest.includes('<Error>')
      });
    }
    
    // Parse results summary
    const test1HasOptions = xmlResponse1.includes('<Option>') || xmlResponse1.includes('<Option ');
    const test1OptionCount = (xmlResponse1.match(/<Option[\s>]/g) || []).length;
    const test1HasError = xmlResponse1.includes('<ErrorReply>') || xmlResponse1.includes('<Error>');
    
    const test2HasOptions = xmlResponse2.includes('<Option>') || xmlResponse2.includes('<Option ');
    const test2OptionCount = (xmlResponse2.match(/<Option[\s>]/g) || []).length;
    const test2HasError = xmlResponse2.includes('<ErrorReply>') || xmlResponse2.includes('<Error>');
    
    return NextResponse.json({
      success: true,
      message: 'TourPlan ButtonDestinations structure test completed',
      parameters: {
        destination,
        dateFrom,
        dateTo,
        adults,
        children,
        roomType
      },
      tests: {
        buttonDestinationsGS: {
          hasResults: test1HasOptions,
          optionCount: test1OptionCount,
          hasError: test1HasError,
          responseLength: xmlResponse1.length,
          rawResponse: xmlResponse1
        },
        buttonDestinationsS: {
          hasResults: test2HasOptions,
          optionCount: test2OptionCount,
          hasError: test2HasError,
          responseLength: xmlResponse2.length,
          rawResponse: xmlResponse2
        },
        destinationTests
      },
      summary: {
        workingTests: [
          test1HasOptions && 'ButtonDestinations with Info=GS',
          test2HasOptions && 'ButtonDestinations with Info=S'
        ].filter(Boolean),
        workingDestinations: destinationTests.filter(t => t.hasResults).map(t => t.destination),
        totalOptionsFound: test1OptionCount + test2OptionCount + destinationTests.reduce((sum, t) => sum + t.optionCount, 0),
        recommendation: test1HasOptions || test2HasOptions 
          ? 'ButtonDestinations structure is working! Use this for accommodation searches.'
          : 'ButtonDestinations structure needs further investigation.'
      }
    });
    
  } catch (error) {
    console.error('❌ ButtonDestinations test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Test failed',
      message: 'Failed to test ButtonDestinations structure'
    }, { status: 500 });
  }
}