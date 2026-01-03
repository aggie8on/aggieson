import type { GuestbookEntry } from "@/app/guestbook/page"

interface GuestbookEntriesProps {
  entries: GuestbookEntry[]
}

export function GuestbookEntries({ entries }: GuestbookEntriesProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-medium">
        {entries.length} {entries.length === 1 ? "Entry" : "Entries"}
      </h2>

      <div className="space-y-6">
        {entries.map((entry) => (
          <article key={entry.id} className="border-b border-border pb-6 last:border-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium">{entry.name}</span>
                <span className="text-sm text-muted-foreground">{entry.timestamp}</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{entry.message}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
