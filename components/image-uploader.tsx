"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ImagePlus, Trash2, Copy, Check, Loader2 } from "lucide-react"

interface ImageUploaderProps {
  initialImage?: string
  onImageChange?: (imageUrl: string) => void
  aspectRatio?: "square" | "landscape" | "portrait" | "auto"
  className?: string
  buttonText?: string
}

export function ImageUploader({
  initialImage = "",
  onImageChange,
  aspectRatio = "landscape",
  className = "",
  buttonText = "Upload Image",
}: ImageUploaderProps) {
  const [image, setImage] = useState(initialImage)
  const [isUploading, setIsUploading] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Set aspect ratio class
  const aspectRatioClass = {
    square: "aspect-square",
    landscape: "aspect-video",
    portrait: "aspect-[3/4]",
    auto: "aspect-auto",
  }[aspectRatio]

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)

      // Create form data
      const formData = new FormData()
      formData.append("file", file)

      // Upload to Vercel Blob
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`)
      }

      const data = await response.json()
      const imageUrl = data.url

      // Update state and call callback
      setImage(imageUrl)
      if (onImageChange) {
        onImageChange(imageUrl)
      }

      // Store in local storage for gallery
      try {
        const STORAGE_KEY = "victory-school-gallery-images"
        const savedImages = localStorage.getItem(STORAGE_KEY)
        const images = savedImages ? JSON.parse(savedImages) : []

        const newImage = {
          url: imageUrl,
          fileName: data.fileName || file.name,
          uploadedAt: new Date().toISOString(),
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify([newImage, ...images]))

        // Trigger storage event for other tabs
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: STORAGE_KEY,
            newValue: JSON.stringify([newImage, ...images]),
          }),
        )
      } catch (error) {
        console.error("Error saving to local storage:", error)
      }

      alert("Image uploaded successfully!")
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("There was an error uploading your image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  // Handle image removal
  const handleRemoveImage = () => {
    setImage("")
    if (onImageChange) {
      onImageChange("")
    }
  }

  // Copy image URL to clipboard
  const copyToClipboard = () => {
    if (image) {
      navigator.clipboard.writeText(image)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {image ? (
        <div className="relative">
          <Card className="overflow-hidden">
            <img
              src={image || "/placeholder.svg"}
              alt="Uploaded image"
              className={`w-full object-cover ${aspectRatioClass}`}
            />
          </Card>
          <div className="absolute top-2 right-2 flex gap-2">
            <Button type="button" variant="destructive" size="icon" onClick={handleRemoveImage} title="Remove image">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button type="button" variant="secondary" size="icon" onClick={copyToClipboard} title="Copy image URL">
              {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      ) : (
        <Card className={`flex items-center justify-center border-dashed p-6 ${aspectRatioClass}`}>
          <div className="text-center">
            <ImagePlus className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-4">No image uploaded</p>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                buttonText
              )}
            </Button>
          </div>
        </Card>
      )}

      {image && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">Image URL:</p>
          <div className="flex gap-2">
            <input type="text" value={image} readOnly className="flex-1 text-xs p-2 border rounded bg-muted" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Change"
              )}
            </Button>
          </div>
        </div>
      )}

      {!image && (
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
      )}
    </div>
  )
}
