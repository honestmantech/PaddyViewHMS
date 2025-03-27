import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("Initializing database...")

    // Create admin user
    const adminPassword = await hash("admin123", 10)
    const admin = await prisma.user.upsert({
      where: { email: "admin@hothotelms.com" },
      update: {},
      create: {
        email: "admin@hothotelms.com",
        name: "Admin User",
        password: adminPassword,
        role: "ADMIN",
      },
    })

    console.log("Admin user created:", admin.email)

    // Create staff user
    const staffPassword = await hash("staff123", 10)
    const staff = await prisma.user.upsert({
      where: { email: "staff@hothotelms.com" },
      update: {},
      create: {
        email: "staff@hothotelms.com",
        name: "Staff User",
        password: staffPassword,
        role: "STAFF",
      },
    })

    console.log("Staff user created:", staff.email)

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
    for (let i = 1; i <= 20; i++) {
      const roomNumber = i.toString().padStart(3, "0")
      const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)] as any

      await prisma.room.upsert({
        where: { roomNumber },
        update: {},
        create: {
          roomNumber,
          type: roomType,
          price: roomPrices[roomType],
          capacity: roomType === "SINGLE" ? 1 : roomType === "SUITE" ? 4 : 2,
          status: "AVAILABLE",
          amenities: ["WiFi", "TV", "Air Conditioning"],
        },
      })
    }

    console.log("Rooms created successfully")

    // Create sample guests
    const guests = [
      {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        phone: "+0987654321",
      },
    ]

    for (const guestData of guests) {
      await prisma.guest.upsert({
        where: { email: guestData.email },
        update: {},
        create: guestData,
      })
    }

    console.log("Sample guests created")

    // Create sample bookings
    const rooms = await prisma.room.findMany({
      take: 5,
    })

    const guestsFromDb = await prisma.guest.findMany({
      take: 2,
    })

    if (rooms.length > 0 && guestsFromDb.length > 0) {
      // Create a booking for today
      const today = new Date()
      const checkOutDate = new Date(today)
      checkOutDate.setDate(today.getDate() + 3)

      await prisma.booking.create({
        data: {
          checkInDate: today,
          checkOutDate,
          status: "CHECKED_IN",
          totalAmount: rooms[0].price * 3, // 3 nights
          paymentStatus: "PAID",
          guestId: guestsFromDb[0].id,
          roomId: rooms[0].id,
          userId: admin.id,
        },
      })

      // Create a future booking
      const futureCheckIn = new Date()
      futureCheckIn.setDate(today.getDate() + 7)
      const futureCheckOut = new Date(futureCheckIn)
      futureCheckOut.setDate(futureCheckIn.getDate() + 2)

      await prisma.booking.create({
        data: {
          checkInDate: futureCheckIn,
          checkOutDate: futureCheckOut,
          status: "CONFIRMED",
          totalAmount: rooms[1].price * 2, // 2 nights
          paymentStatus: "PARTIALLY_PAID",
          guestId: guestsFromDb[1].id,
          roomId: rooms[1].id,
          userId: staff.id,
        },
      })

      console.log("Sample bookings created")
    }

    console.log("Database initialization completed successfully")
  } catch (error) {
    console.error("Error initializing database:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

