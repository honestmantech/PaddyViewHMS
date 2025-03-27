"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function DatabaseStatusPanel() {
  const [status, setStatus] = useState<{
    success: boolean
    message: string
    errorType?: string
    timestamp?: string
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const checkConnection = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/system/db-status")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      setStatus({
        success: false,
        message: "Failed to check database status",
        errorType: "API_ERROR",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  const getErrorHelp = (errorType?: string) => {
    switch (errorType) {
      case "CONNECTION_REFUSED":
        return "Make sure your database server is running and accessible from your application server."
      case "AUTHENTICATION_FAILED":
        return "Check your database username and password in the DATABASE_URL environment variable."
      case "DATABASE_NOT_FOUND":
        return "The specified database does not exist. You may need to create it first."
      case "CONNECTION_TIMEOUT":
        return "The connection timed out. Check network connectivity and firewall settings."
      default:
        return "Check your database configuration and ensure the database server is running."
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Connection Status</CardTitle>
        <CardDescription>Check if your application can connect to the database</CardDescription>
      </CardHeader>
      <CardContent>
        {status ? (
          <Alert variant={status.success ? "default" : "destructive"}>
            {status.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>{status.success ? "Connected" : "Connection Failed"}</AlertTitle>
            <AlertDescription>
              {status.message}
              {!status.success && status.errorType && (
                <div className="mt-2">
                  <p className="font-semibold">Troubleshooting:</p>
                  <p>{getErrorHelp(status.errorType)}</p>
                </div>
              )}
              {status.timestamp && (
                <p className="text-xs text-muted-foreground mt-2">
                  Last checked: {new Date(status.timestamp).toLocaleString()}
                </p>
              )}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="flex items-center justify-center h-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={checkConnection} disabled={loading} variant="outline" className="flex gap-2">
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Check Connection
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

