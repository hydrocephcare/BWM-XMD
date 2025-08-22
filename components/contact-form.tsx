"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send, CheckCircle, AlertCircle } from "lucide-react"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Method 1: Using EmailJS (Recommended)
      // You'll need to set up EmailJS service
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'hydrocephcare@gmail.com',
          from: formData.email,
          subject: `Contact Form: ${formData.subject}`,
          html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Subject:</strong> ${formData.subject}</p>
            <p><strong>Message:</strong></p>
            <p>${formData.message.replace(/\n/g, '<br>')}</p>
          `
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setIsSubmitting(false)
      setIsSubmitted(true)
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      })

    } catch (err) {
      setIsSubmitting(false)
      setError("Failed to send message. Please try again or contact us directly at hydrocephcare@gmail.com")
      console.error('Contact form error:', err)
    }
  }

  // Alternative method using mailto (fallback)
  const handleMailtoFallback = () => {
    const subject = encodeURIComponent(`Contact Form: ${formData.subject}`)
    const body = encodeURIComponent(`
Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}
    `)
    
    window.location.href = `mailto:hydrocephcare@gmail.com?subject=${subject}&body=${body}`
  }

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm h-full flex flex-col items-center justify-center text-center">
        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-navy-800 mb-2">Message Sent!</h2>
        <p className="text-gray-600 mb-2">Thank you for contacting us.</p>
        <p className="text-sm text-gray-500 mb-6">We'll get back to you at {formData.email} as soon as possible.</p>
        <Button onClick={() => setIsSubmitted(false)} className="bg-navy-600 hover:bg-navy-700">
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm h-full">
      <h2 className="text-2xl font-bold text-navy-800 mb-6">Send Us a Message</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
          <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input 
              id="name" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              name="email"
              type="email" 
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email" 
              required 
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input 
            id="subject" 
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="How can we help you?" 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea 
            id="message" 
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Your message..." 
            rows={6} 
            required 
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            type="submit" 
            className="flex-1 bg-navy-600 hover:bg-navy-700 group" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>Sending...</>
            ) : (
              <>
                Send Message
                <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>
          
          <Button 
            type="button"
            variant="outline"
            onClick={handleMailtoFallback}
            className="px-4"
            title="Open in email client"
          >
            📧
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 text-center">
          Or email us directly at: <a href="mailto:hydrocephcare@gmail.com" className="text-navy-600 hover:underline">hydrocephcare@gmail.com</a>
        </p>
      </form>
    </div>
  )
}
