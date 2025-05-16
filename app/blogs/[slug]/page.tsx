import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/blog"
import { ArrowLeft, Calendar, Clock, User, Facebook, Twitter, Linkedin } from "lucide-react"

// Mock blog data - in a real app, this would come from your database based on the slug
const mockBlog = {
  id: "1",
  title: "How to Prepare for KCSE Computer Studies",
  slug: "how-to-prepare-for-kcse-computer-studies",
  excerpt: "Essential tips and strategies to excel in your KCSE Computer Studies examination.",
  content: `
    <p>Preparing for the KCSE Computer Studies examination requires a strategic approach that combines theoretical understanding with practical application. This comprehensive guide will help you navigate your preparation effectively.</p>
    
    <h2>Understanding the Syllabus</h2>
    <p>The first step in your preparation journey is to thoroughly understand the KCSE Computer Studies syllabus. The syllabus outlines all the topics and concepts that you need to master for the examination. Make sure you have a copy of the latest syllabus and use it as a roadmap for your studies.</p>
    
    <h2>Create a Study Schedule</h2>
    <p>Developing a realistic study schedule is crucial for effective preparation. Allocate specific time slots for different topics, ensuring that you give more time to challenging areas. Remember to include breaks in your schedule to avoid burnout.</p>
    
    <h3>Sample Study Schedule</h3>
    <ul>
      <li>Monday: Computer Hardware (2 hours)</li>
      <li>Tuesday: Operating Systems (2 hours)</li>
      <li>Wednesday: Programming Concepts (3 hours)</li>
      <li>Thursday: Database Design (2 hours)</li>
      <li>Friday: Networking (2 hours)</li>
      <li>Saturday: Practical Projects (4 hours)</li>
      <li>Sunday: Revision and Practice Questions (3 hours)</li>
    </ul>
    
    <h2>Master the Theoretical Concepts</h2>
    <p>Computer Studies involves understanding various theoretical concepts. Use textbooks, online resources, and class notes to build a strong foundation. Create concise notes or flashcards for key concepts to facilitate quick revision.</p>
    
    <h2>Hands-on Practice</h2>
    <p>Theory alone is not sufficient for excelling in Computer Studies. Regular hands-on practice is essential, especially for programming and database topics. Set up a development environment on your computer and practice coding regularly.</p>
    
    <h3>Programming Practice Tips</h3>
    <ul>
      <li>Start with simple programs and gradually increase complexity</li>
      <li>Practice implementing algorithms and data structures</li>
      <li>Work on small projects that integrate multiple concepts</li>
      <li>Debug your code to understand common errors and how to fix them</li>
    </ul>
    
    <h2>Database Design and Implementation</h2>
    <p>Database design is a critical component of the KCSE Computer Studies project. Ensure you understand:</p>
    <ul>
      <li>Entity-Relationship (ER) diagrams</li>
      <li>Normalization techniques</li>
      <li>SQL queries for data manipulation</li>
      <li>Database implementation using MS Access or other DBMS</li>
    </ul>
    
    <h2>Review Past Papers</h2>
    <p>Solving past examination papers is one of the most effective ways to prepare for KCSE. It helps you understand the exam pattern, question types, and marking scheme. Allocate sufficient time for this activity in your study schedule.</p>
    
    <h2>Form Study Groups</h2>
    <p>Collaborating with peers can enhance your learning experience. Form study groups where you can discuss complex concepts, solve problems together, and share resources. Teaching concepts to others is also an excellent way to reinforce your understanding.</p>
    
    <h2>Seek Guidance from Teachers</h2>
    <p>Don't hesitate to approach your teachers for clarification on difficult topics. They can provide valuable insights and resources to support your preparation.</p>
    
    <h2>Take Care of Your Well-being</h2>
    <p>Lastly, remember that your physical and mental well-being significantly impacts your academic performance. Ensure you get adequate sleep, maintain a balanced diet, and engage in regular physical activity. Take short breaks during study sessions to maintain focus and productivity.</p>
    
    <h2>Conclusion</h2>
    <p>Preparing for KCSE Computer Studies requires dedication, consistent effort, and a balanced approach. By following these strategies and maintaining a positive attitude, you can excel in your examination and build a strong foundation for future studies in computer science.</p>
  `,
  coverImage: "/placeholder.svg?height=800&width=1600",
  publishedAt: new Date().toISOString(),
  author: "John Doe",
  readTime: "10 min read",
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // In a real app, you would fetch the blog post data from your API based on the slug
  // For now, we'll use the mock data

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section with Cover Image */}
        <div className="relative h-[40vh] md:h-[50vh] bg-navy-900">
          <img
            src={mockBlog.coverImage || "/placeholder.svg"}
            alt={mockBlog.title}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
            <div className="container mx-auto px-4 pb-8 md:pb-16">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{mockBlog.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{mockBlog.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(mockBlog.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{mockBlog.readTime}</span>
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
              dangerouslySetInnerHTML={{ __html: mockBlog.content }}
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
