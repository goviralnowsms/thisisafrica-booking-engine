import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  return NextResponse.json({
    tourplan: {
      apiUrl: process.env.TOURPLAN_API_URL,
      username: process.env.TOURPLAN_USERNAME,
      password: process.env.TOURPLAN_PASSWORD ? "[SET]" : "[MISSING]",
      agentId: process.env.TOURPLAN_AGENT_ID,
      proxyUrl: process.env.TOURPLAN_PROXY_URL,
      useProxy: process.env.USE_TOURPLAN_PROXY,
    },
    allEnvVars: Object.keys(process.env).filter(key => key.includes('TOURPLAN')),
    timestamp: new Date().toISOString(),
  })
}
