import { NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function GET() {
  try {
    // Test the connection with a simple query
    const { data, error } = await supabase.from("rooms").select("id").limit(1)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      timestamp: new Date().toISOString(),
    })
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

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        errorType,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

