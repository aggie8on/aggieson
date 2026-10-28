import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowUpRight } from "lucide-react"
import { SpotifyEmbed, TweetCard } from "@/components/embeds"
import { InlineRichText } from "@/components/inline-rich-text"
import { PageNav } from "@/components/page-nav"
import { hostOf, parseSpotifyUrl, readTweet } from "@/lib/embeds"
import { plainText } from "@/lib/icons"
import { formatDate, getKind, readMeta } from "@/lib/life-content"
import { getIcons, getLifeItem } from "@/lib/portfolio-data"

export const revalidate = 0

type LifeItemPageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: LifeItemPageProps): Promise<Metadata> {
  const { slug } = await params
  const item = await getLifeItem(slug)
  if (!item) return { title: "Not found | Aggieson" }
  const body = typeof item.content?.body === "string" ? item.content.body : ""
  return { title: `${item.title} | Aggieson`, description: plainText(item.excerpt || body).slice(0, 160) || undefined }
}

export default async function LifeItemPage({ params }: LifeItemPageProps) {
  const { slug } = await params
  // Only life entries are served here, so projects and writing never appear under /life.
  const [item, icons] = await Promise.all([getLifeItem(slug), getIcons()])
  if (!item) notFound()

  const kind = getKind(item.item_type)
  const meta = readMeta(item)
  const body = typeof item.content?.body === "string" ? item.content.body : ""
  const tweet = readTweet(item.content)
  const spotify = kind.linkKind === "spotify" && item.external_url ? parseSpotifyUrl(item.external_url) : null
  const metaRows = kind.meta.filter((field) => meta[field.key] && !field.list)
  if (kind.ownable) metaRows.push({ key: "status", label: "Status" })
  const metaValue = (key: string) => (key === "status" ? (item.is_owned ? "I own this" : "On my wishlist") : meta[key])
  const listFields = kind.meta.filter((field) => field.list && meta[field.key])
  const date = kind.dateLabel ? formatDate(item.published_at, "long") : ""
  const showTitle = !(kind.titleOptional && kind.key === "note" && /^note$/i.test(item.title)) && !(kind.key === "photo" && /^photo\b/i.test(item.title))
  const linkText = tweet ? "View on X" : spotify ? "Open in Spotify" : item.external_url ? `Open ${hostOf(item.external_url) || "link"}` : ""

  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-12 sm:px-6 md:pt-16">
      <PageNav trail={[{ label: "Life", href: "/life" }]} />
      <article className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm text-muted-foreground">{[kind.label, date].filter(Boolean).join(" · ")}</p>
          {showTitle && <h1 className="text-3xl font-medium tracking-[-0.045em] text-balance md:text-4xl">{item.title}</h1>}
          {item.excerpt && !tweet && <p className="max-w-xl text-base leading-6 text-muted-foreground"><InlineRichText icons={icons}>{item.excerpt}</InlineRichText></p>}
        </header>

        {tweet && <TweetCard tweet={tweet} note={item.excerpt} />}
        {spotify && <SpotifyEmbed url={item.external_url as string} title={item.title} height={spotify.type === "track" || spotify.type === "episode" ? 152 : 352} />}

        {item.cover_image_url && <img src={item.cover_image_url} alt={item.title} loading="lazy" className="max-h-[560px] w-full rounded-lg object-cover" />}

        {metaRows.length > 0 && (
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-y border-border py-4 text-sm">
            {metaRows.map((field) => (
              <div key={field.key} className="contents">
                <dt className="text-muted-foreground">{field.label.replace(/ \(.*\)$/, "")}</dt>
                <dd>{metaValue(field.key)}</dd>
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
            {kind.bodyHeading && kind.bodyLabel && <h2 className="text-sm font-medium">{kind.bodyLabel}</h2>}
            <div className="whitespace-pre-wrap text-[15px] leading-7 text-foreground/90"><InlineRichText icons={icons}>{body}</InlineRichText></div>
          </section>
        )}

        {item.external_url && !tweet && !spotify && (
          <a href={item.external_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm underline decoration-border underline-offset-4 hover:decoration-foreground">
            {linkText} <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        )}
        {spotify && <a href={spotify.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm underline decoration-border underline-offset-4 hover:decoration-foreground">{linkText} <ArrowUpRight size={14} aria-hidden="true" /></a>}
      </article>
    </main>
  )
}
