"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/blog"
import { ArrowLeft, Calendar, Clock, User, Facebook, Twitter, Linkedin } from "lucide-react"

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [blogPost, setBlogPost] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    // Load blog posts from localStorage
    try {
      const savedPosts = localStorage.getItem("victory-school-blog-posts")
      if (savedPosts) {
        const posts = JSON.parse(savedPosts)
        const post = posts.find((p: any) => p.slug === params.slug)

        if (post) {
          setBlogPost(post)
        } else {
          setNotFound(true)
        }
      } else {
        setNotFound(true)
      }
    } catch (error) {
      console.error("Error loading blog post:", error)
      setNotFound(true)
    } finally {
      setIsLoading(false)
    }
  }, [params.slug])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="relative h-[40vh] md:h-[50vh] bg-navy-900 animate-pulse"></div>
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
              <div className="h-8 bg-muted animate-pulse rounded mb-4 w-1/4"></div>
              <div className="h-12 bg-muted animate-pulse rounded mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-muted animate-pulse rounded w-full"></div>
                <div className="h-4 bg-muted animate-pulse rounded w-full"></div>
                <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/blogs">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blogs
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section with Cover Image */}
        <div className="relative h-[40vh] md:h-[50vh] bg-navy-900">
          <img
            src={blogPost.coverImage || "/placeholder.svg"}
            alt={blogPost.title}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
            <div className="container mx-auto px-4 pb-8 md:pb-16">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{blogPost.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{blogPost.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(blogPost.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{blogPost.readTime || "5 min read"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <Button variant="outline" asChild>
                <Link href="/blogs">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blogs
                </Link>
              </Button>
            </div>

            <div
              className="prose prose-lg dark:prose-invert max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: blogPost.content }}
            />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="bg-muted px-3 py-1 rounded-full text-sm">KCSE</span>
              <span className="bg-muted px-3 py-1 rounded-full text-sm">Computer Studies</span>
              <span className="bg-muted px-3 py-1 rounded-full text-sm">Exam Preparation</span>
              <span className="bg-muted px-3 py-1 rounded-full text-sm">Study Tips</span>
            </div>

            {/* Share Buttons */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold mb-4">Share this article</h3>
              <div className="flex gap-3">
                <Button variant="outline" size="icon">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
