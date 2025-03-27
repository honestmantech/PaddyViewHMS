/** @type {import('next').NextConfig} */
const userConfig = {
  // Ensure environment variables are available at build time
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
  },
  // Add any Supabase-specific configurations
  experimental: {
    // Keep only necessary experimental features
    serverComponentsExternalPackages: ['bcryptjs'],
  },
}

export default userConfig
