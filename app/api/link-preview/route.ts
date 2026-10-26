import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { hostOf, parseSpotifyUrl, parseTweetUrl, type SpotifyRef, type TweetSnapshot } from "@/lib/embeds"

export const dynamic = "force-dynamic"

const OWNER_EMAIL = "aggie8on@gmail.com"

export type LinkPreview =
  | { kind: "tweet"; title: string; tweet: TweetSnapshot }
  | { kind: "spotify"; title: string; image: string; spotify: SpotifyRef }
  | { kind: "link"; title: string; host: string }

async function getJson(url: string): Promise<unknown> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)
  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
      headers: { accept: "application/json", "user-agent": "Mozilla/5.0 (compatible; AggiesonPortfolio/1.0)" },
    })
    if (!response.ok) throw new Error(`Request failed with ${response.status}`)
    return await response.json()
  } finally {
    clearTimeout(timer)
  }
}

const str = (value: unknown) => (typeof value === "string" ? value : "")

function decode(text: string) {
  return text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&nbsp;/g, " ")
}

async function tweetFromFx(user: string, id: string, url: string): Promise<TweetSnapshot | null> {
  const json = (await getJson(`https://api.fxtwitter.com/${user}/status/${id}`)) as { tweet?: Record<string, unknown> }
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
    created_at: str(tweet.created_at) || undefined,
  }
}

async function tweetFromOembed(user: string, id: string, url: string): Promise<TweetSnapshot | null> {
  const json = (await getJson(`https://publish.twitter.com/oembed?omit_script=1&dnt=true&url=${encodeURIComponent(url)}`)) as Record<string, unknown>
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

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email?.toLowerCase() !== OWNER_EMAIL) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 })
  }

  const input = new URL(request.url).searchParams.get("url")?.trim() ?? ""
  if (!input || input.length > 2000) return NextResponse.json({ error: "Add a link first." }, { status: 400 })

  const tweetRef = parseTweetUrl(input)
  if (tweetRef) {
    let tweet: TweetSnapshot | null = null
    try { tweet = await tweetFromFx(tweetRef.user, tweetRef.id, tweetRef.url) } catch { /* try the fallback */ }
    if (!tweet) {
      try { tweet = await tweetFromOembed(tweetRef.user, tweetRef.id, tweetRef.url) } catch { /* handled below */ }
    }
    if (!tweet) return NextResponse.json({ error: "Couldn't load that post. It may be private or deleted." }, { status: 502 })
    const preview: LinkPreview = { kind: "tweet", title: `${tweet.author_name} on X`, tweet }
    return NextResponse.json(preview)
  }

  const spotifyRef = parseSpotifyUrl(input)
  if (spotifyRef) {
    let title = ""
    let image = ""
    try {
      const json = (await getJson(`https://open.spotify.com/oembed?url=${encodeURIComponent(spotifyRef.url)}`)) as Record<string, unknown>
      title = str(json.title)
      image = str(json.thumbnail_url)
    } catch { /* the player still works without the title */ }
    const preview: LinkPreview = { kind: "spotify", title, image, spotify: spotifyRef }
    return NextResponse.json(preview)
  }

  const host = hostOf(input)
  if (!host) return NextResponse.json({ error: "That doesn't look like a link." }, { status: 400 })
  const preview: LinkPreview = { kind: "link", title: host, host }
  return NextResponse.json(preview)
}
