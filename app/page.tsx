import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { HomeSelectedWork } from "@/components/home-selected-work"
import { blogPosts } from "@/lib/blog-data"
import { createClient } from "@/lib/supabase/server"
import { itemTypeLabels, type PortfolioItem } from "@/lib/life-content"

export const revalidate = 0

export default async function HomePage() {
  const latestPosts = Object.values(blogPosts)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  let lifeItems: PortfolioItem[] = []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("portfolio_items")
      .select("id,title,slug,item_type,category,excerpt,external_url,featured,sort_order,published_at,created_at,is_owned")
      .eq("published", true)
      .order("featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("published_at", { ascending: false })
      .limit(3)
    lifeItems = (data ?? []) as PortfolioItem[]
  } catch {
    // Keep the homepage useful if the CMS is not configured yet.
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5 pb-16 pt-12 sm:px-6 md:pt-16">
      <div className="space-y-12 md:space-y-16">
        <section aria-labelledby="intro-heading" className="space-y-3">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Designer · Creator · Curious human</p>
            <h1 id="intro-heading" className="text-4xl font-medium tracking-[-0.055em] md:text-5xl">
              Aggieson
            </h1>
            <p className="max-w-xl text-base leading-6 text-muted-foreground">
              People, places & moments. Helping people set up podcasts, usually with a camera nearby.
              I share the things I make, notice, and learn along the way.
            </p>
          </div>
        </section>

        <HomeSelectedWork />

        <section aria-labelledby="writing-heading" className="space-y-3">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="writing-heading" className="text-sm font-medium text-muted-foreground">Recent writing</h2>
            <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
              All writing <ArrowUpRight size={13} strokeWidth={1.7} />
            </Link>
          </div>

          <div className="divide-y divide-border border-y border-border">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
              >
                <span className="text-sm font-medium tracking-[-0.02em] transition-colors group-hover:text-muted-foreground">
                  {post.title}
                </span>
                <span className="shrink-0 text-sm text-muted-foreground">{post.date}</span>
              </Link>
            ))}
            {latestPosts.length === 0 && (
              <p className="py-4 text-sm text-muted-foreground">New writing coming soon.</p>
            )}
          </div>
        </section>

        <section aria-labelledby="life-heading" className="space-y-3">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="life-heading" className="text-sm font-medium text-muted-foreground">Life, lately</h2>
            <Link href="/life" className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
              All life notes <ArrowUpRight size={13} strokeWidth={1.7} />
            </Link>
          </div>
          {lifeItems.length > 0 ? (
            <div className="divide-y divide-border border-y border-border">
              {lifeItems.map((item) => (
                <article key={item.id} className="py-3">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-5">
                    <Link href={`/life/${item.slug}`} className="text-sm font-medium tracking-[-0.02em] transition-colors hover:text-muted-foreground">
                      {item.title}
                    </Link>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {item.item_type === "wishlist" && item.is_owned ? "In my setup" : itemTypeLabels[item.item_type] ?? item.category ?? "Life"}
                    </span>
                  </div>
                  {item.excerpt && <p className="mt-1 max-w-2xl text-sm leading-5 text-muted-foreground">{item.excerpt}</p>}
                </article>
              ))}
            </div>
          ) : (
            <p className="border-y border-border py-4 text-sm leading-6 text-muted-foreground">
              Recipes, playlists, useful finds, desk notes, and little things from everyday life will live here.
            </p>
          )}
        </section>
      </div>
    </main>
  )
}
