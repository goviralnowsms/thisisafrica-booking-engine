import { NextRequest, NextResponse } from 'next/server';
import { wpXmlRequest } from '@/lib/tourplan/core';

/**
 * Raw XML API endpoint for diagnostic purposes
 * Accepts any XML and returns the raw response
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { xml } = body;

    if (!xml) {
      return NextResponse.json({
        success: false,
        error: 'XML content is required'
      }, { status: 400 });
    }

    console.log('🔍 Raw XML Request:', xml);
    
    // Send XML directly to TourPlan
    const response = await wpXmlRequest(xml);
    
    return NextResponse.json({
      success: true,
      response: response,
      xmlResponse: JSON.stringify(response),
      message: 'Raw XML request successful'
    });

  } catch (error) {
    console.error('❌ Raw XML request failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Raw XML request failed'
    }, { status: 500 });
  }
}