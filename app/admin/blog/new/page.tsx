import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogEditor } from "@/components/blog-editor"

export default function NewBlogPost() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create New Blog Post</h1>
          <BlogEditor />
        </div>
      </main>
      <Footer />
    </div>
  )
}
