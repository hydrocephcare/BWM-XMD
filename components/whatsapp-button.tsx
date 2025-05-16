"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MessageSquare } from "lucide-react"

export function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  return (
    <Link
      href="https://wa.link/jox26j"
      target="_blank"
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-green-500 text-white shadow-lg transition-all duration-300 hover:bg-green-600 ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
      }`}
      aria-label="Chat with us on WhatsApp for immediate project support"
    >
      <MessageSquare className="h-6 w-6" />
    </Link>
  )
}
