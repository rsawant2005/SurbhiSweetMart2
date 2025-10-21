import { connectToDatabase, User } from "@/lib/db"
import { verifyPassword, generateAccessToken, generateRefreshToken, hashPassword } from "@/lib/auth"
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

    // Connect to database
    try {
      await connectToDatabase()
    } catch (dbError) {
      console.error("[v0] Database connection error:", dbError)
      return NextResponse.json({ message: "Database connection failed" }, { status: 500 })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Verify password using bcrypt (now async)
    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Generate JWT access token (15 min expiry)
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    // Generate refresh token (32-byte hex)
    const refreshToken = generateRefreshToken()

    // Hash refresh token before storing
    const hashedRefreshToken = await hashPassword(refreshToken)

    // Calculate refresh token expiry (7 days from now)
    const refreshTokenExpiry = new Date()
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7)

    // Update user document with refresh token and last login
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          refreshToken: hashedRefreshToken,
          refreshTokenExpiry: refreshTokenExpiry,
          lastLogin: new Date(),
        },
      }
    )

    // Prepare response with user data
    const response = NextResponse.json(
      {
        message: "Login successful",
        accessToken,
        refreshToken,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    )

    // Set access token cookie (15 minutes)
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60, // 15 minutes in seconds
    })

    // Set refresh token cookie (7 days)
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    })

    return response
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
