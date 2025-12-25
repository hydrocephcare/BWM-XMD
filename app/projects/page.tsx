import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { ProjectsContent } from "@/components/projects-content"

export default function ProjectsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Suspense fallback={null}>
        <ProjectsContent />
      </Suspense>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
