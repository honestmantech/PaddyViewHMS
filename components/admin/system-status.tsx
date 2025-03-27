"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, RefreshCw, Database, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SystemStatus {
  status: string
  environment: {
    database: boolean
    jwt: boolean
  }
  database: {
    connected: boolean
    message: string
  }
  timestamp: string
}

export function SystemStatus() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(false)

  const checkStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/system/verify-env")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("Error checking system status:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
        <CardDescription>Verify your system configuration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Alert variant={status.environment.database ? "default" : "destructive"}>
                <Database className="h-4 w-4" />
                <AlertTitle>DATABASE_URL</AlertTitle>
                <AlertDescription>
                  {status.environment.database ? "Environment variable is set" : "Environment variable is missing"}
                </AlertDescription>
              </Alert>

              <Alert variant={status.environment.jwt ? "default" : "destructive"}>
                <Key className="h-4 w-4" />
                <AlertTitle>JWT_SECRET</AlertTitle>
                <AlertDescription>
                  {status.environment.jwt ? "Environment variable is set" : "Environment variable is missing"}
                </AlertDescription>
              </Alert>
            </div>

            <Alert variant={status.database.connected ? "default" : "destructive"}>
              {status.database.connected ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>Database Connection</AlertTitle>
              <AlertDescription>
                {status.database.message}
                {status.timestamp && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Last checked: {new Date(status.timestamp).toLocaleString()}
                  </p>
                )}
              </AlertDescription>
            </Alert>
          </>
        ) : (
          <div className="flex items-center justify-center h-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={checkStatus} disabled={loading} variant="outline" className="flex gap-2">
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Refresh Status
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

