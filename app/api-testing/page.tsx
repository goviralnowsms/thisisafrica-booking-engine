"use client"

import { useState, useEffect } from "react"

interface TestResult {
  test: string
  success: boolean
  message: string
  timestamp: string
  responseTime?: number
}

interface StatusState {
  server: "online" | "offline" | "unknown"
  proxy: "working" | "error" | "unknown"
  api: "working" | "error" | "unknown"
  auth: "success" | "failed" | "not-tested"
}

export default function APITestingDashboard() {
  const [status, setStatus] = useState<StatusState>({
    server: "unknown",
    proxy: "unknown",
    api: "unknown",
    auth: "not-tested",
  })

  const [logs, setLogs] = useState<string[]>([])
  const [testResults, setTestResults] = useState<{ [key: string]: TestResult | null }>({})
  const [config, setConfig] = useState({
    baseUrl: "http://localhost:3000",
    useMocks: false,
    useProxy: true, // Default to using proxy
    timeout: 30000,
  })

  // Sample data templates
  const sampleData = {
    search: {
      destination: "Cape Town",
      country: "South Africa",
      tourLevel: "standard",
      startDate: "2024-07-01",
      endDate: "2024-07-03",
      adults: 2,
      children: 0,
    },
    availability: {
      tourId: "tour-001",
      date: "2024-07-01",
      adults: 2,
      children: 0,
    },
    booking: {
      tourId: "tour-001",
      startDate: "2024-07-01",
      endDate: "2024-07-03",
      adults: 2,
      children: 0,
      selectedExtras: ["extra-001"],
      customerDetails: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+27123456789",
        address: "123 Main St, Cape Town",
      },
      createAsProvisional: true,
    },
    payment: {
      amount: 150000,
      currency: "ZAR",
      bookingId: "booking-001",
      paymentMethod: "card",
    },
    tourplanOptionInfo: {
      old: {
        buttonName: "SAMAGT",
        destinationName: "Cape Town",
        info: "G",
      },
      new: {
        opt: "SAMAGT",
        info: "GS",
        dateFrom: "2024-07-01",
        dateTo: "2024-07-05",
        roomConfigs: [
          {
            adults: 2,
            roomType: "DB",
          },
        ],
      },
      generalSearch: {
        opt: "SAMAGT",
        info: "GS",
      },
      stayPricing: {
        opt: "SAMAGT",
        info: "S",
        dateFrom: "2024-07-01",
        dateTo: "2024-07-05",
        roomConfigs: [
          {
            adults: 2,
            roomType: "DB",
          },
        ],
      },
      availability: {
        opt: "SAMAGT",
        info: "A",
        dateFrom: "2024-07-01",
        dateTo: "2024-07-05",
        roomConfigs: [
          {
            adults: 2,
            roomType: "DB",
          },
        ],
      },
      rates: {
        opt: "SAMAGT",
        info: "R",
        dateFrom: "2024-07-01",
        dateTo: "2024-07-05",
        roomConfigs: [
          {
            adults: 2,
            roomType: "DB",
          },
        ],
      },
    },
  }

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString()
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`])
  }

  const checkServerStatus = async () => {
    try {
      const response = await fetch("/api/test-db")
      if (response.ok) {
        setStatus((prev) => ({ ...prev, server: "online" }))
        addLog("✅ Local server is online")
      } else {
        throw new Error(`Server responded with ${response.status}`)
      }
    } catch (error) {
      setStatus((prev) => ({ ...prev, server: "offline" }))
      addLog(`❌ Local server check failed: ${error}`)
    }
  }

  const testProxy = async () => {
    try {
      addLog("🔄 Testing AWS Lambda proxy...")
      const response = await fetch("/api/test-proxy", { method: "POST" })
      const data = await response.json()

      if (response.ok && data.success) {
        setStatus((prev) => ({ ...prev, proxy: "working" }))
        addLog("✅ AWS Lambda proxy is working")

        // Check if we got a successful Tourplan response
        if (data.response?.success) {
          setStatus((prev) => ({ ...prev, api: "working", auth: "success" }))
          addLog("✅ Tourplan API accessible through proxy")
        } else {
          addLog(`⚠️ Proxy works but Tourplan returned: ${data.response?.error || "Unknown error"}`)
        }
      } else {
        throw new Error(data.error || "Proxy test failed")
      }
    } catch (error) {
      setStatus((prev) => ({ ...prev, proxy: "error" }))
      addLog(`❌ Proxy test failed: ${error}`)
    }
  }

  const makeRequest = async (endpoint: string, method: string, payload?: any) => {
    const testKey = endpoint.replace(/\//g, "-").replace(/^-/, "")

    try {
      addLog(`🔄 ${method} ${endpoint} - Request started`)

      const options: RequestInit = {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
      }

      if (payload && method !== "GET") {
        options.body = JSON.stringify(payload)
      }

      const startTime = Date.now()
      const response = await fetch(endpoint, options)
      const endTime = Date.now()
      const duration = endTime - startTime

      const data = await response.text()
      let parsedData

      try {
        parsedData = JSON.parse(data)
      } catch (e) {
        parsedData = data
      }

      const result: TestResult = {
        test: endpoint,
        success: response.ok,
        message: response.ok ? "Success" : `Error ${response.status}`,
        timestamp: new Date().toISOString(),
        responseTime: duration,
      }

      setTestResults((prev) => ({ ...prev, [testKey]: result }))

      if (response.ok) {
        addLog(`✅ ${method} ${endpoint} - Success (${response.status}) in ${duration}ms`)
      } else {
        addLog(`❌ ${method} ${endpoint} - Error (${response.status}) in ${duration}ms`)
      }

      return { success: response.ok, data: parsedData, status: response.status }
    } catch (error) {
      const result: TestResult = {
        test: endpoint,
        success: false,
        message: `Network error: ${error}`,
        timestamp: new Date().toISOString(),
      }

      setTestResults((prev) => ({ ...prev, [testKey]: result }))
      addLog(`❌ ${method} ${endpoint} - Network error: ${error}`)

      return { success: false, error: error }
    }
  }

  const testDatabase = () => makeRequest("/api/test-db", "GET")
  const testTourSearch = (payload: any) => makeRequest("/api/tours/search", "POST", payload)
  const testAvailability = (payload: any) => makeRequest("/api/tours/availability", "POST", payload)
  const testCreateBooking = (payload: any) => makeRequest("/api/bookings/create", "POST", payload)
  const testPayment = (payload: any) => makeRequest("/api/payments/process", "POST", payload)
  const testTourplanOptionInfo = (payload: any) => makeRequest("/api/tourplan/option-info", "POST", payload)

  const clearLogs = () => {
    setLogs([])
    addLog("Dashboard initialized")
  }

  const exportLogs = () => {
    const logsText = logs.join("\n")
    const blob = new Blob([logsText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `tourplan-api-test-logs-${new Date().toISOString().slice(0, 19)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    addLog("📁 Logs exported to file")
  }

  useEffect(() => {
    checkServerStatus()
    addLog("Dashboard initialized")
  }, [])

  const getStatusColor = (statusType: keyof StatusState) => {
    const statusValue = status[statusType]
    switch (statusValue) {
      case "online":
      case "working":
      case "success":
        return "bg-green-500"
      case "offline":
      case "error":
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (statusType: keyof StatusState) => {
    const statusValue = status[statusType]
    switch (statusType) {
      case "server":
        return statusValue === "online"
          ? "Online and ready"
          : statusValue === "offline"
            ? "Offline or unreachable"
            : "Checking..."
      case "proxy":
        return statusValue === "working" ? "AWS proxy working" : statusValue === "error" ? "Proxy failed" : "Not tested"
      case "api":
        return statusValue === "working" ? "Tourplan accessible" : statusValue === "error" ? "API failed" : "Not tested"
      case "auth":
        return statusValue === "success" ? "Authenticated" : statusValue === "failed" ? "Failed" : "Not tested"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🧪 Tourplan API Testing Dashboard</h1>
          <p className="text-gray-600 text-lg">
            Comprehensive testing interface for Tourplan HostConnect API integration via AWS Lambda Proxy
          </p>
        </div>

        {/* Status Panel */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { key: "server" as keyof StatusState, title: "Local Server" },
              { key: "proxy" as keyof StatusState, title: "AWS Lambda Proxy" },
              { key: "api" as keyof StatusState, title: "Tourplan API" },
              { key: "auth" as keyof StatusState, title: "Authentication" },
            ].map(({ key, title }) => (
              <div key={key} className={`p-4 rounded-xl text-white text-center ${getStatusColor(key)}`}>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-sm opacity-90">{getStatusText(key)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">API Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API URL:</label>
              <input
                type="text"
                value={config.baseUrl}
                onChange={(e) => setConfig((prev) => ({ ...prev, baseUrl: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Use Mock Data:</label>
              <select
                value={config.useMocks.toString()}
                onChange={(e) => setConfig((prev) => ({ ...prev, useMocks: e.target.value === "true" }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="true">Yes (Mock Data)</option>
                <option value="false">No (Live API)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Use AWS Proxy:</label>
              <select
                value={config.useProxy.toString()}
                onChange={(e) => setConfig((prev) => ({ ...prev, useProxy: e.target.value === "true" }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="true">Yes (AWS Lambda)</option>
                <option value="false">No (Direct)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timeout (ms):</label>
              <input
                type="number"
                value={config.timeout}
                onChange={(e) => setConfig((prev) => ({ ...prev, timeout: Number.parseInt(e.target.value) }))}
                min="5000"
                max="60000"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* API Tests Panel */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">
              API Endpoint Tests
            </h2>

            {/* Proxy Test */}
            <div className="mb-6 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">POST</span>
                AWS Lambda Proxy Test
              </h3>
              <p className="text-gray-600 mb-3">Test the AWS Lambda proxy connection to Tourplan</p>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={testProxy}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Test Proxy
                </button>
              </div>
              {testResults["api-test-proxy"] && (
                <div
                  className={`p-3 rounded-lg text-sm font-mono ${
                    testResults["api-test-proxy"].success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {testResults["api-test-proxy"].success ? "✅" : "❌"} {testResults["api-test-proxy"].message}
                  {testResults["api-test-proxy"].responseTime && ` (${testResults["api-test-proxy"].responseTime}ms)`}
                </div>
              )}
            </div>

            {/* Database Test */}
            <div className="mb-6 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">GET</span>
                Database Connection
              </h3>
              <p className="text-gray-600 mb-3">Test database connectivity and health check</p>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={testDatabase}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Test Database
                </button>
              </div>
              {testResults["api-test-db"] && (
                <div
                  className={`p-3 rounded-lg text-sm font-mono ${
                    testResults["api-test-db"].success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {testResults["api-test-db"].success ? "✅" : "❌"} {testResults["api-test-db"].message}
                  {testResults["api-test-db"].responseTime && ` (${testResults["api-test-db"].responseTime}ms)`}
                </div>
              )}
            </div>

            {/* Tour Search Test */}
            <div className="mb-6 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">POST</span>
                Tour Search
              </h3>
              <p className="text-gray-600 mb-3">Search for tours based on criteria</p>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => testTourSearch(sampleData.search)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Search Tours
                </button>
              </div>
              {testResults["api-tours-search"] && (
                <div
                  className={`p-3 rounded-lg text-sm font-mono ${
                    testResults["api-tours-search"].success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {testResults["api-tours-search"].success ? "✅" : "❌"} {testResults["api-tours-search"].message}
                  {testResults["api-tours-search"].responseTime &&
                    ` (${testResults["api-tours-search"].responseTime}ms)`}
                </div>
              )}
            </div>

            {/* Tourplan OptionInfo Tests */}
            <div className="mb-6 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">POST</span>
                Tourplan OptionInfo Tests
              </h3>
              <p className="text-gray-600 mb-3">Test Tourplan HostConnect OptionInfo requests via proxy</p>

              {/* Format Tests */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-600 mb-2">Format Tests:</h4>
                <div className="flex gap-2 mb-2 flex-wrap">
                  <button
                    onClick={() => testTourplanOptionInfo(sampleData.tourplanOptionInfo.old)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                  >
                    Old Format (ButtonName)
                  </button>
                  <button
                    onClick={() => testTourplanOptionInfo(sampleData.tourplanOptionInfo.new)}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                  >
                    New Format (Opt)
                  </button>
                </div>
              </div>

              {/* Info Type Tests */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-600 mb-2">Info Type Tests:</h4>
                <div className="flex gap-2 mb-2 flex-wrap">
                  <button
                    onClick={() => testTourplanOptionInfo(sampleData.tourplanOptionInfo.generalSearch)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                  >
                    General Search (GS)
                  </button>
                  <button
                    onClick={() => testTourplanOptionInfo(sampleData.tourplanOptionInfo.stayPricing)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                  >
                    Stay Pricing (S)
                  </button>
                  <button
                    onClick={() => testTourplanOptionInfo(sampleData.tourplanOptionInfo.availability)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                  >
                    Availability (A)
                  </button>
                  <button
                    onClick={() => testTourplanOptionInfo(sampleData.tourplanOptionInfo.rates)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                  >
                    Rates (R)
                  </button>
                </div>
              </div>

              {testResults["api-tourplan-option-info"] && (
                <div
                  className={`p-3 rounded-lg text-sm font-mono ${
                    testResults["api-tourplan-option-info"].success
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {testResults["api-tourplan-option-info"].success ? "✅" : "❌"}{" "}
                  {testResults["api-tourplan-option-info"].message}
                  {testResults["api-tourplan-option-info"].responseTime &&
                    ` (${testResults["api-tourplan-option-info"].responseTime}ms)`}
                </div>
              )}
            </div>
          </div>

          {/* Booking Tests Panel */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">
              Booking & Payment Tests
            </h2>

            {/* Create Booking Test */}
            <div className="mb-6 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">POST</span>
                Create Booking
              </h3>
              <p className="text-gray-600 mb-3">Create a new tour booking</p>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => testCreateBooking(sampleData.booking)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Create Booking
                </button>
              </div>
              {testResults["api-bookings-create"] && (
                <div
                  className={`p-3 rounded-lg text-sm font-mono ${
                    testResults["api-bookings-create"].success
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {testResults["api-bookings-create"].success ? "✅" : "❌"}{" "}
                  {testResults["api-bookings-create"].message}
                  {testResults["api-bookings-create"].responseTime &&
                    ` (${testResults["api-bookings-create"].responseTime}ms)`}
                </div>
              )}
            </div>

            {/* Payment Test */}
            <div className="mb-6 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">POST</span>
                Process Payment
              </h3>
              <p className="text-gray-600 mb-3">Process payment for a booking</p>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => testPayment(sampleData.payment)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Process Payment
                </button>
              </div>
              {testResults["api-payments-process"] && (
                <div
                  className={`p-3 rounded-lg text-sm font-mono ${
                    testResults["api-payments-process"].success
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {testResults["api-payments-process"].success ? "✅" : "❌"}{" "}
                  {testResults["api-payments-process"].message}
                  {testResults["api-payments-process"].responseTime &&
                    ` (${testResults["api-payments-process"].responseTime}ms)`}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mb-6 p-4 border-2 border-gray-200 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Quick Actions</h3>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={checkServerStatus}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Refresh Status
                </button>
                <button
                  onClick={() => {
                    testProxy()
                    testDatabase()
                    testTourSearch(sampleData.search)
                    testTourplanOptionInfo(sampleData.tourplanOptionInfo.new)
                  }}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Run All Tests
                </button>
                <button
                  onClick={() => {
                    testTourplanOptionInfo(sampleData.tourplanOptionInfo.old)
                    testTourplanOptionInfo(sampleData.tourplanOptionInfo.new)
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Test Tourplan API
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Logs Panel */}
        <div className="bg-gray-900 text-green-400 rounded-2xl shadow-xl p-6 mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">📋 Test Logs</h2>
            <div className="flex gap-2">
              <button
                onClick={clearLogs}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Clear Logs
              </button>
              <button
                onClick={exportLogs}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Export Logs
              </button>
            </div>
          </div>
          <div className="font-mono text-sm max-h-80 overflow-y-auto bg-black p-4 rounded-lg">
            {logs.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
