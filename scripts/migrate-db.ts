import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("Starting database migration...")

    // Create admin user if it doesn't exist
    const adminEmail = "admin@hothotelms.com"
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    })

    if (!existingAdmin) {
      const adminPassword = await hash("admin123", 10)
      await prisma.user.create({
        data: {
          name: "Admin User",
          email: adminEmail,
          password: adminPassword,
          role: "ADMIN",
        },
      })
      console.log("Created admin user")
    } else {
      console.log("Admin user already exists")
    }

    // Create room types if they don't exist
    const roomTypes = ["SINGLE", "DOUBLE", "TWIN", "SUITE", "DELUXE"]
    const roomPrices = {
      SINGLE: 100,
      DOUBLE: 150,
      TWIN: 150,
      SUITE: 300,
      DELUXE: 400,
    }

    // Check if we have any rooms
    const roomCount = await prisma.room.count()

    if (roomCount === 0) {
      console.log("Creating sample rooms...")

      // Create 20 rooms
      for (let i = 1; i <= 20; i++) {
        const roomNumber = i.toString().padStart(3, "0")
        const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)] as any

        await prisma.room.create({
          data: {
            roomNumber,
            type: roomType,
            price: roomPrices[roomType],
            capacity: roomType === "SINGLE" ? 1 : roomType === "SUITE" ? 4 : 2,
            status: "AVAILABLE",
            amenities: ["WiFi", "TV", "Air Conditioning"],
          },
        })
      }

      console.log("Created 20 sample rooms")
    } else {
      console.log(`${roomCount} rooms already exist`)
    }

    console.log("Database migration completed successfully")
  } catch (error) {
    console.error("Error during migration:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

