"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface GuestbookFormProps {
  onSubmit: (name: string, message: string) => void
}

export function GuestbookForm({ onSubmit }: GuestbookFormProps) {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && message.trim()) {
      onSubmit(name, message)
      setName("")
      setMessage("")
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
          className="bg-background resize-none"
        />
      </div>

      <Button type="submit" className="w-full">
        Sign Guestbook
      </Button>
    </form>
  )
}
