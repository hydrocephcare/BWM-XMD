"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogEditor } from "@/components/blog-editor"
import { Skeleton } from "@/components/ui/skeleton"

export default function EditBlogPost({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [blogData, setBlogData] = useState<any>(null)

  useEffect(() => {
    // In a real app, you would fetch the blog post data from your API
    // For now, we'll simulate loading data
    const fetchBlogPost = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        setBlogData({
          id: params.id,
          title: "How to Prepare for KCSE Computer Studies",
          slug: "how-to-prepare-for-kcse-computer-studies",
          excerpt: "Essential tips and strategies to excel in your KCSE Computer Studies examination.",
          content:
            "<p>This is a sample blog post content. In a real application, this would be loaded from your database.</p><h2>Study Tips</h2><p>Here are some study tips for KCSE Computer Studies:</p><ul><li>Practice coding regularly</li><li>Understand database concepts thoroughly</li><li>Review past papers</li></ul>",
          coverImage: "/placeholder.svg?height=600&width=1200",
          publishedAt: new Date().toISOString(),
        })
      } catch (error) {
        console.error("Error fetching blog post:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogPost()
  }, [params.id])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Edit Blog Post</h1>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <BlogEditor initialData={blogData} isEditing={true} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
