"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

export function Newsletter() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the email to your newsletter service
    toast({
      title: "Success!",
      description: "You've been subscribed to our newsletter.",
    })
    setEmail("")
  }

  return (
    <section className="py-12 md:py-20 bg-amber-500">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay in Touch</h2>
          <p className="text-lg text-white/90 mb-8">
            Subscribe to our newsletter for exclusive offers, travel tips, and updates on our latest African adventures
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/90 border-0 focus-visible:ring-2 focus-visible:ring-white"
            />
            <Button type="submit" className="bg-green-800 hover:bg-green-900 text-white">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
