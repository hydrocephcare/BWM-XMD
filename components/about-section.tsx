"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { ImageUploader } from "@/components/image-uploader"

export function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [isAdmin, setIsAdmin] = useState(false)
  const [aboutImage, setAboutImage] = useState("/placeholder.svg?height=800&width=600")

  useEffect(() => {
    // Check if user is admin - in a real app, this would be based on authentication
    // For demo purposes, we'll add a simple query param check
    const isAdminMode = new URLSearchParams(window.location.search).get("admin") === "true"
    setIsAdmin(isAdminMode)
  }, [])

  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div ref={ref} className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            {isAdmin ? (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">About Section Image</h3>
                <ImageUploader
                  initialImage={aboutImage}
                  onImageChange={setAboutImage}
                  aspectRatio="portrait"
                  buttonText="Upload About Image"
                />
              </div>
            ) : (
              <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={aboutImage || "/placeholder.svg"}
                  alt="Students collaborating on a computer studies project, demonstrating teamwork and technical skills in a classroom environment"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="absolute -bottom-6 -right-6 bg-navy-600 rounded-lg shadow-lg p-6 text-white max-w-[200px]">
              <h3 className="text-lg font-bold mb-2">Zero Plagiarism</h3>
              <p className="text-sm text-white/90">Each project is uniquely crafted for KCSE 2025</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col space-y-6"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-navy-800 mb-4">
                Victory School Club Membership System
              </h2>
              <p className="text-gray-600">
                Achieving excellent scores in the KCSE and turning your aspirations into reality marks the crucial first
                step toward shaping a bright and successful future. KCSE projects serve as an essential component in
                this journey, offering students an opportunity to apply their knowledge, explore their creativity, and
                demonstrate their understanding of key concepts.
              </p>
              <p className="text-gray-600 mt-4">
                The Victory School Club Membership System is designed to facilitate student registration, track
                membership payments, organize club activities, and generate financial reports. The system enhances
                transparency and streamlines the administration of co-curricular activities, promoting student
                engagement and effective management.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-gold-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-navy-700">Free Past Projects</h3>
                  <p className="text-xs text-gray-500">Access to previous examples</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-gold-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-navy-700">Zero Plagiarism</h3>
                  <p className="text-xs text-gray-500">Original work guaranteed</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-gold-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-navy-700">Affordable Pricing</h3>
                  <p className="text-xs text-gray-500">Student-friendly rates</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-gold-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-navy-700">24/7 Support</h3>
                  <p className="text-xs text-gray-500">Always available to help</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
