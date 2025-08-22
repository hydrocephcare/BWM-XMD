"use client"

import { useRef } from "react"
import Image from "next/image"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

export function AboutContent() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div ref={ref} className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80"
                alt="Students collaborating on computer projects - representing our mission to help KCSE Computer Studies students succeed"
                fill
                className="object-cover"
                priority
              />
              {/* Overlay for better text contrast if needed */}
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col space-y-6"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-navy-800 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2020, our platform was created by a team of experienced Computer Studies teachers and
                software developers who recognized the challenges students face when completing their KCSE projects.
              </p>
              <p className="text-gray-600">
                We believe that every student deserves access to high-quality resources that can help them succeed in
                their academic endeavors. Our mission is to provide comprehensive, well-documented, and
                easy-to-understand project materials that align with the KCSE syllabus requirements.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-gold-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-navy-700">Original Work</h3>
                  <p className="text-sm text-gray-600">Each project is uniquely crafted to ensure zero plagiarism</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-gold-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-navy-700">Syllabus Aligned</h3>
                  <p className="text-sm text-gray-600">All projects are designed to meet KCSE requirements</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-gold-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-navy-700">Comprehensive Support</h3>
                  <p className="text-sm text-gray-600">24/7 assistance via WhatsApp, phone, and email</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
