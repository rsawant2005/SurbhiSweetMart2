"use client"

import { useState, useMemo } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { allProducts } from "@/lib/products"

export default function CollectionPage() {
  const [sortBy, setSortBy] = useState("popular")

  const collectionProducts = useMemo(() => {
    let products = allProducts.filter((p) => p.category === "collection")

    if (sortBy === "price-low") {
      products = [...products].sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      products = [...products].sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating") {
      products = [...products].sort((a, b) => b.rating - a.rating)
    }

    return products
  }, [sortBy])

  return (
    <main className="min-h-screen bg-amber-50">
      <Header />

      {/* Collection Hero Section */}
      <section className="pt-32 pb-16 px-6 md:px-12 bg-gradient-to-b from-amber-100 to-amber-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif text-amber-900 mb-4 text-balance">Our Collection</h1>
          <p className="text-amber-800 text-lg max-w-2xl">
            Discover our premium selection of handcrafted sweets and delicacies, carefully curated to bring you the
            finest flavors and traditions.
          </p>
          <div className="mt-6 h-1 w-24 bg-amber-600 rounded-full"></div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Sort Options */}
          <div className="mb-12 flex justify-between items-center">
            <p className="text-amber-900 font-serif text-lg">{collectionProducts.length} Premium Products</p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-amber-300 rounded-lg bg-white text-amber-900 font-serif focus:outline-none focus:ring-2 focus:ring-amber-600"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {collectionProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group"
              >
                {/* Product Image Container */}
                <div className="relative h-64 overflow-hidden bg-amber-100">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {product.badge && (
                    <div className="absolute top-3 right-3 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-serif">
                      {product.badge}
                    </div>
                  )}
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
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-serif text-amber-900">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors duration-200 font-serif flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Add to Cart
                  </button>
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
