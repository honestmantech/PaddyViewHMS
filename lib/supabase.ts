import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"

const supabaseUrl = process.env.DATABASE_URL || "https://zktivtcqmuhqlwpgbdzq.supabase.co"
const supabaseKey = process.env.JWT_SECRET || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprdGl2dGNxbXVocWx3cGdiZHpxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzA0NzE5MywiZXhwIjoyMDU4NjIzMTkzfQ.iT_noPIlpLKBKailDPwajxmAtHQd3SzcJBj_WrOhbcc"

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables")
}

// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export default supabase


