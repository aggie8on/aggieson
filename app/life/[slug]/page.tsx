import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import type { PortfolioItem } from "@/lib/life-content"

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
    <main className="mx-auto w-full max-w-2xl px-6 pb-24 pt-20 md:pt-28">
      <Link href="/life" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={14} /> Back to life</Link>
      <article className="mt-10">
        <p className="text-sm text-muted-foreground">{item.category} · {item.item_type.replace("-", " ")}</p>
        <h1 className="mt-3 text-4xl font-medium tracking-[-0.05em] md:text-5xl">{item.title}</h1>
        {item.excerpt && <p className="mt-5 text-lg leading-8 text-muted-foreground">{item.excerpt}</p>}
        {item.cover_image_url && <img src={item.cover_image_url} alt="" className="mt-8 max-h-[560px] w-full rounded-md object-cover" />}
        {body && <div className="prose prose-neutral mt-10 max-w-none whitespace-pre-wrap text-base leading-8 dark:prose-invert">{body}</div>}
        {item.external_url && <a href={item.external_url} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm underline underline-offset-4">Visit link <ArrowUpRight size={14} /></a>}
      </article>
    </main>
  )
}
