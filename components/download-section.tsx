"use client"

import { useRef, useState } from "react"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, CheckCircle, FileText, Database, Layout } from "lucide-react"
import { BatchSelectorModal } from "@/components/batch-selector-modal"

export function DownloadSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [selectorModal, setSelectorModal] = useState<{
    isOpen: boolean
    type: "documentation" | "database" | "both"
    title: string
  }>({ isOpen: false, type: "documentation", title: "" })

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
    <>
      <section id="download" className="py-16 md:py-24 bg-navy-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="mb-4 bg-navy-200 text-navy-700 hover:bg-navy-300">Project Files</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-4">Download Your Project Files</h2>
            <p className="text-gray-600">
              Choose the package that best suits your needs. Each milestone builds upon the previous one, providing a
              comprehensive solution for your KCSE Computer Studies project.
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
              <Card className="h-full border-gray-200 transition-all duration-200 hover:shadow-md hover:border-navy-200">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-navy-700">Milestone 1</CardTitle>
                    <Badge variant="outline" className="text-navy-600 border-navy-200">
                      Basic
                    </Badge>
                  </div>
                  <div className="mt-2 mb-2">
                    <span className="text-2xl font-bold text-navy-800">Ksh. 500</span>
                    <span className="text-gray-500 text-sm">/copy</span>
                  </div>
                  <CardDescription>Basic system implementation with core features</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="mr-2 h-4 w-4 text-gold-500" />
                      Complete Documentation
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="mr-2 h-4 w-4 text-gold-500" />
                      Project Overview
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="mr-2 h-4 w-4 text-gold-500" />
                      Problem Statement
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="mr-2 h-4 w-4 text-gold-500" />
                      System Design & Flow Designs
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="mr-2 h-4 w-4 text-gold-500" />
                      User Interface
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() =>
                      setSelectorModal({
                        isOpen: true,
                        type: "documentation",
                        title: "Select Milestone 1 Batch",
                      })
                    }
                    className="w-full bg-navy-600 hover:bg-navy-700 group"
                  >
                    <Download className="mr-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full border-navy-300 relative transition-all duration-200 hover:shadow-md">
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <Badge className="bg-gold-500 text-navy-900 hover:bg-gold-600">Most Popular</Badge>
                </div>
                <CardHeader className="pt-8">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-navy-700">Milestone 2</CardTitle>
                    <Badge variant="outline" className="text-navy-600 border-navy-200">
                      Advanced
                    </Badge>
                  </div>
                  <div className="mt-2 mb-2">
                    <span className="text-2xl font-bold text-navy-800">Ksh. 1,200</span>
                    <span className="text-gray-500 text-sm">/copy</span>
                  </div>
                  <CardDescription>Enhanced system with additional features</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="mr-2 h-4 w-4 text-gold-500" />
                      Fully Customized Forms & Reports
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="mr-2 h-4 w-4 text-gold-500" />
                      Data/Table Modeling
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="mr-2 h-4 w-4 text-gold-500" />
                      Database Structure
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="mr-2 h-4 w-4 text-gold-500" />
                      Query Processing
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="mr-2 h-4 w-4 text-gold-500" />
                      Performance Optimization
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() =>
                      setSelectorModal({
                        isOpen: true,
                        type: "database",
                        title: "Select Milestone 2 Batch",
                      })
                    }
                    className="w-full bg-gold-500 hover:bg-gold-600 text-navy-900 group"
                  >
                    <Download className="mr-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full border-gray-200 transition-all duration-200 hover:shadow-md hover:border-navy-200">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-navy-700">Complete Project</CardTitle>
                    <Badge variant="outline" className="text-navy-600 border-navy-200">
                      Full
                    </Badge>
                  </div>
                  <div className="mt-2 mb-2">
                    <span className="text-2xl font-bold text-navy-800">Ksh. 1,400</span>
                    <span className="text-gray-500 text-sm">/copy</span>
                  </div>
                  <CardDescription>Full system with complete documentation</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="mr-2 h-4 w-4 text-gold-500" />
                      Fully Customized Forms & Reports
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="mr-2 h-4 w-4 text-gold-500" />
                      Project Overview
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="mr-2 h-4 w-4 text-gold-500" />
                      Documentation Clarity
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="mr-2 h-4 w-4 text-gold-500" />
                      Performance Optimization
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="mr-2 h-4 w-4 text-gold-500" />
                      WhatsApp Chat for Support
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() =>
                      setSelectorModal({
                        isOpen: true,
                        type: "both",
                        title: "Select Complete Project Batch",
                      })
                    }
                    className="w-full bg-navy-600 hover:bg-navy-700 group"
                  >
                    <Download className="mr-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
              <div className="h-12 w-12 bg-navy-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-navy-600" />
              </div>
              <h3 className="text-lg font-semibold text-navy-700 mb-2">Complete Documentation</h3>
              <p className="text-sm text-gray-600">
                Comprehensive documentation that meets all KCSE requirements, including system analysis, design, and
                implementation details.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
              <div className="h-12 w-12 bg-navy-100 rounded-full flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-navy-600" />
              </div>
              <h3 className="text-lg font-semibold text-navy-700 mb-2">Database Structure</h3>
              <p className="text-sm text-gray-600">
                Well-designed database with proper relationships, normalization, and optimized queries for efficient
                data management.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
              <div className="h-12 w-12 bg-navy-100 rounded-full flex items-center justify-center mb-4">
                <Layout className="h-6 w-6 text-navy-600" />
              </div>
              <h3 className="text-lg font-semibold text-navy-700 mb-2">User Interface</h3>
              <p className="text-sm text-gray-600">
                Intuitive and user-friendly interface designed for easy navigation and efficient club management
                operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <BatchSelectorModal
        isOpen={selectorModal.isOpen}
        onClose={() => setSelectorModal({ ...selectorModal, isOpen: false })}
        filterType={selectorModal.type}
        title={selectorModal.title}
      />
    </>
  )
}
