import { NextRequest } from 'next/server';
import { tourplanQuery } from '@/lib/tourplan';
import { successResponse, errorResponse } from '../utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productCode = searchParams.get('productCode') || 'NBOGTARP001CKSE';
    const requestType = searchParams.get('type') || 'standard';
    
    // Try different request variations to get MPI content
    const variations = [
      // Standard request
      `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>SAMAGT</AgentID>
    <Password>S@MAgt01</Password>
    <ButtonName>Group Tours</ButtonName>
    <Info>GMFTD</Info>
    <Opt>${productCode}</Opt>
  </OptionInfoRequest>
</Request>`,
      // With additional Info parameter
      `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>SAMAGT</AgentID>
    <Password>S@MAgt01</Password>
    <ButtonName>Group Tours</ButtonName>
    <Info>GMFTDIMG</Info>
    <Opt>${productCode}</Opt>
  </OptionInfoRequest>
</Request>`,
      // With web-specific request
      `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>SAMAGT</AgentID>
    <Password>S@MAgt01</Password>
    <ButtonName>Group Tours</ButtonName>
    <Info>GMFTDWEB</Info>
    <Opt>${productCode}</Opt>
  </OptionInfoRequest>
</Request>`
    ];

    // Try GetServiceMapRequest for maps
    const mapXml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <GetServiceMapRequest>
    <AgentID>SAMAGT</AgentID>
    <Password>S@MAgt01</Password>
    <Opt>${productCode}</Opt>
  </GetServiceMapRequest>
</Request>`;

    // Alternative: Try with NoteCategory parameter
    const noteXml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>SAMAGT</AgentID>
    <Password>S@MAgt01</Password>
    <ButtonName>Group Tours</ButtonName>
    <Info>GMFTD</Info>
    <Opt>${productCode}</Opt>
    <NoteCategories>MPI</NoteCategories>
  </OptionInfoRequest>
</Request>`;

    const xml = requestType === 'map' ? mapXml : 
                requestType === 'note' ? noteXml : 
                variations[0];
    
    console.log(`=== SENDING XML FOR ${productCode} ===`);
    console.log(xml);
    
    // Send to TourPlan API
    const response = await tourplanQuery(xml);
    
    console.log('=== RAW RESPONSE ===');
    console.log(JSON.stringify(response, null, 2));
    
    // Check for map-related data in the response
    const responseStr = JSON.stringify(response);
    const hasMap = responseStr.toLowerCase().includes('map');
    const hasBase64 = responseStr.includes('base64') || responseStr.includes('data:image');
    
    // Look specifically at OptionNotes
    const option = response?.OptionInfoReply?.Option;
    const notes = option?.OptionNotes?.OptionNote || [];
    const notesList = Array.isArray(notes) ? notes : [notes].filter(Boolean);
    
    const mapRelatedNotes = notesList.filter((note: any) => {
      const text = note?.NoteText || '';
      const category = note?.NoteCategory || '';
      return category === 'MPI' || // Map Image category
             text.toLowerCase().includes('map') || 
             text.includes('base64') ||
             text.includes('data:image') ||
             category.toLowerCase().includes('map') ||
             category.toLowerCase().includes('img');
    });
    
    // Specifically look for MPI notes
    const mpiNotes = notesList.filter((note: any) => note?.NoteCategory === 'MPI');
    
    return successResponse({
      productCode,
      requestType,
      xmlSent: xml,
      rawResponse: response,
      analysis: {
        hasMapKeyword: hasMap,
        hasBase64Data: hasBase64,
        totalNotes: notesList.length,
        mapRelatedNotes: mapRelatedNotes.length,
        mpiNotesFound: mpiNotes.length,
        noteCategories: notesList.map((n: any) => n?.NoteCategory).filter(Boolean),
        mapNotes: mapRelatedNotes,
        mpiNotes: mpiNotes,
        responseType: requestType === 'map' ? 'GetServiceMapRequest' : 
                      requestType === 'note' ? 'OptionInfoRequest+NoteCategories' :
                      'OptionInfoRequest'
      }
    });
  } catch (error) {
    console.error('Debug error:', error);
    return errorResponse(
      'Debug test failed',
      500,
      { message: error instanceof Error ? error.message : 'Unknown error' }
    );
  }
}