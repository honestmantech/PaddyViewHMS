"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function DatabaseStatus() {
  const [status, setStatus] = useState<{
    connected: boolean
    message: string
    error?: string
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const checkConnection = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/db-status")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      setStatus({
        connected: false,
        message: "Failed to check database status",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Connection Status</CardTitle>
        <CardDescription>Check if your application can connect to the database</CardDescription>
      </CardHeader>
      <CardContent>
        {status ? (
          <Alert variant={status.connected ? "default" : "destructive"}>
            {status.connected ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>{status.connected ? "Connected" : "Connection Failed"}</AlertTitle>
            <AlertDescription>
              {status.message}
              {status.error && <div className="mt-2 text-sm font-mono bg-muted p-2 rounded">{status.error}</div>}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="flex items-center justify-center h-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={checkConnection} disabled={loading}>
          {loading ? "Checking..." : "Check Connection Again"}
        </Button>
      </CardFooter>
    </Card>
  )
}

