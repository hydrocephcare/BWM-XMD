"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Copy, Check, Search, ImageIcon, ExternalLink } from "lucide-react"
import Link from "next/link"

// This would normally come from your database or API
// For demo purposes, we're using local storage to simulate persistence
const STORAGE_KEY = "victory-school-gallery-images"

type GalleryImage = {
  url: string
  fileName: string
  uploadedAt: string
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isCopied, setIsCopied] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch this from your API
    const loadImages = () => {
      try {
        const savedImages = localStorage.getItem(STORAGE_KEY)
        if (savedImages) {
          const parsedImages = JSON.parse(savedImages) as GalleryImage[]
          setImages(parsedImages)
          setFilteredImages(parsedImages)
        }
      } catch (error) {
        console.error("Error loading images:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadImages()

    // Check if we have new uploads from the upload page
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadImages()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredImages(images)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredImages(images.filter((image) => image.fileName.toLowerCase().includes(query)))
    }
  }, [searchQuery, images])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setIsCopied(id)
    setTimeout(() => setIsCopied(null), 2000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Image Gallery</h1>
              <p className="text-muted-foreground">Browse and manage your uploaded images</p>
            </div>
            <Button asChild>
              <Link href="/admin/upload">
                <ImageIcon className="h-4 w-4 mr-2" />
                Upload New Images
              </Link>
            </Button>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Search Images</CardTitle>
              <CardDescription>Find images by filename</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-square bg-muted animate-pulse" />
                  <CardFooter className="p-4">
                    <div className="w-full space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-8 bg-muted rounded animate-pulse" />
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">No images found</h2>
              <p className="text-muted-foreground mb-8">
                {searchQuery ? "No images match your search query" : "Upload some images to see them here"}
              </p>
              <Button asChild>
                <Link href="/admin/upload">Upload Images</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredImages.map((image, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-square relative group">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.fileName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm" onClick={() => window.open(image.url, "_blank")}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Full Size
                      </Button>
                    </div>
                  </div>
                  <CardFooter className="p-4">
                    <div className="w-full space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium truncate">{image.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(image.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => copyToClipboard(image.url, `gallery-${index}`)}
                      >
                        {isCopied === `gallery-${index}` ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Copied to Clipboard
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Image URL
                          </>
                        )}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
