import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if proxy is configured (UpCloud, EC2, or FixieIP)
    const proxyUrl = process.env.TOURPLAN_PROXY_URL || process.env.PROXY_URL || process.env.FIXIE_URL;
    const proxyApiKey = process.env.TOURPLAN_PROXY_API_KEY;
    const hasProxy = !!proxyUrl;
    const proxyType = process.env.TOURPLAN_PROXY_URL ? 'UpCloud' : (process.env.PROXY_URL ? 'EC2' : (process.env.FIXIE_URL ? 'FixieIP' : 'None'));
    
    // Make a request to an IP checking service
    let outboundIp = 'Unknown';
    let proxyWorking = false;
    
    try {
      // Use ipify to check our outbound IP
      let response: Response;
      
      // If UpCloud proxy with API key, make direct request through proxy
      if (proxyType === 'UpCloud' && proxyApiKey) {
        response = await fetch('https://api.ipify.org?format=json', {
          method: 'GET',
        });
        // For UpCloud proxy, we'll check IP in TourPlan test instead
      } else if (proxyUrl && proxyType !== 'UpCloud') {
        // Use node-fetch with proxy agent for EC2/FixieIP
        const nodeFetch = (await import('node-fetch')).default;
        const { HttpsProxyAgent } = await import('https-proxy-agent');
        const agent = new HttpsProxyAgent(proxyUrl);
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
      const upcloudIp = '95.111.223.107';
      
      if (proxyType === 'UpCloud') {
        proxyWorking = outboundIp === upcloudIp;
      } else if (proxyType === 'EC2') {
        proxyWorking = !outboundIp.startsWith('3.'); // Not a Vercel IP
      } else if (proxyType === 'FixieIP') {
        proxyWorking = fixieIps.includes(outboundIp);
      }
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
      let fetchUrl = 'https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi';
      let headers: Record<string, string> = {
        'Content-Type': 'text/xml; charset=utf-8',
      };
      
      // Use UpCloud proxy if configured
      if (proxyType === 'UpCloud' && proxyApiKey) {
        fetchUrl = proxyUrl;
        headers['x-api-key'] = proxyApiKey;
        
        response = await fetch(fetchUrl, {
          method: 'POST',
          headers,
          body: testXml,
        });
      } else if (proxyUrl && proxyType !== 'UpCloud') {
        // Use node-fetch with proxy agent for EC2/FixieIP
        const nodeFetch = (await import('node-fetch')).default;
        const { HttpsProxyAgent } = await import('https-proxy-agent');
        const agent = new HttpsProxyAgent(proxyUrl);
        // @ts-ignore
        response = await nodeFetch(fetchUrl, {
          method: 'POST',
          headers,
          body: testXml,
          agent,
        }) as unknown as Response;
      } else {
        response = await fetch(fetchUrl, {
          method: 'POST',
          headers,
          body: testXml,
        });
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
        expectedEC2IP: proxyType === 'EC2' ? 'Your EC2 IP' : 'N/A',
        expectedUpCloudIP: proxyType === 'UpCloud' ? '95.111.223.107' : 'N/A',
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