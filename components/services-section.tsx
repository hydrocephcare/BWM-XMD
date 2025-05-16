"use client"

import { useRef } from "react"
import Link from "next/link"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Cloud, GraduationCap, ArrowRight } from "lucide-react"

export function ServicesSection() {
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
    <section id="services" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="mb-4 bg-navy-200 text-navy-700 hover:bg-navy-300">Beyond KCSE</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-4">Other Services</h2>
          <p className="text-gray-600">
            Beyond projects, what's next after KCSE? We support our students by keeping them engaged and providing
            opportunities to ensure they have something meaningful to do after their exams.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid gap-6 md:grid-cols-3"
        >
          <motion.div variants={item}>
            <Card className="h-full border-gray-200 transition-all duration-200 hover:shadow-md hover:border-navy-200 hover:translate-y-[-5px]">
              <CardHeader>
                <div className="h-12 w-12 bg-navy-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-navy-600" />
                </div>
                <CardTitle className="text-navy-700">Data Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Are you a student interested in Data Security and Biometric Technology? We offer specialized training
                  to equip students with valuable skills, ensuring they have meaningful opportunities after KCSE.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-navy-200 text-navy-700 hover:bg-navy-50 hover:text-navy-800 group"
                >
                  <Link href="/contact">
                    Contact Us
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="h-full border-gray-200 transition-all duration-200 hover:shadow-md hover:border-navy-200 hover:translate-y-[-5px]">
              <CardHeader>
                <div className="h-12 w-12 bg-navy-100 rounded-full flex items-center justify-center mb-4">
                  <Cloud className="h-6 w-6 text-navy-600" />
                </div>
                <CardTitle className="text-navy-700">Cloud Computing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Are you a student interested in online or web development, coding, and AI? We are here to sharpen your
                  skills with top-notch training to help make your dreams come true. But first, focus on passing your
                  exams!
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-navy-200 text-navy-700 hover:bg-navy-50 hover:text-navy-800 group"
                >
                  <Link href="/contact">
                    Contact Us
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="h-full border-gray-200 transition-all duration-200 hover:shadow-md hover:border-navy-200 hover:translate-y-[-5px]">
              <CardHeader>
                <div className="h-12 w-12 bg-navy-100 rounded-full flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-navy-600" />
                </div>
                <CardTitle className="text-navy-700">KCSE Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Our projects are built to the highest standards, with well-structured documentation and properly
                  modeled database systems to ensure quality and reliability. Get a head start on your KCSE Computer
                  Studies project.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-navy-200 text-navy-700 hover:bg-navy-50 hover:text-navy-800 group"
                >
                  <Link href="#download">
                    Down
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
