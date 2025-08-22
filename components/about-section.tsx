"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

export function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [zeroPlagiarismImage, setZeroPlagiarismImage] = useState("/placeholder.svg?height=600&width=800")

  useEffect(() => {
    // Load saved images from localStorage
    try {
      const savedImages = localStorage.getItem("victory-school-home-images")
      if (savedImages) {
        const images = JSON.parse(savedImages)
        if (images.zeroPlagiarism) {
          setZeroPlagiarismImage(images.zeroPlagiarism)
        }
      }
    } catch (error) {
      console.error("Error loading zero plagiarism image:", error)
    }
  }, [])

  return (
    <section ref={ref} className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-4">Why Choose Us?</h2>
          <p className="text-gray-600">
            We provide high-quality, original project materials that help students excel in their KCSE Computer Studies
            examination.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col space-y-6"
          >
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-navy-800 mb-4 flex items-center">
                <CheckCircle className="h-6 w-6 text-gold-500 mr-2" />
                Zero Plagiarism
              </h3>
              <p className="text-gray-600">
                All our projects are 100% original and uniquely crafted for each student. We understand the importance
                of original work in academic assessment and ensure that every project meets this high standard.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-navy-800 mb-4 flex items-center">
                <CheckCircle className="h-6 w-6 text-gold-500 mr-2" />
                Complete Documentation
              </h3>
              <p className="text-gray-600">
                Our projects come with comprehensive documentation including system analysis, design, implementation
                details, and user manuals. This thorough approach ensures you understand every aspect of your project.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-navy-800 mb-4 flex items-center">
                <CheckCircle className="h-6 w-6 text-gold-500 mr-2" />
                KCSE Syllabus Aligned
              </h3>
              <p className="text-gray-600">
                All our projects are designed to meet the specific requirements of the KCSE Computer Studies syllabus.
                This alignment ensures that your project will satisfy all examination criteria.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg">
              <Image
                src="https://milestones.sowetomarkets.com/wp-content/uploads/2025/03/Basketball-Club-Sports-Badge-Logo.png"
                alt="Student receiving personalized project guidance from a teacher, with original code visible on computer screens"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
