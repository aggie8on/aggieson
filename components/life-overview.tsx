import { InlineRichText } from "@/components/inline-rich-text"
import { LifeEntries } from "@/components/life-entries"
import { PageNav } from "@/components/page-nav"
import type { PortfolioItem } from "@/lib/life-content"
import type { SiteSection } from "@/lib/site-pages"

export function LifeOverview({ items, sections }: { items: PortfolioItem[]; sections: SiteSection[] }) {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-12 sm:px-6 md:pt-16">
      <PageNav />
      <div className="space-y-10">
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
          if (items.length === 0) {
            return (
              <section key={section.id} className="border-y border-border py-6">
                <p className="text-sm leading-6 text-muted-foreground">A quiet corner for bookmarks, recipes, music, photos and small notes from everyday life. More soon.</p>
              </section>
            )
          }
          return <LifeEntries key={section.id} items={items} />
        })}
      </div>
    </main>
  )
}
