import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GuideEditor } from "@/components/guide-editor"

export default function EditGuidesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <GuideEditor />
        </div>
      </main>
      <Footer />
    </div>
  )
}
