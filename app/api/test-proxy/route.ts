import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const proxyUrl = process.env.TOURPLAN_PROXY_URL

    if (!proxyUrl) {
      return NextResponse.json({ success: false, error: "TOURPLAN_PROXY_URL not configured" }, { status: 500 })
    }

    // Test the proxy with a simple OptionInfo request
    const testXml = `<?xml version="1.0" encoding="UTF-8"?>
<HostConnectRequest>
  <AgentID>${process.env.TOURPLAN_AGENT_ID || "SAMAGT"}</AgentID>
  <Request>
    <OptionInfoRequest>
      <Opt>SAMAGT</Opt>
      <Info>GS</Info>
    </OptionInfoRequest>
  </Request>
</HostConnectRequest>`

    const response = await fetch(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        xmlBody: testXml,
        targetUrl: process.env.TOURPLAN_API_URL,
        agentId: process.env.TOURPLAN_AGENT_ID,
      }),
    })

    const data = await response.text()

    return NextResponse.json({
      success: response.ok,
      response: {
        success: response.ok,
        status: response.status,
        data: data.substring(0, 500) + (data.length > 500 ? "..." : ""),
        error: response.ok ? null : `HTTP ${response.status}`,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: `Proxy test failed: ${error}` }, { status: 500 })
  }
}
