"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { Target, Users, Award, BookOpen } from "lucide-react"

export function MissionSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section className="py-16 md:py-24 bg-navy-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-4">Our Mission & Values</h2>
          <p className="text-gray-600">
            We are committed to empowering KCSE students with the resources and support they need to excel in their
            Computer Studies projects and beyond.
          </p>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
            <div className="h-12 w-12 bg-navy-100 rounded-full flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-navy-600" />
            </div>
            <h3 className="text-lg font-semibold text-navy-700 mb-2">Our Mission</h3>
            <p className="text-sm text-gray-600">
              To provide high-quality, accessible educational resources that help students achieve excellence in their
              KCSE Computer Studies projects.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
            <div className="h-12 w-12 bg-navy-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-navy-600" />
            </div>
            <h3 className="text-lg font-semibold text-navy-700 mb-2">Student-Centered</h3>
            <p className="text-sm text-gray-600">
              We put students' needs first, ensuring our resources are accessible, affordable, and designed to maximize
              learning outcomes.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
            <div className="h-12 w-12 bg-navy-100 rounded-full flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-navy-600" />
            </div>
            <h3 className="text-lg font-semibold text-navy-700 mb-2">Excellence</h3>
            <p className="text-sm text-gray-600">
              We strive for excellence in everything we do, from the quality of our project materials to our customer
              service.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
            <div className="h-12 w-12 bg-navy-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-navy-600" />
            </div>
            <h3 className="text-lg font-semibold text-navy-700 mb-2">Continuous Learning</h3>
            <p className="text-sm text-gray-600">
              We believe in lifelong learning and continuously update our resources to reflect the latest educational
              standards and technologies.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
