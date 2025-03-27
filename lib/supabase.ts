import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.DATABASE_URL || ""
const supabaseKey = process.env.JWT_SECRET || ""

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables")
}

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase

