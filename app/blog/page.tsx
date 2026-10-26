import Link from "next/link"
import type { Metadata } from "next"
import { PageNav } from "@/components/page-nav"
import { getSiteSections, getWriting } from "@/lib/portfolio-data"
import { InlineRichText } from "@/components/inline-rich-text"

export const revalidate = 0
export const metadata: Metadata = { title: "Writing | Aggieson", description: "Notes and ideas by Aggieson." }

export default async function BlogPage() {
  const [sections, writing] = await Promise.all([getSiteSections("blog"), getWriting()])
  const postsArray = writing.data

  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-12 sm:px-6 md:pt-16">
      <PageNav />
      <div className="space-y-8">
        {sections.filter((section) => section.visible).map((section) => {
          if (section.type === "intro") return <section key={section.id} className="max-w-xl space-y-5"><p className="text-sm text-muted-foreground">{section.eyebrow || "Notes & ideas"}</p><h1 className="text-2xl font-medium leading-[1.2] tracking-[-0.045em] sm:text-[1.65rem]">{section.title || "Writing"}</h1>{section.text && <p className="text-sm leading-6 text-muted-foreground"><InlineRichText inlineIconSvg={section.inlineIconSvg} inlineIconUrl={section.inlineIconUrl}>{section.text}</InlineRichText></p>}{section.body && <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground"><InlineRichText inlineIconSvg={section.inlineIconSvg} inlineIconUrl={section.inlineIconUrl}>{section.body}</InlineRichText></p>}{section.image && <img src={section.image} alt={section.title || "Writing"} className="mt-4 max-h-80 w-full rounded-lg object-cover" />}</section>
          if (section.type === "writing") return <section key={section.id} className="space-y-3"><h2 className="text-sm font-medium text-muted-foreground">{section.title || "All writing"}</h2><div className="divide-y divide-border border-y border-border">{postsArray.map((post) => <Link key={post.slug} href={`/blog/${post.slug}`} className="group block py-4 transition-colors"><div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"><h3 className="text-sm font-medium tracking-[-0.02em] transition-colors group-hover:text-muted-foreground">{post.title}</h3><span className="shrink-0 text-sm text-muted-foreground">{post.dateLong}</span></div><p className="mt-2 text-sm leading-5 text-muted-foreground">{post.excerpt.slice(0, 160)}{post.excerpt.length > 160 ? "…" : ""}</p><span className="mt-2 block text-xs text-muted-foreground">{post.readTime}</span></Link>)}</div></section>
          if (section.type === "image") return <section key={section.id} className="space-y-3">{section.title && <h2 className="text-sm font-medium text-muted-foreground">{section.title}</h2>}{section.image && <img src={section.image} alt={section.title || "Writing"} className="max-h-80 w-full rounded-lg object-cover" />}{section.text && <p className="text-sm leading-6 text-muted-foreground">{section.text}</p>}</section>
          if (section.type === "text" || section.type === "links") return <section key={section.id} className="space-y-2">{section.eyebrow && <p className="text-xs text-muted-foreground">{section.eyebrow}</p>}{section.title && <h2 className="text-sm font-medium">{section.title}</h2>}{section.text && <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{section.text}</p>}{section.body && (section.type === "links" ? <a href={section.body} target="_blank" rel="noreferrer" className="text-sm underline underline-offset-4">Open link</a> : <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{section.body}</p>)}</section>
          return <section key={section.id} className="space-y-2">{section.eyebrow && <p className="text-xs text-muted-foreground">{section.eyebrow}</p>}{section.title && <h2 className="text-sm font-medium">{section.title}</h2>}{section.text && <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{section.text}</p>}{section.body && <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{section.body}</p>}{section.image && <img src={section.image} alt={section.title || "Section image"} className="max-h-80 w-full rounded-lg object-cover" />}</section>
        })}
      </div>
    </main>
  )
}
