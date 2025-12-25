"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Download, FileText, Database, Loader2, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase"
import Link from "next/link"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  files: Array<{
    id: string
    file_name: string
    file_type: string
    price: number
    file_url: string
    is_external_link: boolean
  }>
  totalAmount: number
  packageType: "documentation" | "database" | "both"
}

export function PaymentModal({ isOpen, onClose, files, totalAmount, packageType }: PaymentModalProps) {
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "processing" | "checking" | "success" | "error">("idle")
  const [showCrossSell, setShowCrossSell] = useState(false)
  const [acceptedCrossSell, setAcceptedCrossSell] = useState(false)

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
          amount: totalAmount,
          donor_name: "Student",
          payment_type: "project_file",
          file_id: files[0].id,
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
            files.forEach((file, index) => {
              setTimeout(() => {
                window.open(file.file_url, "_blank")
              }, index * 500)
            })

            setTimeout(
              () => {
                onClose()
              },
              files.length * 500 + 1000,
            )
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto">
      <Card className="w-full max-w-md shadow-2xl bg-white border border-gray-200 my-4 md:my-0">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4 border-b border-gray-200 relative">
          <div className="flex-1 pr-8">
            <CardTitle className="text-xl text-navy-800">Complete Your Purchase</CardTitle>
            <CardDescription className="text-sm text-gray-600">Enter M-Pesa number to pay</CardDescription>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {status === "idle" && (
            <>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-navy-700">Files Included</label>
                <div className="space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="p-3 rounded-lg border-2 border-gray-200 bg-white hover:border-navy-300 transition-all"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {file.file_type === "Word" ? (
                            <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          ) : (
                            <Database className="h-4 w-4 text-green-600 flex-shrink-0" />
                          )}
                          <span className="font-medium text-gray-800 truncate">{file.file_name}</span>
                        </div>
                        <Badge className="bg-navy-600 text-white hover:bg-navy-700 flex-shrink-0">
                          KES {file.price}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-navy-50 rounded-lg p-4 border border-navy-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Total Amount:</span>
                  <span className="text-2xl font-bold text-navy-800">KES {totalAmount}</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-navy-800 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
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
                    inputMode="numeric"
                    className="w-full pl-20 pr-4 py-3 md:py-4 border-2 border-gray-200 rounded-lg focus:border-navy-500 focus:ring-4 focus:ring-navy-100 focus:outline-none text-navy-900 font-medium transition-all text-base md:text-base"
                    maxLength={10}
                  />
                </div>
                <p className="text-xs text-gray-500">You'll receive an M-Pesa prompt on this number</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700 font-medium">You'll receive an STK push to enter your M-Pesa PIN</p>
              </div>
            </>
          )}

          {(status === "processing" || status === "checking") && (
            <div className="text-center py-8">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-navy-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-navy-600 rounded-full animate-spin"></div>
              </div>
              <p className="font-bold text-xl text-navy-900 mb-2">
                {status === "processing" ? "Check Your Phone" : "Confirming Payment"}
              </p>
              <p className="text-gray-600 text-sm">
                {status === "processing" ? "Enter your M-Pesa PIN" : "Verifying your transaction..."}
              </p>
            </div>
          )}

          {status === "success" && !showCrossSell && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-bold text-lg text-navy-900">Payment Successful!</p>
              <p className="text-gray-600 text-sm mt-2">Your files are downloading now</p>

              {packageType !== "both" && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm font-medium text-navy-800 mb-4">
                    Would you also like to purchase{" "}
                    {packageType === "documentation" ? "Milestone 2 - Database System" : "Milestone 1 - Documentation"}?
                  </p>
                  <button
                    onClick={() => setShowCrossSell(true)}
                    className="text-navy-600 hover:text-navy-700 font-semibold text-sm flex items-center justify-center gap-2 mx-auto hover:underline"
                  >
                    Yes, show me the options
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Link to projects page to explore other batches */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Want to explore more batches?</p>
                <Link href="/projects" onClick={onClose}>
                  <Button
                    variant="outline"
                    className="w-full border-navy-200 hover:bg-navy-50 text-navy-600 bg-transparent"
                  >
                    View All Project Batches
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="font-bold text-lg text-navy-900">Payment Failed</p>
              <p className="text-gray-600 text-sm mt-2">Please try again or contact support</p>
            </div>
          )}
        </CardContent>

        {status === "idle" && (
          <div className="border-t border-gray-200 p-4 md:p-6 flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent hover:bg-gray-50 border-2 border-gray-200 text-gray-700 font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={loading || !phone || phone.length < 10}
              className="flex-1 bg-navy-600 hover:bg-navy-700 text-white font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Pay Now
                </>
              )}
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
