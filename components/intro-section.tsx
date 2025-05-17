"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

export function IntroSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="py-8 md:py-12 bg-white dark:bg-navy-800">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <Card className="p-6 md:p-8 bg-navy-50/50 dark:bg-navy-700/50 border-navy-100 dark:border-navy-600">
            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              Your project, Victory School Club Membership System, should be able to facilitate student registration, track membership payments, organizes club activities, and generates financial reports. The system should enhance transparency and streamlines the administration of co-curricular activities, promoting student engagement and effective management.
              
              This system helps schools manage and track member data, project submissions, and related operations. Ideal
              for computer studies or IT project demonstrations.
            </p>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
