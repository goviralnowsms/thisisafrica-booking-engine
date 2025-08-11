import { NextRequest, NextResponse } from 'next/server';
import { wpXmlRequest, extractResponseData } from '@/lib/tourplan/core';

export async function GET() {
  try {
    const agentId = process.env.TOURPLAN_AGENT_ID || '';
    const password = process.env.TOURPLAN_PASSWORD || '';
    
    console.log('🔍 Testing Group Tours specifically (which we know should work)');
    
    const tests: any[] = [];
    
    // Test 1: Group Tours with the exact parameters that work on the website
    const xml1 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>Group Tours</ButtonName>
    <Info>GMFTD</Info>
    <DateFrom>2025-02-01</DateFrom>
    <DateTo>2025-12-31</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <RoomType>DB</RoomType>
      </RoomConfig>
    </RoomConfigs>
    <RateConvert>Y</RateConvert>
  </OptionInfoRequest>
</Request>`;

    console.log('📤 Test 1: Group Tours with full parameters (Info=GMFTD, dates, room config)');
    console.log('XML:', xml1);
    
    try {
      const response1 = await wpXmlRequest(xml1);
      console.log('📥 Raw response:', JSON.stringify(response1, null, 2));
      const data1 = extractResponseData(response1, 'OptionInfoReply');
      
      tests.push({
        test: 'Group Tours with full params',
        hasResults: !!data1?.Option,
        resultCount: Array.isArray(data1?.Option) ? data1.Option.length : (data1?.Option ? 1 : 0),
        data: data1
      });
    } catch (error) {
      tests.push({
        test: 'Group Tours with full params',
        hasResults: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    // Test 2: Group Tours with destination filter
    const xml2 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>Group Tours</ButtonName>
    <Info>GMFTD</Info>
    <DestinationName>Kenya</DestinationName>
    <DateFrom>2025-02-01</DateFrom>
    <DateTo>2025-12-31</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <RoomType>DB</RoomType>
      </RoomConfig>
    </RoomConfigs>
    <RateConvert>Y</RateConvert>
  </OptionInfoRequest>
</Request>`;

    console.log('📤 Test 2: Group Tours with Kenya destination');
    
    try {
      const response2 = await wpXmlRequest(xml2);
      console.log('📥 Raw response 2:', JSON.stringify(response2, null, 2));
      const data2 = extractResponseData(response2, 'OptionInfoReply');
      
      tests.push({
        test: 'Group Tours - Kenya',
        hasResults: !!data2?.Option,
        resultCount: Array.isArray(data2?.Option) ? data2.Option.length : (data2?.Option ? 1 : 0),
        data: data2
      });
    } catch (error) {
      tests.push({
        test: 'Group Tours - Kenya',
        hasResults: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    // Test 3: Let's also test Packages with full parameters
    const xml3 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>Packages</ButtonName>
    <Info>P</Info>
    <DateFrom>2025-02-01</DateFrom>
    <DateTo>2025-12-31</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <RoomType>DB</RoomType>
      </RoomConfig>
    </RoomConfigs>
    <RateConvert>Y</RateConvert>
  </OptionInfoRequest>
</Request>`;

    console.log('📤 Test 3: Packages with full parameters');
    
    try {
      const response3 = await wpXmlRequest(xml3);
      console.log('📥 Raw response 3:', JSON.stringify(response3, null, 2));
      const data3 = extractResponseData(response3, 'OptionInfoReply');
      
      tests.push({
        test: 'Packages with full params',
        hasResults: !!data3?.Option,
        resultCount: Array.isArray(data3?.Option) ? data3.Option.length : (data3?.Option ? 1 : 0),
        data: data3
      });
    } catch (error) {
      tests.push({
        test: 'Packages with full params',
        hasResults: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    // Test 4: Direct product lookup to confirm API is working
    const xml4 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <Opt>NBOGTARP001CKSE</Opt>
  </OptionInfoRequest>
</Request>`;

    console.log('📤 Test 4: Direct product lookup (sanity check)');
    
    try {
      const response4 = await wpXmlRequest(xml4);
      const data4 = extractResponseData(response4, 'OptionInfoReply');
      
      tests.push({
        test: 'Direct product lookup',
        hasResults: !!data4?.Option,
        resultCount: 1,
        data: data4
      });
    } catch (error) {
      tests.push({
        test: 'Direct product lookup',
        hasResults: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    return NextResponse.json({
      success: true,
      summary: {
        totalTests: tests.length,
        working: tests.filter(t => t.hasResults).map(t => t.test),
        notWorking: tests.filter(t => !t.hasResults).map(t => t.test)
      },
      tests,
      conclusion: tests.some(t => t.test.includes('Group Tours') && t.hasResults) 
        ? 'Group Tours WORKS with proper parameters!' 
        : 'Group Tours not working - check TourPlan configuration'
    });
    
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Test failed'
    }, { status: 500 });
  }
}