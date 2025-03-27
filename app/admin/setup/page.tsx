import { SystemStatus } from "@/components/admin/system-status"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SetupPage() {
  return (
    <div className="container mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">System Setup</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SystemStatus />

        <Card>
          <CardHeader>
            <CardTitle>Database Initialization</CardTitle>
            <CardDescription>Initialize your database with sample data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This will create sample rooms, guests, and bookings in your database. Only use this in development or when
              setting up a new system.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button asChild variant="outline">
              <Link href="/api/seed">Initialize Database</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/dashboard">Go to Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>Complete these steps to finish setting up your hotel management system</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Verify your database connection is working</li>
              <li>Initialize your database with sample data</li>
              <li>Create an admin user if you haven't already</li>
              <li>Configure your hotel settings</li>
              <li>Add your staff members</li>
              <li>Start managing your hotel!</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

