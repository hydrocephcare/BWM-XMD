import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-navy-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Victory School Club</h3>
            <p className="text-gray-300 mb-4">
              Empowering KCSE students with comprehensive project solutions for Computer Studies.
            </p>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://twitter.com" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://instagram.com" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://youtube.com" className="text-gray-300 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://youtu.be/Rhp84_oP6bU"
                  className="text-gray-300 hover:text-white transition-colors"
                  target="_blank"
                >
                  Video Tutorials
                </Link>
              </li>
              <li>
                <Link
                  href="https://victoryschoolclub.co.ke/wp-content/uploads/2025/05/GUIDELINE-FOR-VICTORY-SCHOOL-CLUB-MEMBERSHIP-SYSTEM.pdf"
                  className="text-gray-300 hover:text-white transition-colors"
                  target="_blank"
                >
                  Student Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href="https://victoryschoolclub.co.ke/wp-content/uploads/2025/05/Victory-School-Club-Membership-System-Question-Paper.pdf"
                  className="text-gray-300 hover:text-white transition-colors"
                  target="_blank"
                >
                  Sample Papers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Phone: (254) 115-475-543</li>
              <li className="text-gray-300">Email: info@victoryschoolclub.co.ke</li>
              <li className="text-gray-300">Nairobi, Kenya</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Victory School Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
