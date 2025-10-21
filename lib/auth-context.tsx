"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  logout: () => void
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Try to restore session from httpOnly cookies via refresh endpoint
    const restoreSession = async () => {
      try {
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include', // Include cookies
        })

        if (response.ok) {
          const data = await response.json()
          // Session restored successfully
          // Note: We don't get user data from refresh endpoint,
          // but middleware will protect routes. User data will be set on login.
          // For now, we just know the session is valid.
        } else {
          // Session cannot be restored (refresh token expired/invalid)
          setUser(null)
        }
      } catch (error) {
        console.error("[v0] Error restoring session:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
  }, [])

  const logout = async () => {
    try {
      // Call logout API to clear cookies and invalidate refresh token
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies
      })
    } catch (error) {
      console.error("[v0] Logout error:", error)
    }

    // Clear user state
    setUser(null)
    // Redirect to login page
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
