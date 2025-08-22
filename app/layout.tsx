import type React from "react"
import type { Metadata } from "next"
import { Mona_Sans as FontSans } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Victory School Club Membership System | KCSE 2025 Computer Studies Project",
  description:
    "Download KCSE 2025 Computer Studies Project files for Victory School Club Membership System. Get Milestone 1, Milestone 2, and the Full Project with comprehensive guides and support.",
  keywords: [
    "KCSE 2025",
    "Computer Studies Project",
    "Victory School Club",
    "Membership System",
    "Kenya Certificate of Secondary Education",
    "Project Download",
    "Milestone 1",
    "Milestone 2",
    "Student Project",
    "School Management System",
    "Club Management",
    "Educational Software",
    "KCSE Computer Studies",
    "Project Files",
    "Academic Project"
  ],
  authors: [{ name: "Victory School Club Project Team" }],
  creator: "Victory School Club Project Team",
  publisher: "Victory School Club",
  category: "Education",
  classification: "Educational Software",
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://victoryschoolclub.com",
    siteName: "Victory School Club Membership System",
    title: "Victory School Club Membership System | KCSE 2025 Computer Studies Project",
    description:
      "Download complete KCSE 2025 Computer Studies Project files for Victory School Club Membership System. Includes Milestone 1, Milestone 2, and Full Project with guides.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Victory School Club Membership System - KCSE 2025 Computer Studies Project",
        type: "image/png",
      },
      {
        url: "/og-image-square.png",
        width: 1200,
        height: 1200,
        alt: "Victory School Club - KCSE Project",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@victoryschoolclub",
    creator: "@victoryschoolclub",
    title: "Victory School Club Membership System | KCSE 2025 Project",
    description:
      "Download KCSE 2025 Computer Studies Project files - Victory School Club Membership System with comprehensive guides and support.",
    images: ["/twitter-image.png"],
  },
  alternates: {
    canonical: "https://victoryschoolclub.com",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Victory School Club",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#2563eb",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#2563eb",
  },
  icons: {
    icon: "/favicon.ico",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head />
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>{children}</body>
    </html>
  )
}
