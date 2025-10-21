import { connectToDatabase, User } from "@/lib/db"
import { verifyAccessToken } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Extract access token from cookie
    const accessToken = request.cookies.get("accessToken")?.value

    // If access token exists, try to invalidate refresh token in database
    if (accessToken) {
      try {
        // Decode JWT to get user ID
        const decoded = verifyAccessToken(accessToken)

        if (decoded && decoded.userId) {
          // Connect to database
          await connectToDatabase()

          // Clear refresh token from user document
          await User.updateOne(
            { _id: decoded.userId },
            {
              $set: {
                refreshToken: null,
                refreshTokenExpiry: null,
              },
            }
          )
        }
      } catch (dbError) {
        // Log error but continue with cookie clearing
        console.error("[v0] Error clearing refresh token from database:", dbError)
      }
    }

    // Prepare response
    const response = NextResponse.json({ message: "Logout successful" }, { status: 200 })

    // Clear access token cookie
    response.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
    })

    // Clear refresh token cookie
    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error("[v0] Logout error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
