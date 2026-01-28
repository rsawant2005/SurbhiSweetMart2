import { getDatabase } from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("[v0] JSON parse error:", parseError)
      return NextResponse.json({ message: "Invalid JSON in request body" }, { status: 400 })
    }

    const { name, email, password } = body

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 })
    }

    let db
    try {
      db = await getDatabase()
    } catch (dbError) {
      console.error("[v0] Database error:", dbError)
      return NextResponse.json({ message: "Database connection failed" }, { status: 500 })
    }

    const usersCollection = db.collection("users")

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 })
    }

    // Hash password and create user
    const hashedPassword = hashPassword(password)
    const result = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    })

    return NextResponse.json({ message: "User created successfully", userId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("[v0] Sign up error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
