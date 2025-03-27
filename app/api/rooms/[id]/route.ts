import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const room = await prisma.room.findUnique({
      where: { id: params.id },
    })

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json(room)
  } catch (error) {
    console.error("Error fetching room:", error)
    return NextResponse.json({ error: "Failed to fetch room" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Check if room exists
    const existingRoom = await prisma.room.findUnique({
      where: { id: params.id },
    })

    if (!existingRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    // Check if room number is being changed and if it already exists
    if (body.roomNumber && body.roomNumber !== existingRoom.roomNumber) {
      const roomWithSameNumber = await prisma.room.findUnique({
        where: { roomNumber: body.roomNumber },
      })

      if (roomWithSameNumber) {
        return NextResponse.json({ error: "Room number already exists" }, { status: 400 })
      }
    }

    const room = await prisma.room.update({
      where: { id: params.id },
      data: {
        roomNumber: body.roomNumber,
        type: body.type,
        price: body.price,
        capacity: body.capacity,
        status: body.status,
        amenities: body.amenities,
      },
    })

    return NextResponse.json(room)
  } catch (error) {
    console.error("Error updating room:", error)
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if room exists
    const existingRoom = await prisma.room.findUnique({
      where: { id: params.id },
    })

    if (!existingRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    // Check if room has bookings
    const bookings = await prisma.booking.findMany({
      where: { roomId: params.id },
    })

    if (bookings.length > 0) {
      return NextResponse.json({ error: "Cannot delete room with bookings" }, { status: 400 })
    }

    await prisma.room.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting room:", error)
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 })
  }
}

