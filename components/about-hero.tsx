import { Badge } from "@/components/ui/badge"

export function AboutHero() {
  return (
    <section className="bg-navy-700 text-white py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <Badge className="mb-4 bg-navy-600 text-white hover:bg-navy-500 border-none">About Us</Badge>
        <h1 className="text-3xl md:text-5xl font-bold mb-6">Supporting KCSE Students Since 2020</h1>
        <p className="text-white/80 max-w-3xl mx-auto text-lg">
          We are dedicated to helping students achieve excellence in their KCSE Computer Studies projects through
          high-quality resources, guidance, and support.
        </p>
      </div>
    </section>
  )
}
