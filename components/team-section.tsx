"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export function TeamSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [teamMembers, setTeamMembers] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if user is admin
    const urlParams = new URLSearchParams(window.location.search)
    setIsAdmin(urlParams.get("admin") === "true")

    // Load team members from localStorage
    try {
      const savedTeam = localStorage.getItem("victory-school-team")
      if (savedTeam) {
        setTeamMembers(JSON.parse(savedTeam))
      }
    } catch (error) {
      console.error("Error loading team members:", error)
    }
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  if (teamMembers.length === 0 && !isAdmin) {
    return null
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-4">Meet Our Team</h2>
          <p className="text-gray-600">
            Our team consists of experienced educators, software developers, and support staff dedicated to helping KCSE
            students succeed in their Computer Studies projects.
          </p>

          {isAdmin && (
            <div className="mt-6">
              <Button asChild>
                <Link href="/admin/team">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Manage Team Members
                </Link>
              </Button>
            </div>
          )}
        </div>

        {teamMembers.length > 0 ? (
          <motion.div
            ref={ref}
            variants={container}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            className="grid gap-6 md:grid-cols-3 lg:grid-cols-4"
          >
            {teamMembers.map((member, index) => (
              <motion.div key={index} variants={item}>
                <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md hover:border-navy-200">
                  <div className="relative h-64 w-full">
                    <Image
                      src={member.image || "/placeholder.svg?height=400&width=300"}
                      alt={`${member.name}, ${member.role}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold text-navy-700">{member.name}</h3>
                    <Badge className="mt-1 mb-2 bg-navy-100 text-navy-700 hover:bg-navy-200">{member.role}</Badge>
                    <p className="text-sm text-gray-600">{member.bio}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          isAdmin && (
            <div className="text-center p-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <h3 className="text-lg font-medium text-gray-600 mb-4">No team members yet</h3>
              <p className="text-gray-500 mb-6">Add team members from the admin panel</p>
              <Button asChild>
                <Link href="/admin/team">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Team Members
                </Link>
              </Button>
            </div>
          )
        )}
      </div>
    </section>
  )
}
