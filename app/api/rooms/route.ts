import { type NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const type = searchParams.get("type")

    let query = supabase.from("rooms").select("*").order("room_number", { ascending: true })

    if (status) {
      query = query.eq("status", status)
    }

    if (type) {
      query = query.eq("type", type)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching rooms:", error)
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.roomNumber || !body.type || !body.price || !body.capacity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if room number already exists
    const { data: existingRoom, error: checkError } = await supabase
      .from("rooms")
      .select("id")
      .eq("room_number", body.roomNumber)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      throw checkError
    }

    if (existingRoom) {
      return NextResponse.json({ error: "Room number already exists" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("rooms")
      .insert({
        room_number: body.roomNumber,
        type: body.type,
        price: body.price,
        capacity: body.capacity,
        status: body.status || "AVAILABLE",
        amenities: body.amenities || [],
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error creating room:", error)
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 })
  }
}

