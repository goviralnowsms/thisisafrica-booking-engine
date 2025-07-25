"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  const slides = [
    {
      image: "/images/lion.png",
      alt: "Majestic African lion in savanna",
    },
    {
      image: "/images/safari-lion.png",
      alt: "Safari experience with lion and vehicle",
    },
    {
      image: "/images/victoria-falls.png",
      alt: "Victoria Falls aerial view with rainbow",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((current) => (current === slides.length - 1 ? 0 : current + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image src={slide.image || "/placeholder.svg"} alt={slide.alt} fill priority className="object-cover" />
        </div>
      ))}

      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-colors ${index === current ? "bg-white" : "bg-white/50"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
