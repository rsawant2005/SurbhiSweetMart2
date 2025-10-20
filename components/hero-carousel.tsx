"use client"

import { useState, useEffect } from "react"

const SWEETS_IMAGES = [
  {
    src: "/sweets-carousel-1.jpg",
    alt: "Assorted Indian sweets and mithai",
  },
  {
    src: "/sweets-carousel-2.jpg",
    alt: "Colorful traditional sweets collection",
  },
  {
    src: "/sweets-carousel-3.jpg",
    alt: "Premium sweets hamper display",
  },
  {
    src: "/sweets-carousel-4.jpg",
    alt: "Delicious Indian desserts and treats",
  },
]

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SWEETS_IMAGES.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Carousel Images */}
      <div className="relative w-full h-full">
        {SWEETS_IMAGES.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img src={image.src || "/placeholder.svg"} alt={image.alt} className="w-full h-full object-cover" />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 via-amber-900/50 to-transparent"></div>
      </div>
    </div>
  )
}
