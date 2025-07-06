// Force Node.js runtime
export const runtime = "nodejs"

import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("=== XML DEBUG TEST (Node.js Runtime) ===")

    const testXML = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>SAMAGT</AgentID>
    <Password>S@MAgt01</Password>
    <ButtonName>Day Tours</ButtonName>
    <DestinationName>Cape Town</DestinationName>
    <Info>G</Info>
  </OptionInfoRequest>
</Request>`

    console.log("Sending XML:", testXML)

    const response = await fetch("https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi", {
      method: "POST",
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        Accept: "application/xml, text/xml",
        "User-Agent": "BookingEngine/1.0",
      },
      body: testXML,
    })

    const responseText = await response.text()

    return NextResponse.json({
      success: true,
      runtime: "nodejs",
      request: {
        url: "https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi",
        method: "POST",
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          Accept: "application/xml, text/xml",
          "User-Agent": "BookingEngine/1.0",
        },
        body: testXML,
      },
      response: {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseText,
        bodyLength: responseText.length,
      },
    })
  } catch (error) {
    console.error("Debug test failed:", error)
    return NextResponse.json(
      {
        error: "Debug test failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
