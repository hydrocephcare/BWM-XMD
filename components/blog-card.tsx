import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { formatDate } from "@/lib/blog"
import { CalendarIcon, Clock, User } from "lucide-react"

interface BlogCardProps {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage: string
  publishedAt: string
  author: string
  readTime?: string
}

export function BlogCard({
  id,
  title,
  slug,
  excerpt,
  coverImage,
  publishedAt,
  author,
  readTime = "5 min read",
}: BlogCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md dark:hover:shadow-navy-700/20">
      <Link href={`/blogs/${slug}`} className="block overflow-hidden h-48">
        <img
          src={coverImage || "/placeholder.svg?height=400&width=600"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </Link>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <CalendarIcon className="h-3 w-3" />
          <span>{formatDate(publishedAt)}</span>
          <span className="mx-1">•</span>
          <Clock className="h-3 w-3" />
          <span>{readTime}</span>
        </div>
        <Link href={`/blogs/${slug}`} className="hover:underline">
          <h3 className="text-xl font-bold line-clamp-2">{title}</h3>
        </Link>
      </CardHeader>
      <CardContent className="pb-4 flex-grow">
        <p className="text-muted-foreground line-clamp-3">{excerpt}</p>
      </CardContent>
      <CardFooter className="pt-0 border-t">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{author}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
