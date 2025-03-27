// A simple health check endpoint to verify the API is working
import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    // Don't expose sensitive information
    config: {
      databaseConfigured: !!process.env.DATABASE_URL,
      jwtConfigured: !!process.env.JWT_SECRET,
    },
  })
}

