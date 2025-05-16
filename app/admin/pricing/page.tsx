import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PricingEditor } from "@/components/pricing-editor"

export default function EditPricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <PricingEditor />
        </div>
      </main>
      <Footer />
    </div>
  )
}
