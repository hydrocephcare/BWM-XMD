import { Badge } from "@/components/ui/badge"

export function ContactHero() {
  return (
    <section className="bg-navy-700 text-white py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <Badge className="mb-4 bg-navy-600 text-white hover:bg-navy-500 border-none">Contact Us</Badge>
        <h1 className="text-3xl md:text-5xl font-bold mb-6">Get In Touch With Us</h1>
        <p className="text-white/80 max-w-3xl mx-auto text-lg">
          Have questions about our projects or need assistance? We're here to help! Reach out to us through any of the
          channels below.
        </p>
      </div>
    </section>
  )
}
