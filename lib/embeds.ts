/** Helpers for recognising X (Twitter) posts and Spotify links. Safe to use on the server and in the browser. */

export type TweetRef = { user: string; id: string; url: string }

export type TweetSnapshot = {
  id: string
  url: string
  author_name: string
  author_handle: string
  avatar_url?: string
  text: string
  image_url?: string
  created_at?: string
  /** Counts as of when the post was saved. The homepage refreshes them periodically. */
  replies?: number
  reposts?: number
  likes?: number
}

/** 1,234 becomes 1.2K, 3,400,000 becomes 3.4M. */
export function formatCount(value: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value)
}

export function parseTweetUrl(input: string): TweetRef | null {
  try {
    const url = new URL(input.trim())
    const host = url.hostname.replace(/^(www\.|mobile\.)/, "")
    if (host !== "x.com" && host !== "twitter.com") return null
    const match = url.pathname.match(/^\/([A-Za-z0-9_]{1,15})\/status(?:es)?\/(\d{1,25})/)
    if (!match) return null
    return { user: match[1], id: match[2], url: `https://x.com/${match[1]}/status/${match[2]}` }
  } catch {
    return null
  }
}

export type SpotifyType = "playlist" | "album" | "track" | "artist" | "episode" | "show"
export type SpotifyRef = { type: SpotifyType; id: string; url: string; embedUrl: string }

export function parseSpotifyUrl(input: string): SpotifyRef | null {
  try {
    const url = new URL(input.trim())
    if (url.hostname !== "open.spotify.com") return null
    const match = url.pathname.match(/^\/(?:intl-[a-z-]+\/)?(?:embed\/)?(playlist|album|track|artist|episode|show)\/([A-Za-z0-9]{10,30})/)
    if (!match) return null
    const type = match[1] as SpotifyType
    const id = match[2]
    return { type, id, url: `https://open.spotify.com/${type}/${id}`, embedUrl: `https://open.spotify.com/embed/${type}/${id}` }
  } catch {
    return null
  }
}

export function hostOf(input: string): string {
  try {
    return new URL(input.trim()).hostname.replace(/^www\./, "")
  } catch {
    return ""
  }
}

/** A small site icon, used as the default tile image for a bookmark. */
export function faviconUrl(link: string): string {
  const host = hostOf(link)
  return host ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128` : ""
}

export function readTweet(content: Record<string, unknown> | null | undefined): TweetSnapshot | null {
  const raw = content?.tweet
  if (!raw || typeof raw !== "object") return null
  const tweet = raw as Record<string, unknown>
  const text = typeof tweet.text === "string" ? tweet.text : ""
  const url = typeof tweet.url === "string" ? tweet.url : ""
  if (!url || !parseTweetUrl(url)) return null
  const pick = (key: string) => (typeof tweet[key] === "string" && tweet[key] !== "" ? (tweet[key] as string) : undefined)
  const count = (key: string) => (typeof tweet[key] === "number" && Number.isFinite(tweet[key]) && (tweet[key] as number) >= 0 ? (tweet[key] as number) : undefined)
  return {
    id: pick("id") ?? "",
    url,
    author_name: pick("author_name") ?? pick("author_handle") ?? "X",
    author_handle: pick("author_handle") ?? "",
    avatar_url: pick("avatar_url"),
    text,
    image_url: pick("image_url"),
    created_at: pick("created_at"),
    replies: count("replies"),
    reposts: count("reposts"),
    likes: count("likes"),
  }
}
