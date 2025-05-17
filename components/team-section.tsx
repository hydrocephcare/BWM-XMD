"use client"

import { useRef } from "react"
import Image from "next/image"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export function TeamSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-4">Meet Our Team</h2>
          <p className="text-gray-600">
            Our team consists of experienced educators, software developers, and support staff dedicated to helping KCSE
            students succeed in their Computer Studies projects.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid gap-6 md:grid-cols-3 lg:grid-cols-4"
        >
          <motion.div variants={item}>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md hover:border-navy-200">
              <div className="relative h-64 w-full">
                <Image
                  src="/placeholder.svg?height=400&width=300"
                  alt="John Doe, Lead Developer with over 10 years of experience in KCSE curriculum, wearing professional attire and smiling confidently"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-navy-700">John Doe</h3>
                <Badge className="mt-1 mb-2 bg-navy-100 text-navy-700 hover:bg-navy-200">Lead Developer</Badge>
                <p className="text-sm text-gray-600">
                  Computer Science teacher with over 10 years of experience in KCSE curriculum.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md hover:border-navy-200">
              <div className="relative h-64 w-full">
                <Image
                  src="/placeholder.svg?height=400&width=300"
                  alt="Jane Smith, Project Manager and former KCSE examiner, in a professional setting with educational materials visible in the background"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-navy-700">Jane Smith</h3>
                <Badge className="mt-1 mb-2 bg-navy-100 text-navy-700 hover:bg-navy-200">Project Manager</Badge>
                <p className="text-sm text-gray-600">
                  Former KCSE examiner with expertise in project documentation and assessment.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md hover:border-navy-200">
              <div className="relative h-64 w-full">
                <Image
                  src="/placeholder.svg?height=400&width=300"
                  alt="David Kamau, Database Specialist working on a computer with database diagrams visible on screen"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-navy-700">David Kamau</h3>
                <Badge className="mt-1 mb-2 bg-navy-100 text-navy-700 hover:bg-navy-200">Database Specialist</Badge>
                <p className="text-sm text-gray-600">
                  Database expert with a passion for teaching students efficient data modeling techniques.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md hover:border-navy-200">
              <div className="relative h-64 w-full">
                <Image
                  src="/placeholder.svg?height=400&width=300"
                  alt="Sarah Wanjiku, Support Lead assisting a student with their project, demonstrating her dedication to student success"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-navy-700">Sarah Wanjiku</h3>
                <Badge className="mt-1 mb-2 bg-navy-100 text-navy-700 hover:bg-navy-200">Support Lead</Badge>
                <p className="text-sm text-gray-600">
                  Dedicated to providing exceptional support and guidance to students throughout their project journey.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
