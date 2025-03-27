import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    // Simple query to test the connection
    const result = await prisma.$queryRaw`SELECT 1 as connected`

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      result,
    })
  } catch (error) {
    console.error("Database connection error:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

