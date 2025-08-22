"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Clock, ArrowRight, BookmarkPlus, Share2 } from "lucide-react"

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
  featured = false
}: BlogCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [imageError, setImageError] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: excerpt,
          url: `/blog/${id}`
        })
      } catch (error) {
        console.log('Error sharing:', error)
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
    <Card className={`group hover:shadow-lg transition-all duration-300 overflow-hidden ${
      featured ? 'md:col-span-1 lg:col-span-1 border-gold-200 dark:border-gold-800' : ''
    }`}>
      {/* Image */}
      <div className={`relative overflow-hidden ${featured ? 'h-64' : 'h-48'}`}>
        {!imageError ? (
          <Image
            src={image}
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
              featured 
                ? 'bg-gold-500 text-navy-900 hover:bg-gold-600' 
                : 'bg-navy-600 text-white hover:bg-navy-700'
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
            <BookmarkPlus className={`h-3 w-3 ${isBookmarked ? 'fill-current' : ''}`} />
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
            <Badge className="bg-gold-500 text-navy-900">
              ⭐ Featured
            </Badge>
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

        <h3 className={`font-bold line-clamp-2 group-hover:text-navy-600 dark:group-hover:text-navy-300 transition-colors ${
          featured ? 'text-xl' : 'text-lg'
        }`}>
          {title}
        </h3>
      </CardHeader>

      <CardContent>
        <p className={`text-muted-foreground mb-4 line-clamp-3 ${
          featured ? 'text-base' : 'text-sm'
        }`}>
          {excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {tags.slice(0, 3).map((tag, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs px-2 py-1 hover:bg-navy-50 dark:hover:bg-navy-900"
            >
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
          <Button 
            variant="ghost" 
            className="w-full justify-between group/btn hover:bg-navy-50 dark:hover:bg-navy-900"
          >
            <span>Read Full Article</span>
            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
