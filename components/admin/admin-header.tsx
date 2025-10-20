"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AdminHeader() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminUser")
    router.push("/admin/login")
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
      <Button
        onClick={handleLogout}
        variant="outline"
        className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
      >
        Logout
      </Button>
    </header>
  )
}
