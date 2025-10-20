"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { allProducts } from "@/lib/products"

const defaultCategories = [
  { id: 1, name: "Collection", slug: "collection", description: "Premium collection items" },
  { id: 2, name: "Best Sellers", slug: "bestsellers", description: "Our most popular products" },
  { id: 3, name: "Snacks", slug: "snacks", description: "Savory snacks and namkeen" },
  { id: 4, name: "Bakes", slug: "bakes", description: "In-house baked goods" },
  { id: 5, name: "Cakes", slug: "cakes", description: "Premium cakes" },
  { id: 6, name: "Sweets", slug: "sweets", description: "Traditional sweets" },
  { id: 7, name: "Namkeen", slug: "namkeen", description: "Savory items" },
]

export default function CategoriesManager() {
  const [categories, setCategories] = useState(defaultCategories)
  const [newCategory, setNewCategory] = useState({ name: "", slug: "", description: "" })

  const getProductCount = (slug: string) => {
    return allProducts.filter((p) => p.category === slug).length
  }

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.slug) {
      setCategories([
        ...categories,
        {
          id: Math.max(...categories.map((c) => c.id), 0) + 1,
          ...newCategory,
        },
      ])
      setNewCategory({ name: "", slug: "", description: "" })
    }
  }

  const handleDeleteCategory = (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((c) => c.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Category Name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="text"
              placeholder="Slug (e.g., premium-sweets)"
              value={newCategory.slug}
              onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="text"
              placeholder="Description"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <Button onClick={handleAddCategory} className="bg-amber-700 hover:bg-amber-800 text-white">
            Add Category
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.slug}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-600"
                  >
                    Delete
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                <p className="text-xs text-gray-500">{getProductCount(category.slug)} products</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
