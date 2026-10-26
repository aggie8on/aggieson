import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { BlogShare } from "@/components/blog-share"
import { ContentMedia } from "@/components/content-media"
import { PageNav } from "@/components/page-nav"
import { getWriting } from "@/lib/portfolio-data"

export const revalidate = 0

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const { data } = await getWriting()
  const post = data.find((candidate) => candidate.slug === slug)
  if (!post) return { title: "Writing not found | Aggieson" }
  return { title: `${post.title} | Aggieson`, description: post.excerpt.slice(0, 160) }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const { data: posts } = await getWriting()
  const index = posts.findIndex((candidate) => candidate.slug === slug)
  if (index === -1) notFound()

  const post = posts[index]
  // Posts are sorted newest first, so the next index is the older post.
  const olderPost = posts[index + 1]
  const newerPost = posts[index - 1]

  return (
    <main className="mx-auto max-w-2xl px-5 pb-16 pt-12 sm:px-6 md:pt-16">
      <PageNav trail={[{ label: "Writing", href: "/blog" }]} />
      <article className="space-y-6">
        <header className="space-y-3">
          <h1 className="text-3xl font-medium tracking-[-0.04em] text-balance md:text-4xl">{post.title}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{post.dateLong}</span>
            <span aria-hidden="true">•</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        <BlogShare title={post.title} />
        <ContentMedia type={post.mediaType} url={post.mediaUrl} title={post.title} />

        <div className="space-y-4">
          {post.paragraphs.map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex} className="whitespace-pre-wrap text-[15px] leading-7 text-foreground/90">
              {paragraph}
            </p>
          ))}
        </div>

        {(olderPost || newerPost) && (
          <nav aria-label="More writing" className="flex items-start justify-between gap-6 border-t border-border pt-6">
            {olderPost ? (
              <Link href={`/blog/${olderPost.slug}`} className="group flex min-w-0 items-center gap-2 text-sm transition-colors hover:text-muted-foreground">
                <ArrowLeft className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                <span>{olderPost.title}</span>
              </Link>
            ) : <span />}
            {newerPost ? (
              <Link href={`/blog/${newerPost.slug}`} className="group flex min-w-0 items-center gap-2 text-right text-sm transition-colors hover:text-muted-foreground">
                <span>{newerPost.title}</span>
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            ) : <span />}
          </nav>
        )}
      </article>
    </main>
  )
}
