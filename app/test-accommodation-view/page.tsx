'use client'

import { useState, useEffect } from 'react'

function TestAccommodationView() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/test-accommodation-direct?code=CPTACPOR002PORTST')
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="p-8">Loading accommodation data...</div>

  const workingResult = data?.results?.find((r: any) => r.optionCount > 0)

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Accommodation Test View</h1>
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold">Product Code: CPTACPOR002PORTST</h2>
        <p className="text-sm text-gray-600">The Portswood Hotel, Cape Town</p>
      </div>

      {workingResult ? (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <h3 className="font-semibold text-green-800">✅ Working Method: {workingResult.testName}</h3>
            <p className="text-sm text-green-700">Found {workingResult.optionCount} result(s)</p>
            {workingResult.hasSupplierData && <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">Has Hotel Data</span>}
            {workingResult.hasRoomData && <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Has Room Data</span>}
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-semibold mb-2">Raw XML Response (First 1000 chars):</h4>
            <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-60">
              {workingResult.xmlResponse}
            </pre>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 p-4 rounded">
          <p className="text-red-800">No working accommodation data found</p>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">All Test Results:</h3>
        <div className="space-y-2">
          {data?.results?.map((result: any, index: number) => (
            <div key={index} className={`p-3 rounded border ${result.optionCount > 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex justify-between items-center">
                <span className="font-medium">{result.testName}</span>
                <span className={`px-2 py-1 rounded text-xs ${result.optionCount > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {result.optionCount} results
                </span>
              </div>
              {result.hasError && <p className="text-red-600 text-sm mt-1">Error: {result.errorMessage}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <TestAccommodationView />
    </div>
  )
}