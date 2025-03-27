import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const guest = await prisma.guest.findUnique({
      where: { id: params.id },
    })

    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    return NextResponse.json(guest)
  } catch (error) {
    console.error("Error fetching guest:", error)
    return NextResponse.json({ error: "Failed to fetch guest" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Check if guest exists
    const existingGuest = await prisma.guest.findUnique({
      where: { id: params.id },
    })

    if (!existingGuest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    // Check if email is being changed and if it already exists
    if (body.email && body.email !== existingGuest.email) {
      const guestWithSameEmail = await prisma.guest.findUnique({
        where: { email: body.email },
      })

      if (guestWithSameEmail) {
        return NextResponse.json({ error: "Email already exists" }, { status: 400 })
      }
    }

    const guest = await prisma.guest.update({
      where: { id: params.id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        address: body.address,
        idNumber: body.idNumber,
        idType: body.idType,
      },
    })

    return NextResponse.json(guest)
  } catch (error) {
    console.error("Error updating guest:", error)
    return NextResponse.json({ error: "Failed to update guest" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if guest exists
    const existingGuest = await prisma.guest.findUnique({
      where: { id: params.id },
    })

    if (!existingGuest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    // Check if guest has bookings
    const bookings = await prisma.booking.findMany({
      where: { guestId: params.id },
    })

    if (bookings.length > 0) {
      return NextResponse.json({ error: "Cannot delete guest with bookings" }, { status: 400 })
    }

    await prisma.guest.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting guest:", error)
    return NextResponse.json({ error: "Failed to delete guest" }, { status: 500 })
  }
}

