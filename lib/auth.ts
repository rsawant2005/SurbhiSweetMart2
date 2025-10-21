import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

// Bcrypt salt rounds
const SALT_ROUNDS = 10

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Verify password against hash using bcrypt
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

/**
 * Generate JWT access token with 15 minute expiry
 * Payload should include: userId, email, role
 */
export function generateAccessToken(payload: object): string {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined')
  }

  return jwt.sign(payload, secret, { expiresIn: '15m' })
}

/**
 * Generate random refresh token (32-byte hex string)
 * Note: This token should be hashed before storing in database
 */
export function generateRefreshToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Verify and decode JWT access token
 * Returns decoded payload if valid, null if invalid or expired
 */
export function verifyAccessToken(token: string): any | null {
  try {
    const secret = process.env.JWT_SECRET

    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not defined')
    }

    const decoded = jwt.verify(token, secret)
    return decoded
  } catch (error) {
    // Token is invalid, expired, or malformed
    return null
  }
}
