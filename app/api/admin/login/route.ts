import { type NextRequest, NextResponse } from "next/server"

// Mock admin user - in production, this would be in a database
const ADMIN_USER = {
  id: 1,
  email: "admin@surbhi.com",
  passwordHash: "$2a$10$YourHashedPasswordHere", // This is a placeholder
}

export async function POST(request: NextRequest) {
  try {
    let email: string
    let password: string

    try {
      const body = await request.json()
      email = body.email
      password = body.password
    } catch (parseError) {
      console.error("[v0] JSON parse error:", parseError)
      return NextResponse.json({ message: "Invalid request format" }, { status: 400 })
    }

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // Simple validation for demo - in production use proper authentication
    if (email === "admin@surbhi.com" && password === "admin123") {
      const token = Buffer.from(`${email}:${Date.now()}`).toString("base64")

      return NextResponse.json({
        token,
        user: {
          id: 1,
          email,
          name: "Admin User",
        },
      })
    }

    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("[v0] Admin login error:", error)
    return NextResponse.json({ message: "Login failed" }, { status: 500 })
  }
}
