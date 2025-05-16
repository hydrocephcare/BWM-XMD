"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface NavLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function NavLink({ href, children, className, onClick }: NavLinkProps) {
  const [isActive, setIsActive] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Skip if we're not in a browser environment
    if (typeof window === "undefined") return

    const handleScroll = () => {
      if (href === "#home") {
        setIsActive(window.scrollY < 100)
        return
      }

      const section = document.querySelector(href)
      if (section) {
        const rect = section.getBoundingClientRect()
        const isInView = rect.top <= 100 && rect.bottom >= 100
        setIsActive(isInView)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check initial state

    return () => window.removeEventListener("scroll", handleScroll)
  }, [href])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // Skip if we're not in a browser environment
    if (typeof window === "undefined") return

    const element = document.querySelector(href)
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      })
    }
    if (onClick) onClick()
  }

  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary relative py-2",
        isMounted && isActive ? "text-primary" : "text-foreground/70",
        className,
      )}
      onClick={handleClick}
    >
      {children}
      <span
        className={cn(
          "absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300",
          isMounted && isActive ? "w-full" : "w-0",
        )}
      />
    </Link>
  )
}
