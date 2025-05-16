"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUploader } from "@/components/image-uploader"
import { Save, ImageIcon } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Define sections for the About page
const ABOUT_SECTIONS = [
  { id: "hero", name: "About Hero", description: "Main banner image for About page" },
  { id: "content", name: "About Content", description: "Image for the main content section" },
  { id: "mission", name: "Mission Section", description: "Image for the mission section" },
]

// Storage key for about page data
const STORAGE_KEY = "victory-school-about-data"

export function AboutEditor() {
  const [images, setImages] = useState<Record<string, string>>({})
  const [content, setContent] = useState({
    title: "Our Story",
    story:
      "Founded in 2020, our platform was created by a team of experienced Computer Studies teachers and software developers who recognized the challenges students face when completing their KCSE projects.",
    mission:
      "We believe that every student deserves access to high-quality resources that can help them succeed in their academic endeavors. Our mission is to provide comprehensive, well-documented, and easy-to-understand project materials that align with the KCSE syllabus requirements.",
    feature1Title: "Original Work",
    feature1Desc: "Each project is uniquely crafted to ensure zero plagiarism",
    feature2Title: "Syllabus Aligned",
    feature2Desc: "All projects are designed to meet KCSE requirements",
    feature3Title: "Comprehensive Support",
    feature3Desc: "24/7 assistance via WhatsApp, phone, and email",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  // Load saved data on component mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY)
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        setImages(parsedData.images || {})
        setContent(parsedData.content || content)
      }
    } catch (error) {
      console.error("Error loading saved about data:", error)
    }
  }, [])

  // Handle image change for a specific section
  const handleImageChange = (sectionId: string, imageUrl: string) => {
    setImages((prev) => {
      const newImages = { ...prev, [sectionId]: imageUrl }
      return newImages
    })
  }

  // Handle content change
  const handleContentChange = (field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Save all changes
  const saveChanges = async () => {
    setIsSaving(true)
    setSaveMessage("")

    try {
      // Save to localStorage
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          images,
          content,
        }),
      )

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSaveMessage("All changes saved successfully!")

      // Refresh the page to show the changes
      setTimeout(() => {
        window.location.href = "/about?updated=" + Date.now()
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
        <h1 className="text-3xl font-bold">Edit About Page</h1>
        <Button onClick={saveChanges} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save All Changes"}
          <Save className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {saveMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{saveMessage}</div>
      )}

      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Images</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ABOUT_SECTIONS.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ImageIcon className="h-5 w-5 mr-2" />
                  {section.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
                <ImageUploader
                  initialImage={images[section.id] || ""}
                  onImageChange={(url) => handleImageChange(section.id, url)}
                  aspectRatio="landscape"
                  buttonText={`Upload ${section.name} Image`}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="text-2xl font-semibold pt-6">Content</h2>
        <Card>
          <CardHeader>
            <CardTitle>About Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={content.title} onChange={(e) => handleContentChange("title", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="story">Our Story</Label>
              <Textarea
                id="story"
                rows={4}
                value={content.story}
                onChange={(e) => handleContentChange("story", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mission">Our Mission</Label>
              <Textarea
                id="mission"
                rows={4}
                value={content.mission}
                onChange={(e) => handleContentChange("mission", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="feature1Title">Feature 1 Title</Label>
                <Input
                  id="feature1Title"
                  value={content.feature1Title}
                  onChange={(e) => handleContentChange("feature1Title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feature1Desc">Feature 1 Description</Label>
                <Input
                  id="feature1Desc"
                  value={content.feature1Desc}
                  onChange={(e) => handleContentChange("feature1Desc", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="feature2Title">Feature 2 Title</Label>
                <Input
                  id="feature2Title"
                  value={content.feature2Title}
                  onChange={(e) => handleContentChange("feature2Title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feature2Desc">Feature 2 Description</Label>
                <Input
                  id="feature2Desc"
                  value={content.feature2Desc}
                  onChange={(e) => handleContentChange("feature2Desc", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="feature3Title">Feature 3 Title</Label>
                <Input
                  id="feature3Title"
                  value={content.feature3Title}
                  onChange={(e) => handleContentChange("feature3Title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feature3Desc">Feature 3 Description</Label>
                <Input
                  id="feature3Desc"
                  value={content.feature3Desc}
                  onChange={(e) => handleContentChange("feature3Desc", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
