import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TeamEditor } from "@/components/team-editor"

export default function EditTeamPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <TeamEditor />
        </div>
      </main>
      <Footer />
    </div>
  )
}
