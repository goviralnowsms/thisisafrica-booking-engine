import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const config = {
      hasEndpoint: !!process.env.TOURPLAN_API_URL,
      hasAgentId1: !!process.env.TOURPLAN_AGENTID,
      hasAgentId2: !!process.env.TOURPLAN_AGENT_ID,
      hasPassword1: !!process.env.TOURPLAN_AGENTPASSWORD,
      hasPassword2: !!process.env.TOURPLAN_PASSWORD,
      hasProxy: !!process.env.PROXY_URL,
      hasFixie: !!process.env.FIXIE_URL,
      
      // Show actual values (masked for security)
      endpoint: process.env.TOURPLAN_API_URL ? 'SET' : 'NOT SET',
      agentId: process.env.TOURPLAN_AGENTID || process.env.TOURPLAN_AGENT_ID || 'NOT SET',
      password: process.env.TOURPLAN_AGENTPASSWORD || process.env.TOURPLAN_PASSWORD ? 'SET' : 'NOT SET',
      proxyUrl: process.env.PROXY_URL ? 'SET' : 'NOT SET',
      
      // Environment info
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
    };

    return NextResponse.json({
      success: true,
      config,
      message: 'TourPlan configuration check'
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to check TourPlan configuration'
    }, { status: 500 });
  }
}