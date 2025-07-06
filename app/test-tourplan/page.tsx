"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestTourplanPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runTest = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-tourplan")
      const result = await response.json()
      setTestResult(result)
    } catch (error) {
      setTestResult({
        error: "Failed to run test",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Tourplan API Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={runTest} disabled={loading}>
            {loading ? "Testing..." : "Run Tourplan API Test"}
          </Button>

          {testResult && (
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded">
                <h3 className="font-semibold mb-2">Environment Check:</h3>
                <ul className="space-y-1">
                  <li>API URL: {testResult.environment?.hasApiUrl ? "✅ Set" : "❌ Missing"}</li>
                  <li>Username: {testResult.environment?.hasUsername ? "✅ Set" : "❌ Missing"}</li>
                  <li>Password: {testResult.environment?.hasPassword ? "✅ Set" : "❌ Missing"}</li>
                  <li>Agent ID: {testResult.environment?.hasAgentId ? "✅ Set" : "❌ Missing"}</li>
                </ul>
              </div>

              {testResult.connectionTest && (
                <div className="bg-gray-100 p-4 rounded">
                  <h3 className="font-semibold mb-2">Connection Test:</h3>
                  <p className={testResult.connectionTest.success ? "text-green-600" : "text-red-600"}>
                    {testResult.connectionTest.success ? "✅" : "❌"} {testResult.connectionTest.message}
                  </p>
                  {testResult.connectionTest.details && (
                    <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto">
                      {JSON.stringify(testResult.connectionTest.details, null, 2)}
                    </pre>
                  )}
                </div>
              )}

              {testResult.searchTest && (
                <div className="bg-gray-100 p-4 rounded">
                  <h3 className="font-semibold mb-2">Search Test:</h3>
                  <p className={testResult.searchTest.success ? "text-green-600" : "text-red-600"}>
                    {testResult.searchTest.success ? "✅" : "❌"} {testResult.searchTest.message}
                  </p>
                  {testResult.searchTest.details && (
                    <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-64">
                      {JSON.stringify(testResult.searchTest.details, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
