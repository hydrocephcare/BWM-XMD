"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { ImageUploader } from "@/components/image-uploader"
import { Save, ArrowLeft, Bold, Italic, List, Heading, LinkIcon, ImageIcon } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import the editor to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
import "react-quill/dist/quill.snow.css"

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
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Here you would typically save the blog post to your database
      // For now, we'll just simulate a successful save
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: isEditing ? "Blog updated" : "Blog created",
        description: isEditing
          ? "Your blog post has been updated successfully."
          : "Your blog post has been created successfully.",
      })

      // Redirect to the blogs page
      router.push("/admin")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your blog post. Please try again.",
        variant: "destructive",
      })
      console.error("Error saving blog post:", error)
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
      toast({
        title: "No image available",
        description: "Please upload a cover image first, then you can insert it into your content.",
      })
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
