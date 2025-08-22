"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import type { ReactNode } from "react"

interface ScrollButtonProps extends ButtonProps {
  targetId: string
  children: ReactNode
  showIcon?: boolean
}

export function ScrollButton({
  targetId,
  children,
  className,
  variant = "default",
  showIcon = true,
  ...props
}: ScrollButtonProps) {
  const handleClick = () => {
    const element = document.getElementById(targetId)
    if (element) {
      // Add smooth scrolling
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  return (
    <Button onClick={handleClick} className={cn("group", className)} variant={variant} {...props}>
      {children}
      {showIcon && <ChevronDown className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />}
    </Button>
  )
}
