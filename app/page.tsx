import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { HomeSelectedWork } from "@/components/home-selected-work"
import { blogPosts } from "@/lib/blog-data"

export default function HomePage() {
  const latestPosts = Object.values(blogPosts)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  return (
    <main className="mx-auto w-full max-w-2xl px-6 pb-24 pt-20 md:pt-28">
      <div className="space-y-20 md:space-y-24">
        <section aria-labelledby="intro-heading" className="space-y-7">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Designer · Creator · Curious human</p>
            <h1 id="intro-heading" className="text-5xl font-medium tracking-[-0.06em] md:text-6xl">
              Aggieson
            </h1>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              People, places & moments. Helping people set up podcasts, usually with a camera nearby.
              I share the things I make, notice, and learn along the way.
            </p>
          </div>

        </section>

        <HomeSelectedWork />

        <section aria-labelledby="writing-heading" className="space-y-5">
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
                className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
              >
                <span className="font-medium tracking-[-0.025em] transition-colors group-hover:text-muted-foreground">
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


        <section aria-labelledby="life-heading" className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-baseline sm:justify-between">
          <div className="space-y-1">
            <h2 id="life-heading" className="text-sm font-medium">A little beyond the work</h2>
            <p className="text-sm text-muted-foreground">Recipes, playlists, useful finds, and small notes from everyday life.</p>
          </div>
          <Link href="/life" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">Explore life <ArrowUpRight size={13} strokeWidth={1.7} /></Link>
        </section>

      </div>
    </main>
  )
}
