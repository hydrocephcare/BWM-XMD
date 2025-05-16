import Link from "next/link"
import { GraduationCap, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-navy-800 text-white dark:bg-navy-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-6 w-6 text-gold-500" />
              <span className="text-xl font-bold">VICTORY SCHOOL</span>
            </div>
            <p className="text-white/70 text-sm">
              Victory School Club Membership System Project is this year's Project. Aim at the best and get the best.
              Good luck in your Exams.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#download" className="text-white/70 hover:text-gold-500 transition-colors text-sm">
                  Download Project
                </Link>
              </li>
              <li>
                <Link href="#guides" className="text-white/70 hover:text-gold-500 transition-colors text-sm">
                  Download from AI
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-white/70 hover:text-gold-500 transition-colors text-sm">
                  KCSE Grade Boost
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-white/70 hover:text-gold-500 transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-white/70 hover:text-gold-500 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-gold-500 transition-colors text-sm">
                  Send Feedback
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-gold-500 transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-gold-500 transition-colors text-sm">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/70 text-sm">
                <MapPin className="h-4 w-4 text-gold-500" />
                Nairobi, Kenya
              </li>
              <li className="flex items-center gap-2 text-white/70 text-sm">
                <Phone className="h-4 w-4 text-gold-500" />
                (254) 115-475-543
              </li>
              <li className="flex items-center gap-2 text-white/70 text-sm">
                <Mail className="h-4 w-4 text-gold-500" />
                admin@victoryschoolclub.co.ke
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/70 text-sm">
          <p>Copyright © {new Date().getFullYear()} KCSE Projects. For Educational Use Only. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="#" className="hover:text-gold-500 transition-colors">
              Terms Of Service
            </Link>
            <Link href="#" className="hover:text-gold-500 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-gold-500 transition-colors">
              Legal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
