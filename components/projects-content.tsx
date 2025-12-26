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
              Browse and download projects by batch
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

          {/* Projects Table - Desktop */}
          <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Batch</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Project Name</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Documentation</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Database</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Complete Package</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBatches.map((batchName) => {
                    const batchFiles = batchedProjects[batchName]
                    const hasDoc = !!batchFiles.documentation
                    const hasDb = !!batchFiles.database
                    const hasBoth = hasDoc && hasDb

                    return (
                      <tr key={batchName} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {batchName}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900 text-sm">
                            {batchFiles.documentation?.file_name || batchFiles.database?.file_name || "Project"}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {hasDoc ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-sm font-bold text-blue-600">KES {batchFiles.documentation?.price}</span>
                              <Button
                                onClick={() => handleDownload("documentation", batchFiles)}
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1 h-7"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </Button>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {hasDb ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-sm font-bold text-purple-600">KES {batchFiles.database?.price}</span>
                              <Button
                                onClick={() => handleDownload("database", batchFiles)}
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700 text-xs px-3 py-1 h-7"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </Button>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {hasBoth ? (
                            <div className="flex flex-col items-center gap-2">
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-bold text-green-600">
                                  KES {(batchFiles.documentation?.price || 0) + (batchFiles.database?.price || 0)}
                                </span>
                              </div>
                              <Button
                                onClick={() => handleDownload("both", batchFiles)}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-xs px-3 py-1 h-7"
                              >
                                <ShoppingCart className="w-3 h-3 mr-1" />
                                Buy Both
                              </Button>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Projects Cards - Mobile */}
          <div className="md:hidden space-y-4 mb-8">
            {filteredBatches.map((batchName) => {
              const batchFiles = batchedProjects[batchName]
              const hasDoc = !!batchFiles.documentation
              const hasDb = !!batchFiles.database
              const hasBoth = hasDoc && hasDb

              return (
                <Card key={batchName} className="bg-white shadow-md overflow-hidden">
                  <div className="p-4">
                    {/* Batch Header */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        {batchName}
                      </span>
                    </div>

                    {/* Project Name */}
                    <h3 className="font-semibold text-gray-900 text-base mb-4">
                      {batchFiles.documentation?.file_name || batchFiles.database?.file_name || "Project"}
                    </h3>

                    {/* Download Options */}
                    <div className="space-y-2">
                      {hasDoc && (
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
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
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
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
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-2 border-green-200">
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              <FileText className="w-3 h-3 text-green-600" />
                              <Database className="w-3 h-3 text-green-600 -ml-1" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-700">Complete Package</p>
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

          {/* Info Section */}
          <div className="max-w-4xl mx-auto">
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
    let attempts = 0

    const checkInterval = setInterval(async () => {
      attempts++

      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("payments").select("*").eq("transaction_id", reference).single()

        if (!error && data && data.payment_status === "completed") {
          clearInterval(checkInterval)
          setStatus("success")
          setLoading(false)

          setTimeout(() => {
            paymentInfo.files.forEach((file, index) => {
              setTimeout(() => {
                window.open(file.file_url, "_blank")
              }, index * 500)
            })

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

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <Card className="w-full max-w-md shadow-2xl bg-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {status === "idle" && (
            <>
              <div className="mb-6 p-5 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Package</p>
                    <p className="font-semibold text-gray-900 text-lg">{paymentInfo.packageType}</p>
                  </div>
                </div>

                {paymentInfo.files.length > 1 && (
                  <div className="space-y-2 mb-4 bg-white/60 rounded-lg p-3">
                    {paymentInfo.files.map((file, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                        {file.file_name}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-baseline justify-between pt-4 border-t border-blue-200">
                  <span className="text-sm font-medium text-gray-600">Total Amount</span>
                  <div className="text-3xl font-bold text-gray-900">KES {paymentInfo.totalAmount}</div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3 text-gray-900">
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
                    className="w-full pl-20 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none text-gray-900 font-medium text-lg transition-all"
                    maxLength={10}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">You'll receive an STK push on this number</p>
              </div>

              <div className="flex gap-3">
                <Button onClick={onClose} variant="outline" className="flex-1 border-2 border-gray-200 hover:bg-gray-50 font-semibold h-12">
                  Cancel
                </Button>
                <Button onClick={handlePayment} disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 font-semibold h-12">
                  {loading ? "Processing..." : "Pay Now"}
                </Button>
              </div>
            </>
          )}

          {(status === "processing" || status === "checking") && (
            <div className="text-center py-8">
              <Loader2 className="w-16 h-16 mx-auto text-blue-600 animate-spin mb-6" />
              <p className="font-bold text-2xl text-gray-900 mb-2">
                {status === "processing" ? "Check Your Phone" : "Confirming Payment"}
              </p>
              <p className="text-gray-600">
                {status === "processing" ? "Enter your M-Pesa PIN to complete payment" : "Verifying your transaction..."}
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center py-8">
              <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <p className="font-bold text-2xl text-green-700 mb-2">Success!</p>
              <p className="text-gray-700 font-medium">
                {paymentInfo.files.length > 1 ? "Your files are downloading now" : "Your file is downloading now"}
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="text-center py-8">
              <p className="font-bold text-2xl text-red-700 mb-2">Payment Failed</p>
              <p className="text-gray-600 mb-6">The transaction could not be processed</p>
              <div className="flex gap-3">
                <Button onClick={onClose} variant="outline" className="flex-1 border-2 border-gray-300 hover:bg-gray-50 font-semibold h-11">
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setStatus("idle")
                    setLoading(false)
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 font-semibold h-11"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
