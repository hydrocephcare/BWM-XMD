"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogCard } from "@/components/blog-card"
import { Input } from "@/components/ui/input"
import { Search, BookOpen } from "lucide-react"

export default function BlogsPage() {
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load blog posts from localStorage
    try {
      const savedPosts = localStorage.getItem("victory-school-blog-posts")
      if (savedPosts) {
        setBlogPosts(JSON.parse(savedPosts))
      }
    } catch (error) {
      console.error("Error loading blog posts:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-navy-700 dark:bg-navy-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Victory School Blog</h1>
            <p className="text-white/80 max-w-3xl mx-auto text-lg">
              Insights, tips, and resources to help you excel in your KCSE Computer Studies project and beyond.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mt-8 relative">
              <Input
                placeholder="Search articles..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            </div>
          </div>
        </section>

        {/* Blog Listing */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-[400px] bg-muted animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-4">No Blog Posts Yet</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  We're working on creating valuable content for you. Check back soon for articles about KCSE Computer
                  Studies projects.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.map((blog) => (
                  <BlogCard key={blog.id} {...blog} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
