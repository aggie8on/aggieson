import { ArrowUpRight, Heart, MessageCircle, Repeat2 } from "lucide-react"
import { TweetTime } from "@/components/tweet-time"
import { formatCount, type TweetSnapshot } from "@/lib/embeds"

export function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function Stat({ icon: Icon, value, label }: { icon: typeof Heart; value?: number; label: string }) {
  if (value === undefined) return null
  return (
    <li className="inline-flex items-center gap-1.5">
      <Icon size={14} strokeWidth={1.6} aria-hidden="true" />
      <span className="tabular-nums">{formatCount(value)}</span>
      <span className="sr-only">{label}</span>
    </li>
  )
}

/**
 * A saved X post, drawn as a small quiet card with its replies, reposts, likes and the time it was posted.
 * Cards grow to fit their text, so a row of them does not need to be the same height.
 */
export function TweetCard({ tweet, note }: { tweet: TweetSnapshot; note?: string }) {
  const hasStats = tweet.replies !== undefined || tweet.reposts !== undefined || tweet.likes !== undefined
  return (
    <a href={tweet.url} target="_blank" rel="noopener noreferrer" className="group block rounded-xl border border-border p-4 transition-colors hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring/40">
      <div className="flex items-center gap-3">
        {tweet.avatar_url
          ? <img src={tweet.avatar_url} alt="" loading="lazy" referrerPolicy="no-referrer" className="size-9 shrink-0 rounded-full bg-muted object-cover" />
          : <span aria-hidden="true" className="size-9 shrink-0 rounded-full bg-muted" />}
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-medium">{tweet.author_name}</p>
          {tweet.author_handle && <p className="truncate text-xs text-muted-foreground">@{tweet.author_handle}</p>}
        </div>
        <XLogo className="size-4 shrink-0 text-muted-foreground" />
      </div>
      {tweet.text && <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6">{tweet.text}</p>}
      {tweet.image_url && <img src={tweet.image_url} alt="" loading="lazy" referrerPolicy="no-referrer" className="mt-3 max-h-64 w-full rounded-lg border border-border object-cover" />}
      {note && <p className="mt-3 border-l-2 border-border pl-3 text-xs leading-5 text-muted-foreground">{note}</p>}
      {hasStats && (
        <ul aria-label="Engagement" className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
          <Stat icon={MessageCircle} value={tweet.replies} label="replies" />
          <Stat icon={Repeat2} value={tweet.reposts} label="reposts" />
          <Stat icon={Heart} value={tweet.likes} label="likes" />
        </ul>
      )}
      <p className={`flex flex-wrap items-center gap-x-1 text-xs text-muted-foreground ${hasStats ? "mt-2.5" : "mt-3"}`}>
        {tweet.created_at && <><TweetTime iso={tweet.created_at} /><span aria-hidden="true">·</span></>}
        <span className="inline-flex items-center gap-0.5 group-hover:text-foreground">View on X <ArrowUpRight size={12} aria-hidden="true" /></span>
      </p>
    </a>
  )
}
