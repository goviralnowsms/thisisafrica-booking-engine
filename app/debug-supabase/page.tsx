"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Database, RefreshCw } from "lucide-react"

export default function DebugSupabasePage() {
  const [result, setResult] = useState<any>(null)
  const [testing, setTesting] = useState(false)

  const runDebug = async () => {
    setTesting(true)
    setResult(null)

    try {
      const response = await fetch("/api/debug-supabase")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        error: "Request failed",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setTesting(false)
    }
  }

  useEffect(() => {
    runDebug()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Supabase Debug</h1>
          <p className="text-gray-600">Diagnose Supabase connection issues</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Database className="w-6 h-6" />
              Connection Debug
            </CardTitle>
            <CardDescription>Detailed Supabase connection analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={runDebug} disabled={testing} className="w-full mb-4">
              {testing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Running Debug...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Run Debug Test
                </>
              )}
            </Button>

            {result && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gray-50">
                  <pre className="text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>
                </div>

                {result.error && (
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                    <h3 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Connection Issue Detected
                    </h3>
                    <div className="text-sm text-red-700 space-y-2">
                      <p>
                        <strong>Error:</strong> {result.error}
                      </p>
                      {result.details && (
                        <p>
                          <strong>Details:</strong> {result.details}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {result.status?.includes("✅") && (
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <h3 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Connection Successful
                    </h3>
                    <p className="text-sm text-green-700">Supabase is connected and working properly.</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            ← Back to Demo
          </Button>
        </div>
      </div>
    </div>
  )
}
