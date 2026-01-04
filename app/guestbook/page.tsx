"use client"

import { Navigation } from "@/components/navigation"
import { GuestbookForm } from "@/components/guestbook-form"
import { GuestbookEntries } from "@/components/guestbook-entries"
import { useState, useEffect } from "react"

export interface GuestbookEntry {
  id: string
  name: string
  message: string
  timestamp: string
}

const defaultEntries: GuestbookEntry[] = [
  {
    id: "3",
    name: "Sarah Chen",
    message:
      "Your attention to detail is incredible. The minimalist approach really lets the content breathe. Inspiring work!",
    timestamp: "2025.01.02",
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    message: "Love the clean aesthetic and thoughtful writing. Keep creating beautiful things!",
    timestamp: "2024.12.28",
  },
  {
    id: "1",
    name: "Emma Thompson",
    message:
      "Found your site through a friend's recommendation. Really enjoying the content and the simple, elegant design.",
    timestamp: "2024.12.15",
  },
]

export default function GuestbookPage() {
  const [entries, setEntries] = useState<GuestbookEntry[]>(defaultEntries)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedEntries = localStorage.getItem("guestbook-entries")
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries))
      } catch (error) {
        console.error("Failed to parse guestbook entries:", error)
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("guestbook-entries", JSON.stringify(entries))
    }
  }, [entries, isLoaded])

  const handleAddEntry = (name: string, message: string) => {
    const newEntry: GuestbookEntry = {
      id: Date.now().toString(),
      name,
      message,
      timestamp: new Date()
        .toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\//g, "."),
    }
    setEntries([newEntry, ...entries])
  }

  return (
    <>
      <Navigation />
      <main className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <div className="space-y-12">
          <section className="space-y-4">
            <h1 className="text-4xl font-medium tracking-tight text-balance">Guestbook</h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Leave a message, share your thoughts, or just say hello. I read every entry and appreciate you taking the
              time.
            </p>
          </section>

          <GuestbookForm onSubmit={handleAddEntry} />

          <GuestbookEntries entries={entries} />
        </div>
      </main>
    </>
  )
}
