import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { itemTypeLabels, type PortfolioItem } from "@/lib/life-content"

export const revalidate = 0

export default async function LifePage() {
  let items: PortfolioItem[] = []
  try {
    const supabase = await createClient()
    const { data } = await supabase.from("portfolio_items")
      .select("id,title,slug,item_type,category,excerpt,content,cover_image_url,external_url,published,featured,is_owned,sort_order,published_at,created_at")
      .eq("published", true).order("sort_order", { ascending: true }).order("published_at", { ascending: false })
    items = (data ?? []) as PortfolioItem[]
  } catch {
    // Empty state stays useful while the database is being connected.
  }

  const groups = [...new Set(items.map((item) => item.category || itemTypeLabels[item.item_type] || "Life"))]
  return (
    <main className="mx-auto w-full max-w-2xl px-6 pb-24 pt-20 md:pt-28">
      <section className="space-y-4">
        <p className="text-sm text-muted-foreground">Outside the portfolio</p>
        <h1 className="text-4xl font-medium tracking-[-0.05em] md:text-5xl">Life, lately.</h1>
        <p className="max-w-xl text-base leading-7 text-muted-foreground">A growing collection of things I enjoy, keep close, cook, listen to, use, and want to remember.</p>
      </section>

      {items.length === 0 ? (
        <div className="mt-12 border-y border-border py-8">
          <p className="text-sm leading-6 text-muted-foreground">A quiet corner for recipes, music, bookmarks, places worth finding, desk notes, and small things from everyday life. More soon.</p>
        </div>
      ) : (
        <div className="mt-12 space-y-12">
          {groups.map((group) => (
            <section key={group} className="space-y-4">
              <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{group}</h2>
              <div className="divide-y divide-border border-y border-border">
                {items.filter((item) => (item.category || itemTypeLabels[item.item_type] || "Life") === group).map((item) => (
                  <article key={item.id} className="py-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-5">
                      <Link href={`/life/${item.slug}`} className="text-base font-medium tracking-[-0.025em] transition-colors hover:text-muted-foreground">{item.title}</Link>
                      <span className="shrink-0 text-xs text-muted-foreground">{itemTypeLabels[item.item_type] ?? item.category}</span>
                    </div>
                    {item.excerpt && <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.excerpt}</p>}
                    {item.item_type === "wishlist" && <p className="mt-2 text-xs text-muted-foreground">{item.is_owned ? "In my setup" : "On the wishlist"}</p>}
                    {item.external_url && <a className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground" href={item.external_url} target="_blank" rel="noreferrer">Open link <ArrowUpRight size={12} /></a>}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  )
}
