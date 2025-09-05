import type React from "react"
import { ClientLayout } from "@/components/layout/client-layout"
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
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
