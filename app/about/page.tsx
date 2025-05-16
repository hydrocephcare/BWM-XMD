import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { AboutHero } from "@/components/about-hero"
import { AboutContent } from "@/components/about-content"
import { TeamSection } from "@/components/team-section"
import { MissionSection } from "@/components/mission-section"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <AboutHero />
        <AboutContent />
        <MissionSection />
        <TeamSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
