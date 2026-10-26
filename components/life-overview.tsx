import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { InlineRichText } from "@/components/inline-rich-text"
import { PageNav } from "@/components/page-nav"
import { LIFE_KINDS, effectiveKind, readMeta, type PortfolioItem } from "@/lib/life-content"
import type { SiteSection } from "@/lib/site-pages"

/** Groups entries by kind, in a fixed order, so the page reads the same way each time. */
function groupItems(items: PortfolioItem[]) {
  const order = LIFE_KINDS.map((kind) => kind.key as string)
  const groups = new Map<string, { name: string; rank: number; items: PortfolioItem[] }>()
  for (const item of items) {
    const kind = effectiveKind(item)
    const group = groups.get(kind.key) ?? { name: kind.plural, rank: order.indexOf(kind.key), items: [] }
    group.items.push(item)
    groups.set(kind.key, group)
  }
  return [...groups.values()].sort((a, b) => a.rank - b.rank)
}

function itemHint(item: PortfolioItem) {
  const meta = readMeta(item)
  return meta.artist || meta.brand || meta.source || meta.where || meta.time || ""
}

export function LifeOverview({ items, sections }: { items: PortfolioItem[]; sections: SiteSection[] }) {
  const groups = groupItems(items)
  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-12 sm:px-6 md:pt-16">
      <PageNav />
      <div className="space-y-8">
        {sections.filter((section) => section.visible).map((section) => {
          if (section.type === "intro") {
            return (
              <section key={section.id} className="space-y-5">
                <p className="text-sm text-muted-foreground">{section.eyebrow || "Outside the portfolio"}</p>
                <h1 className="text-2xl font-medium leading-[1.2] tracking-[-0.045em] sm:text-[1.65rem]">{section.title || "Life, lately."}</h1>
                {section.text && <p className="max-w-xl text-sm leading-6 text-muted-foreground">{section.text}</p>}
                {section.body && <p className="max-w-xl whitespace-pre-wrap text-sm leading-6 text-muted-foreground"><InlineRichText inlineIconSvg={section.inlineIconSvg} inlineIconUrl={section.inlineIconUrl}>{section.body}</InlineRichText></p>}
              </section>
            )
          }
          if (section.type !== "life") return null
          return (
            <section key={section.id} className="space-y-8">
              {items.length === 0 ? (
                <div className="border-y border-border py-6">
                  <p className="text-sm leading-6 text-muted-foreground">A quiet corner for recipes, music, bookmarks, places worth finding, desk notes, and small things from everyday life. More soon.</p>
                </div>
              ) : groups.map((group) => (
                <section key={group.name} aria-label={group.name} className="space-y-3">
                  <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{group.name}</h2>
                  <ul className="divide-y divide-border border-y border-border">
                    {group.items.map((item) => {
                      const hint = itemHint(item)
                      return (
                        <li key={item.id}>
                          <Link href={`/life/${item.slug}`} className="group flex items-baseline justify-between gap-4 py-3">
                            <span className="min-w-0 text-sm font-medium tracking-[-0.02em] transition-colors group-hover:text-muted-foreground">
                              {item.title}
                              {item.excerpt && <span className="mt-1 block max-w-xl text-sm font-normal leading-5 text-muted-foreground">{item.excerpt}</span>}
                            </span>
                            <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                              {hint && <span>{hint}</span>}
                              <ArrowUpRight size={13} aria-hidden="true" className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
                            </span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </section>
              ))}
            </section>
          )
        })}
      </div>
    </main>
  )
}
