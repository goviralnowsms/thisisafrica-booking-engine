import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if proxy is configured (EC2 or FixieIP)
    const proxyUrl = process.env.PROXY_URL || process.env.FIXIE_URL;
    const hasProxy = !!proxyUrl;
    const proxyType = process.env.PROXY_URL ? 'EC2' : (process.env.FIXIE_URL ? 'FixieIP' : 'None');
    
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
      
      // Check if this matches known proxy IPs
      const fixieIps = ['52.5.155.132', '52.87.82.133'];
      // For EC2 proxy, check if it's not a Vercel IP (starts with 3.)
      proxyWorking = process.env.PROXY_URL ? !outboundIp.startsWith('3.') : fixieIps.includes(outboundIp);
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
        proxyType,
        hasProxyUrl: hasProxy,
        proxyUrlConfigured: proxyUrl ? 'Yes (hidden for security)' : 'No',
        outboundIp,
        isUsingProxy: proxyWorking,
        expectedFixieIps: proxyType === 'FixieIP' ? ['52.5.155.132', '52.87.82.133'] : 'N/A',
        expectedEC2IP: process.env.PROXY_URL ? 'Your EC2 IP' : 'N/A',
        tourplanApiReachable: tourplanReachable,
        tourplanError: tourplanError || 'None',
      },
      message: proxyWorking 
        ? `✅ Proxy (${proxyType}) is working correctly. Outbound IP: ${outboundIp}`
        : `⚠️ Proxy (${proxyType}) may not be working. Outbound IP: ${outboundIp}`,
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