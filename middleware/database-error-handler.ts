import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function databaseErrorMiddleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add a response header to track database errors
  response.headers.set("x-db-error-handled", "true")

  try {
    // Continue with the request
    return response
  } catch (error) {
    console.error("Database error in middleware:", error)

    // If this is a database error, return a 503 Service Unavailable
    if (
      error instanceof Error &&
      (error.message.includes("database") || error.message.includes("prisma") || error.message.includes("connection"))
    ) {
      return new NextResponse(
        JSON.stringify({
          error: "Database service unavailable",
          message: "We are experiencing database issues. Please try again later.",
        }),
        {
          status: 503,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "30",
          },
        },
      )
    }

    // For other errors, rethrow
    throw error
  }
}

