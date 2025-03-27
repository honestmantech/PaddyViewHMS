import { compare, hash } from 'bcrypt'
import supabase from "./supabase"

export async function getUserByEmail(email: string) {
  try {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned - user not found
        return null
      }
      throw error
    }

    return data
  } catch (error) {
    console.error("Error getting user by email:", error)
    throw error
  }
}

export async function createUser(userData: {
  name: string
  email: string
  password: string
  role?: "ADMIN" | "MANAGER" | "STAFF"
}) {
  try {
    const hashedPassword = await hash(userData.password, 10)

    const { data, error } = await supabase
      .from("users")
      .insert({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || "STAFF",
      })
      .select("id, name, email, role, created_at, updated_at")
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function validateCredentials(email: string, password: string) {
  try {
    const user = await getUserByEmail(email)

    if (!user) {
      return null
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      return null
    }

    // Don't return the password
    const { password: _, ...userWithoutPassword } = user

    return userWithoutPassword
  } catch (error) {
    console.error("Error validating credentials:", error)
    throw error
  }
}

export async function getAllUsers() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, role, created_at, updated_at")
      .order("name", { ascending: true })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error getting all users:", error)
    throw error
  }
}

