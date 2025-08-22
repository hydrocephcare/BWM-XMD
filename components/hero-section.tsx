"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Download, GraduationCap } from "lucide-react"
import { motion } from "framer-motion"
import { CountdownTimer } from "@/components/countdown-timer"

export function HeroSection() {
  const [isMounted, setIsMounted] = useState(false)
  const [heroImage, setHeroImage] = useState("/placeholder.svg?height=800&width=600")

  useEffect(() => {
    setIsMounted(true)

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

  if (!isMounted) {
    return null
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-navy-50 to-white py-16 md:py-24">
      <div className="absolute inset-0 z-0">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Educational technology background with students working on computers in a modern classroom setting"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col space-y-6"
          >
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-navy-700 rounded-full p-3 shadow-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-800 leading-tight">
                Victory School Club Membership System
              </h1>
            </div>

            <p className="text-lg text-gold-600 font-semibold">#WeMakeTheBestProjects</p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-navy-600 hover:bg-navy-700 group">
                <Link href="https://wa.link/jox26j" target="_blank">
                  Download Now
                  <Download className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
                </Link>
              </Button>
              {/* Removed View Guidelines button as requested */}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="https://project.victoryschoolclub.co.ke/wp-content/uploads/2025/03/Colorful-Rainbow-Pride-Instagram-Profile-Picture.png"
                alt="Student using the Victory School Club Membership System on a computer, showcasing the user interface and database functionality"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4 border border-gray-100">
              <CountdownTimer targetDate="2025-07-31T00:00:00" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
