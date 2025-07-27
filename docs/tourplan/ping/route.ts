import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🏓 Ping test starting...');
    
    // Check environment variables
    const hasUrl = !!process.env.TOURPLAN_API_URL;
    const hasAgent = !!process.env.TOURPLAN_AGENTID;
    const hasPassword = !!process.env.TOURPLAN_AGENTPASSWORD;
    
    console.log('Environment check:', { hasUrl, hasAgent, hasPassword });

    if (!hasUrl || !hasAgent || !hasPassword) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        env: { hasUrl, hasAgent, hasPassword }
      });
    }

    const xmlRequest = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <PingRequest>
    <AgentID>${process.env.TOURPLAN_AGENTID}</AgentID>
    <Password>${process.env.TOURPLAN_AGENTPASSWORD}</Password>
  </PingRequest>
</Request>`;

    console.log('Sending ping to Tourplan...');

    const response = await fetch(process.env.TOURPLAN_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
      },
      body: xmlRequest
    });

    const xmlText = await response.text();
    const isConnected = xmlText.includes('PingReply') && !xmlText.includes('ErrorReply');

    console.log('Ping result:', { status: response.status, connected: isConnected });

    return NextResponse.json({
      success: isConnected,
      connected: isConnected,
      status: response.status,
      message: isConnected ? 'Tourplan API is responding' : 'Tourplan API connection failed',
      responseLength: xmlText.length,
      responsePreview: xmlText.substring(0, 200),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Ping error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}