"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { allProducts } from "@/lib/products"

export default function DashboardOverview() {
  const totalProducts = allProducts.length
  const categories = new Set(allProducts.map((p) => p.category)).size
  const totalValue = allProducts.reduce((sum, p) => sum + p.price, 0)

  const stats = [
    { label: "Total Products", value: totalProducts, icon: "📦" },
    { label: "Categories", value: categories, icon: "🏷️" },
    { label: "Total Inventory Value", value: `₹${totalValue.toLocaleString()}`, icon: "💰" },
    { label: "Average Rating", value: "4.7", icon: "⭐" },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your products, categories, and orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-gray-600">Use the sidebar to navigate to:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>View and manage all products</li>
            <li>Add new products to your catalog</li>
            <li>Manage product categories</li>
            <li>View customer orders</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
