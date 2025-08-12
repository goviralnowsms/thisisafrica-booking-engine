import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if FIXIE_URL is configured
    const fixieUrl = process.env.FIXIE_URL;
    const hasFixie = !!fixieUrl;
    
    // Make a request to an IP checking service
    let outboundIp = 'Unknown';
    let fixieWorking = false;
    
    try {
      // Use ipify to check our outbound IP
      let response: Response;
      
      // If Fixie URL is available, use it for proxy
      if (fixieUrl) {
        const nodeFetch = (await import('node-fetch')).default;
        const { HttpsProxyAgent } = await import('https-proxy-agent');
        const agent = new HttpsProxyAgent(fixieUrl);
        // @ts-ignore
        response = await nodeFetch('https://api.ipify.org?format=json', {
          method: 'GET',
          agent,
        }) as unknown as Response;
      } else {
        response = await fetch('https://api.ipify.org?format=json', {
          method: 'GET',
        });
      }
      const data = await response.json();
      outboundIp = data.ip;
      
      // Check if this matches known Fixie IPs
      const fixieIps = ['52.5.155.132', '52.87.82.133'];
      fixieWorking = fixieIps.includes(outboundIp);
    } catch (error) {
      console.error('Error checking IP:', error);
    }
    
    // Also test TourPlan API connectivity
    let tourplanReachable = false;
    let tourplanError = '';
    
    try {
      const testXml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <PingRequest>
    <AgentID>${process.env.TOURPLAN_AGENT_ID || 'SAMAGT'}</AgentID>
    <Password>${process.env.TOURPLAN_PASSWORD || 'S@MAgt01'}</Password>
  </PingRequest>
</Request>`;
      
      let response: Response;
      
      if (fixieUrl) {
        const nodeFetch = (await import('node-fetch')).default;
        const { HttpsProxyAgent } = await import('https-proxy-agent');
        const agent = new HttpsProxyAgent(fixieUrl);
        // @ts-ignore
        response = await nodeFetch(
          'https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'text/xml; charset=utf-8',
            },
            body: testXml,
            agent,
          }
        ) as unknown as Response;
      } else {
        response = await fetch(
          'https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'text/xml; charset=utf-8',
            },
            body: testXml,
          }
        );
      }
      
      tourplanReachable = response.ok;
      if (!response.ok) {
        tourplanError = `HTTP ${response.status}: ${response.statusText}`;
      }
    } catch (error: any) {
      tourplanError = error.message;
    }
    
    return NextResponse.json({
      diagnostics: {
        environment: process.env.NODE_ENV,
        hasFixieUrl: hasFixie,
        fixieUrlConfigured: fixieUrl ? 'Yes (hidden for security)' : 'No',
        outboundIp,
        isUsingFixie: fixieWorking,
        expectedFixieIps: ['52.5.155.132', '52.87.82.133'],
        tourplanApiReachable: tourplanReachable,
        tourplanError: tourplanError || 'None',
      },
      message: fixieWorking 
        ? `✅ FixieIP is working correctly. Outbound IP: ${outboundIp}`
        : `⚠️ FixieIP may not be working. Outbound IP: ${outboundIp}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Diagnostic test failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}