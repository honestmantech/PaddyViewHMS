import { PrismaClient } from "@prisma/client"
import { checkDatabaseConfig } from "./db-config-checker"

// Maximum number of connection attempts
const MAX_RETRIES = 5
// Delay between retries in milliseconds (starts at 1s, doubles each retry)
const INITIAL_RETRY_DELAY = 1000

class DatabaseManager {
  private prisma: PrismaClient | null = null
  private connectionPromise: Promise<PrismaClient> | null = null
  private retryCount = 0
  private retryDelay = INITIAL_RETRY_DELAY

  constructor() {
    // Check database configuration on initialization
    const configCheck = checkDatabaseConfig()
    if (!configCheck.valid) {
      console.error("Invalid database configuration:", configCheck.message)
      throw new Error(`Database configuration error: ${configCheck.message}`)
    }
  }

  async connect(): Promise<PrismaClient> {
    // If we already have a connection, return it
    if (this.prisma) return this.prisma

    // If we're in the process of connecting, return the promise
    if (this.connectionPromise) return this.connectionPromise

    // Create a new connection
    this.connectionPromise = new Promise(async (resolve, reject) => {
      try {
        const prisma = new PrismaClient({
          log: ["error", "warn"],
          errorFormat: "pretty",
        })

        // Test the connection
        await prisma.$connect()
        console.log("Successfully connected to database")

        this.prisma = prisma
        this.retryCount = 0
        this.retryDelay = INITIAL_RETRY_DELAY

        resolve(prisma)
      } catch (error) {
        console.error("Failed to connect to database:", error)

        if (this.retryCount < MAX_RETRIES) {
          this.retryCount++
          console.log(`Retrying connection (${this.retryCount}/${MAX_RETRIES}) in ${this.retryDelay}ms...`)

          // Wait before retrying
          setTimeout(async () => {
            this.connectionPromise = null
            try {
              const prisma = await this.connect()
              resolve(prisma)
            } catch (retryError) {
              reject(retryError)
            }
          }, this.retryDelay)

          // Double the delay for the next retry (exponential backoff)
          this.retryDelay *= 2
        } else {
          this.connectionPromise = null
          reject(
            new Error(
              `Failed to connect to database after ${MAX_RETRIES} attempts: ${error instanceof Error ? error.message : String(error)}`,
            ),
          )
        }
      }
    })

    return this.connectionPromise
  }

  async disconnect(): Promise<void> {
    if (this.prisma) {
      await this.prisma.$disconnect()
      this.prisma = null
    }
    this.connectionPromise = null
  }

  async getClient(): Promise<PrismaClient> {
    return this.connect()
  }
}

// Create a singleton instance
const dbManager = new DatabaseManager()

export default dbManager

