"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogEditor } from "@/components/blog-editor"
import { Skeleton } from "@/components/ui/skeleton"

export default function EditBlogPost({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [blogData, setBlogData] = useState<any>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    // Load blog posts from localStorage
    const fetchBlogPost = async () => {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        const savedPosts = localStorage.getItem("victory-school-blog-posts")
        if (savedPosts) {
          const posts = JSON.parse(savedPosts)
          const post = posts.find((p: any) => p.id === params.id)

          if (post) {
            setBlogData(post)
          } else {
            setNotFound(true)
          }
        } else {
          setNotFound(true)
        }
      } catch (error) {
        console.error("Error fetching blog post:", error)
        setNotFound(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogPost()
  }, [params.id])

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Blog Post Not Found</h1>
            <p>The blog post you're trying to edit doesn't exist or has been deleted.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

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
