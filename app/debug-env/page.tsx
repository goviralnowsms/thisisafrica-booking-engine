"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"

interface EnvStatus {
  tourplan: {
    configured: boolean
    hasApiUrl: boolean
    hasUsername: boolean
    hasPassword: boolean
    hasAgentId: boolean
    hasProxy: boolean
    useProxy: boolean
  }
  urls: {
    appUrl: string
    hasAppUrl: boolean
    hasPublicAppUrl: boolean
  }
  database: {
    configured: boolean
    hasDatabaseUrl: boolean
    hasSupabaseUrl: boolean
    hasSupabaseKey: boolean
  }
  email: {
    configured: boolean
    hasResend: boolean
    hasSmtp: boolean
    emailFrom: string
  }
  stripe: {
    configured: boolean
    hasSecretKey: boolean
    hasPublishableKey: boolean
  }
  cache: {
    configured: boolean
    hasKvUrl: boolean
    hasKvToken: boolean
  }
  missing: string[]
  ready: boolean
}

export default function DebugEnvPage() {
  const [envStatus, setEnvStatus] = useState<EnvStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEnvStatus = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/debug-env")

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setEnvStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch environment status")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEnvStatus()
  }, [])

  const StatusIcon = ({ status }: { status: boolean }) => {
    return status ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Checking environment variables...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Environment Check Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchEnvStatus} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!envStatus) return null

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Environment Variables Status</h1>
          <p className="text-muted-foreground">Check your configuration and missing variables</p>
        </div>
        <Button onClick={fetchEnvStatus} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overall Status */}
      <Card className={envStatus.ready ? "border-green-200" : "border-red-200"}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StatusIcon status={envStatus.ready} />
            Overall Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant={envStatus.ready ? "default" : "destructive"}>
            {envStatus.ready ? "Ready for Production" : "Configuration Incomplete"}
          </Badge>
          {envStatus.missing.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-red-600 mb-2">Missing Variables:</h4>
              <ul className="list-disc list-inside space-y-1">
                {envStatus.missing.map((variable) => (
                  <li key={variable} className="text-red-600 text-sm">
                    {variable}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tourplan Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StatusIcon status={envStatus.tourplan.configured} />
              Tourplan API
            </CardTitle>
            <CardDescription>Tour booking integration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>API URL</span>
              <StatusIcon status={envStatus.tourplan.hasApiUrl} />
            </div>
            <div className="flex justify-between">
              <span>Username</span>
              <StatusIcon status={envStatus.tourplan.hasUsername} />
            </div>
            <div className="flex justify-between">
              <span>Password</span>
              <StatusIcon status={envStatus.tourplan.hasPassword} />
            </div>
            <div className="flex justify-between">
              <span>Agent ID</span>
              <StatusIcon status={envStatus.tourplan.hasAgentId} />
            </div>
            <div className="flex justify-between">
              <span>Proxy URL</span>
              <StatusIcon status={envStatus.tourplan.hasProxy} />
            </div>
            <div className="flex justify-between">
              <span>Use Proxy</span>
              <Badge variant={envStatus.tourplan.useProxy ? "default" : "secondary"}>
                {envStatus.tourplan.useProxy ? "Yes" : "No"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* App URLs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StatusIcon status={envStatus.urls.hasPublicAppUrl} />
              App URLs
            </CardTitle>
            <CardDescription>Application URLs for redirects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>APP_URL</span>
              <StatusIcon status={envStatus.urls.hasAppUrl} />
            </div>
            <div className="flex justify-between">
              <span>NEXT_PUBLIC_APP_URL</span>
              <StatusIcon status={envStatus.urls.hasPublicAppUrl} />
            </div>
            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
              <strong>Current URL:</strong> {envStatus.urls.appUrl}
            </div>
          </CardContent>
        </Card>

        {/* Database */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StatusIcon status={envStatus.database.configured} />
              Database
            </CardTitle>
            <CardDescription>Data storage configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>NEON_DATABASE_URL</span>
              <StatusIcon status={envStatus.database.hasDatabaseUrl} />
            </div>
            <div className="flex justify-between">
              <span>Supabase URL</span>
              <StatusIcon status={envStatus.database.hasSupabaseUrl} />
            </div>
            <div className="flex justify-between">
              <span>Supabase Key</span>
              <StatusIcon status={envStatus.database.hasSupabaseKey} />
            </div>
          </CardContent>
        </Card>

        {/* Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StatusIcon status={envStatus.email.configured} />
              Email Service
            </CardTitle>
            <CardDescription>Email notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Resend API</span>
              <StatusIcon status={envStatus.email.hasResend} />
            </div>
            <div className="flex justify-between">
              <span>SMTP Config</span>
              <StatusIcon status={envStatus.email.hasSmtp} />
            </div>
            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
              <strong>From Address:</strong> {envStatus.email.emailFrom}
            </div>
          </CardContent>
        </Card>

        {/* Stripe */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StatusIcon status={envStatus.stripe.configured} />
              Stripe Payments
            </CardTitle>
            <CardDescription>Payment processing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Secret Key</span>
              <StatusIcon status={envStatus.stripe.hasSecretKey} />
            </div>
            <div className="flex justify-between">
              <span>Publishable Key</span>
              <StatusIcon status={envStatus.stripe.hasPublishableKey} />
            </div>
          </CardContent>
        </Card>

        {/* Cache */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StatusIcon status={envStatus.cache.configured} />
              Redis Cache
            </CardTitle>
            <CardDescription>Performance optimization (optional)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>KV URL</span>
              <StatusIcon status={envStatus.cache.hasKvUrl} />
            </div>
            <div className="flex justify-between">
              <span>KV Token</span>
              <StatusIcon status={envStatus.cache.hasKvToken} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
