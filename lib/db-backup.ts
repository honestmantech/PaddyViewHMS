import { prisma } from "./db"
import fs from "fs"
import path from "path"

export async function backupDatabase() {
  try {
    console.log("Starting database backup...")

    // Create backup directory if it doesn't exist
    const backupDir = path.join(process.cwd(), "backups")
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

    // Generate timestamp for the backup file
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const backupFile = path.join(backupDir, `backup-${timestamp}.json`)

    // Fetch all data from the database
    const [users, guests, rooms, bookings] = await Promise.all([
      prisma.user.findMany(),
      prisma.guest.findMany(),
      prisma.room.findMany(),
      prisma.booking.findMany(),
    ])

    // Create backup object
    const backup = {
      timestamp,
      data: {
        users: users.map((user) => {
          // Remove password for security
          const { password, ...userWithoutPassword } = user
          return userWithoutPassword
        }),
        guests,
        rooms,
        bookings,
      },
    }

    // Write backup to file
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2))

    console.log(`Database backup completed: ${backupFile}`)
    return { success: true, file: backupFile }
  } catch (error) {
    console.error("Error during database backup:", error)
    return { success: false, error }
  }
}

