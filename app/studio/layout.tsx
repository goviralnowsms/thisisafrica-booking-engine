import type React from "react"

export const metadata = {
  title: "Sanity Studio - This is Africa",
  description: "Content Management System for This is Africa",
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ minHeight: '100vh' }}>
      {children}
    </div>
  )
}