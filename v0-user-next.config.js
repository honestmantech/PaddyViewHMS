/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Ensure environment variables are available at build time
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
  },
  // Increase build timeout if needed
  experimental: {
    serverComponentsExternalPackages: ["bcrypt"],
  },
}

module.exports = nextConfig

