"use client"

import { useState, useMemo } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useSearchParams } from "next/navigation"
import { allProducts } from "@/lib/products"

export default function ShopPage() {
  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get("category")
  const [sortBy, setSortBy] = useState("popular")

  const filteredProducts = useMemo(() => {
    let products = categoryFilter ? allProducts.filter((p) => p.category === categoryFilter) : allProducts

    if (sortBy === "price-low") {
      products = [...products].sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      products = [...products].sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating") {
      products = [...products].sort((a, b) => b.rating - a.rating)
    }

    return products
  }, [categoryFilter, sortBy])

  const categoryNames = {
    collection: "Our Collection",
    bestsellers: "Our Best Sellers",
    snacks: "Snacks And Savories",
    bakes: "In House Bakes",
    cakes: "Cakes",
    sweets: "Sweets",
    namkeen: "Namkeen",
  }

  return (
    <main className="min-h-screen bg-amber-50">
      <Header />

      {/* Shop Header */}
      <section className="pt-32 pb-12 px-6 md:px-12 bg-gradient-to-b from-amber-100 to-amber-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif text-amber-900 mb-4">
            {categoryFilter ? categoryNames[categoryFilter as keyof typeof categoryNames] : "All Products"}
          </h1>
          <p className="text-amber-800 text-lg">{filteredProducts.length} products available</p>
        </div>
      </section>

      {/* Filters and Products */}
      <section className="py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Sort Options */}
          <div className="mb-8 flex justify-between items-center">
            <div className="flex gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-amber-300 rounded-lg bg-white text-amber-900 font-serif"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group"
              >
                {/* Product Image */}
                <div className="relative h-64 overflow-hidden bg-amber-100">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-lg font-serif text-amber-900 mb-2">{product.name}</h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-amber-400" : "fill-gray-300"}`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-serif text-amber-900">₹{product.price}</span>
                    <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors duration-200 font-serif text-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}
