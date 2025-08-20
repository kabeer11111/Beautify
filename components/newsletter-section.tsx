"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export function NewsletterSection() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  return (
    <section className="py-16 bg-gradient-to-r from-pink-600 to-rose-600">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center text-white">
          <Mail className="h-12 w-12 mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Stay Beautiful, Stay Informed</h2>
          <p className="text-pink-100 mb-8 text-lg">
            Get the latest beauty tips, product launches, and exclusive offers delivered to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-pink-200 focus:bg-white/20"
              required
            />
            <Button type="submit" variant="secondary" className="bg-white text-pink-600 hover:bg-pink-50">
              Subscribe
            </Button>
          </form>

          <p className="text-pink-200 text-sm mt-4">Join 50,000+ beauty enthusiasts. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  )
}
