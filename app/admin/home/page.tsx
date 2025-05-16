import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HomeEditor } from "@/components/home-editor"

export default function EditHomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <HomeEditor />
        </div>
      </main>
      <Footer />
    </div>
  )
}
