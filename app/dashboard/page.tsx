import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, DollarSign, Hotel, BedDouble } from "lucide-react"

// Import both real and fallback functions
import { getDashboardStats as getRealDashboardStats } from "@/lib/db-utils"
import { getDashboardStats as getFallbackDashboardStats } from "@/lib/fallback-db"

export const revalidate = 60 // Revalidate every 60 seconds

export default async function DashboardPage() {
  // Try to get real stats, fall back to dummy data if it fails
  let stats
  try {
    stats = await getRealDashboardStats()
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    stats = await getFallbackDashboardStats()
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <Hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRooms}</div>
            <p className="text-xs text-muted-foreground">{stats.availableRooms} available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <BedDouble className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.occupancyRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{stats.occupiedRooms} rooms occupied</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayCheckIns + stats.todayCheckOuts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.todayCheckIns} check-ins, {stats.todayCheckOuts} check-outs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenueThisMonth.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From {stats.totalBookings} bookings</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

