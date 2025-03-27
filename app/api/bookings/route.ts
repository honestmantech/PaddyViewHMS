import { type NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"
import { getRoomAvailability } from "@/lib/db-utils"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const guestId = searchParams.get("guestId")
    const roomId = searchParams.get("roomId")

    let query = supabase
      .from("bookings")
      .select(`
        *,
        guests:guest_id(*),
        rooms:room_id(*),
        users:user_id(id, name, email)
      `)
      .order("check_in_date", { ascending: true })

    if (status) {
      query = query.eq("status", status)
    }

    if (guestId) {
      query = query.eq("guest_id", guestId)
    }

    if (roomId) {
      query = query.eq("room_id", roomId)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.guestId || !body.roomId || !body.userId || !body.checkInDate || !body.checkOutDate || !body.totalAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if room is available for the requested dates
    const checkInDate = new Date(body.checkInDate)
    const checkOutDate = new Date(body.checkOutDate)

    const availability = await getRoomAvailability(body.roomId, checkInDate, checkOutDate)

    if (!availability.available) {
      return NextResponse.json({ error: "Room is not available for the requested dates" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        guest_id: body.guestId,
        room_id: body.roomId,
        user_id: body.userId,
        check_in_date: checkInDate.toISOString(),
        check_out_date: checkOutDate.toISOString(),
        total_amount: body.totalAmount,
        status: body.status || "PENDING",
        payment_status: body.paymentStatus || "UNPAID",
        special_requests: body.specialRequests,
      })
      .select(`
        *,
        guests:guest_id(*),
        rooms:room_id(*)
      `)
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}

