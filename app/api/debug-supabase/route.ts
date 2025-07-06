export async function GET() {
  try {
    console.log("=== Supabase Debug Info ===")

    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY

    console.log("Environment variables:")
    console.log("- SUPABASE_URL exists:", !!supabaseUrl)
    console.log("- SUPABASE_ANON_KEY exists:", !!supabaseKey)
    console.log("- URL format:", supabaseUrl?.substring(0, 30) + "...")
    console.log("- Key format:", supabaseKey?.substring(0, 20) + "...")

    if (!supabaseUrl || !supabaseKey) {
      return Response.json({
        error: "Missing Supabase credentials",
        details: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
        },
      })
    }

    // Try to import and create client
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log("Supabase client created successfully")

    // Test with a simple query that doesn't require tables
    const { data, error } = await supabase.rpc("version")

    if (error) {
      console.log("RPC version error:", error)

      // Try a different approach - just test auth
      const { data: authData, error: authError } = await supabase.auth.getSession()

      return Response.json({
        status: "Connection test",
        rpcError: error.message,
        authTest: authError ? authError.message : "Auth accessible",
        suggestion: "The connection works but may need proper table setup",
      })
    }

    return Response.json({
      status: "✅ Supabase connection successful",
      version: data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Supabase debug error:", error)
    return Response.json({
      error: "Debug failed",
      details: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
