import { NextResponse } from "next/server"

export function handleApiError(error: unknown, context: string) {
  console.error(`Error in ${context}:`, error)

  // Determine if this is a database-related error
  const isDatabaseError =
    error instanceof Error &&
    (error.message.includes("prisma") ||
      error.message.includes("database") ||
      error.message.includes("connection") ||
      error.message.includes("ECONNREFUSED"))

  // Create appropriate error message
  let errorMessage = "An unexpected error occurred"
  let statusCode = 500

  if (isDatabaseError) {
    errorMessage = "Database error occurred"
  } else if (error instanceof Error) {
    errorMessage = error.message

    // Handle specific error types
    if (error.message.includes("not found")) {
      statusCode = 404
    } else if (error.message.includes("unauthorized") || error.message.includes("not authorized")) {
      statusCode = 401
    } else if (error.message.includes("forbidden")) {
      statusCode = 403
    } else if (error.message.includes("validation") || error.message.includes("invalid")) {
      statusCode = 400
    }
  }

  // Return formatted error response
  return NextResponse.json(
    {
      error: errorMessage,
      context,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode },
  )
}

