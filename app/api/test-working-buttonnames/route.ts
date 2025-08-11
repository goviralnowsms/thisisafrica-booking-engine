import { NextRequest, NextResponse } from 'next/server';
import { wpXmlRequest, extractResponseData } from '@/lib/tourplan/core';

export async function GET() {
  try {
    const agentId = process.env.TOURPLAN_AGENT_ID || '';
    const password = process.env.TOURPLAN_PASSWORD || '';
    
    console.log('🔍 Testing ALL ButtonNames to see which ones actually work');
    
    const tests: any[] = [];
    
    // Test all ButtonNames we know about (excluding Day Tours as no page exists)
    const buttonNamesToTest = [
      { name: 'Group Tours', info: 'GMFTD' },
      { name: 'Packages', info: 'P' },
      { name: 'Special Offers', info: null },
      { name: 'Special Deals', info: null },
      { name: 'Cruises', info: null },
      { name: 'Rail', info: null },
      { name: 'Accommodation', info: 'S' },
      { name: 'Hotels', info: 'GS' },
      { name: 'Tours', info: null },
      { name: 'Safaris', info: null },
      { name: 'Transfers', info: null }
    ];
    
    for (const button of buttonNamesToTest) {
      console.log(`🔍 Testing ButtonName="${button.name}"`);
      
      // Test 1: Basic ButtonName search
      const xml1 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>${button.name}</ButtonName>
  </OptionInfoRequest>
</Request>`;

      try {
        const response1 = await wpXmlRequest(xml1);
        const data1 = extractResponseData(response1, 'OptionInfoReply');
        
        const hasResults = !!data1?.Option;
        const resultCount = Array.isArray(data1?.Option) ? data1.Option.length : (data1?.Option ? 1 : 0);
        
        tests.push({
          buttonName: button.name,
          test: 'Basic (no Info)',
          hasResults,
          resultCount,
          status: hasResults ? '✅ WORKS' : '❌ EMPTY'
        });
        
        console.log(`🔍 ${button.name} basic: ${hasResults ? `✅ WORKS (${resultCount} results)` : '❌ EMPTY'}`);
      } catch (error) {
        tests.push({
          buttonName: button.name,
          test: 'Basic (no Info)',
          hasResults: false,
          resultCount: 0,
          status: '❌ ERROR',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      
      // Test 2: With Info parameter if we know it
      if (button.info) {
        const xml2 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>${button.name}</ButtonName>
    <Info>${button.info}</Info>
  </OptionInfoRequest>
</Request>`;

        try {
          const response2 = await wpXmlRequest(xml2);
          const data2 = extractResponseData(response2, 'OptionInfoReply');
          
          const hasResults = !!data2?.Option;
          const resultCount = Array.isArray(data2?.Option) ? data2.Option.length : (data2?.Option ? 1 : 0);
          
          tests.push({
            buttonName: button.name,
            test: `With Info=${button.info}`,
            hasResults,
            resultCount,
            status: hasResults ? '✅ WORKS' : '❌ EMPTY'
          });
          
          console.log(`🔍 ${button.name} with Info=${button.info}: ${hasResults ? `✅ WORKS (${resultCount} results)` : '❌ EMPTY'}`);
        } catch (error) {
          tests.push({
            buttonName: button.name,
            test: `With Info=${button.info}`,
            hasResults: false,
            resultCount: 0,
            status: '❌ ERROR',
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    }
    
    // Summary
    const working = tests.filter(t => t.hasResults);
    const notWorking = tests.filter(t => !t.hasResults && !t.error);
    const errors = tests.filter(t => t.error);
    
    // Group by ButtonName to see which ones work
    const buttonNameSummary: any = {};
    for (const test of tests) {
      if (!buttonNameSummary[test.buttonName]) {
        buttonNameSummary[test.buttonName] = {
          name: test.buttonName,
          tests: [],
          anyWorking: false
        };
      }
      buttonNameSummary[test.buttonName].tests.push({
        type: test.test,
        status: test.status,
        count: test.resultCount
      });
      if (test.hasResults) {
        buttonNameSummary[test.buttonName].anyWorking = true;
      }
    }
    
    const workingButtonNames = Object.values(buttonNameSummary).filter((b: any) => b.anyWorking).map((b: any) => b.name);
    const notWorkingButtonNames = Object.values(buttonNameSummary).filter((b: any) => !b.anyWorking).map((b: any) => b.name);
    
    return NextResponse.json({
      success: true,
      summary: {
        totalTests: tests.length,
        workingTests: working.length,
        emptyTests: notWorking.length,
        errorTests: errors.length,
        workingButtonNames,
        notWorkingButtonNames
      },
      buttonNameDetails: buttonNameSummary,
      allTests: tests,
      recommendation: `
        WORKING ButtonNames: ${workingButtonNames.join(', ') || 'None'}
        NOT WORKING ButtonNames: ${notWorkingButtonNames.join(', ') || 'None'}
        
        Send this to TourPlan support to ask why some ButtonNames return empty when the products exist.
      `
    });
    
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Test failed'
    }, { status: 500 });
  }
}