"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import ProductsTable from "@/components/admin/products-table"
import { allProducts } from "@/lib/products"
import { useAuth } from "@/lib/auth-context"

export default function ProductsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [products, setProducts] = useState(allProducts)

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
              <p className="text-gray-600 mt-2">View and manage all products in your catalog</p>
            </div>
            <ProductsTable products={products} setProducts={setProducts} />
          </div>
        </main>
      </div>
    </div>
  )
}
