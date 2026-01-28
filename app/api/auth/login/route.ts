import { getDatabase } from "@/lib/db"
import { verifyPassword, generateToken } from "@/lib/auth"
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

    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json({ message: "Missing email or password" }, { status: 400 })
    }

    let db
    try {
      db = await getDatabase()
    } catch (dbError) {
      console.error("[v0] Database error:", dbError)
      return NextResponse.json({ message: "Database connection failed" }, { status: 500 })
    }

    const usersCollection = db.collection("users")

    // Find user
    const user = await usersCollection.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    if (!verifyPassword(password, user.password as string)) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Generate token
    const token = generateToken()

    // Store token in database
    await usersCollection.updateOne({ _id: user._id }, { $set: { token, lastLogin: new Date() } })

    // Return token
    const response = NextResponse.json(
      { message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email } },
      { status: 200 },
    )

    // Set token in cookie
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
