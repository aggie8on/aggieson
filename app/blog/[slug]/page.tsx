"use client"

import { Navigation } from "@/components/navigation"
import { ArrowLeft, ArrowRight, Twitter, Facebook, Linkedin, LinkIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import { useState } from "react"
import { blogPosts } from "@/lib/blog-data"

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const post = blogPosts[slug]
  const [copyStatus, setCopyStatus] = useState<"copied" | "error" | null>(null)

  if (!post) {
    return (
      <>
        <Navigation />
        <main className="mx-auto max-w-2xl px-6 py-16">
          <p>Post not found</p>
        </main>
      </>
    )
  }

  const handleShare = async (platform: string) => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    const text = post.title

    switch (platform) {
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank", "noopener,noreferrer")
        break
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank", "noopener,noreferrer")
        break
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank", "noopener,noreferrer")
        break
      case "copy":
        try {
          await navigator.clipboard.writeText(url)
          setCopyStatus("copied")
        } catch {
          setCopyStatus("error")
        }
        window.setTimeout(() => setCopyStatus(null), 2500)
        break
    }
  }

  return (
    <>
      <Navigation />
      <main className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        <article className="space-y-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <header className="space-y-4">
            <h1 className="text-4xl font-medium tracking-tight text-balance">{post.title}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </header>

          <div className="flex items-center gap-2 py-4 border-y border-border">
            <span className="text-sm text-muted-foreground mr-2">Share:</span>
            <Button variant="ghost" size="icon" onClick={() => handleShare("twitter")} className="h-8 w-8">
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Share on Twitter</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleShare("facebook")} className="h-8 w-8">
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Share on Facebook</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleShare("linkedin")} className="h-8 w-8">
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">Share on LinkedIn</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleShare("copy")}
              className="h-8 w-8"
              title={copyStatus === "copied" ? "Copied!" : copyStatus === "error" ? "Copy failed" : "Copy link"}
            >
              <LinkIcon className="h-4 w-4" />
              <span className="sr-only">Copy link</span>
            </Button>
            {copyStatus === "copied" && <span role="status" className="text-xs text-muted-foreground">Copied!</span>}
            {copyStatus === "error" && <span role="status" className="text-xs text-muted-foreground">Couldn’t copy. Copy the URL from your address bar.</span>}
          </div>

          {post.audioUrl && (
            <div className="bg-muted rounded-lg p-6">
              <p className="text-sm font-medium mb-3">Listen to this post</p>
              <audio controls className="w-full">
                <source src={post.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
            {post.content.map((paragraph, index) => (
              <p key={index} className="text-foreground/90 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-border">
            {post.previousPost ? (
              <Link
                href={`/blog/${post.previousPost.slug}`}
                className="flex items-center gap-2 text-sm hover:text-muted-foreground transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span>{post.previousPost.title}</span>
              </Link>
            ) : (
              <div />
            )}
            {post.nextPost ? (
              <Link
                href={`/blog/${post.nextPost.slug}`}
                className="flex items-center gap-2 text-sm hover:text-muted-foreground transition-colors group"
              >
                <span>{post.nextPost.title}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </article>
      </main>
    </>
  )
}
