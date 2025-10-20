"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const menuItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "📊" },
  { label: "Products", href: "/admin/products", icon: "📦" },
  { label: "Add Product", href: "/admin/products/add", icon: "➕" },
  { label: "Categories", href: "/admin/categories", icon: "🏷️" },
  { label: "Orders", href: "/admin/orders", icon: "📋" },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-amber-900 text-white shadow-lg">
      <div className="p-6 border-b border-amber-800">
        <h1 className="text-2xl font-serif font-bold">SURBHI</h1>
        <p className="text-sm text-amber-200">Admin Panel</p>
      </div>
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
              pathname === item.href ? "bg-amber-700 text-white" : "text-amber-100 hover:bg-amber-800",
            )}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
