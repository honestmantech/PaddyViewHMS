// This file provides fallback data for when the database is not available
import { hash } from "bcryptjs"

// Fallback dashboard stats
export async function getDashboardStats() {
  return {
    totalRooms: 20,
    availableRooms: 15,
    occupiedRooms: 5,
    occupancyRate: 25,
    todayCheckIns: 2,
    todayCheckOuts: 3,
    totalGuests: 10,
    totalBookings: 15,
    revenueThisMonth: 5000,
  }
}

// Fallback user functions
export async function getUserByEmail(email: string) {
  if (email === "admin@hothotelms.com") {
    return {
      id: "1",
      name: "Admin User",
      email: "admin@hothotelms.com",
      password: await hash("admin123", 10),
      role: "ADMIN",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }
  return null
}

export async function validateCredentials(email: string, password: string) {
  // In a real app, you would check the password against the hashed password in the database
  if (email === "admin@hothotelms.com" && password === "admin123") {
    const user = await getUserByEmail(email)
    if (user) {
      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword
    }
  }
  return null
}

// Add more fallback functions as needed

