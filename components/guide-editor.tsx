"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, FileText, Youtube, Download } from "lucide-react"

// Storage key for guides
const STORAGE_KEY = "victory-school-guides"

// Define guide types
const GUIDE_TYPES = [
  { id: "setup", name: "Project Setup Guide", icon: Youtube },
  { id: "guidelines", name: "Student Guidelines", icon: FileText },
  { id: "question", name: "Question Paper", icon: Download },
]

export function GuideEditor() {
  const [guides, setGuides] = useState<Record<string, any>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  // Load saved guides on component mount
  useEffect(() => {
    try {
      const savedGuides = localStorage.getItem(STORAGE_KEY)
      if (savedGuides) {
        setGuides(JSON.parse(savedGuides))
      } else {
        // Initialize with default values
        setGuides({
          setup: {
            title: "Project Setup Guide",
            description:
              "Learn how to set up your project environment and get started with the Victory School Club Membership System.",
            url: "https://youtu.be/Rhp84_oP6bU",
          },
          guidelines: {
            title: "Student Guidelines",
            description:
              "Comprehensive guidelines for students on how to implement and present the project for KCSE examination.",
            url: "https://victoryschoolclub.co.ke/wp-content/uploads/2025/05/GUIDELINE-FOR-VICTORY-SCHOOL-CLUB-MEMBERSHIP-SYSTEM.pdf",
          },
          question: {
            title: "Question Paper",
            description:
              "Sample question paper for the Victory School Club Membership System project to help you understand the requirements.",
            url: "https://victoryschoolclub.co.ke/wp-content/uploads/2025/05/Victory-School-Club-Membership-System-Question-Paper.pdf",
          },
        })
      }
    } catch (error) {
      console.error("Error loading saved guides:", error)
    }
  }, [])

  // Handle guide field change
  const handleGuideChange = (guideId: string, field: string, value: string) => {
    setGuides((prev) => ({
      ...prev,
      [guideId]: {
        ...prev[guideId],
        [field]: value,
      },
    }))
  }

  // Save all changes
  const saveChanges = async () => {
    setIsSaving(true)
    setSaveMessage("")

    try {
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(guides))

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSaveMessage("All changes saved successfully!")

      // Refresh the page to show the changes
      setTimeout(() => {
        window.location.href = "/?guides=" + Date.now()
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
        <h1 className="text-3xl font-bold">Edit Guides</h1>
        <Button onClick={saveChanges} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save All Changes"}
          <Save className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {saveMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{saveMessage}</div>
      )}

      <div className="space-y-6">
        {GUIDE_TYPES.map((guide) => {
          const GuideIcon = guide.icon
          return (
            <Card key={guide.id}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GuideIcon className="h-5 w-5 mr-2" />
                  {guide.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${guide.id}-title`}>Title</Label>
                    <Input
                      id={`${guide.id}-title`}
                      value={guides[guide.id]?.title || ""}
                      onChange={(e) => handleGuideChange(guide.id, "title", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${guide.id}-description`}>Description</Label>
                    <Textarea
                      id={`${guide.id}-description`}
                      value={guides[guide.id]?.description || ""}
                      onChange={(e) => handleGuideChange(guide.id, "description", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${guide.id}-url`}>URL</Label>
                    <Input
                      id={`${guide.id}-url`}
                      value={guides[guide.id]?.url || ""}
                      onChange={(e) => handleGuideChange(guide.id, "url", e.target.value)}
                      placeholder={guide.id === "setup" ? "YouTube URL" : "PDF URL"}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-blue-700">
        <h3 className="font-bold">How to use these guides</h3>
        <p className="mt-2">
          After saving, refresh your home page to see the changes. The guides will be automatically updated with your
          new content.
        </p>
      </div>
    </div>
  )
}
