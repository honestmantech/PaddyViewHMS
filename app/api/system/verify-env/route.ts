import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    // Check environment variables
    const envStatus = {
      database: !!process.env.DATABASE_URL,
      jwt: !!process.env.JWT_SECRET,
    }

    // Test database connection
    let dbConnected = false
    try {
      await prisma.$queryRaw`SELECT 1 as result`
      dbConnected = true
    } catch (error) {
      console.error("Database connection error:", error)
    }

    return NextResponse.json({
      status: "success",
      environment: envStatus,
      database: {
        connected: dbConnected,
        message: dbConnected ? "Database connection successful" : "Database connection failed",
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Environment verification error:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "Failed to verify environment",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

