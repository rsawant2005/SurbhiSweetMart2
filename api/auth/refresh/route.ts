import { connectToDatabase, User } from "@/lib/db"
import { verifyPassword, generateAccessToken, generateRefreshToken, hashPassword } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Extract refresh token from cookie
    const refreshToken = request.cookies.get("refreshToken")?.value

    if (!refreshToken) {
      return NextResponse.json({ message: "Refresh token missing" }, { status: 401 })
    }

    // Connect to database
    try {
      await connectToDatabase()
    } catch (dbError) {
      console.error("[v0] Database connection error:", dbError)
      return NextResponse.json({ message: "Database connection failed" }, { status: 500 })
    }

    // Find user with non-expired refresh token
    const currentTime = new Date()
    const user = await User.findOne({
      refreshTokenExpiry: { $gt: currentTime },
    })

    if (!user || !user.refreshToken) {
      return NextResponse.json({ message: "Invalid or expired refresh token" }, { status: 401 })
    }

    // Verify the refresh token matches stored hashed token
    const isTokenValid = await verifyPassword(refreshToken, user.refreshToken)
    if (!isTokenValid) {
      return NextResponse.json({ message: "Invalid or expired refresh token" }, { status: 401 })
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    // Generate new refresh token (token rotation)
    const newRefreshToken = generateRefreshToken()

    // Hash new refresh token
    const hashedNewRefreshToken = await hashPassword(newRefreshToken)

    // Calculate new refresh token expiry (7 days from now)
    const newRefreshTokenExpiry = new Date()
    newRefreshTokenExpiry.setDate(newRefreshTokenExpiry.getDate() + 7)

    // Update user with new refresh token
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          refreshToken: hashedNewRefreshToken,
          refreshTokenExpiry: newRefreshTokenExpiry,
        },
      }
    )

    // Prepare response
    const response = NextResponse.json(
      {
        message: "Token refreshed successfully",
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
      { status: 200 }
    )

    // Set new access token cookie (15 minutes)
    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60, // 15 minutes in seconds
    })

    // Set new refresh token cookie (7 days)
    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    })

    return response
  } catch (error) {
    console.error("[v0] Token refresh error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
