"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"

export default function AdminLogin() {
  const router = useRouter()
  const { setUser } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Include cookies
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Login failed")
        return
      }

      // Check if user has admin role
      if (data.user.role !== 'admin') {
        setError("Admin access required")
        return
      }

      // Store user in auth context (cookies are set by API)
      setUser(data.user)

      // Redirect to admin dashboard
      router.push("/admin/dashboard")
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-serif text-amber-900">Admin Portal</CardTitle>
          <CardDescription>Sign in to manage products and categories</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                placeholder="admin@surbhisweetmart.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
            <Button type="submit" disabled={loading} className="w-full bg-amber-700 hover:bg-amber-800 text-white">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-700">
            <p className="font-semibold">Note:</p>
            <p>Admin account must be created using the seed script.</p>
            <p>Run: npm run seed:admin</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
