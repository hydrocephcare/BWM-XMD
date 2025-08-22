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
  }, [])

  useEffect(() => {
    // Skip if we're not in a browser environment or not mounted
    if (typeof window === "undefined" || !isMounted) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Use delay in milliseconds directly
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
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
  }, [delay, once, threshold, isMounted])

  // Determine the initial transform value based on direction
  const getInitialTransform = () => {
    switch (direction) {
      case "up":
        return `translateY(${distance}px)`
      case "down":
        return `translateY(-${distance}px)`
      case "left":
        return `translateX(${distance}px)`
      case "right":
        return `translateX(-${distance}px)`
      default:
        return `translateY(${distance}px)`
    }
  }

  // If not mounted yet (server-side), render hidden to prevent flash
  if (!isMounted) {
    return (
      <div className={cn(className)} style={{ opacity: 0 }}>
        {children}
      </div>
    )
  }

  const initialTransform = getInitialTransform()

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        transform: isVisible ? "translateX(0) translateY(0)" : initialTransform,
        opacity: isVisible ? 1 : 0,
        transition: `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`,
      }}
    >
      {children}
    </div>
  )
}
