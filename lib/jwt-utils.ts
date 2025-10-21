import { jwtVerify } from 'jose'

/**
 * Verify JWT token for middleware (edge runtime compatible)
 * Uses jose library which works with edge runtime
 * Returns decoded payload if valid, null if invalid or expired
 */
export async function verifyTokenForMiddleware(token: string): Promise<any | null> {
  try {
    const secret = process.env.JWT_SECRET

    if (!secret) {
      console.error('JWT_SECRET environment variable is not defined')
      return null
    }

    // Convert secret to Uint8Array for jose
    const secretKey = new TextEncoder().encode(secret)

    // Verify the token
    const { payload } = await jwtVerify(token, secretKey)

    return payload
  } catch (error) {
    // Token is invalid, expired, or malformed
    return null
  }
}
