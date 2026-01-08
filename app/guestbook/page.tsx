"use client"

import { Navigation } from "@/components/navigation"
import { GuestbookForm } from "@/components/guestbook-form"
import { GuestbookEntries } from "@/components/guestbook-entries"
import { createClient } from "@/lib/supabase/client"

export const dynamic = "force-dynamic"

export interface GuestbookEntry {
  id: string
  name: string
  message: string
  timestamp: string
}

export default async function GuestbookPage() {
  const supabase = await createClient()

  // Fetch entries from Supabase
  const { data: entries, error } = await supabase
    .from("guestbook_entries")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching guestbook entries:", error)
  }

  // Format entries for display
  const formattedEntries =
    entries?.map((entry) => ({
      id: entry.id,
      name: entry.name,
      message: entry.message,
      timestamp: new Date(entry.created_at)
        .toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\//g, "."),
    })) || []

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

          <GuestbookForm />

          <GuestbookEntries entries={formattedEntries} />
        </div>
      </main>
    </>
  )
}
