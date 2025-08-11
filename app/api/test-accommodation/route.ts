import { NextRequest, NextResponse } from 'next/server';
import { wpXmlRequest, extractResponseData } from '@/lib/tourplan/core';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const destination = searchParams.get('destination') || '';
    const dateFrom = searchParams.get('dateFrom') || '2025-02-01';
    const dateTo = searchParams.get('dateTo') || '2025-02-15';
    
    console.log('🧪 Testing accommodation search with TourPlan feedback fixes');
    console.log('Destination:', destination);
    console.log('Dates:', dateFrom, 'to', dateTo);
    
    // Build XML exactly as TourPlan suggested
    const agentId = process.env.TOURPLAN_AGENT_ID || '';
    const password = process.env.TOURPLAN_PASSWORD || '';
    
    // Test 1: Using ButtonDestinations structure as suggested
    const xml1 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>Accommodation</ButtonName>
    <Info>S</Info>
    <DateFrom>${dateFrom}</DateFrom>
    <DateTo>${dateTo}</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <RoomType>DB</RoomType>
      </RoomConfig>
    </RoomConfigs>
    ${destination ? `<ButtonDestinations>
      <ButtonDestination>
        <ButtonName></ButtonName>
        <DestinationName>${destination}</DestinationName>
      </ButtonDestination>
    </ButtonDestinations>` : ''}
  </OptionInfoRequest>
</Request>`;

    console.log('📤 Test 1 - Request XML with ButtonDestinations:', xml1);
    const response1 = await wpXmlRequest(xml1);
    const data1 = extractResponseData(response1, 'OptionInfoReply');
    console.log('📥 Test 1 - Response:', JSON.stringify(data1, null, 2));
    
    // Test 2: Try without ButtonDestinations for comparison
    const xml2 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>Accommodation</ButtonName>
    <Info>GS</Info>
    <DateFrom>${dateFrom}</DateFrom>
    <DateTo>${dateTo}</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <RoomType>DB</RoomType>
      </RoomConfig>
    </RoomConfigs>
    ${destination ? `<DestinationName>${destination}</DestinationName>` : ''}
  </OptionInfoRequest>
</Request>`;

    console.log('📤 Test 2 - Request XML with DestinationName:', xml2);
    const response2 = await wpXmlRequest(xml2);
    const data2 = extractResponseData(response2, 'OptionInfoReply');
    console.log('📥 Test 2 - Response:', JSON.stringify(data2, null, 2));
    
    // Test 3: Try without any destination filter
    const xml3 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>Accommodation</ButtonName>
    <Info>S</Info>
    <DateFrom>${dateFrom}</DateFrom>
    <DateTo>${dateTo}</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <RoomType>DB</RoomType>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`;

    console.log('📤 Test 3 - Request XML without destination:', xml3);
    const response3 = await wpXmlRequest(xml3);
    const data3 = extractResponseData(response3, 'OptionInfoReply');
    console.log('📥 Test 3 - Response:', JSON.stringify(data3, null, 2));
    
    return NextResponse.json({
      success: true,
      tests: {
        test1_buttonDestinations: {
          request: 'Using ButtonDestinations structure (TourPlan suggestion)',
          hasResults: !!data1?.Option,
          resultCount: Array.isArray(data1?.Option) ? data1.Option.length : (data1?.Option ? 1 : 0),
          data: data1
        },
        test2_destinationName: {
          request: 'Using DestinationName (original approach)',
          hasResults: !!data2?.Option,
          resultCount: Array.isArray(data2?.Option) ? data2.Option.length : (data2?.Option ? 1 : 0),
          data: data2
        },
        test3_noDestination: {
          request: 'No destination filter',
          hasResults: !!data3?.Option,
          resultCount: Array.isArray(data3?.Option) ? data3.Option.length : (data3?.Option ? 1 : 0),
          data: data3
        }
      },
      summary: {
        destination: destination || 'none',
        dateFrom,
        dateTo,
        recommendation: 'Check console logs for detailed XML and responses'
      }
    });
    
  } catch (error) {
    console.error('Test accommodation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Test failed'
    }, { status: 500 });
  }
}