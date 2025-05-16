"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
  direction?: "up" | "down" | "left" | "right"
  distance?: number
  duration?: number
  once?: boolean
  threshold?: number
}

export function ScrollReveal({
  children,
  delay = 0,
  className,
  direction = "up",
  distance = 50,
  duration = 700,
  once = true,
  threshold = 0.1,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)

    // Skip if we're not in a browser environment
    if (typeof window === "undefined") return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay * 100) // Convert to milliseconds
          if (once) {
            observer.unobserve(entry.target)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      {
        threshold,
      },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [delay, once, threshold])

  // If not mounted yet (server-side), render without animation
  if (!isMounted) {
    return <div>{children}</div>
  }

  // Determine the transform value based on direction
  let transform = "translate-y-0"
  let initialTransform = ""

  switch (direction) {
    case "up":
      initialTransform = `translateY(${distance}px)`
      transform = isVisible ? "translate-y-0" : `translate-y-[${distance}px]`
      break
    case "down":
      initialTransform = `translateY(-${distance}px)`
      transform = isVisible ? "translate-y-0" : `translate-y-[-${distance}px]`
      break
    case "left":
      initialTransform = `translateX(${distance}px)`
      transform = isVisible ? "translate-x-0" : `translate-x-[${distance}px]`
      break
    case "right":
      initialTransform = `translateX(-${distance}px)`
      transform = isVisible ? "translate-x-0" : `translate-x-[-${distance}px]`
      break
  }

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        transform: isVisible ? "none" : initialTransform,
        opacity: isVisible ? 1 : 0,
        transition: `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`,
      }}
    >
      {children}
    </div>
  )
}
