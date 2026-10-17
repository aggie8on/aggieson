"use client"

import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { blogPosts } from "@/lib/blog-data"

export default function BlogPage() {
  const postsArray = Object.values(blogPosts).sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return (
    <>
      <Navigation />
      <main className="mx-auto w-full max-w-2xl px-6 pb-24 pt-20 md:pt-28">
        <div className="space-y-12">
          <section className="space-y-4">
            <p className="text-sm text-muted-foreground">Notes & ideas</p>
            <h1 className="text-4xl font-medium tracking-[-0.05em] md:text-5xl">Writing</h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground">
              Thoughts on communication, perspective, and the things I notice along the way.
            </p>
          </section>

          <div className="divide-y divide-border border-y border-border">
            {postsArray.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block py-5 transition-colors"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <h2 className="text-base font-medium tracking-[-0.025em] transition-colors group-hover:text-muted-foreground">
                    {post.title}
                  </h2>
                  <span className="shrink-0 text-sm text-muted-foreground">{post.date}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{post.content[0]?.slice(0, 160)}{post.content[0] && post.content[0].length > 160 ? "…" : ""}</p>
                <span className="mt-2 block text-xs text-muted-foreground">{post.readTime}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
