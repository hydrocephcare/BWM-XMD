"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, FileText, Database, ExternalLink, Loader2, ArrowRight, Check } from "lucide-react"
import { createClient } from "@/lib/supabase"

interface ProjectFile {
  id: string
  batch_name: string
  file_name: string
  file_type: string
  price: number
  file_url: string
  is_external_link: boolean
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectFile[]>([])
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
      } else {
        setProjects(data || [])
      }
    } catch (error) {
      console.error("[v0] Failed to load projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = (file: ProjectFile) => {
    setPaymentModal({ show: true, file })
  }

  const batches = [...new Set(projects.map((p) => p.batch_name))].sort()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-background to-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-block mb-4">
              <span className="text-xs sm:text-sm font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                PROJECT FILES
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Download Your <span className="text-primary">KCSE Project</span> Files
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
              Access high-quality, professionally crafted project files. Pay securely via M-Pesa and download instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {batches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-24">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No Projects Available Yet</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              Check back soon! We're preparing premium KCSE project files for you.
            </p>
          </div>
        ) : (
          <div className="space-y-16 md:space-y-20">
            {batches.map((batch, batchIndex) => (
              <div key={batch}>
                <div className="mb-8 md:mb-12">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <span className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary font-bold text-sm">
                        {batchIndex + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground">{batch}</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {projects.filter((p) => p.batch_name === batch).length} file
                        {projects.filter((p) => p.batch_name === batch).length !== 1 ? "s" : ""} available
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {projects
                    .filter((p) => p.batch_name === batch)
                    .map((file) => (
                      <Card
                        key={file.id}
                        className="group flex flex-col h-full p-6 hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/20 bg-card"
                      >
                        {/* File Icon */}
                        <div className="mb-6">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            {file.file_type === "Word" ? (
                              <FileText className="w-6 h-6 text-primary" />
                            ) : (
                              <Database className="w-6 h-6 text-primary" />
                            )}
                          </div>
                        </div>

                        {/* File Info */}
                        <div className="flex-1 mb-6">
                          <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {file.file_name}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-primary/10 text-primary">
                              {file.file_type === "Word" ? "📄 Word" : "🗄️ Database"}
                            </span>
                            {file.is_external_link && (
                              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-muted text-muted-foreground">
                                <ExternalLink className="w-3 h-3" />
                                Link
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price and CTA */}
                        <div className="border-t border-border pt-6 mt-auto">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1 font-medium">Price</p>
                              <p className="text-2xl font-bold text-foreground">
                                KES <span className="text-primary">{file.price.toLocaleString()}</span>
                              </p>
                            </div>
                            <Button
                              onClick={() => handleDownload(file)}
                              className="flex-shrink-0 px-6 gap-2 group/btn"
                              size="lg"
                            >
                              <Download className="w-4 h-4 group-hover/btn:animate-pulse" />
                              <span className="hidden sm:inline">Download</span>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Process Steps - Shows only when projects exist */}
        {batches.length > 0 && (
          <div className="mt-16 md:mt-24 pt-16 md:pt-24 border-t border-border">
            <div className="mb-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Simple, secure payment process to get your project files instantly
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                { number: "01", title: "Select File", description: "Choose the project file you need" },
                { number: "02", title: "Enter Phone", description: "Provide your M-Pesa number" },
                { number: "03", title: "Confirm Payment", description: "Complete STK push on your phone" },
                { number: "04", title: "Download Now", description: "Get instant access to your file" },
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="p-6 rounded-lg bg-card border border-border">
                    <div className="text-3xl font-bold text-primary mb-3">{step.number}</div>
                    <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  {idx < 3 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-border" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {paymentModal.show && paymentModal.file && (
        <PaymentModal file={paymentModal.file} onClose={() => setPaymentModal({ show: false, file: null })} />
      )}
    </div>
  )
}

function PaymentModal({ file, onClose }: { file: ProjectFile; onClose: () => void }) {
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "processing" | "checking" | "success" | "error">("idle")
  const [paymentReference, setPaymentReference] = useState("")

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
        setPaymentReference(data.reference)
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
        console.log("[v0] Payment check timeout")
      }
    }, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <Card className="w-full max-w-md p-6 md:p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-foreground mb-6">Complete Payment</h2>

        {status === "idle" && (
          <>
            <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-xs font-medium text-muted-foreground mb-2">File</p>
              <p className="font-semibold text-foreground mb-4">{file.file_name}</p>
              <div className="flex items-center justify-between pt-3 border-t border-primary/20">
                <span className="text-sm text-muted-foreground">Amount to Pay</span>
                <span className="text-2xl font-bold text-primary">KES {file.price.toLocaleString()}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-foreground mb-2">M-Pesa Phone Number</label>
              <input
                type="tel"
                placeholder="07XXXXXXXX or 01XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                maxLength={10}
              />
              <p className="text-xs text-muted-foreground mt-2">Enter your Safaricom number to receive STK push</p>
            </div>

            <div className="flex gap-3">
              <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button onClick={handlePayment} disabled={loading} className="flex-1">
                {loading ? "Processing..." : "Pay Now"}
              </Button>
            </div>
          </>
        )}

        {(status === "processing" || status === "checking") && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-2 border-border border-t-primary mx-auto mb-6"></div>
            <p className="font-semibold text-lg text-foreground mb-2">
              {status === "processing" ? "Check your phone" : "Verifying payment..."}
            </p>
            <p className="text-sm text-muted-foreground">
              {status === "processing"
                ? "Enter your M-Pesa PIN to complete payment"
                : "Please wait while we confirm your payment"}
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <p className="font-bold text-xl text-foreground mb-2">Payment Successful!</p>
            <p className="text-sm text-muted-foreground">Downloading file now...</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="font-bold text-xl text-foreground mb-2">Payment Failed</p>
            <p className="text-sm text-muted-foreground mb-6">
              Payment not confirmed. Please try again or contact support
            </p>
            <Button onClick={onClose} variant="outline" className="w-full bg-transparent">
              Close
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
