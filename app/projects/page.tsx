"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Database, CheckCircle, Loader2, X } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"

interface ProjectFile {
  id: string
  batch_name: string
  file_name: string
  file_type: string
  price: number
  file_url: string
  is_external_link: boolean
}

interface BatchFiles {
  documentation?: ProjectFile
  database?: ProjectFile
}

interface PaymentInfo {
  files: ProjectFile[]
  totalAmount: number
  packageType: 'documentation' | 'database' | 'both'
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectFile[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null)
  const [selectedFileType, setSelectedFileType] = useState<string | null>(null)
  const [paymentModal, setPaymentModal] = useState<{ show: boolean; paymentInfo: PaymentInfo | null }>({
    show: false,
    paymentInfo: null,
  })
  
  const searchParams = useSearchParams()
  const milestoneFromHome = searchParams?.get('milestone')

  useEffect(() => {
    loadProjects()
  }, [])

  useEffect(() => {
    // If coming from homepage with milestone parameter
    if (milestoneFromHome && projects.length > 0) {
      // Show batch selector for the selected milestone
      setSelectedFileType(milestoneFromHome === '1' ? 'Word' : milestoneFromHome === '2' ? 'Access' : 'both')
    }
  }, [milestoneFromHome, projects])

  const loadProjects = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("batch_name", { ascending: true })

      if (error) {
        console.error("Error loading projects:", error)
      } else {
        setProjects(data || [])
      }
    } catch (error) {
      console.error("Failed to load projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const getBatchedProjects = (): { [key: string]: BatchFiles } => {
    const batched: { [key: string]: BatchFiles } = {}
    
    projects.forEach((project) => {
      if (!batched[project.batch_name]) {
        batched[project.batch_name] = {}
      }
      
      if (project.file_type === 'Word') {
        batched[project.batch_name].documentation = project
      } else if (project.file_type === 'Access') {
        batched[project.batch_name].database = project
      }
    })
    
    return batched
  }

  const handleDownloadClick = (batch: string, fileType: string) => {
    const batchedProjects = getBatchedProjects()
    const batchFiles = batchedProjects[batch]
    
    if (fileType === 'documentation' && batchFiles.documentation) {
      setPaymentModal({ 
        show: true, 
        paymentInfo: {
          files: [batchFiles.documentation],
          totalAmount: batchFiles.documentation.price,
          packageType: 'documentation'
        }
      })
    } else if (fileType === 'database' && batchFiles.database) {
      setPaymentModal({ 
        show: true, 
        paymentInfo: {
          files: [batchFiles.database],
          totalAmount: batchFiles.database.price,
          packageType: 'database'
        }
      })
    } else if (fileType === 'both' && batchFiles.documentation && batchFiles.database) {
      // For complete project, include both files
      setPaymentModal({ 
        show: true, 
        paymentInfo: {
          files: [batchFiles.documentation, batchFiles.database],
          totalAmount: batchFiles.documentation.price + batchFiles.database.price,
          packageType: 'both'
        }
      })
    }
  }

  const batchedProjects = getBatchedProjects()
  const batches = Object.keys(batchedProjects).sort()

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center bg-navy-50">
          <Loader2 className="w-12 h-12 animate-spin text-navy-600" />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 bg-navy-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9nPjwvc3ZnPg==')] opacity-40"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2 rounded-full mb-6">
                <div className="w-2 h-2 bg-gold-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-white">Premium Project Files</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gold-400">
                KCSE Computer Studies Projects
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
                Professional, ready-to-submit project files for KCSE Computer Studies. 
                Get complete documentation, working databases, and expert-level implementations.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 px-5 py-3 rounded-xl hover:bg-white/20 transition-all">
                  <CheckCircle className="h-5 w-5 text-gold-400" />
                  <span className="font-medium text-white">KCSE Standard</span>
                </div>
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 px-5 py-3 rounded-xl hover:bg-white/20 transition-all">
                  <CheckCircle className="h-5 w-5 text-gold-400" />
                  <span className="font-medium text-white">Instant Download</span>
                </div>
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 px-5 py-3 rounded-xl hover:bg-white/20 transition-all">
                  <CheckCircle className="h-5 w-5 text-gold-400" />
                  <span className="font-medium text-white">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {batches.length === 0 ? (
              <Card className="p-12 text-center max-w-2xl mx-auto bg-white">
                <div className="mb-4">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                </div>
                <h3 className="text-xl font-semibold text-navy-700 mb-2">
                  No Projects Available Yet
                </h3>
                <p className="text-gray-500">
                  Check back soon for new project files!
                </p>
              </Card>
            ) : (
              <div className="space-y-16">
                {batches.map((batchName, index) => {
                  const batchFiles = batchedProjects[batchName]
                  const hasDocumentation = !!batchFiles.documentation
                  const hasDatabase = !!batchFiles.database
                  const hasBoth = hasDocumentation && hasDatabase
                  
                  const docPrice = batchFiles.documentation?.price || 0
                  const dbPrice = batchFiles.database?.price || 0
                  const completePrice = hasBoth ? docPrice + dbPrice : 0

                  return (
                    <motion.div
                      key={batchName}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {/* Batch Header */}
                      <div className="flex items-center gap-4 mb-8">
                        <div className="h-1 w-16 bg-gold-500 rounded"></div>
                        <h2 className="text-3xl font-bold text-navy-800">{batchName}</h2>
                        <div className="h-1 flex-1 bg-gray-200 rounded"></div>
                      </div>

                      {/* Pricing Cards */}
                      <div className="grid md:grid-cols-3 gap-6">
                        {/* Milestone 1 - Documentation */}
                        {hasDocumentation && (
                          <Card className="h-full border-gray-200 transition-all duration-200 hover:shadow-lg hover:border-navy-300 bg-white">
                            <CardHeader>
                              <div className="flex justify-between items-center mb-2">
                                <CardTitle className="text-navy-700">Milestone 1</CardTitle>
                                <Badge variant="outline" className="text-navy-600 border-navy-200">
                                  Basic
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 bg-navy-100 rounded-lg flex items-center justify-center">
                                  <FileText className="h-5 w-5 text-navy-600" />
                                </div>
                                <div>
                                  <div className="text-2xl font-bold text-navy-800">
                                    Ksh. {docPrice}
                                  </div>
                                  <div className="text-xs text-gray-500">Documentation Only</div>
                                </div>
                              </div>
                              <CardDescription className="text-sm">
                                {batchFiles.documentation?.file_name || 'Word Documentation'}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                <li className="flex items-center text-sm text-gray-600">
                                  <CheckCircle className="mr-2 h-4 w-4 text-gold-500 flex-shrink-0" />
                                  Complete Documentation
                                </li>
                                <li className="flex items-center text-sm text-gray-600">
                                  <CheckCircle className="mr-2 h-4 w-4 text-gold-500 flex-shrink-0" />
                                  System Design & Flowcharts
                                </li>
                                <li className="flex items-center text-sm text-gray-600">
                                  <CheckCircle className="mr-2 h-4 w-4 text-gold-500 flex-shrink-0" />
                                  Problem Statement
                                </li>
                                <li className="flex items-center text-sm text-gray-600">
                                  <CheckCircle className="mr-2 h-4 w-4 text-gold-500 flex-shrink-0" />
                                  User Interface Design
                                </li>
                              </ul>
                            </CardContent>
                            <CardFooter>
                              <Button 
                                className="w-full bg-navy-600 hover:bg-navy-700 group"
                                onClick={() => handleDownloadClick(batchName, 'documentation')}
                              >
                                Download
                                <Download className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
                              </Button>
                            </CardFooter>
                          </Card>
                        )}

                        {/* Milestone 2 - Database */}
                        {hasDatabase && (
                          <Card className={`h-full transition-all duration-200 hover:shadow-lg bg-white ${
                            hasBoth ? 'border-navy-300 relative' : 'border-gray-200 hover:border-navy-300'
                          }`}>
                            {hasBoth && (
                              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                                <Badge className="bg-gold-500 text-navy-900 hover:bg-gold-600">
                                  Most Popular
                                </Badge>
                              </div>
                            )}
                            <CardHeader className={hasBoth ? "pt-8" : ""}>
                              <div className="flex justify-between items-center mb-2">
                                <CardTitle className="text-navy-700">Milestone 2</CardTitle>
                                <Badge variant="outline" className="text-navy-600 border-navy-200">
                                  Advanced
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 bg-navy-100 rounded-lg flex items-center justify-center">
                                  <Database className="h-5 w-5 text-navy-600" />
                                </div>
                                <div>
                                  <div className="text-2xl font-bold text-navy-800">
                                    Ksh. {dbPrice}
                                  </div>
                                  <div className="text-xs text-gray-500">Database System</div>
                                </div>
                              </div>
                              <CardDescription className="text-sm">
                                {batchFiles.database?.file_name || 'Access Database'}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                <li className="flex items-center text-sm text-gray-600">
                                  <CheckCircle className="mr-2 h-4 w-4 text-gold-500 flex-shrink-0" />
                                  Customized Forms & Reports
                                </li>
                                <li className="flex items-center text-sm text-gray-600">
                                  <CheckCircle className="mr-2 h-4 w-4 text-gold-500 flex-shrink-0" />
                                  Data/Table Modeling
                                </li>
                                <li className="flex items-center text-sm text-gray-600">
                                  <CheckCircle className="mr-2 h-4 w-4 text-gold-500 flex-shrink-0" />
                                  Query Processing
                                </li>
                                <li className="flex items-center text-sm text-gray-600">
                                  <CheckCircle className="mr-2 h-4 w-4 text-gold-500 flex-shrink-0" />
                                  Performance Optimization
                                </li>
                              </ul>
                            </CardContent>
                            <CardFooter>
                              <Button 
                                className="w-full bg-gold-500 hover:bg-gold-600 text-navy-900 group"
                                onClick={() => handleDownloadClick(batchName, 'database')}
                              >
                                Download
                                <Download className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
                              </Button>
                            </CardFooter>
                          </Card>
                        )}

                        {/* Complete Project */}
                        {hasBoth && (
                          <Card className="h-full border-gray-200 transition-all duration-200 hover:shadow-lg hover:border-navy-300 bg-white">
                            <CardHeader>
                              <div className="flex justify-between items-center mb-2">
                                <CardTitle className="text-navy-700">Complete Project</CardTitle>
                                <Badge variant="outline" className="text-navy-600 border-navy-200">
                                  Full Package
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 bg-navy-100 rounded-lg flex items-center justify-center">
                                  <div className="flex">
                                    <FileText className="h-4 w-4 text-navy-600" />
                                    <Database className="h-4 w-4 text-navy-600 -ml-1" />
                                  </div>
                                </div>
                                <div>
                                  <div className="text-2xl font-bold text-navy-800">
                                    Ksh. {completePrice}
                                  </div>
                                  <div className="text-xs text-gray-500">Both Files</div>
                                </div>
                              </div>
                              <CardDescription className="text-sm">
                                Full system with documentation & database
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                <li className="flex items-center text-sm text-gray-600">
                                  <CheckCircle className="mr-2 h-4 w-4 text-gold-500 flex-shrink-0" />
                                  Everything in Milestone 1 & 2
                                </li>
                                <li className="flex items-center text-sm text-gray-600">
                                  <CheckCircle className="mr-2 h-4 w-4 text-gold-500 flex-shrink-0" />
                                  Complete Documentation
                                </li>
                                <li className="flex items-center text-sm text-gray-600">
                                  <CheckCircle className="mr-2 h-4 w-4 text-gold-500 flex-shrink-0" />
                                  Full Database System
                                </li>
                                <li className="flex items-center text-sm text-gray-600">
                                  <CheckCircle className="mr-2 h-4 w-4 text-gold-500 flex-shrink-0" />
                                  WhatsApp Support
                                </li>
                              </ul>
                            </CardContent>
                            <CardFooter>
                              <Button 
                                className="w-full bg-navy-600 hover:bg-navy-700 group"
                                onClick={() => handleDownloadClick(batchName, 'both')}
                              >
                                Download Both Files
                                <Download className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
                              </Button>
                            </CardFooter>
                          </Card>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* How It Works Section */}
            {batches.length > 0 && (
              <div className="mt-20">
                <div className="text-center mb-12">
                  <Badge className="mb-4 bg-navy-200 text-navy-700 hover:bg-navy-300">
                    Simple Process
                  </Badge>
                  <h2 className="text-3xl font-bold text-navy-800 mb-4">How It Works</h2>
                </div>
                
                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { step: "1", title: "Choose Your Files", desc: "Select documentation, database, or complete project" },
                    { step: "2", title: "Enter Phone Number", desc: "Provide your M-Pesa number for payment" },
                    { step: "3", title: "Complete Payment", desc: "Enter PIN on STK push notification" },
                    { step: "4", title: "Instant Download", desc: "Get your files immediately after payment" }
                  ].map((item, i) => (
                    <div key={i} className="bg-white rounded-lg p-6 shadow-sm text-center">
                      <div className="h-12 w-12 bg-gold-500 text-navy-900 font-bold rounded-full flex items-center justify-center mb-4 mx-auto text-xl">
                        {item.step}
                      </div>
                      <h3 className="text-lg font-semibold text-navy-700 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />

      {/* Payment Modal */}
      {paymentModal.show && paymentModal.paymentInfo && (
        <PaymentModal 
          paymentInfo={paymentModal.paymentInfo} 
          onClose={() => setPaymentModal({ show: false, paymentInfo: null })} 
        />
      )}
    </div>
  )
}

function PaymentModal({ paymentInfo, onClose }: { paymentInfo: PaymentInfo; onClose: () => void }) {
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "processing" | "checking" | "success" | "error">("idle")

  const handlePayment = async () => {
    if (!phone || phone.length < 10) {
      alert("Please enter a valid phone number")
      return
    }

    setLoading(true)
    setStatus("processing")

    try {
      const response = await fetch("/api/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          amount: paymentInfo.totalAmount,
          donor_name: "Student",
          payment_type: "project_file",
          file_id: paymentInfo.files[0].id,
        }),
      })

      const data = await response.json()

      if (data.status === "success" && data.reference) {
        setStatus("checking")
        checkPaymentStatus(data.reference)
      } else {
        setStatus("error")
        setLoading(false)
      }
    } catch (error) {
      console.error("Payment error:", error)
      setStatus("error")
      setLoading(false)
    }
  }

  const checkPaymentStatus = async (reference: string) => {
    const maxAttempts = 30
    let attempts = 0

    const checkInterval = setInterval(async () => {
      attempts++

      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("payments")
          .select("*")
          .eq("transaction_id", reference)
          .single()

        if (!error && data && data.payment_status === "completed") {
          clearInterval(checkInterval)
          setStatus("success")
          setLoading(false)

          // Download all files in the package
          setTimeout(() => {
            paymentInfo.files.forEach((file, index) => {
              setTimeout(() => {
                window.open(file.file_url, "_blank")
              }, index * 500) // Stagger downloads by 500ms to avoid blocking
            })
            
            // Close modal after downloads start
            setTimeout(() => {
              onClose()
            }, paymentInfo.files.length * 500 + 1000)
          }, 2000)
          return
        }
      } catch (error) {
        console.error("Error checking payment:", error)
      }

      if (attempts >= maxAttempts) {
        clearInterval(checkInterval)
        setStatus("error")
        setLoading(false)
      }
    }, 2000)
  }

  const getPackageDescription = () => {
    if (paymentInfo.packageType === 'both') {
      return `${paymentInfo.files.length} files (Documentation + Database)`
    }
    return paymentInfo.files[0].file_name
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <Card className="w-full max-w-md shadow-2xl bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-navy-800">Complete Payment</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </CardHeader>

        <CardContent>
          {status === "idle" && (
            <>
              <div className="mb-6 p-5 bg-gradient-to-br from-navy-50 to-blue-50 rounded-xl border border-navy-200 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Package</p>
                    <p className="font-semibold text-navy-900 text-lg">{getPackageDescription()}</p>
                  </div>
                  <div className="bg-white px-3 py-1 rounded-full">
                    <span className="text-xs font-medium text-navy-600">
                      {paymentInfo.packageType === 'both' ? '2 Files' : '1 File'}
                    </span>
                  </div>
                </div>
                
                {paymentInfo.packageType === 'both' && (
                  <div className="space-y-2 mb-4 bg-white/60 backdrop-blur-sm rounded-lg p-3">
                    {paymentInfo.files.map((file, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-2"></div>
                        {file.file_name}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-baseline justify-between pt-4 border-t border-navy-200/50">
                  <span className="text-sm font-medium text-gray-600">Total Amount</span>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-navy-900">KES {paymentInfo.totalAmount}</div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3 text-navy-800 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                  M-Pesa Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                    <span className="text-gray-400 font-medium">+254</span>
                    <div className="w-px h-6 bg-gray-300"></div>
                  </div>
                  <input
                    type="tel"
                    placeholder="712 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-20 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-navy-500 focus:ring-4 focus:ring-navy-100 focus:outline-none text-navy-900 font-medium text-lg transition-all"
                    maxLength={10}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  You'll receive an STK push on this number
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={onClose} 
                  variant="outline" 
                  className="flex-1 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 font-semibold h-12"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handlePayment} 
                  disabled={loading} 
                  className="flex-1 bg-gradient-to-r from-navy-600 to-navy-700 hover:from-navy-700 hover:to-navy-800 font-semibold h-12 shadow-lg shadow-navy-500/30"
                >
                  {loading ? "Processing..." : "Pay Now"}
                </Button>
              </div>
            </>
          )}

          {(status === "processing" || status === "checking") && (
            <div className="text-center py-8">
              <div className="relative mb-6">
                {/* Animated Phone Icon */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                  {/* Outer ring */}
                  <div className="absolute inset-0 border-4 border-navy-200 rounded-full"></div>
                  {/* Spinning ring */}
                  <div className="absolute inset-0 border-4 border-transparent border-t-navy-600 rounded-full animate-spin"></div>
                  {/* Phone icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-16 bg-gradient-to-br from-navy-600 to-navy-700 rounded-lg shadow-lg flex items-center justify-center relative">
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-1 bg-navy-800 rounded-full"></div>
                      <svg className="w-6 h-6 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-navy-800 rounded-full"></div>
                    </div>
                  </div>
                  {/* Pulse effect */}
                  <div className="absolute inset-0 bg-navy-400 rounded-full animate-ping opacity-20"></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="font-bold text-2xl text-navy-900 mb-2">
                    {status === "processing" ? "Check Your Phone" : "Confirming Payment"}
                  </p>
                  <p className="text-gray-600">
                    {status === "processing"
                      ? "Enter your M-Pesa PIN to complete payment"
                      : "Verifying your transaction..."}
                  </p>
                </div>
                
                {status === "processing" && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 max-w-sm mx-auto">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-semibold text-blue-900 mb-1">STK Push Sent</p>
                        <p className="text-xs text-blue-700">Check your phone for the M-Pesa prompt and enter your PIN</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {status === "checking" && (
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-navy-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-navy-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-navy-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="text-center py-8">
              <div className="relative mb-6">
                {/* Success animation */}
                <div className="w-24 h-24 mx-auto relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full animate-pulse"></div>
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {/* Celebratory rings */}
                  <div className="absolute -inset-4 border-4 border-green-200 rounded-full animate-ping"></div>
                </div>
                
                <div className="inline-flex items-center gap-2 bg-green-100 border border-green-300 px-4 py-1.5 rounded-full mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Payment Confirmed</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="font-bold text-2xl text-green-700 mb-2">🎉 Success!</p>
                  <p className="text-gray-700 font-medium">
                    {paymentInfo.packageType === 'both' 
                      ? "Your files are downloading now" 
                      : "Your file is downloading now"}
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 max-w-sm mx-auto">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Download className="w-5 h-5 text-white animate-bounce" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-sm font-semibold text-green-900 mb-1">Download Started</p>
                      <p className="text-xs text-green-700">
                        {paymentInfo.packageType === 'both' 
                          ? "Both files will open in new tabs" 
                          : "Check your downloads folder"}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <p className="text-xs text-gray-500">Closing automatically in a moment...</p>
                </div>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="text-center py-8">
              <div className="relative mb-6">
                {/* Error animation */}
                <div className="w-24 h-24 mx-auto relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 rounded-full"></div>
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                
                <div className="inline-flex items-center gap-2 bg-red-100 border border-red-300 px-4 py-1.5 rounded-full mb-4">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-xs font-bold text-red-700 uppercase tracking-wide">Payment Failed</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="font-bold text-2xl text-red-700 mb-2">Payment Not Completed</p>
                  <p className="text-gray-600">The transaction could not be processed</p>
                </div>
                
                <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-5 text-left max-w-sm mx-auto">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-900 mb-2">Common Issues:</p>
                      <ul className="space-y-1.5 text-xs text-red-800">
                        <li className="flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">•</span>
                          <span>Payment cancelled on your phone</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">•</span>
                          <span>Insufficient M-Pesa balance</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">•</span>
                          <span>Wrong PIN entered</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">•</span>
                          <span>Network connection timeout</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button 
                    onClick={onClose} 
                    variant="outline" 
                    className="flex-1 border-2 border-gray-300 hover:bg-gray-50 font-semibold h-11"
                  >
                    Close
                  </Button>
                  <Button 
                    onClick={() => {
                      setStatus("idle")
                      setLoading(false)
                    }} 
                    className="flex-1 bg-gradient-to-r from-navy-600 to-navy-700 hover:from-navy-700 hover:to-navy-800 font-semibold h-11 shadow-lg shadow-navy-500/30"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
