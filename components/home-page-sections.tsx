import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { HomeSelectedWork } from "@/components/home-selected-work"
import { SocialGlassLinks } from "@/components/social-glass-links"
import { itemTypeLabels, type PortfolioItem } from "@/lib/life-content"
import type { SiteSection } from "@/lib/site-pages"

type Post = { slug: string; title: string; date: string }

function sectionSpacing(layout: SiteSection["layout"]) {
  if (layout === "compact") return "space-y-2"
  if (layout === "wide") return "space-y-5"
  return "space-y-3"
}

export function HomePageSections({ sections, posts, lifeItems }: { sections: SiteSection[]; posts: Post[]; lifeItems: PortfolioItem[] }) {
  return (
    <div className="space-y-12 md:space-y-16">
      {sections.filter((section) => section.visible).map((section) => {
        if (section.type === "intro") {
          return (
            <section key={section.id} aria-labelledby={section.id + "-heading"} className={sectionSpacing(section.layout)}>
              {section.eyebrow && <p className="text-sm text-muted-foreground">{section.eyebrow}</p>}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0"><h1 id={section.id + "-heading"} className="text-[1.65rem] font-medium leading-tight tracking-[-0.045em] sm:text-[1.8rem]">{section.title || "Aggieson"}</h1><p className="mt-1 text-[0.95rem] leading-6 text-muted-foreground">Design engineer</p></div>
                <SocialGlassLinks />
              </div>
              <div className={section.layout === "split" ? "grid gap-4 sm:grid-cols-[1fr_0.8fr]" : "max-w-xl space-y-3"}>
                {section.text && <p className="text-[0.95rem] leading-[1.65] text-muted-foreground">{section.text.replace(/^Human designer\.\s*/i, "").split("Toothless").map((part, index, all) => <span key={index}>{part}{index < all.length - 1 && <a href="https://www.toothless.design" target="_blank" rel="noopener noreferrer" className="text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground">Toothless</a>}</span>)}</p>}
                {section.body && <p className="text-[0.95rem] leading-[1.65] text-muted-foreground">{section.body}</p>}
                <p className="text-sm text-muted-foreground">Contact me by <a href="mailto:aggie8on@gmail.com" className="text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground">email</a>.</p>
              </div>
            </section>
          )
        }
        if (section.type === "projects") return <div key={section.id}><HomeSelectedWork title={section.title || "Selected projects"} /></div>
        if (section.type === "writing") {
          return (
            <section key={section.id} className={sectionSpacing(section.layout)}>
              <div className="flex items-baseline justify-between gap-4"><h2 className="text-sm font-medium text-muted-foreground">{section.title || "Recent writing"}</h2><Link href="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">All writing <ArrowUpRight size={13} strokeWidth={1.7} /></Link></div>
              <div className="divide-y divide-border border-y border-border">
                {posts.map((post) => <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"><span className="text-sm font-medium tracking-[-0.02em] group-hover:text-muted-foreground">{post.title}</span><span className="shrink-0 text-sm text-muted-foreground">{post.date}</span></Link>)}
                {posts.length === 0 && <p className="py-4 text-sm text-muted-foreground">New writing coming soon.</p>}
              </div>
            </section>
          )
        }
        if (section.type === "life") {
          return (
            <section key={section.id} className={sectionSpacing(section.layout)}>
              <div className="flex items-baseline justify-between gap-4"><h2 className="text-sm font-medium text-muted-foreground">{section.title || "Life, lately"}</h2><Link href="/life" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">All life notes <ArrowUpRight size={13} strokeWidth={1.7} /></Link></div>
              {lifeItems.length ? <div className="divide-y divide-border border-y border-border">{lifeItems.map((item) => <article key={item.id} className="py-3"><div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-5"><Link href={`/life/${item.slug}`} className="text-sm font-medium tracking-[-0.02em] hover:text-muted-foreground">{item.title}</Link><span className="shrink-0 text-xs text-muted-foreground">{item.item_type === "wishlist" && item.is_owned ? "In my setup" : itemTypeLabels[item.item_type] ?? item.category ?? "Life"}</span></div>{item.excerpt && <p className="mt-1 max-w-2xl text-sm leading-5 text-muted-foreground">{item.excerpt}</p>}</article>)}</div> : <p className="border-y border-border py-4 text-sm leading-6 text-muted-foreground">{section.text || "Recipes, playlists, useful finds, desk notes, and little things from everyday life will live here."}</p>}
            </section>
          )
        }
        if (section.type === "image") {
          return <section key={section.id} className={sectionSpacing(section.layout)}>{section.title && <h2 className="text-sm font-medium text-muted-foreground">{section.title}</h2>}{section.image && <img src={section.image} alt={section.title || "Portfolio image"} className={section.layout === "wide" ? "w-full rounded-lg object-cover" : "max-h-[28rem] w-full rounded-lg object-cover"} />}{section.text && <p className="text-sm leading-6 text-muted-foreground">{section.text}</p>}</section>
        }
        if (section.type === "links") {
          return <section key={section.id} className={sectionSpacing(section.layout)}>{section.title && <h2 className="text-sm font-medium text-muted-foreground">{section.title}</h2>}{section.text && <p className="text-sm leading-6 text-muted-foreground">{section.text}</p>}{section.body && <a className="inline-flex items-center gap-1 text-sm underline underline-offset-4" href={section.body} target="_blank" rel="noreferrer">Open link <ArrowUpRight size={13} /></a>}</section>
        }
        return <section key={section.id} className={sectionSpacing(section.layout)}>{section.eyebrow && <p className="text-sm text-muted-foreground">{section.eyebrow}</p>}{section.title && <h2 className="text-lg font-medium tracking-[-0.03em]">{section.title}</h2>}{section.text && <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{section.text}</p>}{section.body && <p className="max-w-2xl whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{section.body}</p>}{section.image && <img src={section.image} alt={section.title || "Portfolio image"} className="max-h-[28rem] w-full rounded-lg object-cover" />}</section>
      })}
    </div>
  )
}
