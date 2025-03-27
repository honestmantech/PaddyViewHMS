import { prisma } from "./db"
import { hash } from "bcrypt"

async function main() {
  try {
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

    console.log("Admin user created:", admin)

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

    // Create sample guest
    const guest = await prisma.guest.upsert({
      where: { email: "john.doe@example.com" },
      update: {},
      create: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        address: "123 Main St, Anytown, USA",
        idNumber: "AB123456",
        idType: "Passport",
      },
    })

    console.log("Sample guest created:", guest)

    // Create sample booking
    const room = await prisma.room.findFirst({
      where: { type: "DOUBLE" },
    })

    if (room) {
      const booking = await prisma.booking.create({
        data: {
          checkInDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          checkOutDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          status: "CONFIRMED",
          totalAmount: room.price * 3, // 3 nights
          paymentStatus: "PAID",
          guestId: guest.id,
          roomId: room.id,
          userId: admin.id,
        },
      })

      console.log("Sample booking created:", booking)
    }

    console.log("Seed completed successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

