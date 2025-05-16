"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PlusCircle,
  FileEdit,
  LayoutDashboard,
  Settings,
  Users,
  BookOpen,
  ImageIcon,
  Upload,
  Home,
  InfoIcon,
  DollarSign,
} from "lucide-react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [blogPosts, setBlogPosts] = useState<any[]>([])

  useEffect(() => {
    // Get query parameter for tab
    const urlParams = new URLSearchParams(window.location.search)
    const tabParam = urlParams.get("tab")
    if (tabParam) {
      setActiveTab(tabParam)
    }

    // Load blog posts from localStorage
    try {
      const savedPosts = localStorage.getItem("victory-school-blog-posts")
      if (savedPosts) {
        setBlogPosts(JSON.parse(savedPosts))
      }
    } catch (error) {
      console.error("Error loading blog posts:", error)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Admin Panel</CardTitle>
                <CardDescription>Manage your website content</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs
                  defaultValue="overview"
                  className="w-full"
                  orientation="vertical"
                  value={activeTab}
                  onValueChange={setActiveTab}
                >
                  <TabsList className="flex flex-col h-auto items-stretch bg-transparent border-r-0">
                    <TabsTrigger value="overview" className="justify-start text-left px-4 data-[state=active]:bg-muted">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="home" className="justify-start text-left px-4 data-[state=active]:bg-muted">
                      <Home className="h-4 w-4 mr-2" />
                      Home Page
                    </TabsTrigger>
                    <TabsTrigger value="about" className="justify-start text-left px-4 data-[state=active]:bg-muted">
                      <InfoIcon className="h-4 w-4 mr-2" />
                      About Page
                    </TabsTrigger>
                    <TabsTrigger value="pricing" className="justify-start text-left px-4 data-[state=active]:bg-muted">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Pricing
                    </TabsTrigger>
                    <TabsTrigger value="blogs" className="justify-start text-left px-4 data-[state=active]:bg-muted">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Blog Posts
                    </TabsTrigger>
                    <TabsTrigger value="images" className="justify-start text-left px-4 data-[state=active]:bg-muted">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Images
                    </TabsTrigger>
                    <TabsTrigger value="users" className="justify-start text-left px-4 data-[state=active]:bg-muted">
                      <Users className="h-4 w-4 mr-2" />
                      Users
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="justify-start text-left px-4 data-[state=active]:bg-muted">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "overview" && (
              <Card>
                <CardHeader>
                  <CardTitle>Dashboard Overview</CardTitle>
                  <CardDescription>Welcome to your admin dashboard</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Blog Posts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">{blogPosts.length}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Users</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">48</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Downloads</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">156</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "home" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Home Page Editor</CardTitle>
                    <CardDescription>Edit your home page content and images</CardDescription>
                  </div>
                  <Button asChild>
                    <Link href="/admin/home">
                      <Home className="h-4 w-4 mr-2" />
                      Edit Home Page
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>Use the Home Page Editor to update the content and images on your home page. You can:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Change the hero section image</li>
                      <li>Update the about section image</li>
                      <li>Change guide images</li>
                      <li>Update testimonial profile pictures</li>
                      <li>Change team member photos</li>
                      <li>Update service images</li>
                      <li>Change download and CTA section backgrounds</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/admin/home">
                      <Home className="h-4 w-4 mr-2" />
                      Go to Home Page Editor
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )}

            {activeTab === "about" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>About Page Editor</CardTitle>
                    <CardDescription>Edit your about page content and images</CardDescription>
                  </div>
                  <Button asChild>
                    <Link href="/admin/about">
                      <InfoIcon className="h-4 w-4 mr-2" />
                      Edit About Page
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>Use the About Page Editor to update the content and images on your about page. You can:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Change the about hero image</li>
                      <li>Update the content section image</li>
                      <li>Change the mission section image</li>
                      <li>Edit the about us text content</li>
                      <li>Update the features and benefits</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/admin/about">
                      <InfoIcon className="h-4 w-4 mr-2" />
                      Go to About Page Editor
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )}

            {activeTab === "pricing" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Pricing Editor</CardTitle>
                    <CardDescription>Edit your pricing plans and milestones</CardDescription>
                  </div>
                  <Button asChild>
                    <Link href="/admin/pricing">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Edit Pricing
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>Use the Pricing Editor to update your pricing plans and milestones. You can:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Change plan titles and descriptions</li>
                      <li>Update pricing information</li>
                      <li>Edit plan features</li>
                      <li>Customize the pricing tiers</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/admin/pricing">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Go to Pricing Editor
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )}

            {activeTab === "blogs" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Blog Posts</CardTitle>
                    <CardDescription>Manage your blog content</CardDescription>
                  </div>
                  <Button asChild>
                    <Link href="/admin/blog/new">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      New Post
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {blogPosts.length === 0 ? (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No blog posts yet</h3>
                        <p className="text-muted-foreground mb-4">Create your first blog post to get started</p>
                        <Button asChild>
                          <Link href="/admin/blog/new">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Create New Post
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      blogPosts.map((post) => (
                        <div key={post.id} className="flex items-center justify-between p-4 border rounded-md">
                          <div>
                            <h3 className="font-medium">{post.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Published on {new Date(post.publishedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/admin/blog/edit/${post.id}`}>
                                <FileEdit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
                {blogPosts.length > 0 && (
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/blogs">View All Posts</Link>
                    </Button>
                  </CardFooter>
                )}
              </Card>
            )}

            {activeTab === "images" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Image Management</CardTitle>
                    <CardDescription>Manage your website images</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Upload Images</CardTitle>
                        <CardDescription>Add new images to your website</CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-center justify-center py-6">
                        <Upload className="h-12 w-12 text-muted-foreground" />
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" asChild>
                          <Link href="/admin/upload">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Images
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Image Gallery</CardTitle>
                        <CardDescription>Browse and manage your images</CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-center justify-center py-6">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" variant="outline" asChild>
                          <Link href="/admin/gallery">
                            <ImageIcon className="h-4 w-4 mr-2" />
                            View Gallery
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2">How to use images in your website</h3>
                    <ol className="list-decimal pl-5 space-y-1 text-sm">
                      <li>Upload images using the Upload Images page</li>
                      <li>Copy the image URL from the Gallery</li>
                      <li>Paste the URL where you need to use the image</li>
                      <li>Images are automatically optimized and served from Vercel's CDN</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "users" && (
              <Card>
                <CardHeader>
                  <CardTitle>Users</CardTitle>
                  <CardDescription>Manage user accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>User management functionality will be implemented here.</p>
                </CardContent>
              </Card>
            )}

            {activeTab === "settings" && (
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Configure your website settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Website settings will be implemented here.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
