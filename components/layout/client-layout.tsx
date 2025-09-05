'use client'

import { usePathname } from 'next/navigation'
import { Header } from "./header"
import { Footer } from "./footer"
import { Toaster } from "@/components/ui/toaster"
import { EnhancedRecommendationAssistant } from "@/components/enhanced-recommendation-assistant"

export function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isStudio = pathname?.startsWith('/studio')

  return (
    <>
      {!isStudio && <Header />}
      {children}
      {!isStudio && <Footer />}
      {!isStudio && <EnhancedRecommendationAssistant />}
      <Toaster />
    </>
  )
}