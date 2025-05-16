"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send, CheckCircle } from "lucide-react"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm h-full flex flex-col items-center justify-center text-center">
        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-navy-800 mb-2">Message Sent!</h2>
        <p className="text-gray-600 mb-6">Thank you for contacting us. We'll get back to you as soon as possible.</p>
        <Button onClick={() => setIsSubmitted(false)} className="bg-navy-600 hover:bg-navy-700">
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm h-full">
      <h2 className="text-2xl font-bold text-navy-800 mb-6">Send Us a Message</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input id="name" placeholder="Enter your name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="Enter your email" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" placeholder="How can we help you?" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" placeholder="Your message..." rows={6} required />
        </div>
        <Button type="submit" className="w-full bg-navy-600 hover:bg-navy-700 group" disabled={isSubmitting}>
          {isSubmitting ? (
            <>Sending...</>
          ) : (
            <>
              Send Message
              <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
