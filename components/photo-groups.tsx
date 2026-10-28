"use client"

import { useCallback, useEffect, useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react"

export type PhotoGroup = {
  id: string
  title: string
  date: string
  where?: string
  /** Every photo in the group. The first one stands in for the group. */
  images: string[]
}

const roundButton = "inline-flex size-9 items-center justify-center rounded-full border border-border bg-background/90 text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-30"

/**
 * Photo groups. Each group is one greyscale tile showing its first photo. Clicking it opens a pop-up with every
 * photo in colour, and clicking a photo there shows it whole, never cropped.
 */
export function PhotoGroups({ groups }: { groups: PhotoGroup[] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [viewing, setViewing] = useState<number | null>(null)
  const group = groups.find((entry) => entry.id === openId) ?? null

  const closeAll = useCallback(() => { setViewing(null); setOpenId(null) }, [])
  const step = useCallback((direction: -1 | 1) => {
    setViewing((current) => (current === null || !group ? current : (current + direction + group.images.length) % group.images.length))
  }, [group])

  useEffect(() => {
    if (viewing === null) return
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") step(1)
      else if (event.key === "ArrowLeft") step(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [viewing, step])

  if (groups.length === 0) return null
  const label = group ? group.title || "Photos" : ""
  const total = group?.images.length ?? 0

  return (
    <>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
        {groups.map((entry) => {
          const count = entry.images.length
          return (
            <li key={entry.id}>
              <button type="button" onClick={() => setOpenId(entry.id)} aria-haspopup="dialog" aria-label={`${entry.title || "Photos"}, ${count} ${count === 1 ? "photo" : "photos"}. Open`} className="group relative block w-full text-left focus-visible:outline-none">
                {count > 1 && (
                  <>
                    <span aria-hidden="true" className="absolute inset-0 translate-x-2 translate-y-2 rounded-xl border border-border bg-muted/30" />
                    <span aria-hidden="true" className="absolute inset-0 translate-x-1 translate-y-1 rounded-xl border border-border bg-accent" />
                  </>
                )}
                <span className="relative block aspect-square overflow-hidden rounded-xl border border-border bg-muted group-focus-visible:ring-2 group-focus-visible:ring-ring/60">
                  <img src={entry.images[0]} alt="" loading="lazy" className="size-full object-cover grayscale transition duration-500 group-hover:scale-[1.03] group-hover:brightness-110" />
                  {count > 1 && (
                    <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[11px] text-white backdrop-blur-sm"><Images size={11} aria-hidden="true" /> {count}</span>
                  )}
                </span>
              </button>
              {(entry.title || entry.date) && (
                <p className="mt-2 truncate text-xs text-muted-foreground">
                  {entry.title && <span className="text-foreground">{entry.title}</span>}{entry.title && entry.date ? " · " : ""}{entry.date}
                </p>
              )}
            </li>
          )
        })}
      </ul>

      {/* The group: every photo, in colour. */}
      <Dialog.Root open={Boolean(group)} onOpenChange={(open) => { if (!open) closeAll() }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <Dialog.Content aria-describedby={undefined} className="fixed left-1/2 top-1/2 z-50 flex max-h-[88vh] w-[calc(100vw-1.5rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-border bg-background shadow-xl outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
            <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
              <div className="min-w-0">
                <Dialog.Title className="truncate text-base font-medium tracking-[-0.02em]">{label}</Dialog.Title>
                <p className="mt-0.5 text-xs text-muted-foreground">{[group?.where, group?.date, `${total} ${total === 1 ? "photo" : "photos"}`].filter(Boolean).join(" · ")}</p>
              </div>
              <Dialog.Close className={roundButton} aria-label="Close"><X size={16} aria-hidden="true" /></Dialog.Close>
            </header>
            <div className="overflow-y-auto p-4 sm:p-5">
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {group?.images.map((src, position) => (
                  <li key={`${src}-${position}`}>
                    <button type="button" onClick={() => setViewing(position)} aria-label={`View photo ${position + 1} of ${total}`} className="block aspect-square w-full overflow-hidden rounded-lg border border-border bg-muted focus-visible:ring-2 focus-visible:ring-ring/60">
                      <img src={src} alt="" loading="lazy" className="size-full object-cover transition-transform duration-500 hover:scale-[1.03]" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* One photo, shown whole. */}
      <Dialog.Root open={viewing !== null && Boolean(group)} onOpenChange={(open) => { if (!open) setViewing(null) }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/90 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <Dialog.Content aria-describedby={undefined} className="fixed inset-0 z-[60] flex flex-col outline-none">
            <Dialog.Title className="sr-only">{label}, photo {(viewing ?? 0) + 1} of {total}</Dialog.Title>
            <div className="flex items-center justify-between px-4 py-3 text-sm text-white/80">
              <span className="tabular-nums">{(viewing ?? 0) + 1} / {total}</span>
              <Dialog.Close className="inline-flex size-9 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/60" aria-label="Back to the group"><X size={18} aria-hidden="true" /></Dialog.Close>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-6 sm:px-16" onClick={(event) => { if (event.target === event.currentTarget) setViewing(null) }}>
              {viewing !== null && group && (
                <img key={group.images[viewing]} src={group.images[viewing]} alt={`${label}, photo ${viewing + 1} of ${total}`} className="max-h-full max-w-full object-contain" />
              )}
              {total > 1 && (
                <>
                  <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className={`${roundButton} absolute left-2 top-1/2 -translate-y-1/2 sm:left-4`}><ChevronLeft size={18} aria-hidden="true" /></button>
                  <button type="button" onClick={() => step(1)} aria-label="Next photo" className={`${roundButton} absolute right-2 top-1/2 -translate-y-1/2 sm:right-4`}><ChevronRight size={18} aria-hidden="true" /></button>
                </>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
