import { NextResponse } from "next/server"
import supabase from "@/lib/supabase-client"
import { hash } from "bcryptjs"

export async function GET() {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          status: "error",
          message: "Seed endpoint is not available in production",
        },
        { status: 403 },
      )
    }

    // Create admin user
    const adminPassword = await hash("admin123", 10)

    const { data: admin, error: adminError } = await supabase
      .from("users")
      .upsert(
        {
          email: "admin@hothotelms.com",
          name: "Admin User",
          password: adminPassword,
          role: "ADMIN",
        },
        {
          onConflict: "email",
        },
      )
      .select("id, email, name, role")
      .single()

    if (adminError) throw adminError

    // Create room types
    const roomTypes = ["SINGLE", "DOUBLE", "TWIN", "SUITE", "DELUXE"]
    const roomPrices = {
      SINGLE: 100,
      DOUBLE: 150,
      TWIN: 150,
      SUITE: 300,
      DELUXE: 400,
    }

    // Create 20 rooms
    const rooms = []
    for (let i = 1; i <= 20; i++) {
      const roomNumber = i.toString().padStart(3, "0")
      const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)]

      const { data: room, error: roomError } = await supabase
        .from("rooms")
        .upsert(
          {
            room_number: roomNumber,
            type: roomType,
            price: roomPrices[roomType],
            capacity: roomType === "SINGLE" ? 1 : roomType === "SUITE" ? 4 : 2,
            status: "AVAILABLE",
            amenities: ["WiFi", "TV", "Air Conditioning"],
          },
          {
            onConflict: "room_number",
          },
        )
        .select()
        .single()

      if (roomError) throw roomError

      rooms.push(room)
    }

    // Create sample guest
    const { data: guest, error: guestError } = await supabase
      .from("guests")
      .upsert(
        {
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@example.com",
          phone: "+1234567890",
          address: "123 Main St, Anytown, USA",
          id_number: "AB123456",
          id_type: "Passport",
        },
        {
          onConflict: "email",
        },
      )
      .select()
      .single()

    if (guestError) throw guestError

    // Create sample booking
    const room = rooms.find((r) => r.type === "DOUBLE")

    let booking = null
    if (room) {
      // Delete any existing bookings for this room
      await supabase.from("bookings").delete().eq("room_id", room.id)

      const { data: newBooking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          check_in_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          check_out_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
          status: "CONFIRMED",
          total_amount: room.price * 3, // 3 nights
          payment_status: "PAID",
          guest_id: guest.id,
          room_id: room.id,
          user_id: admin.id,
        })
        .select()
        .single()

      if (bookingError) throw bookingError

      booking = newBooking
    }

    return NextResponse.json({
      status: "success",
      message: "Database seeded successfully",
      data: {
        admin: { id: admin.id, email: admin.email, name: admin.name },
        roomsCount: rooms.length,
        guest: { id: guest.id, name: `${guest.first_name} ${guest.last_name}`, email: guest.email },
        booking: booking
          ? { id: booking.id, check_in_date: booking.check_in_date, check_out_date: booking.check_out_date }
          : null,
      },
    })
  } catch (error) {
    console.error("Error seeding database:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "Failed to seed database",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

