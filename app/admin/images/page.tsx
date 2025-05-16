"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ImageUploader } from "@/components/image-uploader"
import { Copy, Check } from "lucide-react"

export default function ImageManagement() {
  const [activeTab, setActiveTab] = useState("hero")
  const [images, setImages] = useState({
    hero: ["/placeholder.svg?height=800&width=600"],
    about: ["/placeholder.svg?height=800&width=600"],
    guides: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    testimonials: ["/placeholder.svg?height=100&width=100", "/placeholder.svg?height=100&width=100"],
    team: ["/placeholder.svg?height=400&width=300", "/placeholder.svg?height=400&width=300"],
  })
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)

  const handleImageChange = (section: string, index: number, url: string) => {
    setImages((prev) => {
      const newImages = { ...prev }
      newImages[section][index] = url
      return newImages
    })
  }

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedIndex(id)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const addNewImage = (section: string) => {
    setImages((prev) => {
      const newImages = { ...prev }
      newImages[section] = [...newImages[section], ""]
      return newImages
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Image Management</h1>

          <Tabs defaultValue="hero" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="hero">Hero Section</TabsTrigger>
              <TabsTrigger value="about">About Section</TabsTrigger>
              <TabsTrigger value="guides">Guides Section</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="team">Team Members</TabsTrigger>
            </TabsList>

            <TabsContent value="hero" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hero Section Images</CardTitle>
                  <CardDescription>Manage images for the hero section of your website</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {images.hero.map((image, index) => (
                    <div key={`hero-${index}`} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Hero Image {index + 1}</h3>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(image, `hero-${index}`)}>
                          {copiedIndex === `hero-${index}` ? (
                            <Check className="h-4 w-4 mr-2" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          {copiedIndex === `hero-${index}` ? "Copied" : "Copy URL"}
                        </Button>
                      </div>
                      <ImageUploader
                        initialImage={image}
                        onImageChange={(url) => handleImageChange("hero", index, url)}
                        aspectRatio="landscape"
                      />
                    </div>
                  ))}
                  <Button onClick={() => addNewImage("hero")}>Add New Hero Image</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="about" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About Section Images</CardTitle>
                  <CardDescription>Manage images for the about section of your website</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {images.about.map((image, index) => (
                    <div key={`about-${index}`} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">About Image {index + 1}</h3>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(image, `about-${index}`)}>
                          {copiedIndex === `about-${index}` ? (
                            <Check className="h-4 w-4 mr-2" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          {copiedIndex === `about-${index}` ? "Copied" : "Copy URL"}
                        </Button>
                      </div>
                      <ImageUploader
                        initialImage={image}
                        onImageChange={(url) => handleImageChange("about", index, url)}
                        aspectRatio="portrait"
                      />
                    </div>
                  ))}
                  <Button onClick={() => addNewImage("about")}>Add New About Image</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="guides" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Guides Section Images</CardTitle>
                  <CardDescription>Manage images for the guides section of your website</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {images.guides.map((image, index) => (
                    <div key={`guides-${index}`} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Guide Image {index + 1}</h3>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(image, `guides-${index}`)}>
                          {copiedIndex === `guides-${index}` ? (
                            <Check className="h-4 w-4 mr-2" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          {copiedIndex === `guides-${index}` ? "Copied" : "Copy URL"}
                        </Button>
                      </div>
                      <ImageUploader
                        initialImage={image}
                        onImageChange={(url) => handleImageChange("guides", index, url)}
                        aspectRatio="landscape"
                      />
                    </div>
                  ))}
                  <Button onClick={() => addNewImage("guides")}>Add New Guide Image</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="testimonials" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Testimonial Images</CardTitle>
                  <CardDescription>Manage profile images for testimonials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {images.testimonials.map((image, index) => (
                    <div key={`testimonials-${index}`} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Testimonial Image {index + 1}</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(image, `testimonials-${index}`)}
                        >
                          {copiedIndex === `testimonials-${index}` ? (
                            <Check className="h-4 w-4 mr-2" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          {copiedIndex === `testimonials-${index}` ? "Copied" : "Copy URL"}
                        </Button>
                      </div>
                      <ImageUploader
                        initialImage={image}
                        onImageChange={(url) => handleImageChange("testimonials", index, url)}
                        aspectRatio="square"
                      />
                    </div>
                  ))}
                  <Button onClick={() => addNewImage("testimonials")}>Add New Testimonial Image</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Member Images</CardTitle>
                  <CardDescription>Manage profile images for team members</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {images.team.map((image, index) => (
                    <div key={`team-${index}`} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Team Member Image {index + 1}</h3>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(image, `team-${index}`)}>
                          {copiedIndex === `team-${index}` ? (
                            <Check className="h-4 w-4 mr-2" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          {copiedIndex === `team-${index}` ? "Copied" : "Copy URL"}
                        </Button>
                      </div>
                      <ImageUploader
                        initialImage={image}
                        onImageChange={(url) => handleImageChange("team", index, url)}
                        aspectRatio="portrait"
                      />
                    </div>
                  ))}
                  <Button onClick={() => addNewImage("team")}>Add New Team Member Image</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
