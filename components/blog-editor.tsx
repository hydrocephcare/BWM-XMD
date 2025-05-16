"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUploader } from "@/components/image-uploader"
import { Save, ArrowLeft, Bold, Italic, List, Heading, LinkIcon, ImageIcon } from "lucide-react"

// Storage key for blog posts
const STORAGE_KEY = "victory-school-blog-posts"

interface BlogEditorProps {
  initialData?: {
    id?: string
    title: string
    slug: string
    excerpt: string
    content: string
    coverImage: string
  }
  isEditing?: boolean
}

export function BlogEditor({ initialData, isEditing = false }: BlogEditorProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState(initialData?.title || "")
  const [slug, setSlug] = useState(initialData?.slug || "")
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "")
  const [saveMessage, setSaveMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Generate slug from title
  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")
  }, [])

  // Handle title change and auto-generate slug if not editing
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    if (!isEditing) {
      setSlug(generateSlug(newTitle))
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !content || !excerpt) {
      setSaveMessage("Please fill in all required fields.")
      return
    }

    setIsSubmitting(true)
    setSaveMessage("")

    try {
      // Create a new blog post object
      const blogPost = {
        id: initialData?.id || Date.now().toString(),
        title,
        slug,
        excerpt,
        content,
        coverImage,
        publishedAt: new Date().toISOString(),
        author: "Admin User", // In a real app, this would come from the authenticated user
      }

      // Get existing blog posts from localStorage
      const existingPostsJSON = localStorage.getItem(STORAGE_KEY)
      const existingPosts = existingPostsJSON ? JSON.parse(existingPostsJSON) : []

      // If editing, update the existing post
      // Otherwise, add the new post to the beginning of the array
      let updatedPosts
      if (isEditing && initialData?.id) {
        updatedPosts = existingPosts.map((post: any) => (post.id === initialData.id ? blogPost : post))
      } else {
        updatedPosts = [blogPost, ...existingPosts]
      }

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts))

      // Show success message
      setSaveMessage(isEditing ? "Blog post updated successfully!" : "Blog post created successfully!")

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/admin?tab=blogs")
      }, 1500)
    } catch (error) {
      console.error("Error saving blog post:", error)
      setSaveMessage("Error saving blog post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Text formatting functions
  const insertFormatting = (startTag: string, endTag: string) => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const beforeText = content.substring(0, start)
    const afterText = content.substring(end)

    setContent(beforeText + startTag + selectedText + endTag + afterText)

    // Set focus back to textarea after formatting
    setTimeout(() => {
      textarea.focus()
      textarea.selectionStart = start + startTag.length
      textarea.selectionEnd = start + startTag.length + selectedText.length
    }, 0)
  }

  const formatBold = () => insertFormatting("<strong>", "</strong>")
  const formatItalic = () => insertFormatting("<em>", "</em>")
  const formatHeading = () => insertFormatting("<h2>", "</h2>")
  const formatList = () => insertFormatting("<ul>\n  <li>", "</li>\n</ul>")
  const formatLink = () => {
    const url = prompt("Enter URL:", "https://")
    if (url) {
      insertFormatting(`<a href="${url}">`, "</a>")
    }
  }

  const insertImage = () => {
    if (coverImage) {
      insertFormatting(`<img src="${coverImage}" alt="Blog image" class="w-full my-4" />`, "")
    } else {
      setSaveMessage("Please upload a cover image first, then you can insert it into your content.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Saving..." : isEditing ? "Update Post" : "Publish Post"}
        </Button>
      </div>

      {saveMessage && (
        <div
          className={`p-4 rounded-md ${saveMessage.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
        >
          {saveMessage}
        </div>
      )}

      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="Enter blog title" value={title} onChange={handleTitleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            placeholder="url-friendly-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            placeholder="Brief summary of your blog post"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            required
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Cover Image</Label>
          <ImageUploader
            initialImage={coverImage}
            onImageChange={setCoverImage}
            aspectRatio="landscape"
            buttonText="Upload Cover Image"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <div className="border rounded-md">
            <div className="flex items-center gap-1 p-2 border-b bg-muted/50">
              <Button type="button" variant="ghost" size="icon" onClick={formatBold} title="Bold">
                <Bold className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={formatItalic} title="Italic">
                <Italic className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={formatHeading} title="Heading">
                <Heading className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={formatList} title="List">
                <List className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={formatLink} title="Link">
                <LinkIcon className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={insertImage} title="Insert Image">
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog post content here... (HTML formatting is supported)"
              className="min-h-[350px] border-0 rounded-none rounded-b-md focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            You can use HTML tags for formatting. Select text and use the toolbar buttons to add formatting.
          </p>
        </div>
      </div>
    </form>
  )
}
