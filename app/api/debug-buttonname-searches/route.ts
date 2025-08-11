import { NextRequest, NextResponse } from 'next/server';
import { wpXmlRequest, extractResponseData } from '@/lib/tourplan/core';

export async function GET() {
  try {
    const agentId = process.env.TOURPLAN_AGENT_ID || '';
    const password = process.env.TOURPLAN_PASSWORD || '';
    
    console.log('🔍 Testing ButtonName searches that return empty results');
    
    const tests: any[] = [];
    
    // Test all the ButtonName searches that we know return empty
    const buttonNamesToTest = [
      'Cruises',
      'Rail', 
      'Accommodation',
      'Hotels',
      'Special Offers',
      'Special Deals'
    ];
    
    for (const buttonName of buttonNamesToTest) {
      console.log(`🔍 Testing ButtonName="${buttonName}"`);
      
      // Test 1: Basic ButtonName search (no other parameters)
      const xml1 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>${buttonName}</ButtonName>
  </OptionInfoRequest>
</Request>`;

      try {
        const response1 = await wpXmlRequest(xml1);
        const data1 = extractResponseData(response1, 'OptionInfoReply');
        
        tests.push({
          buttonName,
          test: 'Basic search',
          hasResults: !!data1?.Option,
          resultCount: Array.isArray(data1?.Option) ? data1.Option.length : (data1?.Option ? 1 : 0),
          data: data1,
          xml: xml1
        });
        
        console.log(`🔍 ${buttonName} basic: ${data1?.Option ? 'HAS RESULTS' : 'EMPTY'}`);
      } catch (error) {
        tests.push({
          buttonName,
          test: 'Basic search',
          hasResults: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          xml: xml1
        });
      }
      
      // Test 2: ButtonName with Info parameter
      if (['Cruises', 'Rail'].includes(buttonName)) {
        const xml2 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>${buttonName}</ButtonName>
    <Info>GS</Info>
  </OptionInfoRequest>
</Request>`;

        try {
          const response2 = await wpXmlRequest(xml2);
          const data2 = extractResponseData(response2, 'OptionInfoReply');
          
          tests.push({
            buttonName,
            test: 'With Info=GS',
            hasResults: !!data2?.Option,
            resultCount: Array.isArray(data2?.Option) ? data2.Option.length : (data2?.Option ? 1 : 0),
            data: data2,
            xml: xml2
          });
          
          console.log(`🔍 ${buttonName} with Info: ${data2?.Option ? 'HAS RESULTS' : 'EMPTY'}`);
        } catch (error) {
          tests.push({
            buttonName,
            test: 'With Info=GS',
            hasResults: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            xml: xml2
          });
        }
      }
      
      // Test 3: ButtonName with date range
      const xml3 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>${buttonName}</ButtonName>
    <DateFrom>2025-02-01</DateFrom>
    <DateTo>2025-02-15</DateTo>
  </OptionInfoRequest>
</Request>`;

      try {
        const response3 = await wpXmlRequest(xml3);
        const data3 = extractResponseData(response3, 'OptionInfoReply');
        
        tests.push({
          buttonName,
          test: 'With date range',
          hasResults: !!data3?.Option,
          resultCount: Array.isArray(data3?.Option) ? data3.Option.length : (data3?.Option ? 1 : 0),
          data: data3,
          xml: xml3
        });
        
        console.log(`🔍 ${buttonName} with dates: ${data3?.Option ? 'HAS RESULTS' : 'EMPTY'}`);
      } catch (error) {
        tests.push({
          buttonName,
          test: 'With date range',
          hasResults: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          xml: xml3
        });
      }
    }
    
    // Test 4: Direct product code lookup (we know this works)
    console.log('🔍 Testing direct product code lookup (known to work)');
    const knownCodes = ['BBKCRCHO018TIACP2', 'VFARLROV001VFPRDX', 'NBOGTARP001CKSE'];
    
    for (const code of knownCodes) {
      const xmlDirect = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <Opt>${code}</Opt>
  </OptionInfoRequest>
</Request>`;

      try {
        const responseDirect = await wpXmlRequest(xmlDirect);
        const dataDirect = extractResponseData(responseDirect, 'OptionInfoReply');
        
        tests.push({
          buttonName: `Direct lookup: ${code}`,
          test: 'Product code lookup',
          hasResults: !!dataDirect?.Option,
          resultCount: Array.isArray(dataDirect?.Option) ? dataDirect.Option.length : (dataDirect?.Option ? 1 : 0),
          data: dataDirect,
          xml: xmlDirect
        });
        
        console.log(`🔍 Direct ${code}: ${dataDirect?.Option ? 'HAS RESULTS' : 'EMPTY'}`);
      } catch (error) {
        tests.push({
          buttonName: `Direct lookup: ${code}`,
          test: 'Product code lookup',
          hasResults: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          xml: xmlDirect
        });
      }
    }
    
    // Summary
    const workingButtonNames = tests.filter(t => t.hasResults && t.buttonName.length < 20).map(t => `${t.buttonName} (${t.test})`);
    const emptyButtonNames = tests.filter(t => !t.hasResults && t.buttonName.length < 20).map(t => `${t.buttonName} (${t.test})`);
    const directLookups = tests.filter(t => t.buttonName.includes('Direct lookup')).map(t => `${t.buttonName}: ${t.hasResults ? 'WORKS' : 'FAILS'}`);
    
    return NextResponse.json({
      success: true,
      summary: {
        workingButtonNames,
        emptyButtonNames,
        directLookups,
        totalTests: tests.length
      },
      allTests: tests,
      conclusion: {
        buttonNameSearches: workingButtonNames.length > 0 ? 'Some work' : 'All empty',
        directProductLookups: directLookups.filter(d => d.includes('WORKS')).length > 0 ? 'Working' : 'Broken',
        recommendation: 'Send detailed results to TourPlan support to investigate why ButtonName searches return empty'
      }
    });
    
  } catch (error) {
    console.error('Debug test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Test failed'
    }, { status: 500 });
  }
}