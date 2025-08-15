import type React from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "@/components/ui/toaster"
import { EnhancedRecommendationAssistant } from "@/components/enhanced-recommendation-assistant"
import "./globals.css"

export const metadata = {
  title: "This is Africa - Authentic African Travel Experiences",
  description:
    "Experience the magic of Africa with our expertly crafted tours and safaris. Book your unforgettable African adventure today.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
        <EnhancedRecommendationAssistant />
        <Toaster />
      </body>
    </html>
  )
}
