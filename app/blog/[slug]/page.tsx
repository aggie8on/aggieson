import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { BlogShare } from "@/components/blog-share"
import { blogPosts } from "@/lib/blog-data"

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) {
    return { title: "Writing not found | Aggieson" }
  }

  return {
    title: `${post.title} | Aggieson`,
    description: post.content[0]?.slice(0, 160),
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) notFound()

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <article className="space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">← Aggieson</Link>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to writing
        </Link>

        <header className="space-y-4">
          <h1 className="text-4xl font-medium tracking-tight text-balance">{post.title}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{post.date}</span>
            <span aria-hidden="true">•</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        <BlogShare title={post.title} />

        {post.audioUrl && (
          <div className="rounded-lg bg-muted p-6">
            <p className="mb-3 text-sm font-medium">Listen to this post</p>
            <audio controls className="w-full">
              <source src={post.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          {post.content.map((paragraph, index) => (
            <p key={index} className="leading-relaxed text-foreground/90">
              {paragraph}
            </p>
          ))}
        </div>

        <nav aria-label="Adjacent articles" className="flex items-start justify-between gap-6 border-t border-border pt-8">
          {post.previousPost ? (
            <Link
              href={`/blog/${post.previousPost.slug}`}
              className="group flex min-w-0 items-center gap-2 text-sm transition-colors hover:text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-1" />
              <span>{post.previousPost.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {post.nextPost ? (
            <Link
              href={`/blog/${post.nextPost.slug}`}
              className="group flex min-w-0 items-center gap-2 text-right text-sm transition-colors hover:text-muted-foreground"
            >
              <span>{post.nextPost.title}</span>
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>
    </main>
  )
}
