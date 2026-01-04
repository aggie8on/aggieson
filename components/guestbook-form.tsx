"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function GuestbookForm() {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && message.trim()) {
      setIsSubmitting(true)
      const supabase = createClient()

      const { error } = await supabase.from("guestbook_entries").insert({
        name: name.trim(),
        message: message.trim(),
      })

      if (error) {
        console.error("Error adding guestbook entry:", error)
        alert("Failed to add entry. Please try again.")
      } else {
        setName("")
        setMessage("")
        // Refresh the page to show new entry
        router.refresh()
      }

      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-border rounded-lg p-6 bg-card">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
          disabled={isSubmitting}
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Leave a message..."
          rows={4}
          required
          disabled={isSubmitting}
          className="bg-background resize-none"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Sign Guestbook"}
      </Button>
    </form>
  )
}
