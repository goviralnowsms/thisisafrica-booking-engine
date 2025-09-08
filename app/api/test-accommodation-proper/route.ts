import { NextRequest, NextResponse } from 'next/server';
import { wpXmlRequest, extractResponseData } from '@/lib/tourplan/core';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const destination = searchParams.get('destination') || 'Nairobi';
    const dateFrom = searchParams.get('dateFrom') || '2025-07-15';
    const dateTo = searchParams.get('dateTo') || '2025-07-18';
    
    console.log('🏨 Testing proper accommodation search based on TourPlan documentation');
    console.log('Destination:', destination);
    console.log('Dates:', dateFrom, 'to', dateTo);
    
    const agentId = process.env.TOURPLAN_AGENT_ID || '';
    const password = process.env.TOURPLAN_PASSWORD || '';
    
    const tests: any[] = [];
    
    // Test 1: Using documented parameters with GS info
    const xml1 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>Accommodation</ButtonName>
    <DestinationName>${destination}</DestinationName>
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

    console.log('📤 Test 1 - With documented parameters (Info=GS)');
    console.log('Request XML:', xml1);
    const response1 = await wpXmlRequest(xml1);
    console.log('📥 Test 1 - Raw Response:', response1);
    const data1 = extractResponseData(response1, 'OptionInfoReply');
    
    // Parse accommodation results
    let accommodations1: any[] = [];
    if (data1?.Option) {
      const options = Array.isArray(data1.Option) ? data1.Option : [data1.Option];
      accommodations1 = options.map((opt: any) => ({
        code: opt.Opt,
        name: opt.OptGeneral?.Description,
        supplier: opt.OptGeneral?.SupplierName,
        locality: opt.OptGeneral?.Locality,
        localityDesc: opt.OptGeneral?.LocalityDescription,
        serviceType: opt.OptGeneral?.SrvType,
        comment: opt.OptGeneral?.Comment,
        hasRates: !!opt.OptDateRanges?.OptDateRange
      }));
    }
    
    tests.push({
      name: 'Documented Parameters (Info=GS)',
      hasResults: accommodations1.length > 0,
      count: accommodations1.length,
      accommodations: accommodations1.slice(0, 5), // First 5 for readability
      fullData: data1
    });
    
    // Test 2: Try with MinimumAvailability parameter
    const xml2 = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>Accommodation</ButtonName>
    <DestinationName>${destination}</DestinationName>
    <Info>GS</Info>
    <DateFrom>${dateFrom}</DateFrom>
    <DateTo>${dateTo}</DateTo>
    <MinimumAvailability>RQ</MinimumAvailability>
    <RoomConfigs>
      <RoomConfig>
        <Adults>2</Adults>
        <RoomType>DB</RoomType>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`;

    console.log('📤 Test 2 - With MinimumAvailability=RQ');
    const response2 = await wpXmlRequest(xml2);
    console.log('📥 Test 2 - Raw Response:', response2);
    const data2 = extractResponseData(response2, 'OptionInfoReply');
    
    let accommodations2: any[] = [];
    if (data2?.Option) {
      const options = Array.isArray(data2.Option) ? data2.Option : [data2.Option];
      accommodations2 = options.map((opt: any) => ({
        code: opt.Opt,
        name: opt.OptGeneral?.Description,
        supplier: opt.OptGeneral?.SupplierName,
        locality: opt.OptGeneral?.Locality,
        serviceType: opt.OptGeneral?.SrvType
      }));
    }
    
    tests.push({
      name: 'With MinimumAvailability',
      hasResults: accommodations2.length > 0,
      count: accommodations2.length,
      accommodations: accommodations2.slice(0, 5)
    });
    
    // Test 3: Try different destinations
    const destinations = ['Cape Town', 'Victoria Falls', 'Masai Mara', 'Serengeti'];
    
    for (const dest of destinations) {
      const xmlDest = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${agentId}</AgentID>
    <Password>${password}</Password>
    <ButtonName>Accommodation</ButtonName>
    <DestinationName>${dest}</DestinationName>
    <Info>GS</Info>
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

      console.log(`📤 Testing destination: ${dest}`);
      const responseDest = await wpXmlRequest(xmlDest);
      const dataDest = extractResponseData(responseDest, 'OptionInfoReply');
      
      let accommodationsDest: any[] = [];
      if (dataDest?.Option) {
        const options = Array.isArray(dataDest.Option) ? dataDest.Option : [dataDest.Option];
        accommodationsDest = options.map((opt: any) => ({
          code: opt.Opt,
          name: opt.OptGeneral?.Description,
          supplier: opt.OptGeneral?.SupplierName
        }));
      }
      
      tests.push({
        name: `Destination: ${dest}`,
        hasResults: accommodationsDest.length > 0,
        count: accommodationsDest.length,
        accommodations: accommodationsDest.slice(0, 3)
      });
    }
    
    // Summary of findings
    const workingDestinations = tests
      .filter(t => t.name.startsWith('Destination:') && t.hasResults)
      .map(t => t.name.replace('Destination: ', ''));
    
    const allAccommodationCodes = tests
      .flatMap(t => t.accommodations || [])
      .map(a => a.code)
      .filter((code, index, self) => code && self.indexOf(code) === index);
    
    return NextResponse.json({
      success: true,
      tests,
      summary: {
        testedDestination: destination,
        dateRange: `${dateFrom} to ${dateTo}`,
        workingDestinations,
        totalUniqueAccommodations: allAccommodationCodes.length,
        sampleAccommodationCodes: allAccommodationCodes.slice(0, 10),
        recommendation: tests[0].hasResults 
          ? 'Accommodation search is working with Info=GS parameter' 
          : 'Accommodation search may need different parameters or destinations'
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