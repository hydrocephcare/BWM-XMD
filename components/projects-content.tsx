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
  file_type: string
  file_url: string
  documentation_url?: string
  price: number
  is_external_link: boolean
  has_documentation?: boolean
  has_database?: boolean
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

  const handlePurchase = (project: Project) => {
    setPaymentModal({
      show: true,
      paymentInfo: {
        files: [project],
        totalAmount: project.price,
        packageType: project.file_type,
      },
    })
  }

  const batches = ["all", ...new Set(projects.map((p) => p.batch_name))].sort()
  const filteredProjects = selectedBatch === "all" 
    ? projects 
    : projects.filter((p) => p.batch_name === selectedBatch)

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
        <div className="container mx-auto px-4 py-16">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              KCSE Computer Studies Projects
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Complete project packages with documentation and database files ready for your KCSE examination
            </p>
          </div>

          {/* Batch Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {batches.map((batch) => (
              <Button
                key={batch}
                onClick={() => setSelectedBatch(batch)}
                variant={selectedBatch === batch ? "default" : "outline"}
                className={
                  selectedBatch === batch
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "hover:bg-gray-100"
                }
              >
                {batch === "all" ? "All Projects" : batch}
              </Button>
            ))}
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <Card className="p-12 text-center bg-white shadow-lg max-w-2xl mx-auto">
              <div className="text-gray-400 mb-4">
                <Database className="w-16 h-16 mx-auto mb-4" />
                <p className="text-xl font-medium text-gray-500">No projects available</p>
                <p className="text-sm mt-2">Check back soon for new projects!</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
                >
                  <div className="p-6">
                    {/* Project Header */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                          {project.batch_name}
                        </span>
                        <span className="text-2xl font-bold text-blue-600">
                          KES {project.price}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {project.file_name}
                      </h3>
                    </div>

                    {/* Project Components */}
                    <div className="space-y-3 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">Documentation</p>
                            <p className="text-xs text-gray-600">Complete Word document</p>
                          </div>
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <Database className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">Database System</p>
                            <p className="text-xs text-gray-600">Access database file</p>
                          </div>
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Complete project package</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>KCSE examination ready</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Instant download access</span>
                      </div>
                    </div>

                    {/* Purchase Button */}
                    <Button
                      onClick={() => handlePurchase(project)}
                      className="w-full bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Purchase Now
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Info Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What You Get</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Complete Documentation</h3>
                    <p className="text-sm text-gray-600">
                      Professional Word documents with all project details, system analysis, design, and implementation
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <Database className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Working Database</h3>
                    <p className="text-sm text-gray-600">
                      Fully functional Microsoft Access database with tables, forms, queries, and reports
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">KCSE Ready</h3>
                    <p className="text-sm text-gray-600">
                      All projects meet KCSE Computer Studies examination requirements and standards
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <Download className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Instant Access</h3>
                    <p className="text-sm text-gray-600">
                      Download immediately after payment via M-Pesa. No waiting required
                    </p>
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
                    <p className="font-semibold text-gray-900 text-lg">{paymentInfo.files[0].file_name}</p>
                  </div>
                </div>

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
                <p className="text-xs text-gray-500 mt-2">
                  You'll receive an STK push on this number
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 border-2 border-gray-200 hover:bg-gray-50 font-semibold h-12"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 font-semibold h-12"
                >
                  {loading ? "Processing..." : "Pay Now"}
                </Button>
              </div>
            </>
          )}

          {(status === "processing" || status === "checking") && (
            <div className="text-center py-8">
              <div className="relative mb-6">
                <Loader2 className="w-16 h-16 mx-auto text-blue-600 animate-spin" />
              </div>

              <div className="space-y-4">
                <div>
                  <p className="font-bold text-2xl text-gray-900 mb-2">
                    {status === "processing" ? "Check Your Phone" : "Confirming Payment"}
                  </p>
                  <p className="text-gray-600">
                    {status === "processing"
                      ? "Enter your M-Pesa PIN to complete payment"
                      : "Verifying your transaction..."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="text-center py-8">
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="font-bold text-2xl text-green-700 mb-2">Success!</p>
                  <p className="text-gray-700 font-medium">Your file is downloading now</p>
                </div>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="text-center py-8">
              <div className="space-y-4">
                <div>
                  <p className="font-bold text-2xl text-red-700 mb-2">Payment Failed</p>
                  <p className="text-gray-600">The transaction could not be processed</p>
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
                    className="flex-1 bg-blue-600 hover:bg-blue-700 font-semibold h-11"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
