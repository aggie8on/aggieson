import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import type { PortfolioItem } from "@/lib/life-content"
import { ContentMedia } from "@/components/content-media"

export const revalidate = 0

export default async function LifeItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from("portfolio_items")
    .select("id,title,slug,item_type,category,excerpt,content,cover_image_url,external_url,published,featured,is_owned,sort_order,published_at,created_at")
    .eq("slug", slug).eq("published", true).maybeSingle()
  if (!data) notFound()
  const item = data as PortfolioItem
  const body = typeof item.content?.body === "string" ? item.content.body : ""
  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-12 sm:px-6 md:pt-16">
      <nav aria-label="Breadcrumb" className="mb-5">
        <Link href="/life" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft size={14} /> Back to life
        </Link>
      </nav>
      <article className="mt-7">
        <p className="text-sm text-muted-foreground">{item.category} · {item.item_type.replace("-", " ")}</p>
        <h1 className="mt-3 text-3xl font-medium tracking-[-0.045em] md:text-4xl">{item.title}</h1>
        {item.excerpt && <p className="mt-3 text-base leading-6 text-muted-foreground">{item.excerpt}</p>}
        {item.cover_image_url && <img src={item.cover_image_url} alt="" className="mt-6 max-h-[480px] w-full object-cover" />}
        {body && <div className="prose prose-neutral mt-7 max-w-none whitespace-pre-wrap text-[15px] leading-7 dark:prose-invert">{body}</div>}<ContentMedia type={typeof item.content?.media_type === "string" ? item.content.media_type : undefined} url={typeof item.content?.media_url === "string" ? item.content.media_url : undefined} title={item.title} />
        {item.external_url && <a href={item.external_url} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm underline underline-offset-4">Visit link <ArrowUpRight size={14} /></a>}
      </article>
    </main>
  )
}
