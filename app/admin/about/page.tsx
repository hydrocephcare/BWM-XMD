import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AboutEditor } from "@/components/about-editor"

export default function EditAboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <AboutEditor />
        </div>
      </main>
      <Footer />
    </div>
  )
}
