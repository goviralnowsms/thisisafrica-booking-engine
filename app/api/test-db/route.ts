export async function GET() {
  try {
    console.log("=== Database Test Starting ===")

    // Check if environment variables exist
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY

    console.log("Environment check:", {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey,
      supabaseUrlLength: supabaseUrl?.length || 0,
      supabaseKeyLength: supabaseKey?.length || 0,
      urlPreview: supabaseUrl?.substring(0, 30) + "...",
    })

    if (!supabaseUrl || !supabaseKey) {
      return Response.json({
        success: false,
        status: "❌ Supabase environment variables not found",
        details: {
          SUPABASE_URL: !!supabaseUrl,
          SUPABASE_ANON_KEY: !!supabaseKey,
          message: "Please add Supabase integration in Vercel dashboard",
        },
      })
    }

    // Validate URL format
    if (!supabaseUrl.startsWith("https://") || !supabaseUrl.includes(".supabase.co")) {
      return Response.json({
        success: false,
        status: "❌ Invalid Supabase URL format",
        details: {
          url: supabaseUrl.substring(0, 30) + "...",
          expected: "https://your-project.supabase.co",
        },
      })
    }

    // Try to import Supabase with better error handling
    let createClient
    try {
      console.log("Importing Supabase client...")
      const supabaseModule = await import("@supabase/supabase-js")
      createClient = supabaseModule.createClient
      console.log("Supabase import successful")
    } catch (importError) {
      console.error("Supabase import failed:", importError)
      return Response.json({
        success: false,
        status: "❌ Supabase package not available",
        details: {
          error: importError instanceof Error ? importError.message : "Import failed",
          suggestion: "Check if @supabase/supabase-js is installed",
        },
      })
    }

    // Create Supabase client with timeout
    console.log("Creating Supabase client...")
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
      global: {
        fetch: (url, options = {}) => {
          return fetch(url, {
            ...options,
            signal: AbortSignal.timeout(10000), // 10 second timeout
          })
        },
      },
    })

    console.log("Testing database connection...")

    // Test with a simple query that should work even without tables
    const { data, error } = await supabase.from("customers").select("count", { count: "exact", head: true })

    if (error) {
      console.log("Query error:", error)

      // If it's a table not found error, that's actually good - connection works
      if (error.code === "42P01") {
        return Response.json({
          success: true,
          status: "✅ Database Connected - Tables Need Setup",
          details: {
            message: "Connection successful but tables don't exist yet",
            suggestion: "Run the table creation script in Supabase SQL Editor",
            timestamp: new Date().toISOString(),
          },
        })
      }

      return Response.json({
        success: false,
        status: `❌ Database Error: ${error.message}`,
        details: {
          code: error.code,
          hint: error.hint,
          details: error.details,
          suggestion: "Check your Supabase project status and permissions",
        },
      })
    }

    console.log("Database test successful!")
    return Response.json({
      success: true,
      status: "✅ Database Connected Successfully",
      details: {
        timestamp: new Date().toISOString(),
        tablesFound: true,
        message: "All systems operational",
      },
    })
  } catch (err) {
    console.error("Database test error:", err)

    // More specific error handling
    let errorMessage = "Unknown error"
    let suggestion = "Check your network connection and Supabase configuration"

    if (err instanceof Error) {
      errorMessage = err.message

      if (err.message.includes("fetch failed")) {
        suggestion = "Network connectivity issue - check if Supabase project is accessible"
      } else if (err.message.includes("timeout")) {
        suggestion = "Request timed out - Supabase may be slow or unreachable"
      } else if (err.message.includes("ENOTFOUND")) {
        suggestion = "DNS resolution failed - check Supabase URL"
      }
    }

    return Response.json({
      success: false,
      status: `❌ Connection Error: ${errorMessage}`,
      details: {
        error: errorMessage,
        suggestion,
        timestamp: new Date().toISOString(),
        troubleshooting: [
          "1. Check if Supabase project is active (not paused)",
          "2. Verify Supabase integration in Vercel dashboard",
          "3. Check Supabase project billing status",
          "4. Try redeploying the application",
        ],
      },
    })
  }
}
