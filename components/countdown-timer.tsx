"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

interface CountdownTimerProps {
  targetDate?: string
}

export function CountdownTimer({ targetDate = "2025-12-31T23:59:59" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const updateTimer = () => {
      const now = new Date()
      const target = new Date(targetDate)
      const difference = target.getTime() - now.getTime()

      // Debug info - remove these console.logs after testing
      console.log('Now:', now.toString())
      console.log('Target:', target.toString())
      console.log('Difference (ms):', difference)

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="h-4 w-4 text-navy-600 dark:text-gold-400" />
        <span className="text-sm font-medium text-navy-700 dark:text-white">Comp Exam Paper Countdown</span>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        <div>
          <div className="bg-navy-700 text-white dark:bg-gold-500 dark:text-navy-900 rounded px-2 py-1 text-xl font-bold">
            {String(timeLeft.days).padStart(2, "0")}
          </div>
          <span className="text-xs text-navy-600 dark:text-gold-400">Days</span>
        </div>
        <div>
          <div className="bg-navy-700 text-white dark:bg-gold-500 dark:text-navy-900 rounded px-2 py-1 text-xl font-bold">
            {String(timeLeft.hours).padStart(2, "0")}
          </div>
          <span className="text-xs text-navy-600 dark:text-gold-400">Hours</span>
        </div>
        <div>
          <div className="bg-navy-700 text-white dark:bg-gold-500 dark:text-navy-900 rounded px-2 py-1 text-xl font-bold">
            {String(timeLeft.minutes).padStart(2, "0")}
          </div>
          <span className="text-xs text-navy-600 dark:text-gold-400">Minutes</span>
        </div>
        <div>
          <div className="bg-navy-700 text-white dark:bg-gold-500 dark:text-navy-900 rounded px-2 py-1 text-xl font-bold">
            {String(timeLeft.seconds).padStart(2, "0")}
          </div>
          <span className="text-xs text-navy-600 dark:text-gold-400">Seconds</span>
        </div>
      </div>
    </div>
  )
}
