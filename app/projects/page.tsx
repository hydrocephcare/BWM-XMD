"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, FileText, Database, ExternalLink } from "lucide-react"

interface ProjectFile {
  id: string
  name: string
  type: "word" | "access"
  url: string
  price: number
  batch: number
  isExternalLink?: boolean
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectFile[]>([])
  const [paymentModal, setPaymentModal] = useState<{ show: boolean; file: ProjectFile | null }>({
    show: false,
    file: null,
  })

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = () => {
    const saved = localStorage.getItem("projectFiles")
    if (saved) {
      setProjects(JSON.parse(saved))
    }
  }

  const handleDownload = (file: ProjectFile) => {
    setPaymentModal({ show: true, file })
  }

  const batches = [...new Set(projects.map((p) => p.batch))].sort()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">KCSE Project Files</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse and download high-quality KCSE project files. Pay securely via M-Pesa and get instant access.
          </p>
        </div>

        {batches.length === 0 ? (
          <Card className="p-12 text-center max-w-2xl mx-auto">
            <div className="mb-4">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Projects Available Yet</h3>
            <p className="text-gray-500">Check back soon for new project files!</p>
          </Card>
        ) : (
          <div className="space-y-12">
            {batches.map((batch) => (
              <div key={batch}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-1 w-12 bg-blue-600 rounded"></div>
                  <h2 className="text-2xl font-bold text-gray-900">Batch {batch}</h2>
                  <div className="h-1 flex-1 bg-gray-200 rounded"></div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects
                    .filter((p) => p.batch === batch)
                    .map((file) => (
                      <Card
                        key={file.id}
                        className="p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                            {file.type === "word" ? (
                              <FileText className="w-7 h-7 text-white" />
                            ) : (
                              <Database className="w-7 h-7 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 mb-1 leading-tight">{file.name}</h3>
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                                {file.type === "word" ? "Word Document" : "Access Database"}
                              </span>
                              {file.isExternalLink && <ExternalLink className="w-3 h-3 text-gray-400" />}
                            </div>
                          </div>
                        </div>

                        <div className="border-t pt-4 mt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Price</p>
                              <span className="text-2xl font-bold text-blue-600">KES {file.price}</span>
                            </div>
                            <Button
                              size="lg"
                              onClick={() => handleDownload(file)}
                              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 gap-2 shadow-md"
                            >
                              <Download className="w-4 h-4" />
                              Download
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

        <div className="mt-12 text-center">
          <Card className="p-6 max-w-2xl mx-auto bg-blue-50 border-blue-200">
            <h3 className="font-bold text-gray-900 mb-2">How It Works</h3>
            <ol className="text-left text-sm text-gray-700 space-y-2">
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">1.</span>
                <span>Choose the project file you want to download</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">2.</span>
                <span>Click "Download" and enter your M-Pesa phone number</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">3.</span>
                <span>Complete payment via STK push on your phone</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">4.</span>
                <span>Download begins automatically after successful payment</span>
              </li>
            </ol>
          </Card>
        </div>
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
          amount: file.price,
          donor_name: "Student",
          payment_type: "project_file",
          file_id: file.id,
        }),
      })

      const data = await response.json()

      if (data.status === "success") {
        // Simulate payment processing
        setTimeout(() => {
          setStatus("success")
          setTimeout(() => {
            window.open(file.url, "_blank")
            onClose()
          }, 2000)
        }, 3000)
      } else {
        setStatus("error")
      }
    } catch (error) {
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <Card className="w-full max-w-md p-6 shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>

        {status === "idle" && (
          <>
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">File:</p>
              <p className="font-semibold text-gray-900">{file.name}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-200">
                <span className="text-sm text-gray-600">Amount to Pay:</span>
                <span className="text-2xl font-bold text-blue-600">KES {file.price}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-gray-700">M-Pesa Phone Number</label>
              <input
                type="tel"
                placeholder="07XXXXXXXX or 01XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                maxLength={10}
              />
              <p className="text-xs text-gray-500 mt-2">Enter your Safaricom number to receive STK push</p>
            </div>

            <div className="flex gap-3">
              <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button onClick={handlePayment} disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700">
                {loading ? "Processing..." : "Pay Now"}
              </Button>
            </div>
          </>
        )}

        {status === "processing" && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <p className="font-semibold text-lg text-gray-900 mb-2">Check your phone</p>
            <p className="text-sm text-gray-600">Enter your M-Pesa PIN to complete payment</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-bold text-xl text-green-600 mb-2">Payment Successful!</p>
            <p className="text-sm text-gray-600">Downloading file now...</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="font-bold text-xl text-red-600 mb-2">Payment Failed</p>
            <p className="text-sm text-gray-600 mb-4">Please try again or contact support</p>
            <Button onClick={onClose} className="bg-gray-600 hover:bg-gray-700">
              Close
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
