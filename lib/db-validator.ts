import { prisma } from "./db"

export async function validateDatabaseConnection() {
  try {
    // Test the connection with a simple query
    await prisma.$queryRaw`SELECT 1 as result`
    return { success: true, message: "Database connection successful" }
  } catch (error) {
    console.error("Database validation error:", error)

    // Determine the specific error type
    let errorMessage = "Unknown database error"
    let errorType = "UNKNOWN_ERROR"

    if (error instanceof Error) {
      errorMessage = error.message

      // Identify common error patterns
      if (errorMessage.includes("ECONNREFUSED")) {
        errorType = "CONNECTION_REFUSED"
      } else if (errorMessage.includes("authentication failed")) {
        errorType = "AUTHENTICATION_FAILED"
      } else if (errorMessage.includes("does not exist")) {
        errorType = "DATABASE_NOT_FOUND"
      } else if (errorMessage.includes("timeout")) {
        errorType = "CONNECTION_TIMEOUT"
      }
    }

    return {
      success: false,
      message: errorMessage,
      errorType,
      timestamp: new Date().toISOString(),
    }
  }
}

