"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Database, RefreshCw, ExternalLink } from "lucide-react"

interface TestResult {
  success: boolean
  status: string
  details?: any
}

export default function DatabaseTestPage() {
  const [result, setResult] = useState<TestResult | null>(null)
  const [testing, setTesting] = useState(false)

  const runTest = async () => {
    setTesting(true)
    setResult(null)

    try {
      const response = await fetch("/api/test-db", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        status: `❌ Request Failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        details: {
          error: error instanceof Error ? error.message : "Unknown error",
          suggestion: "Check if the API route is working",
          troubleshooting: [
            "1. Try refreshing the page",
            "2. Check Vercel deployment logs",
            "3. Verify Supabase project is active",
          ],
        },
      })
    } finally {
      setTesting(false)
    }
  }

  useEffect(() => {
    runTest()
  }, [])

  const getStatusIcon = () => {
    if (testing) return <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
    if (!result) return <Database className="w-6 h-6 text-gray-500" />
    return result.success ? (
      <CheckCircle className="w-6 h-6 text-green-500" />
    ) : (
      <XCircle className="w-6 h-6 text-red-500" />
    )
  }

  const getStatusBadge = () => {
    if (testing) return <Badge className="bg-blue-100 text-blue-800">Testing...</Badge>
    if (!result) return <Badge variant="secondary">Ready</Badge>
    return result.success ? (
      <Badge className="bg-green-100 text-green-800">Success</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Error</Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Connection Test</h1>
          <p className="text-gray-600">Diagnose your Supabase integration</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {getStatusIcon()}
              Database Status
              {getStatusBadge()}
            </CardTitle>
            <CardDescription>Testing connection to Supabase database and table structure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={runTest} disabled={testing} className="w-full" size="lg">
                {testing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testing Connection...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 mr-2" />
                    Test Database Connection
                  </>
                )}
              </Button>

              {result && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gray-50">
                    <h3 className="font-medium mb-2">Status</h3>
                    <p className={result.success ? "text-green-700" : "text-red-700"}>{result.status}</p>
                  </div>

                  {result.details && (
                    <div className="p-4 rounded-lg bg-gray-50">
                      <h3 className="font-medium mb-2">Details</h3>
                      {result.details.message && <p className="text-sm mb-2">{result.details.message}</p>}
                      {result.details.suggestion && (
                        <p className="text-sm text-blue-600 mb-2">
                          <strong>Suggestion:</strong> {result.details.suggestion}
                        </p>
                      )}
                      {result.details.troubleshooting && (
                        <div className="text-sm">
                          <strong>Troubleshooting Steps:</strong>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            {result.details.troubleshooting.map((step: string, index: number) => (
                              <li key={index}>{step}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {!result.success && (
                    <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                      <h3 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Quick Fixes
                      </h3>
                      <div className="text-sm text-yellow-700 space-y-2">
                        <p>
                          1. <strong>Check Supabase Project:</strong> Make sure it's active and not paused
                        </p>
                        <p>
                          2. <strong>Verify Integration:</strong> Check Vercel dashboard → Settings → Integrations
                        </p>
                        <p>
                          3. <strong>Redeploy:</strong> Try redeploying your application
                        </p>
                        <div className="mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open("https://vercel.com/dashboard", "_blank")}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open Vercel Dashboard
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {result.success && result.status.includes("Tables Need Setup") && (
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <h3 className="font-medium text-blue-800 mb-2">Next Step</h3>
                      <p className="text-sm text-blue-700 mb-3">
                        Connection successful! Now create the database tables in Supabase SQL Editor.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Supabase Dashboard
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-x-4">
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            ← Back to Demo
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/debug-supabase")}>
            Advanced Debug
          </Button>
        </div>
      </div>
    </div>
  )
}
