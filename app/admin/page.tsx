"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, FileEdit, LayoutDashboard, Settings, Users, BookOpen, ImageIcon } from "lucide-react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

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
                        <p className="text-3xl font-bold">12</p>
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
                    {/* Sample blog posts - would be dynamically loaded */}
                    {[1, 2, 3].map((post) => (
                      <div key={post} className="flex items-center justify-between p-4 border rounded-md">
                        <div>
                          <h3 className="font-medium">How to Prepare for KCSE Computer Studies</h3>
                          <p className="text-sm text-muted-foreground">Published on May 10, 2025</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/blog/edit/${post}`}>
                              <FileEdit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/blogs">View All Posts</Link>
                  </Button>
                </CardFooter>
              </Card>
            )}

            {activeTab === "images" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Image Management</CardTitle>
                    <CardDescription>Manage your website images</CardDescription>
                  </div>
                  <Button asChild>
                    <Link href="/admin/images">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Manage Images
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Hero Images</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">3</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Blog Images</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">24</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Team Photos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">8</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/admin/images">Go to Image Management</Link>
                  </Button>
                </CardFooter>
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
