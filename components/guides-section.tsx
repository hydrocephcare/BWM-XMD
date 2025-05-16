"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Youtube, Download, ExternalLink } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"

export function GuidesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [guideImages, setGuideImages] = useState({
    guide1: "/placeholder.svg?height=400&width=600",
    guide2: "/placeholder.svg?height=400&width=600",
    guide3: "/placeholder.svg?height=400&width=600",
    whatsapp: "/placeholder.svg?height=500&width=800",
  })

  useEffect(() => {
    // Load saved images from localStorage
    try {
      const savedImages = localStorage.getItem("victory-school-home-images")
      if (savedImages) {
        const images = JSON.parse(savedImages)
        const newGuideImages = { ...guideImages }

        if (images.guide1) newGuideImages.guide1 = images.guide1
        if (images.guide2) newGuideImages.guide2 = images.guide2
        if (images.guide3) newGuideImages.guide3 = images.guide3
        if (images.whatsapp) newGuideImages.whatsapp = images.whatsapp

        setGuideImages(newGuideImages)
      }
    } catch (error) {
      console.error("Error loading guide images:", error)
    }
  }, [])

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  return (
    <section id="guides" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <ScrollReveal delay={0} direction="up" distance={30}>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="mb-4 bg-navy-200 text-navy-700 hover:bg-navy-300">Learning Resources</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-4">Guides & Tutorials</h2>
            <p className="text-gray-600">
              These guides are designed to help you shape and refine your project to achieve the best possible outcome.
              We have carefully crafted a variety of resources to assist you in every stage of your project development.
            </p>
          </div>
        </ScrollReveal>

        <div ref={ref} className="grid gap-6 md:grid-cols-3">
          <motion.div custom={0} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={cardVariants}>
            <Card className="border-gray-200 transition-all duration-200 hover:shadow-md hover:border-navy-200 overflow-hidden h-full">
              <div className="relative h-48 w-full">
                <Image
                  src={guideImages.guide1 || "/placeholder.svg"}
                  alt="Teacher demonstrating project setup on a computer with students gathered around, showing step-by-step installation process"
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <Badge className="bg-navy-600">Video Tutorial</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-navy-700">Project Setup Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Learn how to set up your project environment and get started with the Victory School Club Membership
                  System.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-navy-200 text-navy-700 hover:bg-navy-50 hover:text-navy-800"
                >
                  <Link href="https://youtu.be/Rhp84_oP6bU" target="_blank">
                    <Youtube className="mr-2 h-4 w-4" />
                    Watch Tutorial
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div custom={1} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={cardVariants}>
            <Card className="border-gray-200 transition-all duration-200 hover:shadow-md hover:border-navy-200 overflow-hidden h-full">
              <div className="relative h-48 w-full">
                <Image
                  src={guideImages.guide2 || "/placeholder.svg"}
                  alt="Open student guideline document with highlighted sections, diagrams, and code examples for the Victory School Club Membership System"
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <Badge className="bg-navy-600">Documentation</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-navy-700">Student Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Comprehensive guidelines for students on how to implement and present the project for KCSE
                  examination.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-navy-200 text-navy-700 hover:bg-navy-50 hover:text-navy-800"
                >
                  <Link
                    href="https://victoryschoolclub.co.ke/wp-content/uploads/2025/05/GUIDELINE-FOR-VICTORY-SCHOOL-CLUB-MEMBERSHIP-SYSTEM.pdf"
                    target="_blank"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div custom={2} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={cardVariants}>
            <Card className="border-gray-200 transition-all duration-200 hover:shadow-md hover:border-navy-200 overflow-hidden h-full">
              <div className="relative h-48 w-full">
                <Image
                  src={guideImages.guide3 || "/placeholder.svg"}
                  alt="KCSE Computer Studies question paper with Victory School Club Membership System requirements and marking scheme visible"
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <Badge className="bg-navy-600">Sample Paper</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-navy-700">Question Paper</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Sample question paper for the Victory School Club Membership System project to help you understand the
                  requirements.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-navy-200 text-navy-700 hover:bg-navy-50 hover:text-navy-800"
                >
                  <Link
                    href="https://victoryschoolclub.co.ke/wp-content/uploads/2025/05/Victory-School-Club-Membership-System-Question-Paper.pdf"
                    target="_blank"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        <ScrollReveal delay={6} direction="up" distance={40}>
          <div className="mt-12 bg-navy-50 rounded-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold text-navy-800 mb-4">Join Our WhatsApp Group</h3>
                <p className="text-gray-600 mb-6">
                  Connect with other KCSE students and get direct support from our team. Share your progress, ask
                  questions, and learn from others working on the same project.
                </p>
                <Button asChild className="bg-green-600 hover:bg-green-700 group">
                  <Link href="https://chat.whatsapp.com/IO7QQrf6GH3IRHDMDAbNwm" target="_blank">
                    Join WhatsApp Group
                    <ExternalLink className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
              <div className="md:w-1/2">
                <div className="relative h-[200px] md:h-[250px] rounded-lg overflow-hidden shadow-md transform transition-transform duration-500 hover:scale-[1.02]">
                  <Image
                    src={guideImages.whatsapp || "/placeholder.svg"}
                    alt="Active WhatsApp group chat showing students discussing the Victory School Club Membership System project and sharing tips"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <h4 className="text-lg font-semibold">KCSE 2025 Support Group</h4>
                      <p className="text-sm opacity-90">Get help from peers and experts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
