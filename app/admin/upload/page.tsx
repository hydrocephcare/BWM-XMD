"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Copy, Check, Upload, ImageIcon, Loader2 } from "lucide-react"

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<Array<{ url: string; fileName: string }>>([])
  const [isCopied, setIsCopied] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`)
        }

        return await response.json()
      })

      const results = await Promise.all(uploadPromises)
      const successfulUploads = results
        .filter((result) => result.success)
        .map((result) => ({ url: result.url, fileName: result.fileName }))

      setUploadedImages((prev) => [...successfulUploads, ...prev])
    } catch (error) {
      console.error("Error uploading files:", error)
      alert("Failed to upload one or more files. Please try again.")
    } finally {
      setIsUploading(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setIsCopied(id)
    setTimeout(() => setIsCopied(null), 2000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Upload Images</h1>

          <Tabs defaultValue="upload">
            <TabsList className="mb-8">
              <TabsTrigger value="upload">Upload Images</TabsTrigger>
              <TabsTrigger value="recent">Recent Uploads</TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <Card>
                <CardHeader>
                  <CardTitle>Upload to Blob Storage</CardTitle>
                  <CardDescription>
                    Upload images to your Vercel Blob Storage. These images can be used throughout your website.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border-2 border-dashed rounded-lg p-10 text-center">
                      <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Drag and drop your images here</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Or click the button below to select files from your computer
                      </p>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                        multiple
                      />
                      <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="mx-auto">
                        {isUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Select Files
                          </>
                        )}
                      </Button>
                    </div>

                    {uploadedImages.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Uploaded Images</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {uploadedImages.map((image, index) => (
                            <Card key={index} className="overflow-hidden">
                              <div className="aspect-video relative">
                                <img
                                  src={image.url || "/placeholder.svg"}
                                  alt={`Uploaded image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <CardFooter className="flex justify-between items-center p-4">
                                <p className="text-sm truncate max-w-[200px]">{image.fileName}</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(image.url, `image-${index}`)}
                                >
                                  {isCopied === `image-${index}` ? (
                                    <>
                                      <Check className="h-4 w-4 mr-2" />
                                      Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-4 w-4 mr-2" />
                                      Copy URL
                                    </>
                                  )}
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recent">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Uploads</CardTitle>
                  <CardDescription>View and manage your recently uploaded images.</CardDescription>
                </CardHeader>
                <CardContent>
                  {uploadedImages.length === 0 ? (
                    <div className="text-center py-10">
                      <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No recent uploads</h3>
                      <p className="text-sm text-muted-foreground">Upload some images to see them here</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {uploadedImages.map((image, index) => (
                        <Card key={index} className="overflow-hidden">
                          <div className="aspect-square relative">
                            <img
                              src={image.url || "/placeholder.svg"}
                              alt={`Uploaded image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardFooter className="flex justify-between items-center p-4">
                            <p className="text-xs truncate max-w-[120px]">{image.fileName}</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(image.url, `recent-${index}`)}
                            >
                              {isCopied === `recent-${index}` ? (
                                <>
                                  <Check className="h-4 w-4 mr-2" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy URL
                                </>
                              )}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>How to Use Uploaded Images</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Upload your image using the form above</li>
                  <li>Copy the URL of the uploaded image</li>
                  <li>Use the URL in your website code where you need to display the image</li>
                  <li>
                    Example:{" "}
                    <code className="bg-muted px-1 py-0.5 rounded text-sm">
                      &lt;img src="your-copied-url" alt="Description" /&gt;
                    </code>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
