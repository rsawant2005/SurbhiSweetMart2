import { connectToDatabase, User } from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

    // Validation: Required fields
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Validation: Name length
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json({ message: "Name must be between 2 and 100 characters" }, { status: 400 })
    }

    // Validation: Email format
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 })
    }

    // Validation: Password minimum length (updated to 8 characters)
    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 })
    }

    // Connect to database
    try {
      await connectToDatabase()
    } catch (dbError) {
      console.error("[v0] Database connection error:", dbError)
      return NextResponse.json({ message: "Database connection failed" }, { status: 500 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 })
    }

    // Hash password using bcrypt (now async)
    const hashedPassword = await hashPassword(password)

    // Create user with role defaulting to 'user'
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
    })

    return NextResponse.json(
      {
        message: "User created successfully",
        userId: newUser._id
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[v0] Sign up error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
