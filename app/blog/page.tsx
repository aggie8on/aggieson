"use client"

import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { blogPosts } from "@/lib/blog-data"

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
}

export default function BlogPage() {
  const postsArray = Object.values(blogPosts).sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return (
    <>
      <Navigation />
      <main className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        <div className="space-y-12">
          <section className="space-y-4">
            <h1 className="text-4xl font-medium tracking-tight">Blog</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I effortlessly share my thoughts in a calm & dustless space.
            </p>
          </section>

          <div className="space-y-8">
            {postsArray.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block group space-y-2 py-4 border-b border-border last:border-0"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-xl font-medium group-hover:text-muted-foreground transition-colors">
                    {post.title}
                  </h2>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">{post.date}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">{post.excerpt}</p>
                <span className="text-sm text-muted-foreground">{post.readTime}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
