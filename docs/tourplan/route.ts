// app/api/tourplan/route.ts
import { NextRequest, NextResponse } from 'next/server';

async function makeRequestWithRetry(xmlPayload: string, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`=== TOURPLAN API REQUEST (Attempt ${attempt}/${maxRetries}) ===`);
      console.log('Payload:', xmlPayload);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout per attempt
      
      const response = await fetch('https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml; charset=utf-8',
          'Accept': 'text/xml',
          'User-Agent': 'TourplanBookingEngine/1.0',
          'Cache-Control': 'no-cache',
        },
        body: xmlPayload,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log(`=== TOURPLAN API RESPONSE (Attempt ${attempt}) ===`);
      console.log('Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const xmlResponse = await response.text();
      console.log('✅ Success! Response length:', xmlResponse.length);
      console.log('📄 Full XML Response:');
      console.log(xmlResponse);
      
      // Basic analysis of the response
      if (xmlResponse.includes('<Option>')) {
        const optionCount = (xmlResponse.match(/<Option>/g) || []).length;
        console.log(`🎯 Found ${optionCount} Option elements in response`);
      } else {
        console.log('⚠️ No <Option> elements found in response');
      }
      
      if (xmlResponse.includes('<Error>')) {
        console.log('❌ Response contains error elements');
      }
      
      return {
        success: true,
        data: xmlResponse,
        attempt: attempt,
        debug: {
          status: response.status,
          responseLength: xmlResponse.length,
          retriesUsed: attempt - 1,
          hasOptions: xmlResponse.includes('<Option>'),
          hasErrors: xmlResponse.includes('<Error>')
        }
      };
      
    } catch (error: any) {
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        // Final attempt failed
        throw new Error(`All ${maxRetries} attempts failed. Last error: ${error.message}`);
      }
      
      // Wait before retry (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Max 5 seconds
      console.log(`⏳ Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { xmlPayload } = await request.json();
    
    const result = await makeRequestWithRetry(xmlPayload, 3);
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('=== FINAL TOURPLAN API ERROR ===');
    console.error('Error message:', error.message);
    
    // Return detailed error for better debugging
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Tourplan API temporarily unavailable',
      errorType: error.constructor.name,
      debug: {
        timestamp: new Date().toISOString(),
        endpoint: 'https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi',
        suggestion: 'API may be experiencing intermittent issues - try again in a moment'
      }
    }, { 
      status: 500 
    });
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}