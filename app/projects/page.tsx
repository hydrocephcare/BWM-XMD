"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, FileText, Database, ExternalLink, Loader2, Check, X } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"

interface ProjectFile {
  id: string
  batch_name: string
  file_name: string
  file_type: string
  price: number
  file_url: string
  is_external_link: boolean
}

interface Batch {
  name: string
  files: ProjectFile[]
}

export default function ProjectsPage() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [loading, setLoading] = useState(true)
  const [paymentModal, setPaymentModal] = useState<{ show: boolean; file: ProjectFile | null }>({
    show: false,
    file: null,
  })

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("projects").select("*").order("batch_name", { ascending: true })

      if (error) {
        console.error("[v0] Error loading projects:", error)
        return
      }

      const batchMap = new Map<string, ProjectFile[]>()
      data?.forEach((file) => {
        if (!batchMap.has(file.batch_name)) {
          batchMap.set(file.batch_name, [])
        }
        batchMap.get(file.batch_name)!.push(file)
      })

      const batchesArray: Batch[] = Array.from(batchMap.entries()).map(([name, files]) => ({
        name,
        files,
      }))

      setBatches(batchesArray)
    } catch (error) {
      console.error("[v0] Failed to load projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = (file: ProjectFile) => {
    setPaymentModal({ show: true, file })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-white">
          <Loader2 className="w-12 h-12 animate-spin text-navy-600" />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-navy-50 to-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-navy-200 text-navy-700 hover:bg-navy-300">Project Files</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-navy-800 mb-6 leading-tight">
                Professional <span className="text-gold-600">Project Files</span>
              </h1>
              <p className="text-lg text-gray-700">
                Choose from our collection of complete KCSE Computer Studies projects. Each batch contains carefully
                crafted documentation and database implementations ready to download.
              </p>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          {batches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Projects Available</h3>
              <p className="text-gray-600">Check back soon for available files.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {batches.map((batch) => (
                <div key={batch.name} id={batch.name} className="scroll-mt-20">
                  <div className="mb-8">
                    <Badge className="mb-4 bg-gold-100 text-gold-700 hover:bg-gold-200">{batch.name}</Badge>
                    <h2 className="text-3xl font-bold text-navy-800">
                      {batch.files.some((f) => f.file_type === "Word") ? "Documentation" : "Database"}{" "}
                      {batch.files.some((f) => f.file_type === "Access") &&
                      batch.files.some((f) => f.file_type === "Word")
                        ? "& Database"
                        : ""}
                    </h2>
                    <p className="text-gray-600 mt-2">{batch.files.length} file(s) available</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {batch.files.map((file) => (
                      <Card
                        key={file.id}
                        className="flex flex-col h-full p-6 border border-gray-200 hover:shadow-lg hover:border-gold-300 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-lg bg-gold-100 flex items-center justify-center flex-shrink-0">
                            {file.file_type === "Word" ? (
                              <FileText className="w-6 h-6 text-gold-600" />
                            ) : (
                              <Database className="w-6 h-6 text-gold-600" />
                            )}
                          </div>
                          {file.is_external_link && <ExternalLink className="w-4 h-4 text-gray-400" />}
                        </div>

                        <h3 className="text-lg font-semibold text-navy-800 mb-2 line-clamp-2 flex-1">
                          {file.file_name}
                        </h3>

                        <div className="mb-6">
                          <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                            {file.file_type === "Word" ? "📄 Documentation" : "🗄️ Database"}
                          </span>
                        </div>

                        <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                          <div>
                            <p className="text-gray-600 text-sm font-medium">Price</p>
                            <p className="text-2xl font-bold text-navy-800">
                              KES <span className="text-gold-600">{file.price.toLocaleString()}</span>
                            </p>
                          </div>
                          <Button
                            onClick={() => handleDownload(file)}
                            className="bg-navy-600 hover:bg-navy-700"
                            size="sm"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {paymentModal.show && paymentModal.file && (
        <PaymentModal file={paymentModal.file} onClose={() => setPaymentModal({ show: false, file: null })} />
      )}

      <Footer />
    </div>
  )
}

function PaymentModal({ file, onClose }: { file: ProjectFile; onClose: () => void }) {
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
      console.log("[v0] Initiating payment for file:", file.id)

      const response = await fetch("/api/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          amount: file.price,
          donor_name: "Student",
          payment_type: "project_file",
          file_id: file.id,
        }),
      })

      const data = await response.json()
      console.log("[v0] Payment response:", data)

      if (data.status === "success" && data.reference) {
        setStatus("checking")
        checkPaymentStatus(data.reference)
      } else {
        setStatus("error")
        setLoading(false)
      }
    } catch (error) {
      console.error("[v0] Payment error:", error)
      setStatus("error")
      setLoading(false)
    }
  }

  const checkPaymentStatus = async (reference: string) => {
    const maxAttempts = 30
    let attempts = 0

    const checkInterval = setInterval(async () => {
      attempts++
      console.log(`[v0] Checking payment status, attempt ${attempts}`)

      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("payments").select("*").eq("transaction_id", reference).single()

        if (error) {
          console.log("[v0] Payment not found yet:", error)
        } else if (data && data.payment_status === "completed") {
          console.log("[v0] Payment successful!")
          clearInterval(checkInterval)
          setStatus("success")
          setLoading(false)

          setTimeout(() => {
            window.open(file.file_url, "_blank")
            onClose()
          }, 2000)
          return
        }
      } catch (error) {
        console.error("[v0] Error checking payment:", error)
      }

      if (attempts >= maxAttempts) {
        clearInterval(checkInterval)
        setStatus("error")
        setLoading(false)
      }
    }, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <Card className="w-full max-w-md p-6 md:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-navy-900">Complete Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {status === "idle" && (
          <>
            <div className="mb-6 p-4 rounded-lg bg-gold-50 border border-gold-200">
              <p className="text-xs font-semibold text-gold-700 uppercase mb-2">File</p>
              <p className="font-semibold text-navy-900 mb-4">{file.file_name}</p>
              <div className="flex items-center justify-between pt-3 border-t border-gold-200">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="text-2xl font-bold text-gold-600">KES {file.price.toLocaleString()}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-navy-900 mb-2">M-Pesa Phone Number</label>
              <input
                type="tel"
                placeholder="07XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-navy-900 focus:border-navy-600 focus:outline-none transition-colors"
                maxLength={10}
              />
              <p className="text-xs text-gray-500 mt-2">Enter Safaricom number for STK push</p>
            </div>

            <div className="flex gap-3">
              <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                disabled={loading}
                className="flex-1 bg-navy-600 hover:bg-navy-700 text-white"
              >
                {loading ? "Processing..." : "Pay Now"}
              </Button>
            </div>
          </>
        )}

        {(status === "processing" || status === "checking") && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-2 border-gray-300 border-t-navy-600 mx-auto mb-6"></div>
            <p className="font-semibold text-lg text-navy-900 mb-2">
              {status === "processing" ? "Check your phone" : "Verifying payment..."}
            </p>
            <p className="text-sm text-gray-600">
              {status === "processing" ? "Enter your M-Pesa PIN" : "Please wait..."}
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-gold-600" />
            </div>
            <p className="font-bold text-xl text-navy-900 mb-2">Payment Successful!</p>
            <p className="text-sm text-gray-600">Downloading file now...</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <p className="font-bold text-xl text-navy-900 mb-2">Payment Failed</p>
            <p className="text-sm text-gray-600 mb-6">Please try again or contact support</p>
            <Button onClick={onClose} variant="outline" className="w-full bg-transparent">
              Close
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
