"use client"

import { useRef } from "react"
import Image from "next/image"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Quote } from "lucide-react"

export function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-navy-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="mb-4 bg-navy-200 text-navy-700 hover:bg-navy-300">Student Feedback</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-4">What Our Students Say</h2>
          <p className="text-gray-600">
            We take pride in our students' success, as they frequently share feedback on passing their Computer Studies
            exams. Our projects help students clearly understand expectations and transform their dreams into achievable
            goals.
          </p>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Tabs defaultValue="2024" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-navy-100">
                <TabsTrigger value="2022" className="data-[state=active]:bg-navy-600 data-[state=active]:text-white">
                  KCSE 2022
                </TabsTrigger>
                <TabsTrigger value="2023" className="data-[state=active]:bg-navy-600 data-[state=active]:text-white">
                  KCSE 2023
                </TabsTrigger>
                <TabsTrigger value="2024" className="data-[state=active]:bg-navy-600 data-[state=active]:text-white">
                  KCSE 2024
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="2022" className="mt-0">
              <div className="grid gap-6 md:grid-cols-2">
                <TestimonialCard
                  name="Jane M."
                  school="Alliance Girls High School"
                  year="2022"
                  quote="The resources and guidance provided were invaluable in helping me successfully complete my KCSE project. The step-by-step approach made everything clear and manageable."
                  image="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                  imageAlt="Young African female student with a bright smile"
                />
                <TestimonialCard
                  name="David K."
                  school="Starehe Boys Centre"
                  year="2022"
                  quote="I was struggling with the database design until I found this resource. The documentation was clear and the support team was always available to answer my questions."
                  image=""
                  imageAlt=""
                />
              </div>
            </TabsContent>

            <TabsContent value="2023" className="mt-0">
              <div className="grid gap-6 md:grid-cols-2">
                <TestimonialCard
                  name="Joseph Andrew"
                  school="Mang'u High School"
                  year="2023"
                  quote="Thanks to the comprehensive tutorials and expert support, I was able to design and implement a fully functional database for my KCSE project. Highly recommended!"
                  image=""
                  imageAlt=""
                />
                <TestimonialCard
                  name="Faith W."
                  school="Kenya High School"
                  year="2023"
                  quote="The project guidelines were extremely helpful. I managed to score an A in my Computer Studies project thanks to the clear instructions and support."
                  image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                  imageAlt="Young African female student with a confident expression"
                />
              </div>
            </TabsContent>

            <TabsContent value="2024" className="mt-0">
              <div className="grid gap-6 md:grid-cols-2">
                <TestimonialCard
                  name="Mark Doe"
                  school="Nairobi School"
                  year="2024"
                  quote="Mafunzo yaliyotolewa hayakunisaidia tu kuelewa vipengele vya kiufundi, bali pia yalifanya mchakato wa uandishi wa hati kuwa rahisi zaidi. Nilijihisi nikiwa na ujasiri kote katika mradi."
                  image="https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                  imageAlt="Young African male student with a cheerful smile"
                />
                <TestimonialCard
                  name="Sarah N."
                  school="Precious Blood Riruta"
                  year="2024"
                  quote="The project materials were well-organized and easy to follow. I appreciated the detailed explanations and the responsive support team whenever I had questions."
                  image=""
                  imageAlt=""
                />
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}

interface TestimonialCardProps {
  name: string
  school: string
  year: string
  quote: string
  image: string
  imageAlt: string
}

function TestimonialCard({ name, school, year, quote, image, imageAlt }: TestimonialCardProps) {
  return (
    <Card className="border-gray-200 transition-all duration-200 hover:shadow-md hover:border-navy-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {image && (
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-navy-100">
              <Image src={image} alt={imageAlt} fill className="object-cover" />
            </div>
          )}
          <div className="flex-1">
            <div className="mb-3 flex items-center">
              <div>
                <h4 className="text-base font-semibold text-navy-800">{name}</h4>
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  {school}{" "}
                  <Badge variant="outline" className="text-xs border-navy-200 text-navy-600">
                    {year}
                  </Badge>
                </p>
              </div>
              <Quote className="ml-auto h-5 w-5 text-gold-500" />
            </div>
            <p className="text-sm italic text-gray-600">{quote}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
