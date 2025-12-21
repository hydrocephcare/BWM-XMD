"use client"

import { useState, useEffect } from "react"
import { PasswordProtection } from "@/components/password-protection"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, FileText, Database } from "lucide-react"
import Link from "next/link"

interface ProjectFile {
  id: string
  name: string
  type: "word" | "access"
  url: string
  price: number
  batch: number
}

export default function ProjectsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [projects, setProjects] = useState<ProjectFile[]>([])
  const [paymentModal, setPaymentModal] = useState<{ show: boolean; file: ProjectFile | null }>({
    show: false,
    file: null,
  })

  useEffect(() => {
    const auth = sessionStorage.getItem("projectsAuth")
    if (auth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects()
    }
  }, [isAuthenticated])

  const loadProjects = () => {
    const saved = localStorage.getItem("projectFiles")
    if (saved) {
      setProjects(JSON.parse(saved))
    }
  }

  const handleAuth = () => {
    sessionStorage.setItem("projectsAuth", "true")
    setIsAuthenticated(true)
  }

  const handleDownload = (file: ProjectFile) => {
    setPaymentModal({ show: true, file })
  }

  if (!isAuthenticated) {
    return <PasswordProtection onSuccess={handleAuth} />
  }

  const batches = [...new Set(projects.map((p) => p.batch))].sort()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Current Projects</h1>
            <p className="text-gray-600">Download KCSE project files after payment</p>
          </div>
          <Link href="/admin/projects">
            <Button variant="outline">Admin Panel</Button>
          </Link>
        </div>

        {batches.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500">No projects available yet</p>
          </Card>
        ) : (
          <div className="space-y-8">
            {batches.map((batch) => (
              <div key={batch}>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Batch {batch}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects
                    .filter((p) => p.batch === batch)
                    .map((file) => (
                      <Card key={file.id} className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            {file.type === "word" ? (
                              <FileText className="w-6 h-6 text-blue-600" />
                            ) : (
                              <Database className="w-6 h-6 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate mb-1">{file.name}</h3>
                            <p className="text-sm text-gray-500 mb-3">
                              {file.type === "word" ? "Microsoft Word" : "Microsoft Access"}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-blue-600">KES {file.price}</span>
                              <Button size="sm" onClick={() => handleDownload(file)} className="gap-2">
                                <Download className="w-4 h-4" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {paymentModal.show && paymentModal.file && (
        <PaymentModal file={paymentModal.file} onClose={() => setPaymentModal({ show: false, file: null })} />
      )}
    </div>
  )
}

function PaymentModal({ file, onClose }: { file: ProjectFile; onClose: () => void }) {
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [reference, setReference] = useState("")

  const handlePayment = async () => {
    if (!phone) {
      alert("Please enter your phone number")
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
          amount: file.price,
          donor_name: "Student",
          payment_type: "project_file",
          file_id: file.id,
        }),
      })

      const data = await response.json()

      if (data.status === "success") {
        setReference(data.reference)
        checkPaymentStatus(data.reference)
      } else {
        setStatus("error")
        alert(data.error || "Payment initiation failed")
      }
    } catch (error) {
      setStatus("error")
      alert("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const checkPaymentStatus = async (ref: string) => {
    const maxAttempts = 30
    let attempts = 0

    const interval = setInterval(async () => {
      attempts++

      try {
        const response = await fetch(`/api/check-payment?reference=${ref}`)
        const data = await response.json()

        if (data.status === "success") {
          clearInterval(interval)
          setStatus("success")
          setTimeout(() => {
            window.open(file.url, "_blank")
            onClose()
          }, 2000)
        } else if (data.status === "failed") {
          clearInterval(interval)
          setStatus("error")
        } else if (attempts >= maxAttempts) {
          clearInterval(interval)
          setStatus("error")
        }
      } catch (error) {
        if (attempts >= maxAttempts) {
          clearInterval(interval)
          setStatus("error")
        }
      }
    }, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Complete Payment</h2>

        {status === "idle" && (
          <>
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                File: <strong>{file.name}</strong>
              </p>
              <p className="text-gray-600 mb-4">
                Amount: <strong className="text-blue-600">KES {file.price}</strong>
              </p>

              <label className="block text-sm font-medium mb-2">M-Pesa Phone Number</label>
              <input
                type="tel"
                placeholder="0712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">Enter your Safaricom number to receive STK push</p>
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

        {status === "processing" && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="font-medium">Check your phone for M-Pesa prompt</p>
            <p className="text-sm text-gray-500 mt-2">Enter your PIN to complete payment</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-medium text-green-600">Payment Successful!</p>
            <p className="text-sm text-gray-500 mt-2">Downloading file...</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="font-medium text-red-600">Payment Failed</p>
            <p className="text-sm text-gray-500 mt-2">Please try again</p>
            <Button onClick={onClose} className="mt-4">
              Close
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
