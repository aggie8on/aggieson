import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { BlogShare } from "@/components/blog-share"
import { ContentMedia } from "@/components/content-media"
import { blogPosts, type BlogPostData } from "@/lib/blog-data"
import { createClient } from "@/lib/supabase/server"

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

async function getCmsWriting(slug: string) {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from("portfolio_items")
      .select("slug,title,excerpt,content,published_at,created_at")
      .eq("slug", slug)
      .eq("item_type", "writing")
      .eq("published", true)
      .maybeSingle()
    return data
  } catch {
    return null
  }
}

function cmsDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const staticPost = blogPosts[slug]
  if (staticPost) {
    return {
      title: `${staticPost.title} | Aggieson`,
      description: staticPost.content[0]?.slice(0, 160),
    }
  }

  const post = await getCmsWriting(slug)
  if (!post) return { title: "Writing not found | Aggieson" }
  const body = typeof post.content?.body === "string" ? post.content.body : ""
  return {
    title: `${post.title} | Aggieson`,
    description: (post.excerpt || body).slice(0, 160),
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  let post: BlogPostData | undefined = blogPosts[slug]
  let mediaType: string | undefined
  let mediaUrl: string | undefined

  if (!post) {
    const cmsPost = await getCmsWriting(slug)
    if (!cmsPost) notFound()

    const body = typeof cmsPost.content?.body === "string" ? cmsPost.content.body : ""
    const paragraphs = body.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean)
    if (paragraphs.length === 0 && cmsPost.excerpt) paragraphs.push(cmsPost.excerpt)
    const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0
    const dateValue = cmsPost.published_at ?? cmsPost.created_at

    post = {
      slug: cmsPost.slug,
      title: cmsPost.title,
      date: cmsDate(dateValue),
      readTime: `${Math.max(1, Math.ceil(wordCount / 200))} min read`,
      content: paragraphs,
    }
    mediaType = typeof cmsPost.content?.media_type === "string" ? cmsPost.content.media_type : undefined
    mediaUrl = typeof cmsPost.content?.media_url === "string" ? cmsPost.content.media_url : undefined
  }

  if (!post) notFound()

  return (
    <main className="mx-auto max-w-2xl px-5 py-10 sm:px-6 md:py-16">
      <article className="space-y-6">
        <nav aria-label="Page navigation" className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            Back to writing
          </Link>
        </nav>

        <header className="space-y-3">
          <h1 className="text-3xl font-medium tracking-[-0.04em] text-balance md:text-4xl">{post.title}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{post.date}</span>
            <span aria-hidden="true">•</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        <BlogShare title={post.title} />
        <ContentMedia type={mediaType} url={mediaUrl} title={post.title} />

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 text-[15px]">
          {post.content.map((paragraph, index) => (
            <p key={index} className="whitespace-pre-wrap text-[15px] leading-7 text-foreground/90">
              {paragraph}
            </p>
          ))}
        </div>

        <nav aria-label="Adjacent articles" className="flex items-start justify-between gap-6 border-t border-border pt-6">
          {post.previousPost ? (
            <Link
              href={`/blog/${post.previousPost.slug}`}
              className="group flex min-w-0 items-center gap-2 text-sm transition-colors hover:text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-1" />
              <span>{post.previousPost.title}</span>
            </Link>
          ) : <span />}
          {post.nextPost ? (
            <Link
              href={`/blog/${post.nextPost.slug}`}
              className="group flex min-w-0 items-center gap-2 text-right text-sm transition-colors hover:text-muted-foreground"
            >
              <span>{post.nextPost.title}</span>
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : <span />}
        </nav>
      </article>
    </main>
  )
}
