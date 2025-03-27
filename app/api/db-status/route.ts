import { NextResponse } from "next/server"
import { checkDatabaseConnection } from "@/lib/db-status"

export async function GET() {
  const status = await checkDatabaseConnection()

  if (status.connected) {
    return NextResponse.json(status)
  } else {
    return NextResponse.json(status, { status: 500 })
  }
}

