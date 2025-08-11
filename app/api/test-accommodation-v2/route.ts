import { NextRequest, NextResponse } from 'next/server';
import { wpXmlRequest, extractResponseData } from '@/lib/tourplan/core';

export async function GET(request: NextRequest) {
  try {
    const agentId = process.env.TOURPLAN_AGENT_ID || '';
    const password = process.env.TOURPLAN_PASSWORD || '';
    
    console.log('🧪 Testing various accommodation search approaches');
    
    const tests: any[] = [];
    
    // Test 1: Try with LocationCode instead of destination
    const xml1 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>Accommodation</ButtonName>
    <Info>S</Info>
    <DateFrom>2025-02-01</DateFrom>
    <DateTo>2025-02-15</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <RoomType>DB</RoomType>
      </RoomConfig>
    </RoomConfigs>
    <LocationCode>CPT</LocationCode>
  </OptionInfoRequest>
</Request>`;

    console.log('📤 Test 1 - Using LocationCode (CPT)');
    const response1 = await wpXmlRequest(xml1);
    console.log('📥 Test 1 - Raw Response:', response1);
    const data1 = extractResponseData(response1, 'OptionInfoReply');
    tests.push({
      name: 'LocationCode (CPT)',
      hasResults: !!data1?.Option,
      count: Array.isArray(data1?.Option) ? data1.Option.length : (data1?.Option ? 1 : 0),
      data: data1
    });
    
    // Test 2: Try without Info parameter
    const xml2 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>Accommodation</ButtonName>
    <DateFrom>2025-02-01</DateFrom>
    <DateTo>2025-02-15</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <RoomType>DB</RoomType>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`;

    console.log('📤 Test 2 - Without Info parameter');
    const response2 = await wpXmlRequest(xml2);
    console.log('📥 Test 2 - Raw Response:', response2);
    const data2 = extractResponseData(response2, 'OptionInfoReply');
    tests.push({
      name: 'No Info parameter',
      hasResults: !!data2?.Option,
      count: Array.isArray(data2?.Option) ? data2.Option.length : (data2?.Option ? 1 : 0),
      data: data2
    });
    
    // Test 3: Try with specific product code we know exists
    const xml3 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <Opt>NBOGTARP001CKSE</Opt>
    <DateFrom>2025-02-01</DateFrom>
    <DateTo>2025-02-15</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <RoomType>DB</RoomType>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`;

    console.log('📤 Test 3 - Specific product code (NBOGTARP001CKSE)');
    const response3 = await wpXmlRequest(xml3);
    console.log('📥 Test 3 - Raw Response:', response3);
    const data3 = extractResponseData(response3, 'OptionInfoReply');
    tests.push({
      name: 'Specific product (NBOGTARP001CKSE)',
      hasResults: !!data3?.Option,
      count: Array.isArray(data3?.Option) ? data3.Option.length : (data3?.Option ? 1 : 0),
      data: data3
    });
    
    // Test 4: Try Hotels ButtonName
    const xml4 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>Hotels</ButtonName>
    <Info>S</Info>
    <DateFrom>2025-02-01</DateFrom>
    <DateTo>2025-02-15</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <RoomType>DB</RoomType>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`;

    console.log('📤 Test 4 - Hotels ButtonName');
    const response4 = await wpXmlRequest(xml4);
    console.log('📥 Test 4 - Raw Response:', response4);
    const data4 = extractResponseData(response4, 'OptionInfoReply');
    tests.push({
      name: 'Hotels ButtonName',
      hasResults: !!data4?.Option,
      count: Array.isArray(data4?.Option) ? data4.Option.length : (data4?.Option ? 1 : 0),
      data: data4
    });
    
    // Test 5: Try with Locality parameter
    const xml5 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>Accommodation</ButtonName>
    <Info>S</Info>
    <Locality>NBO</Locality>
    <DateFrom>2025-02-01</DateFrom>
    <DateTo>2025-02-15</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <RoomType>DB</RoomType>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`;

    console.log('📤 Test 5 - Using Locality (NBO)');
    const response5 = await wpXmlRequest(xml5);
    console.log('📥 Test 5 - Raw Response:', response5);
    const data5 = extractResponseData(response5, 'OptionInfoReply');
    tests.push({
      name: 'Locality (NBO - Nairobi)',
      hasResults: !!data5?.Option,
      count: Array.isArray(data5?.Option) ? data5.Option.length : (data5?.Option ? 1 : 0),
      data: data5
    });
    
    // Test 6: Try Packages ButtonName with accommodation Info
    const xml6 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>Packages</ButtonName>
    <Info>P</Info>
    <DateFrom>2025-02-01</DateFrom>
    <DateTo>2025-02-15</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <RoomType>DB</RoomType>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`;

    console.log('📤 Test 6 - Packages ButtonName');
    const response6 = await wpXmlRequest(xml6);
    console.log('📥 Test 6 - Raw Response:', response6);
    const data6 = extractResponseData(response6, 'OptionInfoReply');
    tests.push({
      name: 'Packages (as alternative)',
      hasResults: !!data6?.Option,
      count: Array.isArray(data6?.Option) ? data6.Option.length : (data6?.Option ? 1 : 0),
      data: data6
    });
    
    return NextResponse.json({
      success: true,
      tests,
      summary: {
        working: tests.filter(t => t.hasResults).map(t => t.name),
        notWorking: tests.filter(t => !t.hasResults).map(t => t.name),
        totalTests: tests.length,
        successfulTests: tests.filter(t => t.hasResults).length
      }
    });
    
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Test failed'
    }, { status: 500 });
  }
}