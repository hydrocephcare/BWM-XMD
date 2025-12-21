"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Clock, ArrowRight, BookmarkPlus, Share2, Search } from "lucide-react"

interface BlogCardProps {
  id: number
  title: string
  excerpt: string
  content?: string
  image: string
  author: string
  date: string
  category: string
  tags: string[]
  readTime: string
  featured?: boolean
}

export function BlogCard({
  id,
  title,
  excerpt,
  image,
  author,
  date,
  category,
  tags,
  readTime,
  featured = false,
}: BlogCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [imageError, setImageError] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: excerpt,
          url: `/blog/${id}`,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${title} - ${window.location.origin}/blog/${id}`)
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // Here you could save to localStorage or send to API
  }

  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-300 overflow-hidden ${
        featured ? "md:col-span-1 lg:col-span-1 border-gold-200 dark:border-gold-800" : ""
      }`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${featured ? "h-64" : "h-48"}`}>
        {!imageError ? (
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy-100 to-navy-200 dark:from-navy-800 dark:to-navy-900 flex items-center justify-center">
            <div className="text-center p-4">
              <BookmarkPlus className="h-8 w-8 mx-auto text-navy-400 mb-2" />
              <p className="text-sm text-navy-600 dark:text-navy-300">Article Image</p>
            </div>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant="secondary"
            className={`${
              featured ? "bg-gold-500 text-navy-900 hover:bg-gold-600" : "bg-navy-600 text-white hover:bg-navy-700"
            }`}
          >
            {category}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            onClick={handleBookmark}
          >
            <BookmarkPlus className={`h-3 w-3 ${isBookmarked ? "fill-current" : ""}`} />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            onClick={handleShare}
          >
            <Share2 className="h-3 w-3" />
          </Button>
        </div>

        {featured && (
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-gold-500 text-navy-900">⭐ Featured</Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(date)}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{author}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{readTime}</span>
          </div>
        </div>

        <h3
          className={`font-bold line-clamp-2 group-hover:text-navy-600 dark:group-hover:text-navy-300 transition-colors ${
            featured ? "text-xl" : "text-lg"
          }`}
        >
          {title}
        </h3>
      </CardHeader>

      <CardContent>
        <p className={`text-muted-foreground mb-4 line-clamp-3 ${featured ? "text-base" : "text-sm"}`}>{excerpt}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs px-2 py-1 hover:bg-navy-50 dark:hover:bg-navy-900">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs px-2 py-1">
              +{tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Read More Button */}
        <Link href={`/blog/${id}`} className="block">
          <Button variant="ghost" className="w-full justify-between group/btn hover:bg-navy-50 dark:hover:bg-navy-900">
            <span>Read Full Article</span>
            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogCardProps[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    // Load blogs from localStorage
    const savedBlogs = localStorage.getItem("blogs")
    if (savedBlogs) {
      setBlogs(JSON.parse(savedBlogs))
    }
  }, [])

  const categories = ["All", ...Array.from(new Set(blogs.map((blog) => blog.category)))]

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredBlogs = filteredBlogs.filter((blog) => blog.featured)
  const regularBlogs = filteredBlogs.filter((blog) => !blog.featured)

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-50 to-white dark:from-navy-950 dark:to-navy-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-navy-900 dark:text-white mb-4">Our Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights, tips, and resources for KCSE success
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-navy-600 hover:bg-navy-700" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Blogs */}
        {featuredBlogs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-6">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBlogs.map((blog) => (
                <BlogCard key={blog.id} {...blog} />
              ))}
            </div>
          </div>
        )}

        {/* Regular Blogs */}
        {regularBlogs.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-6">All Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularBlogs.map((blog) => (
                <BlogCard key={blog.id} {...blog} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery || selectedCategory !== "All"
                ? "No articles found matching your criteria."
                : "No blog posts available yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
