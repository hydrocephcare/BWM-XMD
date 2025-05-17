"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUploader } from "@/components/image-uploader"
import { Save, ImageIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Storage key for home page images
const STORAGE_KEY = "victory-school-home-images"

export function HomeEditor() {
  const [images, setImages] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  // Load saved images on component mount
  useEffect(() => {
    try {
      const savedImages = localStorage.getItem(STORAGE_KEY)
      if (savedImages) {
        setImages(JSON.parse(savedImages))
      }
    } catch (error) {
      console.error("Error loading saved images:", error)
    }
  }, [])

  // Handle image change for a specific section
  const handleImageChange = (sectionId: string, imageUrl: string) => {
    setImages((prev) => {
      const newImages = { ...prev, [sectionId]: imageUrl }
      // Save to localStorage immediately
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newImages))
      return newImages
    })
  }

  // Save all changes
  const saveChanges = async () => {
    setIsSaving(true)
    setSaveMessage("")

    try {
      // In a real app, you would save to a database here
      // For now, we're just using localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images))

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSaveMessage("All changes saved successfully!")

      // Refresh the page to show the changes
      setTimeout(() => {
        window.location.href = "/?images=" + Date.now()
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
        <h1 className="text-3xl font-bold">Edit Home Page Images</h1>
        <Button onClick={saveChanges} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save All Changes"}
          <Save className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {saveMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{saveMessage}</div>
      )}

      <Tabs defaultValue="main">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="main">Main Sections</TabsTrigger>
          <TabsTrigger value="guides">Guides & Tutorials</TabsTrigger>
        </TabsList>

        <TabsContent value="main">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Banner/Hero Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Banner Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">The main banner image at the top of the home page</p>
                <ImageUploader
                  initialImage={images["hero"] || ""}
                  onImageChange={(url) => handleImageChange("hero", url)}
                  aspectRatio="landscape"
                  buttonText="Upload Banner Image"
                />
              </CardContent>
            </Card>

            {/* About Section Image (Zero Plagiarism) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ImageIcon className="h-5 w-5 mr-2" />
                  About Section Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">The image below the "Zero Plagiarism" section</p>
                <ImageUploader
                  initialImage={images["about"] || ""}
                  onImageChange={(url) => handleImageChange("about", url)}
                  aspectRatio="landscape"
                  buttonText="Upload About Image"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="guides">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Video Tutorial Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Video Tutorial Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Image for the Video Tutorial card in Guides section
                </p>
                <ImageUploader
                  initialImage={images["guide1"] || ""}
                  onImageChange={(url) => handleImageChange("guide1", url)}
                  aspectRatio="landscape"
                  buttonText="Upload Video Tutorial Image"
                />
              </CardContent>
            </Card>

            {/* Documentation Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Documentation Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Image for the Documentation card in Guides section</p>
                <ImageUploader
                  initialImage={images["guide2"] || ""}
                  onImageChange={(url) => handleImageChange("guide2", url)}
                  aspectRatio="landscape"
                  buttonText="Upload Documentation Image"
                />
              </CardContent>
            </Card>

            {/* Sample Paper Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Sample Paper Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Image for the Sample Paper card in Guides section</p>
                <ImageUploader
                  initialImage={images["guide3"] || ""}
                  onImageChange={(url) => handleImageChange("guide3", url)}
                  aspectRatio="landscape"
                  buttonText="Upload Sample Paper Image"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-blue-700">
        <h3 className="font-bold">How to use these images</h3>
        <p className="mt-2">
          After saving, refresh your home page to see the changes. The images will be automatically applied to the
          corresponding sections.
        </p>
      </div>
    </div>
  )
}
