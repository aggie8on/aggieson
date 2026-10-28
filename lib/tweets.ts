/**
 * Server-side helpers for loading X posts. Used by Studio's link preview (always fresh)
 * and by the homepage (cached for half an hour, so counts stay current without slowing the page).
 */
import { parseTweetUrl, type TweetSnapshot } from "@/lib/embeds"

const str = (value: unknown) => (typeof value === "string" ? value : "")
const count = (value: unknown) => (typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : undefined)

async function getJson(url: string, options: { fresh: boolean; timeoutMs: number }): Promise<unknown> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), options.timeoutMs)
  try {
    const response = await fetch(url, {
      ...(options.fresh ? { cache: "no-store" as const } : { next: { revalidate: 1800 } }),
      signal: controller.signal,
      headers: { accept: "application/json", "user-agent": "Mozilla/5.0 (compatible; AggiesonPortfolio/1.0)" },
    })
    if (!response.ok) throw new Error(`Request failed with ${response.status}`)
    return await response.json()
  } finally {
    clearTimeout(timer)
  }
}

function decode(text: string) {
  return text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&nbsp;/g, " ")
}

/** The post's date as an ISO string, preferring the numeric timestamp because it is unambiguous. */
function isoDate(tweet: Record<string, unknown>) {
  const stamp = count(tweet.created_timestamp)
  if (stamp) return new Date(stamp * 1000).toISOString()
  const raw = str(tweet.created_at)
  const parsed = raw ? new Date(raw) : null
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : undefined
}

export async function tweetFromFx(user: string, id: string, url: string, options = { fresh: true, timeoutMs: 8000 }): Promise<TweetSnapshot | null> {
  const json = (await getJson(`https://api.fxtwitter.com/${user}/status/${id}`, options)) as { tweet?: Record<string, unknown> }
  const tweet = json.tweet
  if (!tweet) return null
  const author = (tweet.author ?? {}) as Record<string, unknown>
  const media = (tweet.media ?? {}) as { photos?: { url?: string }[]; videos?: { thumbnail_url?: string }[] }
  const text = str(tweet.text)
  if (!text && !author.name) return null
  return {
    id,
    url,
    author_name: str(author.name) || str(author.screen_name) || user,
    author_handle: str(author.screen_name) || user,
    avatar_url: str(author.avatar_url) || undefined,
    text,
    image_url: str(media.photos?.[0]?.url) || str(media.videos?.[0]?.thumbnail_url) || undefined,
    created_at: isoDate(tweet),
    replies: count(tweet.replies),
    reposts: count(tweet.retweets),
    likes: count(tweet.likes),
  }
}

/** A text-only fallback when the main service is down. It has no counts. */
export async function tweetFromOembed(user: string, id: string, url: string): Promise<TweetSnapshot | null> {
  const json = (await getJson(`https://publish.twitter.com/oembed?omit_script=1&dnt=true&url=${encodeURIComponent(url)}`, { fresh: true, timeoutMs: 8000 })) as Record<string, unknown>
  const html = str(json.html)
  const paragraph = html.match(/<p[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? ""
  const text = decode(paragraph.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")).trim()
  if (!text) return null
  return {
    id,
    url,
    author_name: str(json.author_name) || user,
    author_handle: str(json.author_url).split("/").filter(Boolean).pop() ?? user,
    text,
  }
}

/**
 * Brings a saved post up to date: new like, repost and reply counts, and the post time if it was never stored.
 * If the lookup is slow or fails, the saved version is shown unchanged.
 */
export async function refreshTweet(saved: TweetSnapshot): Promise<TweetSnapshot> {
  const ref = parseTweetUrl(saved.url)
  if (!ref) return saved
  try {
    const live = await tweetFromFx(ref.user, ref.id, ref.url, { fresh: false, timeoutMs: 3500 })
    if (!live) return saved
    return {
      ...saved,
      created_at: live.created_at ?? saved.created_at,
      replies: live.replies ?? saved.replies,
      reposts: live.reposts ?? saved.reposts,
      likes: live.likes ?? saved.likes,
    }
  } catch {
    return saved
  }
}
