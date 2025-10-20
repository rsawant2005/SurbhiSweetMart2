"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut, ShoppingCart, Heart, Settings } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("auth_token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (err) {
      console.error("[v0] Error parsing user data:", err)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 pt-24 flex items-center justify-center">
        <div className="text-amber-900 font-serif">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-amber-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-serif text-amber-900 mb-2">Welcome, {user.name}!</h1>
            <p className="text-amber-700">Manage your Surbhi Sweet Mart account</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-serif rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Orders Card */}
          <Link href="/dashboard/orders">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-amber-100 hover:shadow-xl transition-shadow duration-200 cursor-pointer">
              <ShoppingCart className="w-12 h-12 text-amber-600 mb-4" />
              <h2 className="text-2xl font-serif text-amber-900 mb-2">My Orders</h2>
              <p className="text-amber-700">View and track your orders</p>
            </div>
          </Link>

          {/* Wishlist Card */}
          <Link href="/dashboard/wishlist">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-amber-100 hover:shadow-xl transition-shadow duration-200 cursor-pointer">
              <Heart className="w-12 h-12 text-amber-600 mb-4" />
              <h2 className="text-2xl font-serif text-amber-900 mb-2">Wishlist</h2>
              <p className="text-amber-700">Your saved favorite items</p>
            </div>
          </Link>

          {/* Settings Card */}
          <Link href="/dashboard/settings">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-amber-100 hover:shadow-xl transition-shadow duration-200 cursor-pointer">
              <Settings className="w-12 h-12 text-amber-600 mb-4" />
              <h2 className="text-2xl font-serif text-amber-900 mb-2">Settings</h2>
              <p className="text-amber-700">Manage your account settings</p>
            </div>
          </Link>
        </div>

        {/* User Info Card */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8 border border-amber-100">
          <h2 className="text-2xl font-serif text-amber-900 mb-6">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-serif text-amber-700 mb-2">Full Name</label>
              <p className="text-lg text-amber-900">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-serif text-amber-700 mb-2">Email Address</label>
              <p className="text-lg text-amber-900">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
