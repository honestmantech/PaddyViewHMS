export function checkDatabaseConfig() {
  const requiredEnvVars = ["DATABASE_URL"]
  const missingVars = []

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar)
    }
  }

  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(", ")}`)
    return {
      valid: false,
      missingVars,
      message: `Missing required environment variables: ${missingVars.join(", ")}`,
    }
  }

  // Check if DATABASE_URL has the correct format
  const dbUrl = process.env.DATABASE_URL || ""
  const validProtocols = ["postgresql://", "mysql://", "mongodb://", "mongodb+srv://"]
  const hasValidProtocol = validProtocols.some((protocol) => dbUrl.startsWith(protocol))

  if (!hasValidProtocol) {
    return {
      valid: false,
      message:
        "DATABASE_URL does not have a valid protocol. Expected postgresql://, mysql://, mongodb://, or mongodb+srv://",
    }
  }

  return { valid: true, message: "Database configuration is valid" }
}

