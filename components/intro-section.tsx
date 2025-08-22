"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/scroll-reveal"
import { ScrollButton } from "@/components/scroll-button"
import { Download } from "lucide-react"

export function IntroSection() {
  const [heroImage, setHeroImage] = useState("/placeholder.svg?height=600&width=1200")

  useEffect(() => {
    // Load saved images from localStorage
    try {
      const savedImages = localStorage.getItem("victory-school-home-images")
      if (savedImages) {
        const images = JSON.parse(savedImages)
        if (images.hero) {
          setHeroImage(images.hero)
        }
      }
    } catch (error) {
      console.error("Error loading hero image:", error)
    }
  }, [])

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage || "/placeholder.svg"}
          alt="Students working on a computer project in a classroom setting"
          fill
          priority
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white"></div>
      </div>

      
    </section>
  )
}
