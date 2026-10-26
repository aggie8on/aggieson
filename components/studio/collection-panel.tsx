"use client"

import { useMemo, useState, type FormEvent } from "react"
import { ArrowLeft, ArrowUpRight, Loader2, Plus, RefreshCw, Save } from "lucide-react"
import { fetchLinkPreview, removeItem, saveItem, type PanelProps } from "@/components/studio/api"
import { DeleteButton, EmptyState, Field, ImageField, Notice, PanelHeader, StatusChip, StatusSwitch, Toggle, inputClass, primaryButton, secondaryButton, textareaClass, type Message } from "@/components/studio/ui"
import { KindIcon } from "@/components/life-icons"
import { SpotifyEmbed, TweetCard } from "@/components/embeds"
import { hostOf, parseSpotifyUrl, parseTweetUrl, readTweet } from "@/lib/embeds"
import { LIFE_KINDS, PUBLIC_LIFE_TYPES, formatDate, getKind, groupOf, readMeta, slugify, uniqueSlug, type LifeGroup, type LifeKind, type PortfolioItem } from "@/lib/life-content"

type Draft = {
  id?: string; kind: LifeKind; title: string; slug: string; slugTouched: boolean; summary: string; body: string
  meta: Record<string, string>; image: string; link: string; date: string
  owned: boolean; featured: boolean; published: boolean; extra: Record<string, unknown>
}

const today = () => new Date().toISOString().slice(0, 10)

function blankDraft(kind: LifeKind): Draft {
  return { kind, title: "", slug: "", slugTouched: false, summary: "", body: "", meta: {}, image: "", link: "", date: today(), owned: false, featured: false, published: false, extra: {} }
}

function toDraft(item: PortfolioItem): Draft {
  const { body, meta: _meta, media_type: _mediaType, media_url: _mediaUrl, ...extra } = item.content
  void _meta; void _mediaType; void _mediaUrl
  return {
    id: item.id, kind: getKind(item.item_type).key, title: item.title, slug: item.slug, slugTouched: true, summary: item.excerpt ?? "",
    body: typeof body === "string" ? body : "", meta: readMeta(item), image: item.cover_image_url ?? "", link: item.external_url ?? "",
    date: (item.published_at ?? item.created_at).slice(0, 10), owned: item.is_owned, featured: item.featured, published: item.published, extra,
  }
}

function withoutTweet(extra: Record<string, unknown>) {
  const { tweet: _tweet, ...rest } = extra
  void _tweet
  return rest
}

const COPY: Record<LifeGroup, { title: string; description: string; empty: string; pick: string }> = {
  bookmarks: { title: "Bookmarks", description: "Links, recipes, hidden gems and gadgets. Shown as round tiles on the Life page.", empty: "Save a link, a recipe, a place or a gadget.", pick: "What are you saving?" },
  lifelog: { title: "Life log", description: "Music, photos and notes. Shown below your bookmarks on the Life page.", empty: "Add a song, a photo or a note.", pick: "What are you adding?" },
}

export function CollectionPanel({ items, onChanged, group }: PanelProps & { group: LifeGroup }) {
  const kinds = useMemo(() => LIFE_KINDS.filter((kind) => kind.group === group), [group])
  const copy = COPY[group]
  const entries = useMemo(() => items.filter((item) => PUBLIC_LIFE_TYPES.includes(item.item_type) && groupOf(item) === group)
    .sort((a, b) => new Date(b.published_at ?? b.created_at).getTime() - new Date(a.published_at ?? a.created_at).getTime()), [items, group])
  const [draft, setDraft] = useState<Draft | null>(null)
  const [picking, setPicking] = useState(false)
  const [filter, setFilter] = useState("all")
  const [message, setMessage] = useState<Message>(null)
  const [linkNote, setLinkNote] = useState<Message>(null)
  const [fetching, setFetching] = useState(false)
  const [saving, setSaving] = useState(false)

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((current) => (current ? { ...current, [key]: value } : current))
  const visible = filter === "all" ? entries : entries.filter((entry) => getKind(entry.item_type).key === filter)

  function open(next: Draft | null) {
    setDraft(next); setPicking(false); setMessage(null); setLinkNote(null); setFetching(false)
  }

  /** Looks up an X post or Spotify link and fills in what it can. */
  async function lookup() {
    if (!draft) return
    const url = draft.link.trim()
    const config = getKind(draft.kind)
    if (!url) { setLinkNote(null); return }
    const isTweet = Boolean(parseTweetUrl(url))
    const isSpotify = Boolean(parseSpotifyUrl(url))
    if (config.linkKind === "spotify" && !isSpotify) {
      setLinkNote({ tone: "error", text: "That doesn't look like a Spotify link. In Spotify, choose Share, then Copy link." })
      return
    }
    if (!isTweet && !isSpotify) {
      setLinkNote(null)
      setDraft((current) => (current ? { ...current, extra: withoutTweet(current.extra) } : current))
      return
    }
    setFetching(true); setLinkNote(null)
    const result = await fetchLinkPreview(url)
    setFetching(false)
    if (!result.ok) {
      setLinkNote({ tone: "error", text: `${result.error} You can still save it as a plain link.` })
      setDraft((current) => (current ? { ...current, extra: withoutTweet(current.extra) } : current))
      return
    }
    const data = result.data
    setDraft((current) => {
      if (!current || current.link.trim() !== url) return current
      const next = { ...current }
      if (data.kind === "tweet") next.extra = { ...current.extra, tweet: data.tweet }
      if (!next.title.trim() && data.title && data.kind !== "link") next.title = data.title
      return next
    })
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    if (!draft) return
    const config = getKind(draft.kind)
    const link = draft.link.trim()
    const tweetRef = parseTweetUrl(link)

    if (config.linkRequired && !link) { setMessage({ tone: "error", text: `Add a link: ${config.linkLabel?.toLowerCase()}.` }); return }
    if (config.linkKind === "spotify" && !parseSpotifyUrl(link)) { setMessage({ tone: "error", text: "That doesn't look like a Spotify link. In Spotify, choose Share, then Copy link." }); return }
    if (config.imageRequired && !draft.image.trim()) { setMessage({ tone: "error", text: "Add a photo first." }); return }
    if (config.bodyRequired && !draft.body.trim()) { setMessage({ tone: "error", text: "Write the note first." }); return }
    if (!draft.title.trim() && !config.titleOptional) { setMessage({ tone: "error", text: `Add a ${config.titleLabel.toLowerCase()} first.` }); return }

    setSaving(true); setMessage(null)

    // Make sure a saved X post has up-to-date details before it is stored.
    let tweet = readTweet(draft.extra)
    if (tweetRef && (!tweet || tweet.url !== tweetRef.url)) {
      const result = await fetchLinkPreview(link)
      tweet = result.ok && result.data.kind === "tweet" ? result.data.tweet : null
    }
    if (!tweetRef) tweet = null

    let title = draft.title.trim()
    if (!title) {
      title = config.key === "photo" ? `Photo ${draft.date}`
        : config.key === "note" ? "Note"
        : config.key === "music" ? "Music"
        : tweet ? `${tweet.author_name} on X` : hostOf(link) || "Link"
    }

    const meta = Object.fromEntries(config.meta.map((field) => [field.key, (draft.meta[field.key] ?? "").trim()]).filter(([, value]) => value))
    const content: Record<string, unknown> = { ...withoutTweet(draft.extra), body: draft.body }
    if (Object.keys(meta).length) content.meta = meta
    if (tweet) content.tweet = tweet

    const existing = items.find((item) => item.id === draft.id)
    const slug = draft.id ? slugify(draft.slug || title) : uniqueSlug(draft.slug || title, items)
    const result = await saveItem({
      title, slug, item_type: draft.kind, category: config.plural,
      excerpt: draft.summary.trim(), content,
      cover_image_url: config.imageLabel ? draft.image.trim() || null : null,
      external_url: config.linkLabel ? link || null : null,
      published: draft.published, featured: draft.featured, is_owned: config.ownable ? draft.owned : false, sort_order: 0,
      published_at: config.dateLabel ? `${draft.date || today()}T12:00:00Z` : (existing?.published_at ?? new Date().toISOString()),
    }, draft.id)
    setSaving(false)
    if (!result.ok) { setMessage({ tone: "error", text: result.error }); return }
    const saved = toDraft(result.data)
    setDraft(saved)
    const base = draft.published ? "Saved. This entry is live." : "Draft saved. It isn't public yet."
    setMessage({ tone: "success", text: tweetRef && !tweet ? `${base} The post's details couldn't be loaded, so it will show as a plain link.` : base })
    await onChanged()
  }

  async function remove(item: PortfolioItem) {
    const result = await removeItem(item.id)
    if (!result.ok) { setMessage({ tone: "error", text: result.error }); return }
    if (draft?.id === item.id) setDraft(null)
    setMessage({ tone: "success", text: `“${item.title}” was deleted.` })
    await onChanged()
  }

  if (draft) {
    const config = getKind(draft.kind)
    const err = (text: string) => setMessage({ tone: "error", text })
    const tweet = parseTweetUrl(draft.link) ? readTweet(draft.extra) : null
    const spotify = parseSpotifyUrl(draft.link)
    const linkBlock = config.linkLabel && (
      <div className="space-y-3">
        <Field label={config.linkLabel} required={config.linkRequired} hint={config.linkHint}>
          <input type="url" value={draft.link} onChange={(event) => { set("link", event.target.value); setLinkNote(null) }} onBlur={() => void lookup()} className={inputClass} placeholder={config.linkKind === "spotify" ? "https://open.spotify.com/playlist/…" : "https://…"} />
        </Field>
        {fetching && <p className="inline-flex items-center gap-2 text-xs text-muted-foreground"><Loader2 size={13} className="animate-spin" aria-hidden="true" /> Loading preview…</p>}
        <Notice message={linkNote} />
        {tweet && <div className="max-w-sm"><TweetCard tweet={tweet} /></div>}
        {spotify && <SpotifyEmbed url={draft.link} title={draft.title || undefined} />}
        {(tweet || spotify || parseTweetUrl(draft.link)) && !fetching && (
          <button type="button" onClick={() => void lookup()} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"><RefreshCw size={12} aria-hidden="true" /> Refresh details from the link</button>
        )}
      </div>
    )
    return (
      <form onSubmit={save} className="space-y-6">
        <button type="button" onClick={() => open(null)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={14} aria-hidden="true" /> All {copy.title.toLowerCase()}</button>
        <PanelHeader title={`${draft.id ? "Edit" : "New"} ${config.label.toLowerCase()}`} description={config.blurb} />
        {config.linkRequired && linkBlock}
        <Field label={config.titleLabel} required={!config.titleOptional}><input value={draft.title} onChange={(event) => { set("title", event.target.value); if (!draft.slugTouched) set("slug", slugify(event.target.value)) }} className={inputClass} placeholder={config.titlePlaceholder} /></Field>
        {config.meta.some((field) => !field.list) && (
          <div className="grid gap-4 sm:grid-cols-2">
            {config.meta.filter((field) => !field.list).map((field) => (
              <Field key={field.key} label={field.label}><input value={draft.meta[field.key] ?? ""} onChange={(event) => set("meta", { ...draft.meta, [field.key]: event.target.value })} className={inputClass} placeholder={field.placeholder} /></Field>
            ))}
          </div>
        )}
        {config.dateLabel && <Field label={config.dateLabel}><input type="date" value={draft.date} onChange={(event) => set("date", event.target.value)} className={`${inputClass} sm:max-w-xs`} /></Field>}
        {config.imageLabel && <ImageField label={config.imageLabel} value={draft.image} onChange={(url) => set("image", url)} folder={`life/${config.key}`} onError={err} hint={config.imageHint} />}
        {config.summaryLabel && <Field label={config.summaryLabel}><textarea rows={2} value={draft.summary} onChange={(event) => set("summary", event.target.value)} className={textareaClass} placeholder={config.summaryPlaceholder} /></Field>}
        {config.meta.filter((field) => field.list).map((field) => (
          <Field key={field.key} label={field.label} hint="One per line."><textarea rows={6} value={draft.meta[field.key] ?? ""} onChange={(event) => set("meta", { ...draft.meta, [field.key]: event.target.value })} className={textareaClass} placeholder={field.placeholder} /></Field>
        ))}
        {config.bodyLabel && <Field label={config.bodyLabel} required={config.bodyRequired}><textarea rows={config.key === "recipe" ? 12 : config.key === "note" ? 8 : 6} value={draft.body} onChange={(event) => set("body", event.target.value)} className={textareaClass} placeholder={config.bodyPlaceholder} /></Field>}
        {!config.linkRequired && linkBlock}
        {config.ownable && <Toggle checked={draft.owned} onChange={(value) => set("owned", value)} label="I own this" hint="Leave off to keep it on your wishlist." />}
        <Toggle checked={draft.featured} onChange={(value) => set("featured", value)} label={config.pinnable ? "Pin this note" : "Show on the homepage"} hint={config.pinnable ? "Pinned notes sit first on the Life page." : "Featured entries appear first in “Life, lately” on the homepage."} />
        <div className="grid gap-4 sm:grid-cols-2">
          <StatusSwitch published={draft.published} onChange={(value) => set("published", value)} />
          <Field label="Web address" hint={draft.id ? "Changing this breaks existing links." : "Created from the title."}><input value={draft.slug} onChange={(event) => { set("slug", slugify(event.target.value)); set("slugTouched", true) }} className={inputClass} placeholder="auto" /></Field>
        </div>
        <Notice message={message} />
        <div className="flex flex-wrap items-center gap-3">
          <button disabled={saving || fetching} className={primaryButton}><Save size={14} aria-hidden="true" /> {saving ? "Saving…" : draft.published ? "Save and publish" : "Save draft"}</button>
          {draft.id && draft.published && <a href={`/life/${draft.slug}`} target="_blank" rel="noopener noreferrer" className={secondaryButton}>View live <ArrowUpRight size={14} aria-hidden="true" /></a>}
          {draft.id && <span className="ml-auto"><DeleteButton label={`Delete ${draft.title}`} onConfirm={async () => { const item = entries.find((entry) => entry.id === draft.id); if (item) await remove(item) }} /></span>}
        </div>
      </form>
    )
  }

  if (picking) {
    return (
      <div className="space-y-6">
        <button type="button" onClick={() => setPicking(false)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={14} aria-hidden="true" /> All {copy.title.toLowerCase()}</button>
        <PanelHeader title={copy.pick} description="Each kind has its own fields, so you only fill in what makes sense." />
        <ul className="grid gap-3 sm:grid-cols-2">
          {kinds.map((kind) => (
            <li key={kind.key}>
              <button type="button" onClick={() => open(blankDraft(kind.key))} className="flex h-full w-full items-start gap-3 rounded-lg border border-border p-4 text-left transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/40">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground"><KindIcon kind={kind.key} size={15} /></span>
                <span><span className="block text-sm font-medium">{kind.label}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{kind.blurb}</span></span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const present = kinds.filter((kind) => entries.some((entry) => getKind(entry.item_type).key === kind.key))
  return (
    <div className="space-y-6">
      <PanelHeader title={copy.title} count={entries.length} description={copy.description} action={<button type="button" onClick={() => { setPicking(true); setMessage(null) }} className={primaryButton}><Plus size={14} aria-hidden="true" /> New entry</button>} />
      {present.length > 1 && (
        <div role="group" aria-label="Filter by kind" className="flex flex-wrap gap-2">
          {[{ key: "all", label: "All" }, ...present].map((kind) => (
            <button key={kind.key} type="button" aria-pressed={filter === kind.key} onClick={() => setFilter(kind.key)} className={`rounded-full border px-3 py-1 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 ${filter === kind.key ? "border-foreground bg-accent font-medium" : "border-border text-muted-foreground hover:bg-accent/50"}`}>{kind.label}</button>
          ))}
        </div>
      )}
      <Notice message={message} />
      {visible.length === 0 ? <EmptyState title="Nothing here yet">{copy.empty}</EmptyState> : (
        <ul className="divide-y divide-border border-y border-border">
          {visible.map((entry) => {
            const kind = getKind(entry.item_type)
            return (
              <li key={entry.id} className="flex items-center gap-3 py-3">
                {entry.cover_image_url
                  ? <img src={entry.cover_image_url} alt="" className="size-10 shrink-0 rounded-full border border-border object-cover" />
                  : <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground"><KindIcon kind={kind.key} size={16} /></span>}
                <button type="button" onClick={() => open(toDraft(entry))} className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-sm font-medium hover:underline">{entry.title}</span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">{kind.label} · {formatDate(entry.published_at ?? entry.created_at, "short")}{entry.is_owned ? " · Owned" : ""}{kind.pinnable && entry.featured ? " · Pinned" : ""}</span>
                </button>
                <StatusChip published={entry.published} />
                <DeleteButton compact label={`Delete ${entry.title}`} onConfirm={() => remove(entry)} />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
