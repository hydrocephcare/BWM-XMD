"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Youtube, Download, ExternalLink, X, Play } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"

export function GuidesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const [guideImages, setGuideImages] = useState({
    guide1: "https://img.youtube.com/vi/Rhp84_oP6bU/maxresdefault.jpg",
    guide2: "https://img.youtube.com/vi/GMP0Fn3WJpk/maxresdefault.jpg",
    guide3: "https://img.youtube.com/vi/Zj57vFeaO-A/maxresdefault.jpg",
    whatsapp: "/placeholder.svg?height=500&width=800",
  })

  const videos = [
    {
      id: "Rhp84_oP6bU",
      title: "Project Setup Guide",
      description: "Learn how to set up your project environment and get started with the Victory School Club Membership System.",
      badge: "Tutorial"
    },
    {
      id: "GMP0Fn3WJpk", 
      title: "Implementation Guide",
      description: "Advanced implementation techniques and best practices for the Victory School Club Membership System.",
      badge: "Advanced"
    },
    {
      id: "Zj57vFeaO-A",
      title: "KCSE Preparation", 
      description: "Complete guide on how to present your project for KCSE examination and achieve the best results.",
      badge: "KCSE Prep"
    }
  ]

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

  // Handle escape key to close video
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveVideo(null)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const openVideo = (videoId: string) => {
    setActiveVideo(videoId)
  }

  const closeVideo = () => {
    setActiveVideo(null)
  }

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
    <>
      <section id="guides" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal delay={0} direction="up" distance={30}>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-4">Project Guides & Resources</h2>
              <p className="text-gray-600">
                Everything you need to successfully complete your Victory School Club Membership System project.
              </p>
            </div>
          </ScrollReveal>

          <div ref={ref} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video, index) => (
              <motion.div 
                key={video.id} 
                custom={index} 
                initial="hidden" 
                animate={isInView ? "visible" : "hidden"} 
                variants={cardVariants}
              >
                <Card className="border-gray-200 transition-all duration-200 hover:shadow-md hover:border-navy-200 overflow-hidden h-full">
                  <div className="relative h-48 w-full">
                    {activeVideo === video.id ? (
                      // Video Player
                      <div className="relative w-full h-full bg-black">
                        <iframe
                          src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                          title={`${video.title} - YouTube video player`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full"
                        />
                        <button
                          onClick={() => setActiveVideo(null)}
                          className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white rounded-full p-1.5 transition-all duration-200 z-10"
                          aria-label="Close video"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      // Thumbnail
                      <div className="cursor-pointer h-full" onClick={() => openVideo(video.id)}>
                        <Image
                          src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                          alt={`YouTube video thumbnail for ${video.title}`}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                          <Badge className="bg-red-600">{video.badge}</Badge>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-red-600 rounded-full p-3 shadow-lg transform transition-transform duration-300 hover:scale-110">
                            <Play className="h-8 w-8 text-white ml-1" />
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300"></div>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-navy-700">{video.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      {video.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    {activeVideo === video.id ? (
                      <Button
                        onClick={() => setActiveVideo(null)}
                        variant="outline"
                        className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Close Video
                      </Button>
                    ) : (
                      <Button
                        onClick={() => openVideo(video.id)}
                        variant="outline"
                        className="w-full border-navy-200 text-navy-700 hover:bg-navy-50 hover:text-navy-800"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Watch Tutorial
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          <ScrollReveal delay={600} direction="up" distance={40}>
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
                      src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                      alt="African students collaborating and studying together in a modern learning environment"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
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

      {/* No modal needed - videos play inline */}
    </>
  )
}
