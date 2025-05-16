"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, DollarSign } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Storage key for pricing data
const STORAGE_KEY = "victory-school-pricing-data"

// Default pricing plans
const DEFAULT_PRICING = [
  {
    id: "basic",
    title: "Basic Plan",
    price: "1,500",
    description: "Perfect for individual students",
    features: ["Full project documentation", "Source code access", "Email support", "1 revision"],
  },
  {
    id: "standard",
    title: "Standard Plan",
    price: "3,000",
    description: "Ideal for most students",
    features: ["Everything in Basic", "Video walkthrough", "WhatsApp support", "3 revisions"],
  },
  {
    id: "premium",
    title: "Premium Plan",
    price: "5,000",
    description: "Complete package for serious students",
    features: ["Everything in Standard", "One-on-one consultation", "Unlimited revisions", "Priority support"],
  },
]

export function PricingEditor() {
  const [pricingPlans, setPricingPlans] = useState(DEFAULT_PRICING)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  // Load saved data on component mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY)
      if (savedData) {
        setPricingPlans(JSON.parse(savedData))
      }
    } catch (error) {
      console.error("Error loading saved pricing data:", error)
    }
  }, [])

  // Handle plan title change
  const handleTitleChange = (index: number, value: string) => {
    const newPlans = [...pricingPlans]
    newPlans[index].title = value
    setPricingPlans(newPlans)
  }

  // Handle plan price change
  const handlePriceChange = (index: number, value: string) => {
    const newPlans = [...pricingPlans]
    newPlans[index].price = value
    setPricingPlans(newPlans)
  }

  // Handle plan description change
  const handleDescriptionChange = (index: number, value: string) => {
    const newPlans = [...pricingPlans]
    newPlans[index].description = value
    setPricingPlans(newPlans)
  }

  // Handle plan features change
  const handleFeaturesChange = (index: number, value: string) => {
    const newPlans = [...pricingPlans]
    newPlans[index].features = value.split("\n").filter((line) => line.trim() !== "")
    setPricingPlans(newPlans)
  }

  // Save all changes
  const saveChanges = async () => {
    setIsSaving(true)
    setSaveMessage("")

    try {
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pricingPlans))

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSaveMessage("All changes saved successfully!")

      // Refresh the page to show the changes
      setTimeout(() => {
        window.location.href = "/?pricing=" + Date.now()
      }, 1500)
    } catch (error) {
      console.error("Error saving changes:", error)
      setSaveMessage("Error saving changes. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Pricing Plans</h1>
        <Button onClick={saveChanges} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save All Changes"}
          <Save className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {saveMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{saveMessage}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pricingPlans.map((plan, index) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                {plan.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`title-${index}`}>Plan Title</Label>
                <Input
                  id={`title-${index}`}
                  value={plan.title}
                  onChange={(e) => handleTitleChange(index, e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`price-${index}`}>Price (KSh)</Label>
                <Input
                  id={`price-${index}`}
                  value={plan.price}
                  onChange={(e) => handlePriceChange(index, e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`description-${index}`}>Description</Label>
                <Input
                  id={`description-${index}`}
                  value={plan.description}
                  onChange={(e) => handleDescriptionChange(index, e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`features-${index}`}>Features (one per line)</Label>
                <Textarea
                  id={`features-${index}`}
                  rows={6}
                  value={plan.features.join("\n")}
                  onChange={(e) => handleFeaturesChange(index, e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-blue-700">
        <h3 className="font-bold">How to edit pricing plans</h3>
        <p className="mt-2">
          Edit the plan details above and click "Save All Changes" to update the pricing section on your website. For
          features, enter each feature on a new line.
        </p>
      </div>
    </div>
  )
}
