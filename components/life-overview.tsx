"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowUpRight, X } from "lucide-react"
import { itemTypeLabels, type PortfolioItem } from "@/lib/life-content"
import type { SiteSection } from "@/lib/site-pages"

export function LifeOverview({ items, sections }: { items: PortfolioItem[]; sections: SiteSection[] }) {
  const [openItem, setOpenItem] = useState<PortfolioItem | null>(null)
  const intro = sections.find((section) => section.type === "intro" && section.visible)
  const listSection = sections.find((section) => section.type === "life" && section.visible)
  const groups = useMemo(() => {
    const groupFor = (item: PortfolioItem) => item.item_type === "wishlist" && item.is_owned ? "My setup" : item.category || itemTypeLabels[item.item_type] || "Life"
    const names = [...new Set(items.map(groupFor))]
    return names.map((name) => ({ name, items: items.filter((item) => groupFor(item) === name) }))
  }, [items])

  useEffect(() => {
    if (!openItem) return
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setOpenItem(null) }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [openItem])

  return (
    <>
      <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-12 sm:px-6 md:pt-16">
        <div className="mb-5"><a href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">← Aggieson</a></div>
        {intro && <section className="space-y-3"><p className="text-sm text-muted-foreground">{intro.eyebrow || "Outside the portfolio"}</p><h1 className="text-3xl font-medium tracking-[-0.045em] md:text-4xl">{intro.title || "Life, lately."}</h1>{intro.text && <p className="max-w-xl text-sm leading-6 text-muted-foreground">{intro.text}</p>}{intro.body && <p className="max-w-xl whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{intro.body}</p>}{intro.image && <img src={intro.image} alt={intro.title || "Life"} className="mt-5 max-h-80 w-full rounded-lg object-cover" />}</section>}
        {listSection?.text && <p className="mt-6 text-sm leading-6 text-muted-foreground">{listSection.text}</p>}
        {items.length === 0 ? (
          <div className="mt-8 border-y border-border py-6"><p className="text-sm leading-6 text-muted-foreground">A quiet corner for recipes, music, bookmarks, places worth finding, desk notes, and small things from everyday life. More soon.</p></div>
        ) : (
          <div className="mt-8 space-y-8">
            {groups.map((group) => <section key={group.name} className="space-y-3"><h2 className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{group.name}</h2><div className="divide-y divide-border border-y border-border">{group.items.map((item) => <button key={item.id} type="button" onClick={() => setOpenItem(item)} className="group flex w-full items-baseline justify-between gap-4 py-3 text-left"><span className="min-w-0 text-sm font-medium tracking-[-0.02em] transition-colors group-hover:text-muted-foreground">{item.title}{item.excerpt && <span className="mt-1 block max-w-xl text-sm font-normal leading-5 text-muted-foreground">{item.excerpt}</span>}</span><span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground"><span>{item.item_type === "wishlist" && item.is_owned ? "In my setup" : itemTypeLabels[item.item_type] ?? item.category}</span><ArrowUpRight size={13} className="opacity-0 transition-opacity group-hover:opacity-100" /></span></button>)}</div></section>)}
          </div>
        )}
      </main>

      {openItem && <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-0 backdrop-blur-[3px] sm:items-center sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpenItem(null) }}>
        <section role="dialog" aria-modal="true" aria-labelledby="life-dialog-title" className="relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-border bg-background shadow-2xl sm:rounded-2xl">
          <button type="button" onClick={() => setOpenItem(null)} aria-label="Close item" className="sticky top-3 float-right z-10 mr-3 mt-3 inline-flex size-9 items-center justify-center rounded-full border border-border bg-background/90 text-muted-foreground backdrop-blur hover:text-foreground"><X size={16} /></button>
          <div className="p-6 pt-7 sm:p-9">
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{openItem.item_type === "wishlist" && openItem.is_owned ? "In my setup" : itemTypeLabels[openItem.item_type] ?? openItem.category}</p>
            <h2 id="life-dialog-title" className="mt-2 max-w-xl text-2xl font-medium tracking-[-0.045em] sm:text-3xl">{openItem.title}</h2>
            {openItem.excerpt && <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{openItem.excerpt}</p>}
            {openItem.cover_image_url && <img src={openItem.cover_image_url} alt={openItem.title} className="mt-6 max-h-[420px] w-full rounded-lg object-cover" />}
            {typeof openItem.content?.body === "string" && openItem.content.body && <div className="mt-6 whitespace-pre-wrap text-sm leading-7">{openItem.content.body}</div>}
            {openItem.external_url && <a href={openItem.external_url} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-1 text-sm underline decoration-border underline-offset-4 hover:decoration-foreground">Open link <ArrowUpRight size={13} /></a>}
            <div className="mt-8 border-t border-border pt-4"><button type="button" onClick={() => setOpenItem(null)} className="text-sm text-muted-foreground hover:text-foreground">Close</button></div>
          </div>
        </section>
      </div>}
    </>
  )
}
