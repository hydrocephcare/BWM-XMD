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

      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <ScrollReveal delay={0} direction="left" distance={100}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy-800 leading-tight">
                Victory School Club Membership System
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={3} direction="left" distance={100}>
              <p className="mt-6 text-lg text-gray-600">
                A comprehensive KCSE Computer Studies project that demonstrates database management, user
                authentication, and reporting capabilities for school club administration.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={6} direction="up" distance={50}>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-navy-600 hover:bg-navy-700">
                  <Link href="https://victoryschoolclub.co.ke/download">
                    <Download className="mr-2 h-5 w-5" />
                    Download Now
                  </Link>
                </Button>

                <ScrollButton targetId="guides" size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Guides & Tutorials
                </ScrollButton>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={3} direction="right" distance={100}>
            <div className="relative h-[300px] md:h-[400px] rounded-lg shadow-2xl overflow-hidden border-8 border-white">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Victory School Club Membership System dashboard showing student registration interface"
                fill
                className="object-cover"
              />
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={9} direction="up" distance={30}>
          <div className="mt-16 md:mt-24 text-center">
            <div className="inline-flex items-center justify-center p-1 bg-navy-50 rounded-full">
              <span className="px-3 py-1 text-xs font-medium text-navy-700">Trusted by 200+ schools across Kenya</span>
            </div>
            <h2 className="mt-4 text-2xl md:text-3xl font-bold text-navy-800">
              Designed specifically for KCSE 2025 Computer Studies Project
            </h2>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
