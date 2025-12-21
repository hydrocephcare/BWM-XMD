import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, Users, DollarSign, BookOpen, ImageIcon, Upload, FileCode } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your Victory School Club website content</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Home Page Editor */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Link href="/admin/home">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Home className="w-5 h-5" />
                Home Page
              </h3>
              <p className="text-gray-600 text-sm mb-4">Edit homepage content, images, and sections</p>
              <Button className="w-full">Edit Home</Button>
            </Link>
          </Card>

          {/* About Page Editor */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Link href="/admin/about">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Users className="w-5 h-5" />
                About Page
              </h3>
              <p className="text-gray-600 text-sm mb-4">Manage about page content and team information</p>
              <Button className="w-full">Edit About</Button>
            </Link>
          </Card>

          {/* Pricing Editor */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Link href="/admin/pricing">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Pricing Plans
              </h3>
              <p className="text-gray-600 text-sm mb-4">Update pricing tiers, features, and costs</p>
              <Button className="w-full">Edit Pricing</Button>
            </Link>
          </Card>

          {/* Team Editor */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Link href="/admin/team">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Members
              </h3>
              <p className="text-gray-600 text-sm mb-4">Add and manage team member profiles</p>
              <Button className="w-full">Manage Team</Button>
            </Link>
          </Card>

          {/* Blog Editor */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Link href="/admin/blog">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Blog Posts
              </h3>
              <p className="text-gray-600 text-sm mb-4">Create and edit blog posts</p>
              <Button className="w-full">Manage Blog</Button>
            </Link>
          </Card>

          {/* Image Gallery */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Link href="/admin/gallery">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Image Gallery
              </h3>
              <p className="text-gray-600 text-sm mb-4">View and manage uploaded images</p>
              <Button className="w-full">View Gallery</Button>
            </Link>
          </Card>

          {/* Image Upload */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Link href="/admin/upload">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Images
              </h3>
              <p className="text-gray-600 text-sm mb-4">Upload new images to your site</p>
              <Button className="w-full">Upload</Button>
            </Link>
          </Card>

          {/* Project Files */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Link href="/admin/projects">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <FileCode className="w-5 h-5" />
                Project Files
              </h3>
              <p className="text-gray-600 text-sm mb-4">Manage downloadable project files with M-Pesa payments</p>
              <Button className="w-full">Manage Files</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
