import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowUpRight } from "lucide-react"
import { ContentMedia } from "@/components/content-media"
import { PageNav } from "@/components/page-nav"
import { effectiveKind, formatDate, getKind, readMeta } from "@/lib/life-content"
import { getLifeItem } from "@/lib/portfolio-data"

export const revalidate = 0

type LifeItemPageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: LifeItemPageProps): Promise<Metadata> {
  const { slug } = await params
  const item = await getLifeItem(slug)
  if (!item) return { title: "Not found | Aggieson" }
  return { title: `${item.title} | Aggieson`, description: item.excerpt || undefined }
}

export default async function LifeItemPage({ params }: LifeItemPageProps) {
  const { slug } = await params
  // Only life entries are served here, so projects and writing never appear under /life.
  const item = await getLifeItem(slug)
  if (!item) notFound()

  const kind = effectiveKind(item)
  const config = getKind(item.item_type)
  const meta = readMeta(item)
  const body = typeof item.content?.body === "string" ? item.content.body : ""
  const metaRows = config.meta.filter((field) => meta[field.key] && !field.list)
  const listFields = config.meta.filter((field) => field.list && meta[field.key])
  const date = config.dateLabel ? formatDate(item.published_at, "long") : ""
  const mediaType = typeof item.content?.media_type === "string" ? item.content.media_type : undefined
  const mediaUrl = typeof item.content?.media_url === "string" ? item.content.media_url : undefined

  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-12 sm:px-6 md:pt-16">
      <PageNav trail={[{ label: "Life", href: "/life" }]} />
      <article className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm text-muted-foreground">{[kind.label, date].filter(Boolean).join(" · ")}</p>
          <h1 className="text-3xl font-medium tracking-[-0.045em] text-balance md:text-4xl">{item.title}</h1>
          {item.excerpt && <p className="max-w-xl text-base leading-6 text-muted-foreground">{item.excerpt}</p>}
        </header>

        {item.cover_image_url && <img src={item.cover_image_url} alt={item.title} loading="lazy" className="max-h-[480px] w-full rounded-lg object-cover" />}

        {metaRows.length > 0 && (
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-y border-border py-4 text-sm">
            {metaRows.map((field) => (
              <div key={field.key} className="contents">
                <dt className="text-muted-foreground">{field.label.replace(/ \(.*\)$/, "")}</dt>
                <dd>{meta[field.key]}</dd>
              </div>
            ))}
          </dl>
        )}

        {listFields.map((field) => (
          <section key={field.key} className="space-y-2">
            <h2 className="text-sm font-medium">{field.label}</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm leading-6">
              {meta[field.key].split("\n").map((line) => line.trim()).filter(Boolean).map((line, index) => <li key={index}>{line}</li>)}
            </ul>
          </section>
        ))}

        {body && (
          <section className="space-y-2">
            {config.bodyHeading && <h2 className="text-sm font-medium">{config.bodyLabel}</h2>}
            <div className="whitespace-pre-wrap text-[15px] leading-7 text-foreground/90">{body}</div>
          </section>
        )}

        <ContentMedia type={mediaType} url={mediaUrl} title={item.title} />

        {item.external_url && (
          <a href={item.external_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm underline decoration-border underline-offset-4 hover:decoration-foreground">
            {config.linkLabel?.replace(/ \(optional\)$/i, "") ?? "Open link"} <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        )}
      </article>
    </main>
  )
}
