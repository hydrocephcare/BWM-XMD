"use client"

import { useRef, useState, useEffect } from "react"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, CheckCircle, FileText, Database, Layout } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { PaymentModal } from "@/components/payment-modal"

export function DownloadSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [prices, setPrices] = useState({ milestone1: 500, milestone2: 1200, complete: 1400 })
  const [loading, setLoading] = useState(false)
  const [paymentState, setPaymentState] = useState<{ show: boolean; files: any[]; total: number; type: string }>({
    show: false,
    files: [],
    total: 0,
    type: "",
  })

  useEffect(() => {
    loadPrices()
  }, [])

  const loadPrices = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("projects").select("file_type, price")

      if (error) {
        console.error("[v0] Error loading prices:", error)
        // Use default prices on error
        setPrices({
          milestone1: 500,
          milestone2: 1200,
          complete: 1400,
        })
        return
      }

      let maxDoc = 500
      let maxDb = 1200

      data?.forEach((project) => {
        if (project.file_type === "Word" && project.price > maxDoc) {
          maxDoc = project.price
        } else if (project.file_type === "Access" && project.price > maxDb) {
          maxDb = project.price
        }
      })

      setPrices({
        milestone1: maxDoc,
        milestone2: maxDb,
        complete: maxDoc + maxDb,
      })
    } catch (error) {
      console.error("[v0] Failed to load prices:", error)
      // Keep default prices on error
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (milestoneType: "1" | "2" | "both") => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("projects").select("*")

      if (error) {
        console.error("Error loading files:", error)
        return
      }

      let files = []
      let total = 0

      if (milestoneType === "1") {
        files = data.filter((p: any) => p.file_type === "Word")
        total = files.length > 0 ? Math.max(...files.map((f: any) => f.price)) : 500
      } else if (milestoneType === "2") {
        files = data.filter((p: any) => p.file_type === "Access")
        total = files.length > 0 ? Math.max(...files.map((f: any) => f.price)) : 1200
      } else {
        const docFiles = data.filter((p: any) => p.file_type === "Word")
        const dbFiles = data.filter((p: any) => p.file_type === "Access")
        const maxDoc = docFiles.length > 0 ? Math.max(...docFiles.map((f: any) => f.price)) : 500
        const maxDb = dbFiles.length > 0 ? Math.max(...dbFiles.map((f: any) => f.price)) : 1200
        total = maxDoc + maxDb
        files = [...docFiles, ...dbFiles]
      }

      setPaymentState({
        show: true,
        files: files, // Now passing all files instead of just first one
        total,
        type: milestoneType,
      })
    } catch (error) {
      console.error("Failed to load files:", error)
    }
  }

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
      <section id="download" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="mb-4 bg-navy-200 text-navy-700 hover:bg-navy-300">Project Files</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-4 text-balance">
              Download Your Project Files
            </h2>
            <p className="text-gray-600 text-base">
              Choose the package that best suits your needs. Each milestone builds upon the previous one, providing a
              comprehensive solution for your KCSE Computer Studies project.
            </p>
          </div>

          <motion.div
            ref={ref}
            variants={container}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            className="grid gap-6 md:grid-cols-3 mb-12"
          >
            {/* Milestone 1 Card */}
            <motion.div variants={item}>
              <Card className="h-full border-2 border-gray-200 bg-white transition-all duration-200 hover:shadow-lg hover:border-navy-300">
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-navy-700 text-xl">Milestone 1</CardTitle>
                    <Badge variant="outline" className="text-navy-600 border-navy-200 whitespace-nowrap">
                      Basic
                    </Badge>
                  </div>
                  <div className="mt-4 mb-2">
                    <span className="text-3xl font-bold text-navy-800">Ksh. {prices.milestone1}</span>
                    <span className="text-gray-500 text-sm ml-1">/copy</span>
                  </div>
                  <CardDescription className="text-gray-600">Complete system documentation</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="mr-3 h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span>Complete Documentation</span>
                    </li>
                    <li className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="mr-3 h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span>System Design & Flowcharts</span>
                    </li>
                    <li className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="mr-3 h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span>Problem Statement</span>
                    </li>
                    <li className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="mr-3 h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span>User Interface Design</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleDownload("1")}
                    className="w-full bg-navy-600 hover:bg-navy-700 text-white font-medium"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Milestone 2 Card - Most Popular */}
            <motion.div variants={item}>
              <Card className="h-full border-2 border-gold-400 bg-white relative transition-all duration-200 hover:shadow-lg">
                <div className="absolute -top-3 left-0 right-0 flex justify-center">
                  <Badge className="bg-gold-500 text-navy-900 hover:bg-gold-600 font-semibold">Most Popular</Badge>
                </div>
                <CardHeader className="pt-8">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-navy-700 text-xl">Milestone 2</CardTitle>
                    <Badge variant="outline" className="text-navy-600 border-navy-200 whitespace-nowrap">
                      Advanced
                    </Badge>
                  </div>
                  <div className="mt-4 mb-2">
                    <span className="text-3xl font-bold text-navy-800">Ksh. {prices.milestone2}</span>
                    <span className="text-gray-500 text-sm ml-1">/copy</span>
                  </div>
                  <CardDescription className="text-gray-600">Customized forms & database system</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="mr-3 h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span>Customized Forms & Reports</span>
                    </li>
                    <li className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="mr-3 h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span>Data/Table Modeling</span>
                    </li>
                    <li className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="mr-3 h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span>Query Processing</span>
                    </li>
                    <li className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="mr-3 h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span>Performance Optimization</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleDownload("2")}
                    className="w-full bg-gold-500 hover:bg-gold-600 text-navy-900 font-medium"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Complete Project Card */}
            <motion.div variants={item}>
              <Card className="h-full border-2 border-gray-200 bg-white transition-all duration-200 hover:shadow-lg hover:border-navy-300">
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-navy-700 text-xl">Complete Project</CardTitle>
                    <Badge variant="outline" className="text-navy-600 border-navy-200 whitespace-nowrap">
                      Full Package
                    </Badge>
                  </div>
                  <div className="mt-4 mb-2">
                    <span className="text-3xl font-bold text-navy-800">Ksh. {prices.complete}</span>
                    <span className="text-gray-500 text-sm ml-1">/copy</span>
                  </div>
                  <CardDescription className="text-gray-600">Everything included in one package</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="mr-3 h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span>Complete Documentation</span>
                    </li>
                    <li className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="mr-3 h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span>Full Database System</span>
                    </li>
                    <li className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="mr-3 h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span>All Forms & Reports</span>
                    </li>
                    <li className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="mr-3 h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span>24/7 WhatsApp Support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleDownload("both")}
                    className="w-full bg-navy-600 hover:bg-navy-700 text-white font-medium"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <div className="bg-navy-50 rounded-lg p-6 border border-gray-200 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-navy-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-navy-600" />
              </div>
              <h3 className="text-lg font-semibold text-navy-700 mb-2">Complete Documentation</h3>
              <p className="text-sm text-gray-600">Comprehensive documentation that meets all KCSE requirements</p>
            </div>

            <div className="bg-navy-50 rounded-lg p-6 border border-gray-200 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-navy-100 rounded-full flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-navy-600" />
              </div>
              <h3 className="text-lg font-semibold text-navy-700 mb-2">Database Structure</h3>
              <p className="text-sm text-gray-600">Professional database design with optimization</p>
            </div>

            <div className="bg-navy-50 rounded-lg p-6 border border-gray-200 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-navy-100 rounded-full flex items-center justify-center mb-4">
                <Layout className="h-6 w-6 text-navy-600" />
              </div>
              <h3 className="text-lg font-semibold text-navy-700 mb-2">Professional UI</h3>
              <p className="text-sm text-gray-600">Intuitive interface designed for easy navigation</p>
            </div>
          </div>

          {/* View More Files section with link to projects page */}
          <div className="mt-16 pt-12 border-t-2 border-gray-200">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-navy-800 mb-4">Want to See More?</h3>
              <p className="text-gray-600 mb-6">
                Browse all available project batches and files on our dedicated projects page. View complete
                documentation, database files, and choose from multiple KCSE-standard solutions.
              </p>
              <a href="/projects" className="inline-block">
                <Button className="bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all">
                  View All Available Batches
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentState.show}
        onClose={() =>
          setPaymentState({
            show: false,
            files: [],
            total: 0,
            type: "",
          })
        }
        files={paymentState.files}
        totalAmount={paymentState.total}
        packageType={paymentState.type as any}
      />
    </>
  )
}
