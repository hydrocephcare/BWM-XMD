"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Database, Download, Loader2, CheckCircle2, ShoppingCart, X } from "lucide-react"
import { createClient } from "@/lib/supabase"

interface Project {
  id: string
  batch_name: string
  file_name: string
  file_type: "Word" | "Access"
  file_url: string
  price: number
  is_external_link: boolean
}

interface BatchFiles {
  documentation?: Project
  database?: Project
}

interface PaymentInfo {
  files: Project[]
  totalAmount: number
  packageType: string
}

export function ProjectsContent() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBatch, setSelectedBatch] = useState<string>("all")
  const [paymentModal, setPaymentModal] = useState<{ show: boolean; paymentInfo: PaymentInfo | null }>({
    show: false,
    paymentInfo: null,
  })

  useEffect(() => {
    loadProjects()
  }, [])

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

      if (project.file_type === "Word") {
        batched[project.batch_name].documentation = project
      } else if (project.file_type === "Access") {
        batched[project.batch_name].database = project
      }
    })

    return batched
  }

  const handleDownload = (type: "documentation" | "database" | "both", batchFiles: BatchFiles) => {
    if (type === "documentation" && batchFiles.documentation) {
      setPaymentModal({
        show: true,
        paymentInfo: {
          files: [batchFiles.documentation],
          totalAmount: batchFiles.documentation.price,
          packageType: "Documentation Only",
        },
      })
    } else if (type === "database" && batchFiles.database) {
      setPaymentModal({
        show: true,
        paymentInfo: {
          files: [batchFiles.database],
          totalAmount: batchFiles.database.price,
          packageType: "Database Only",
        },
      })
    } else if (type === "both" && batchFiles.documentation && batchFiles.database) {
      setPaymentModal({
        show: true,
        paymentInfo: {
          files: [batchFiles.documentation, batchFiles.database],
          totalAmount: batchFiles.documentation.price + batchFiles.database.price,
          packageType: "Complete Package",
        },
      })
    }
  }

  const batchedProjects = getBatchedProjects()
  const batches = ["all", ...Object.keys(batchedProjects)].sort()
  const filteredBatches = selectedBatch === "all" ? Object.keys(batchedProjects).sort() : [selectedBatch]
  const isAllBatches = selectedBatch === "all"

  if (loading) {
    return (
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading projects...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <>
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              KCSE Computer Studies Projects
            </h1>
            <p className="text-base text-gray-600">
              {isAllBatches ? "Browse all available projects" : `Viewing ${selectedBatch} projects`}
            </p>
          </div>

          {/* Batch Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {batches.map((batch) => (
              <Button
                key={batch}
                onClick={() => setSelectedBatch(batch)}
                variant={selectedBatch === batch ? "default" : "outline"}
                size="sm"
                className={selectedBatch === batch ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-gray-100"}
              >
                {batch === "all" ? "All Batches" : batch}
              </Button>
            ))}
          </div>

          {/* ALL BATCHES VIEW - Table/Compact Format */}
          {isAllBatches && (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Batch</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Project Name</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">
                          <div className="flex items-center justify-center gap-2">
                            <FileText className="w-4 h-4" />
                            Documentation
                          </div>
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">
                          <div className="flex items-center justify-center gap-2">
                            <Database className="w-4 h-4" />
                            Database
                          </div>
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">
                          <div className="flex items-center justify-center gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            Complete Package
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredBatches.map((batchName, idx) => {
                        const batchFiles = batchedProjects[batchName]
                        const hasDoc = !!batchFiles.documentation
                        const hasDb = !!batchFiles.database
                        const hasBoth = hasDoc && hasDb

                        return (
                          <tr key={batchName} className={`hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="px-6 py-4">
                              <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-xs font-bold shadow-sm">
                                {batchName}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-semibold text-gray-900 text-sm">
                                {batchFiles.documentation?.file_name || batchFiles.database?.file_name || "Project"}
                              </p>
                            </td>
                            <td className="px-6 py-4 text-center">
                              {hasDoc ? (
                                <div className="flex flex-col items-center gap-2">
                                  <span className="text-base font-bold text-blue-600">KES {batchFiles.documentation?.price}</span>
                                  <Button
                                    onClick={() => handleDownload("documentation", batchFiles)}
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 text-xs px-4 py-1.5 h-8 shadow-sm"
                                  >
                                    <Download className="w-3 h-3 mr-1" />
                                    Get
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">—</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {hasDb ? (
                                <div className="flex flex-col items-center gap-2">
                                  <span className="text-base font-bold text-purple-600">KES {batchFiles.database?.price}</span>
                                  <Button
                                    onClick={() => handleDownload("database", batchFiles)}
                                    size="sm"
                                    className="bg-purple-600 hover:bg-purple-700 text-xs px-4 py-1.5 h-8 shadow-sm"
                                  >
                                    <Download className="w-3 h-3 mr-1" />
                                    Get
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">—</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {hasBoth ? (
                                <div className="flex flex-col items-center gap-2">
                                  <div className="flex flex-col items-center">
                                    <span className="text-base font-bold text-green-600">
                                      KES {(batchFiles.documentation?.price || 0) + (batchFiles.database?.price || 0)}
                                    </span>
                                    <span className="text-xs text-green-600 font-semibold">BEST VALUE</span>
                                  </div>
                                  <Button
                                    onClick={() => handleDownload("both", batchFiles)}
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-xs px-4 py-1.5 h-8 shadow-sm"
                                  >
                                    <ShoppingCart className="w-3 h-3 mr-1" />
                                    Buy Both
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">—</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile/Tablet Cards for All Batches */}
              <div className="lg:hidden space-y-3 mb-8">
                {filteredBatches.map((batchName) => {
                  const batchFiles = batchedProjects[batchName]
                  const hasDoc = !!batchFiles.documentation
                  const hasDb = !!batchFiles.database
                  const hasBoth = hasDoc && hasDb

                  return (
                    <Card key={batchName} className="bg-white shadow-md overflow-hidden border-l-4 border-blue-500">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-xs font-bold">
                            {batchName}
                          </span>
                        </div>

                        <h3 className="font-bold text-gray-900 text-base mb-4">
                          {batchFiles.documentation?.file_name || batchFiles.database?.file_name || "Project"}
                        </h3>

                        <div className="space-y-2">
                          {hasDoc && (
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-600" />
                                <div>
                                  <p className="text-xs font-medium text-gray-700">Documentation</p>
                                  <p className="text-sm font-bold text-blue-600">KES {batchFiles.documentation?.price}</p>
                                </div>
                              </div>
                              <Button
                                onClick={() => handleDownload("documentation", batchFiles)}
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-xs px-3 h-8"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Get
                              </Button>
                            </div>
                          )}

                          {hasDb && (
                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                              <div className="flex items-center gap-2">
                                <Database className="w-4 h-4 text-purple-600" />
                                <div>
                                  <p className="text-xs font-medium text-gray-700">Database</p>
                                  <p className="text-sm font-bold text-purple-600">KES {batchFiles.database?.price}</p>
                                </div>
                              </div>
                              <Button
                                onClick={() => handleDownload("database", batchFiles)}
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700 text-xs px-3 h-8"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Get
                              </Button>
                            </div>
                          )}

                          {hasBoth && (
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-2 border-green-400">
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  <FileText className="w-3.5 h-3.5 text-green-600" />
                                  <Database className="w-3.5 h-3.5 text-green-600 -ml-1" />
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-green-700 uppercase">Best Value</p>
                                  <p className="text-sm font-bold text-green-600">
                                    KES {(batchFiles.documentation?.price || 0) + (batchFiles.database?.price || 0)}
                                  </p>
                                </div>
                              </div>
                              <Button
                                onClick={() => handleDownload("both", batchFiles)}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-xs px-3 h-8"
                              >
                                <ShoppingCart className="w-3 h-3 mr-1" />
                                Buy
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </>
          )}

          {/* SINGLE BATCH VIEW - Large Cards Format */}
          {!isAllBatches && (
            <div className="space-y-8">
              {filteredBatches.map((batchName) => {
                const batchFiles = batchedProjects[batchName]
                const hasDoc = !!batchFiles.documentation
                const hasDb = !!batchFiles.database
                const hasBoth = hasDoc && hasDb

                return (
                  <div key={batchName}>
                    {/* Batch Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{batchName}</h2>
                      <div className="h-1 flex-1 bg-gray-300 rounded"></div>
                    </div>

                    {/* Large Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Documentation Card */}
                      {hasDoc && (
                        <Card className="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-blue-200 hover:border-blue-400">
                          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wide">Documentation</span>
                              <FileText className="w-5 h-5" />
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="text-center mb-6">
                              <p className="text-4xl font-bold text-blue-600 mb-2">
                                KES {batchFiles.documentation?.price}
                              </p>
                              <p className="text-sm text-gray-600">One-time payment</p>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">
                              {batchFiles.documentation?.file_name}
                            </h3>

                            <div className="space-y-3 mb-6">
                              <div className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Complete system analysis & design</span>
                              </div>
                              <div className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Professional flowcharts & diagrams</span>
                              </div>
                              <div className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>KCSE standard format</span>
                              </div>
                              <div className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Ready to submit</span>
                              </div>
                            </div>

                            <Button
                              onClick={() => handleDownload("documentation", batchFiles)}
                              className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold shadow-md"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Documentation
                            </Button>
                          </div>
                        </Card>
                      )}

                      {/* Database Card */}
                      {hasDb && (
                        <Card className="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-purple-200 hover:border-purple-400">
                          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 text-white">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wide">Database</span>
                              <Database className="w-5 h-5" />
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="text-center mb-6">
                              <p className="text-4xl font-bold text-purple-600 mb-2">
                                KES {batchFiles.database?.price}
                              </p>
                              <p className="text-sm text-gray-600">One-time payment</p>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">
                              {batchFiles.database?.file_name}
                            </h3>

                            <div className="space-y-3 mb-6">
                              <div className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Fully functional Access database</span>
                              </div>
                              <div className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Custom forms & reports</span>
                              </div>
                              <div className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Query processing included</span>
                              </div>
                              <div className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Professional data modeling</span>
                              </div>
                            </div>

                            <Button
                              onClick={() => handleDownload("database", batchFiles)}
                              className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-base font-semibold shadow-md"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Database
                            </Button>
                          </div>
                        </Card>
                      )}

                      {/* Complete Package Card */}
                      {hasBoth && (
                        <Card className="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-green-400 hover:border-green-500 relative">
                          <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-md z-10">
                            SAVE MORE
                          </div>
                          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wide">Complete Package</span>
                              <div className="flex">
                                <FileText className="w-4 h-4" />
                                <Database className="w-4 h-4 -ml-1" />
                              </div>
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="text-center mb-6">
                              <p className="text-4xl font-bold text-green-600 mb-2">
                                KES {(batchFiles.documentation?.price || 0) + (batchFiles.database?.price || 0)}
                              </p>
                              <p className="text-sm text-gray-600">Everything you need</p>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">
                              Full Project Bundle
                            </h3>

                            <div className="space-y-3 mb-6">
                              <div className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Complete documentation file</span>
                              </div>
                              <div className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Full database system</span>
                              </div>
                              <div className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>WhatsApp support included</span>
                              </div>
                              <div className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Best value for money</span>
                              </div>
                            </div>

                            <Button
                              onClick={() => handleDownload("both", batchFiles)}
                              className="w-full bg-green-600 hover:bg-green-700 h-12 text-base font-semibold shadow-md"
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Get Complete Package
                            </Button>
                          </div>
                        </Card>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Info Section */}
          <div className="max-w-4xl mx-auto mt-12">
            <Card className="bg-white shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">What's Included</h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex gap-3">
                  <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Documentation</h3>
                    <p className="text-gray-600">Complete Word documents with system analysis & design</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Database className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Database</h3>
                    <p className="text-gray-600">Functional Access database with forms & reports</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">KCSE Ready</h3>
                    <p className="text-gray-600">Meets all examination requirements</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Download className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Instant Access</h3>
                    <p className="text-gray-600">Download immediately after M-Pesa payment</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {paymentModal.show && paymentModal.paymentInfo && (
        <PaymentModal
          paymentInfo={paymentModal.paymentInfo}
          onClose={() => setPaymentModal({ show: false, paymentInfo: null })}
        />
      )}
    </>
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
    let attempts
