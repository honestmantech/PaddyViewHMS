// A safer database connection module that handles errors gracefully
import { PrismaClient } from "@prisma/client"

// Function to create a new Prisma client with error handling
function createPrismaClient() {
  try {
    const prisma = new PrismaClient({
      log: ["error", "warn"],
      errorFormat: "pretty",
    })

    return prisma
  } catch (error) {
    console.error("Failed to create Prisma client:", error)

    // Return a mock client for development that won't crash the app
    if (process.env.NODE_ENV !== "production") {
      console.warn("Using mock Prisma client for development")
      return createMockPrismaClient()
    }

    throw error
  }
}

// Create a mock Prisma client for development
function createMockPrismaClient() {
  const handler = {
    get: (target: any, prop: string) => {
      if (prop === "$connect") {
        return async () => console.log("Mock: Connected to database")
      }

      if (prop === "$disconnect") {
        return async () => console.log("Mock: Disconnected from database")
      }

      if (prop === "$queryRaw") {
        return async () => [{ result: 1 }]
      }

      // For model operations (user, room, etc.)
      return new Proxy(
        {},
        {
          get: () => async () => {
            console.log(`Mock: Called ${prop} operation`)
            return []
          },
        },
      )
    },
  }

  return new Proxy({}, handler)
}

// Create the client
let prisma: any

try {
  prisma = createPrismaClient()
} catch (error) {
  console.error("Could not create Prisma client:", error)

  // In production, we want to fail fast
  if (process.env.NODE_ENV === "production") {
    throw error
  }

  // In development, use a mock client
  prisma = createMockPrismaClient()
}

export { prisma }

