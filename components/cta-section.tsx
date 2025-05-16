"use client"

import { useRef } from "react"
import Link from "next/link"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function CtaSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section className="py-16 md:py-24 bg-navy-700 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Achieve Your Goals</h2>
          <p className="text-lg text-white/80 mb-8">
            Download this Year's Project. Get your copy now! Each project is uniquely crafted and fully customized. We
            strongly discourage plagiarism to ensure every student receives their own original work. Contact us today to
            get yours!
          </p>
          <Button asChild size="lg" className="bg-gold-500 hover:bg-gold-600 text-navy-900 group">
            <Link href="https://wa.link/jox26j" target="_blank">
              Download Now
              <Download className="ml-2 h-5 w-5 transition-transform group-hover:translate-y-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
