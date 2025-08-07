'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function TestRateIdPage() {
  const [productCode, setProductCode] = useState('NBOGTARP001CKSE')
  const [dateFrom, setDateFrom] = useState('2025-08-01')
  const [debugResults, setDebugResults] = useState<any>(null)
  const [testResults, setTestResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runDebug = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/tourplan/debug-rateid?productCode=${productCode}&dateFrom=${dateFrom}`)
      const data = await response.json()
      setDebugResults(data)
    } catch (error) {
      console.error('Debug error:', error)
    } finally {
      setLoading(false)
    }
  }

  const runTest = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/tourplan/test-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productCode, dateFrom })
      })
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      console.error('Test error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">TourPlan RateId Debugger</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
            <CardDescription>Configure the product and date for testing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Code</label>
              <Input
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                placeholder="e.g., NBOGTARP001CKSE"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date From</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <Button onClick={runDebug} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Debug RateId Extraction
              </Button>
              <Button onClick={runTest} disabled={loading} variant="secondary">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Test RateId Values
              </Button>
            </div>
          </CardContent>
        </Card>

        {debugResults && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Debug Results</CardTitle>
              <CardDescription>RateId extraction from different Info types</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-x-auto bg-gray-100 p-4 rounded">
                {JSON.stringify(debugResults, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {testResults && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>Testing different RateId values</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-x-auto bg-gray-100 p-4 rounded">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}