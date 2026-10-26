"use client"

import { useState } from "react"
import Link from "next/link"
import { KindIcon } from "@/components/life-icons"

export type BookmarkTile = {
  id: string
  title: string
  kind: string
  label: string
  href: string
  external: boolean
  image: string
  note?: string
}

function Tile({ tile }: { tile: BookmarkTile }) {
  const [broken, setBroken] = useState(false)
  const showImage = Boolean(tile.image) && !broken
  const face = (
    <>
      <span className="flex size-16 items-center justify-center overflow-hidden rounded-full border border-border bg-muted/40 text-muted-foreground transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-foreground/40 group-hover:text-foreground group-focus-visible:border-foreground/60">
        {showImage
          ? <img src={tile.image} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setBroken(true)} className={tile.kind === "bookmark" ? "size-7 object-contain" : "size-full object-cover"} />
          : <KindIcon kind={tile.kind} size={22} />}
      </span>
      {/* Name on hover or keyboard focus. Touch screens have no hover, so they get a short caption instead. */}
      <span role="tooltip" className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-max max-w-[12rem] -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-center text-xs leading-4 text-background opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">{tile.title}</span>
      <span className="mt-1.5 block w-16 truncate text-center text-[10px] leading-4 text-muted-foreground [@media(hover:hover)]:hidden">{tile.title}</span>
    </>
  )
  const className = "group relative block rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
  return tile.external
    ? <a href={tile.href} target="_blank" rel="noopener noreferrer" aria-label={`${tile.title} (opens in a new tab)`} className={className}>{face}</a>
    : <Link href={tile.href} aria-label={tile.title} className={className}>{face}</Link>
}

export function BookmarkGrid({ tiles }: { tiles: BookmarkTile[] }) {
  const [filter, setFilter] = useState("all")
  const kinds = [...new Map(tiles.map((tile) => [tile.kind, tile.label])).entries()]
  const shown = filter === "all" ? tiles : tiles.filter((tile) => tile.kind === filter)
  return (
    <div className="space-y-5">
      {kinds.length > 1 && (
        <div role="group" aria-label="Filter bookmarks" className="flex flex-wrap gap-1.5">
          {[["all", "All"], ...kinds].map(([key, label]) => (
            <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)}
              className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 ${filter === key ? "border-foreground/50 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>{label}</button>
          ))}
        </div>
      )}
      <ul className="flex flex-wrap gap-x-5 gap-y-7 pb-2">
        {shown.map((tile) => <li key={tile.id}><Tile tile={tile} /></li>)}
      </ul>
    </div>
  )
}
