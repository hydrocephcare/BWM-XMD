"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        scrolled ? "bg-white/80 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
              <span className="text-xl font-bold text-navy-700">Victory</span>
              <span className="text-xl font-bold text-gold-500">School</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-navy-600 transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-navy-600 transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-navy-600 transition-colors">
              Contact Us
            </Link>
            <Link href="/#download" className="text-sm font-medium text-gray-700 hover:text-navy-600 transition-colors">
              Download Projects
            </Link>
            <Link href="/#guides" className="text-sm font-medium text-gray-700 hover:text-navy-600 transition-colors">
              View Guides
            </Link>
            <Link href="/blogs" className="text-sm font-medium text-gray-700 hover:text-navy-600 transition-colors">
              Blogs
            </Link>
            <Link href="/admin" className="text-sm font-medium text-gray-700 hover:text-navy-600 transition-colors">
              Admin
            </Link>
            <Button asChild className="ml-4 bg-navy-600 hover:bg-navy-700">
              <Link href="/#download">Download Now</Link>
            </Button>
          </nav>

          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Menu Button */}
            <button className="p-2 text-gray-700 focus:outline-none" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b shadow-lg">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-navy-600 transition-colors py-2"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-navy-600 transition-colors py-2"
              onClick={closeMenu}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-700 hover:text-navy-600 transition-colors py-2"
              onClick={closeMenu}
            >
              Contact Us
            </Link>
            <Link
              href="/#download"
              className="text-sm font-medium text-gray-700 hover:text-navy-600 transition-colors py-2"
              onClick={closeMenu}
            >
              Download Projects
            </Link>
            <Link
              href="/#guides"
              className="text-sm font-medium text-gray-700 hover:text-navy-600 transition-colors py-2"
              onClick={closeMenu}
            >
              View Guides
            </Link>
            <Link
              href="/blogs"
              className="text-sm font-medium text-gray-700 hover:text-navy-600 transition-colors py-2"
              onClick={closeMenu}
            >
              Blogs
            </Link>
            <Link
              href="/admin"
              className="text-sm font-medium text-gray-700 hover:text-navy-600 transition-colors py-2"
              onClick={closeMenu}
            >
              Admin
            </Link>
            <Button asChild className="w-full bg-navy-600 hover:bg-navy-700 mt-2">
              <Link href="/#download" onClick={closeMenu}>
                Download Now
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
