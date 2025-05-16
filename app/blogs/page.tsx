import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogCard } from "@/components/blog-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// Mock blog data - in a real app, this would come from your database
const mockBlogs = [
  {
    id: "1",
    title: "How to Prepare for KCSE Computer Studies",
    slug: "how-to-prepare-for-kcse-computer-studies",
    excerpt: "Essential tips and strategies to excel in your KCSE Computer Studies examination.",
    coverImage: "/placeholder.svg?height=600&width=1200",
    publishedAt: new Date().toISOString(),
    author: "John Doe",
    readTime: "5 min read",
  },
  {
    id: "2",
    title: "Understanding Database Design for KCSE Projects",
    slug: "understanding-database-design-for-kcse-projects",
    excerpt: "A comprehensive guide to designing efficient databases for your KCSE Computer Studies project.",
    coverImage: "/placeholder.svg?height=600&width=1200",
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    author: "Jane Smith",
    readTime: "8 min read",
  },
  {
    id: "3",
    title: "Top 10 Programming Tips for Beginners",
    slug: "top-10-programming-tips-for-beginners",
    excerpt: "Essential programming tips for students just starting their journey in computer studies.",
    coverImage: "/placeholder.svg?height=600&width=1200",
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    author: "David Kamau",
    readTime: "6 min read",
  },
  {
    id: "4",
    title: "The Importance of Documentation in KCSE Projects",
    slug: "importance-of-documentation-in-kcse-projects",
    excerpt: "Learn why proper documentation is crucial for scoring high marks in your KCSE Computer Studies project.",
    coverImage: "/placeholder.svg?height=600&width=1200",
    publishedAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
    author: "Sarah Wanjiku",
    readTime: "4 min read",
  },
  {
    id: "5",
    title: "How to Create Effective User Interfaces for Your Project",
    slug: "how-to-create-effective-user-interfaces",
    excerpt: "Design principles and best practices for creating user-friendly interfaces in your KCSE project.",
    coverImage: "/placeholder.svg?height=600&width=1200",
    publishedAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    author: "John Doe",
    readTime: "7 min read",
  },
  {
    id: "6",
    title: "Common Mistakes to Avoid in KCSE Computer Studies Projects",
    slug: "common-mistakes-to-avoid-in-kcse-projects",
    excerpt: "Learn about the pitfalls that many students encounter and how to avoid them in your project.",
    coverImage: "/placeholder.svg?height=600&width=1200",
    publishedAt: new Date(Date.now() - 86400000 * 14).toISOString(), // 14 days ago
    author: "Jane Smith",
    readTime: "5 min read",
  },
]

export default function BlogsPage() {
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockBlogs.map((blog) => (
                <BlogCard key={blog.id} {...blog} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="flex gap-2">
                <Button variant="outline" disabled>
                  Previous
                </Button>
                <Button variant="outline" className="bg-primary text-primary-foreground">
                  1
                </Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">Next</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
