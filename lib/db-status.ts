import { prisma } from "./db"

export async function checkDatabaseConnection() {
  try {
    // Execute a simple query to check connection
    await prisma.$queryRaw`SELECT 1`
    return { connected: true, message: "Database connection successful" }
  } catch (error) {
    console.error("Database connection error:", error)
    return {
      connected: false,
      message: "Database connection failed",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

