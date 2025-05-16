import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { QuoteIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TestimonialProps {
  name: string
  school: string
  image: string
  quote: string
  year: string
}

export function Testimonial({ name, school, image, quote, year }: TestimonialProps) {
  return (
    <Card className="h-full transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-primary/20">
            <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
          </div>
          <div className="flex-1">
            <div className="mb-3 flex items-center">
              <div>
                <h4 className="text-base font-semibold">{name}</h4>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  {school}{" "}
                  <Badge variant="outline" className="text-xs">
                    {year}
                  </Badge>
                </p>
              </div>
              <QuoteIcon className="ml-auto h-5 w-5 text-primary/40" />
            </div>
            <p className="text-sm italic">{quote}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
