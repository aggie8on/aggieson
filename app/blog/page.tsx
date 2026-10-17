import Link from "next/link"
import { blogPosts } from "@/lib/blog-data"

export default function BlogPage() {
  const postsArray = Object.values(blogPosts).sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return (
      <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-12 sm:px-6 md:pt-16">
        <div className="mb-5"><Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">← Aggieson</Link></div>
        <div className="space-y-8">
          <section className="space-y-3">
            <p className="text-sm text-muted-foreground">Notes & ideas</p>
            <h1 className="text-3xl font-medium tracking-[-0.045em] md:text-4xl">Writing</h1>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              Thoughts on communication, perspective, and the things I notice along the way.
            </p>
          </section>

          <div className="divide-y divide-border border-y border-border">
            {postsArray.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block py-4 transition-colors"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <h2 className="text-sm font-medium tracking-[-0.02em] transition-colors group-hover:text-muted-foreground">
                    {post.title}
                  </h2>
                  <span className="shrink-0 text-sm text-muted-foreground">{post.date}</span>
                </div>
                <p className="mt-2 text-sm leading-5 text-muted-foreground">{post.content[0]?.slice(0, 160)}{post.content[0] && post.content[0].length > 160 ? "…" : ""}</p>
                <span className="mt-2 block text-xs text-muted-foreground">{post.readTime}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
  )
}
