import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { blogPosts } from "@/lib/blog-data"
import { PinsBoard } from "@/components/pins-board"

export default function HomePage() {
  const latestPosts = Object.values(blogPosts)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  return (
    <>
      <Navigation />
      <main className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <div className="space-y-12">
          <section className="space-y-4">
            <h1 className="text-4xl font-medium tracking-tight text-balance md:text-5xl">People, Places & Moments.</h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Creating thoughtful digital experiences. Always with a camera or sort of. I effortlessly share my thoughts
              in a calm & dustless space.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-medium">Recent Writing</h2>
            <div className="space-y-6">
              {latestPosts.map((post) => (
                <article key={post.slug} className="group">
                  <Link href={`/blog/${post.slug}`} className="block space-y-2">
                    <h3 className="font-medium group-hover:text-muted-foreground transition-colors">{post.title}</h3>
                    <p className="text-sm text-muted-foreground">{post.date}</p>
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <PinsBoard />
        </div>
      </main>
    </>
  )
}
