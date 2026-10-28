import Link from "next/link"
import { ArrowUpRight, Pin } from "lucide-react"
import { AudioPlayer, type Track } from "@/components/audio-player"
import { BookmarkGrid, type BookmarkTile } from "@/components/bookmark-grid"
import { TweetCard } from "@/components/embeds"
import { PhotoGroups, type PhotoGroup } from "@/components/photo-groups"
import { faviconUrl, hostOf, readTweet } from "@/lib/embeds"
import { plainText } from "@/lib/icons"
import { audioOf, formatDate, getKind, groupOf, photosOf, readMeta, type PortfolioItem } from "@/lib/life-content"

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
  // On the homepage, saved X posts already have their own "From X" section, so they are not repeated here.
  const bookmarks = items.filter((item) => groupOf(item) === "bookmarks").sort(newestFirst)
  const lifeLog = items.filter((item) => groupOf(item) === "lifelog").sort(newestFirst)

  const posts = compact ? [] : bookmarks.filter((item) => readTweet(item.content))
  const tiles = bookmarks.filter((item) => !readTweet(item.content)).map(toTile)

  const notes = lifeLog.filter((item) => getKind(item.item_type).key === "note").sort((a, b) => Number(b.featured) - Number(a.featured))
  const songs = lifeLog.filter((item) => getKind(item.item_type).key === "music")
  // Uploaded songs play in the site's own player. Older entries that only have a link stay as a quiet link.
  const tracks: Track[] = songs.filter((item) => audioOf(item)).map((item) => ({
    id: item.id,
    title: item.title,
    artist: readMeta(item).artist,
    src: audioOf(item),
    cover: item.cover_image_url || undefined,
    note: item.excerpt || undefined,
  }))
  const linkedSongs = songs.filter((item) => !audioOf(item) && item.external_url)
  const groups: PhotoGroup[] = lifeLog.filter((item) => getKind(item.item_type).key === "photo" && photosOf(item).length > 0).map((item) => ({
    id: item.id,
    title: /^photo\b/i.test(item.title) ? "" : item.title,
    date: formatDate(item.published_at ?? item.created_at, "short"),
    where: readMeta(item).where,
    images: photosOf(item),
  }))
  const hasLifeLog = notes.length + tracks.length + linkedSongs.length + groups.length > 0

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
                    <p className="line-clamp-6 whitespace-pre-wrap pr-6 text-sm leading-6 text-foreground/90">{plainText(typeof note.content?.body === "string" ? note.content.body : note.excerpt)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {(tracks.length > 0 || linkedSongs.length > 0) && (
            <div className="space-y-3">
              {tracks.length > 0 && <AudioPlayer tracks={tracks} />}
              {linkedSongs.length > 0 && (
                <ul className="divide-y divide-border border-y border-border text-sm">
                  {linkedSongs.map((song) => (
                    <li key={song.id}>
                      <a href={song.external_url as string} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 py-2.5 hover:text-muted-foreground">
                        <span className="min-w-0 truncate">{song.title}</span>
                        <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">{hostOf(song.external_url as string)} <ArrowUpRight size={12} aria-hidden="true" /></span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {groups.length > 0 && <PhotoGroups groups={groups} />}
        </section>
      )}
    </div>
  )
}
