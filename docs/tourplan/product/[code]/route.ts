// app/api/tourplan/product/[code]/route.ts
// API route for getting detailed product information

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;
    const searchParams = request.nextUrl.searchParams;
    const info = searchParams.get('info') || 'GMFTD';

    console.log(`🔍 Getting product details for code: ${code}, info: ${info}`);

    if (!code) {
      return NextResponse.json(
        { error: 'Product code is required' },
        { status: 400 }
      );
    }

    // Build XML request for product details
    const xmlRequest = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>AGENT_ID</AgentID>
    <Password>PASSWORD</Password>
    <OptionNumber>${code}</OptionNumber>
    <Info>${info}</Info>
  </OptionInfoRequest>
</Request>`;

    console.log('📤 Product details XML request:', xmlRequest);

    // Make request to Tourplan API
    const response = await fetch('/api/tourplan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ xmlPayload: xmlRequest }),
    });

    if (!response.ok) {
      throw new Error(`Tourplan API request failed: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to get product details');
    }

    console.log('📥 Product details response received');

    // Parse XML response
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(result.data, 'text/xml');

    // Check for errors
    const errors = xmlDoc.getElementsByTagName('ErrorText');
    if (errors.length > 0) {
      const errorText = errors[0].textContent;
      throw new Error(`Tourplan Error: ${errorText}`);
    }

    // Extract product details
    const options = xmlDoc.getElementsByTagName('Option');
    if (options.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const option = options[0];
    const optGeneral = option.getElementsByTagName('OptGeneral')[0];
    
    const productData = {
      code: code,
      name: optGeneral?.getElementsByTagName('Description')[0]?.textContent || 'Unknown Product',
      description: optGeneral?.getElementsByTagName('Comment')[0]?.textContent || '',
      classDescription: optGeneral?.getElementsByTagName('ClassDescription')[0]?.textContent || '',
      periods: optGeneral?.getElementsByTagName('Periods')[0]?.textContent || '0',
      // Add more fields as needed
    };

    return NextResponse.json({
      success: true,
      product: productData,
      rawXml: result.data // Include raw XML for debugging
    });

  } catch (error: any) {
    console.error('❌ Product details error:', error.message);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to get product details',
        code: params.code 
      },
      { status: 500 }
    );
  }
}