"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"

export default function Header() {
  const [isShopOpen, setIsShopOpen] = useState(false)
  const [shopTimeout, setShopTimeout] = useState<NodeJS.Timeout | null>(null)
  const { user, logout } = useAuth()

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collection", href: "/collection" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  const shopCategories = [
    { name: "Our Collection", href: "/shop?category=collection" },
    { name: "Our Best Sellers", href: "/shop?category=bestsellers" },
    { name: "Snacks And Savories", href: "/shop?category=snacks" },
    { name: "In House Bakes", href: "/shop?category=bakes" },
    { name: "Cakes", href: "/shop?category=cakes" },
    { name: "Sweets", href: "/shop?category=sweets" },
    { name: "Namkeen", href: "/shop?category=namkeen" },
  ]

  const handleShopMouseEnter = () => {
    if (shopTimeout) clearTimeout(shopTimeout)
    setIsShopOpen(true)
  }

  const handleShopMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsShopOpen(false)
    }, 200)
    setShopTimeout(timeout)
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-amber-900/95 backdrop-blur-sm border-b border-amber-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/surbhi-sweet-mart-logo.jpg"
            alt="Surbhi Sweet Mart Logo"
            width={48}
            height={48}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <h1 className="text-2xl font-serif text-amber-200">SURBHI</h1>
            <p className="text-xs text-amber-100">SWEET MART</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-12 items-center">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-amber-100 hover:text-amber-300 transition-colors duration-200 font-serif text-base"
            >
              {link.name}
            </a>
          ))}

          <div className="relative" onMouseEnter={handleShopMouseEnter} onMouseLeave={handleShopMouseLeave}>
            <a
              href="/shop"
              className="text-amber-100 hover:text-amber-300 transition-colors duration-200 font-serif text-base"
            >
              Shop
            </a>

            {/* Dropdown Menu */}
            {isShopOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-amber-800 rounded-lg shadow-lg py-2 border border-amber-700">
                {shopCategories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="block px-4 py-3 text-amber-100 hover:bg-amber-700 hover:text-amber-300 transition-colors duration-200 font-serif text-sm"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="hidden md:flex gap-4 items-center">
          {/* Cart Button */}
          <button className="flex items-center gap-2 px-4 py-2 text-amber-100 hover:text-amber-300 transition-colors duration-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="text-base font-serif">Cart</span>
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <p className="text-amber-100 font-serif text-sm">{user.name}</p>
                <Link href="/dashboard" className="text-amber-300 hover:text-amber-200 text-xs font-serif">
                  Dashboard
                </Link>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-amber-50 rounded-lg transition-colors duration-200 font-serif text-base"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login">
              <button className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-amber-50 rounded-lg transition-colors duration-200 font-serif text-base">
                Sign In
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-amber-100 hover:text-amber-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  )
}
