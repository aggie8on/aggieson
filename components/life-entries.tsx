import Link from "next/link"
import { Pin } from "lucide-react"
import { BookmarkGrid, type BookmarkTile } from "@/components/bookmark-grid"
import { SpotifyEmbed, TweetCard } from "@/components/embeds"
import { faviconUrl, parseSpotifyUrl, readTweet } from "@/lib/embeds"
import { formatDate, getKind, groupOf, type PortfolioItem } from "@/lib/life-content"

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{children}</h2>
}

function toTile(item: PortfolioItem): BookmarkTile {
  const kind = getKind(item.item_type)
  // Links go straight to the site. Recipes, gems and gadgets open their own page, which links onward.
  const goesOut = kind.key === "bookmark" && Boolean(item.external_url)
  return {
    id: item.id,
    title: item.title,
    kind: kind.key,
    label: kind.plural,
    href: goesOut ? (item.external_url as string) : `/life/${item.slug}`,
    external: goesOut,
    image: item.cover_image_url || (kind.key === "bookmark" && item.external_url ? faviconUrl(item.external_url) : ""),
  }
}

function newestFirst(a: PortfolioItem, b: PortfolioItem) {
  return new Date(b.published_at ?? b.created_at).getTime() - new Date(a.published_at ?? a.created_at).getTime()
}

/**
 * The real previews for life entries: round bookmark tiles, X post cards, pinned notes, Spotify players and photos.
 * Used on the Life page, and in compact form (no headings or filters) in the homepage's "Life, lately".
 */
export function LifeEntries({ items, compact = false }: { items: PortfolioItem[]; compact?: boolean }) {
  const bookmarks = items.filter((item) => groupOf(item) === "bookmarks").sort(newestFirst)
  const lifeLog = items.filter((item) => groupOf(item) === "lifelog").sort(newestFirst)

  const posts = bookmarks.filter((item) => readTweet(item.content))
  const tiles = bookmarks.filter((item) => !readTweet(item.content)).map(toTile)

  const notes = lifeLog.filter((item) => getKind(item.item_type).key === "note").sort((a, b) => Number(b.featured) - Number(a.featured))
  const music = lifeLog.filter((item) => getKind(item.item_type).key === "music" && parseSpotifyUrl(item.external_url ?? ""))
  const photos = lifeLog.filter((item) => getKind(item.item_type).key === "photo" && item.cover_image_url)
  const hasLifeLog = notes.length + music.length + photos.length > 0

  return (
    <div className={compact ? "space-y-8" : "space-y-12"}>
      {(tiles.length > 0 || posts.length > 0) && (
        <section aria-label="Bookmarks" className="space-y-5">
          {!compact && <SectionHeading>Bookmarks</SectionHeading>}
          {tiles.length > 0 && <BookmarkGrid tiles={tiles} filterable={!compact} />}
          {posts.length > 0 && (
            <ul className="grid gap-3 sm:grid-cols-2">
              {posts.map((item) => {
                const tweet = readTweet(item.content)
                return tweet ? <li key={item.id}><TweetCard tweet={tweet} note={item.excerpt} /></li> : null
              })}
            </ul>
          )}
        </section>
      )}

      {hasLifeLog && (
        <section aria-label="Life log" className="space-y-8">
          {!compact && <SectionHeading>Life log</SectionHeading>}

          {notes.length > 0 && (
            <ul className="grid gap-3 sm:grid-cols-2">
              {notes.map((note) => (
                <li key={note.id}>
                  <Link href={`/life/${note.slug}`} className="group relative block h-full rounded-xl border border-border bg-accent/20 p-4 pt-5 transition-colors hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring/40">
                    <Pin size={15} strokeWidth={1.5} aria-label={note.featured ? "Pinned note" : "Note"} className={`absolute right-3 top-3 rotate-45 ${note.featured ? "fill-foreground text-foreground" : "text-muted-foreground"}`} />
                    {note.title && !/^note$/i.test(note.title) && <p className="mb-1 pr-6 text-sm font-medium">{note.title}</p>}
                    <p className="line-clamp-6 whitespace-pre-wrap pr-6 text-sm leading-6 text-foreground/90">{typeof note.content?.body === "string" ? note.content.body : note.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {music.length > 0 && (
            <ul className="grid gap-3 sm:grid-cols-2">
              {music.map((track) => (
                <li key={track.id}>
                  <SpotifyEmbed url={track.external_url as string} title={track.title} />
                  {track.excerpt && <p className="mt-1.5 px-1 text-xs leading-5 text-muted-foreground">{track.excerpt}</p>}
                </li>
              ))}
            </ul>
          )}

          {photos.length > 0 && (
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {photos.map((photo) => (
                <li key={photo.id}>
                  <Link href={`/life/${photo.slug}`} className="group relative block aspect-square overflow-hidden rounded-xl border border-border bg-muted focus-visible:ring-2 focus-visible:ring-ring/40">
                    <img src={photo.cover_image_url as string} alt={photo.title} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2.5 pt-8 text-xs leading-4 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      {photo.title}
                      <span className="block text-[10px] text-white/70">{formatDate(photo.published_at ?? photo.created_at, "short")}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  )
}
