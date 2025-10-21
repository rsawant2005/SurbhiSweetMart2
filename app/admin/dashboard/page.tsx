"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import DashboardOverview from "@/components/admin/dashboard-overview"
import { useAuth } from "@/lib/auth-context"

export default function AdminDashboard() {
  const router = useRouter()
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  // Middleware already protects this route, so if we reach here, user is authenticated
  // Just render the dashboard
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto">
          <DashboardOverview />
        </main>
      </div>
    </div>
  )
}
