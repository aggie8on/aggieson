"use client"

import { useMemo, useState, type FormEvent } from "react"
import { ArrowLeft, ArrowUpRight, Plus, Save } from "lucide-react"
import { removeItem, saveItem, type PanelProps } from "@/components/studio/api"
import { DeleteButton, EmptyState, Field, ImageField, MediaField, Notice, PanelHeader, StatusChip, StatusSwitch, Toggle, inputClass, primaryButton, secondaryButton, textareaClass, type Message } from "@/components/studio/ui"
import { LIFE_KINDS, PUBLIC_LIFE_TYPES, formatDate, getKind, readMeta, slugify, type LifeKind, type PortfolioItem } from "@/lib/life-content"

type Draft = {
  id?: string; kind: string; title: string; slug: string; slugTouched: boolean; summary: string; body: string
  meta: Record<string, string>; image: string; link: string; mediaType: string; mediaUrl: string; date: string
  owned: boolean; featured: boolean; published: boolean; extra: Record<string, unknown>
}

const today = () => new Date().toISOString().slice(0, 10)

function blankDraft(kind: LifeKind): Draft {
  return { kind, title: "", slug: "", slugTouched: false, summary: "", body: "", meta: {}, image: "", link: "", mediaType: "none", mediaUrl: "", date: today(), owned: false, featured: false, published: false, extra: {} }
}

function toDraft(item: PortfolioItem): Draft {
  const { body, meta: _meta, media_type, media_url, ...extra } = item.content
  void _meta
  return {
    id: item.id, kind: item.item_type, title: item.title, slug: item.slug, slugTouched: true, summary: item.excerpt ?? "",
    body: typeof body === "string" ? body : "", meta: readMeta(item), image: item.cover_image_url ?? "", link: item.external_url ?? "",
    mediaType: typeof media_type === "string" ? media_type : "none", mediaUrl: typeof media_url === "string" ? media_url : "",
    date: (item.published_at ?? item.created_at).slice(0, 10), owned: item.is_owned, featured: item.featured, published: item.published, extra,
  }
}

export function LifePanel({ items, onChanged }: PanelProps) {
  const entries = useMemo(() => items.filter((item) => PUBLIC_LIFE_TYPES.includes(item.item_type))
    .sort((a, b) => new Date(b.published_at ?? b.created_at).getTime() - new Date(a.published_at ?? a.created_at).getTime()), [items])
  const [draft, setDraft] = useState<Draft | null>(null)
  const [picking, setPicking] = useState(false)
  const [filter, setFilter] = useState("all")
  const [message, setMessage] = useState<Message>(null)
  const [saving, setSaving] = useState(false)

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((current) => (current ? { ...current, [key]: value } : current))
  const visible = filter === "all" ? entries : entries.filter((entry) => entry.item_type === filter)

  async function save(event: FormEvent) {
    event.preventDefault()
    if (!draft) return
    const config = getKind(draft.kind)
    if (!draft.title.trim()) { setMessage({ tone: "error", text: `Add a ${config.titleLabel.toLowerCase()} first.` }); return }
    if (config.linkRequired && !draft.link.trim()) { setMessage({ tone: "error", text: `Add a link: ${config.linkLabel?.toLowerCase()}.` }); return }
    setSaving(true); setMessage(null)
    const meta = Object.fromEntries(config.meta.map((field) => [field.key, (draft.meta[field.key] ?? "").trim()]).filter(([, value]) => value))
    const content: Record<string, unknown> = { ...draft.extra, body: draft.body }
    if (Object.keys(meta).length) content.meta = meta
    if (config.media && draft.mediaType !== "none" && draft.mediaUrl) { content.media_type = draft.mediaType; content.media_url = draft.mediaUrl }
    const existing = items.find((item) => item.id === draft.id)
    const result = await saveItem({
      title: draft.title.trim(), slug: slugify(draft.slug || draft.title), item_type: draft.kind, category: config.plural,
      excerpt: draft.summary.trim(), content,
      cover_image_url: config.imageLabel ? draft.image.trim() || null : null,
      external_url: config.linkLabel ? draft.link.trim() || null : null,
      published: draft.published, featured: draft.featured, is_owned: config.ownable ? draft.owned : false, sort_order: 0,
      published_at: config.dateLabel ? `${draft.date || today()}T12:00:00Z` : (existing?.published_at ?? new Date().toISOString()),
    }, draft.id)
    setSaving(false)
    if (!result.ok) { setMessage({ tone: "error", text: result.error }); return }
    setDraft(toDraft(result.data))
    setMessage({ tone: "success", text: draft.published ? "Saved. This entry is live." : "Draft saved. It isn't public yet." })
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
    return (
      <form onSubmit={save} className="space-y-6">
        <button type="button" onClick={() => { setDraft(null); setMessage(null) }} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={14} aria-hidden="true" /> All life entries</button>
        <PanelHeader title={`${draft.id ? "Edit" : "New"} ${config.label.toLowerCase()}`} description={config.blurb} />
        <Field label={config.titleLabel} required><input value={draft.title} onChange={(event) => { set("title", event.target.value); if (!draft.slugTouched) set("slug", slugify(event.target.value)) }} className={inputClass} placeholder={config.titlePlaceholder} /></Field>
        {config.meta.some((field) => !field.list) && (
          <div className="grid gap-4 sm:grid-cols-2">
            {config.meta.filter((field) => !field.list).map((field) => (
              <Field key={field.key} label={field.label}><input value={draft.meta[field.key] ?? ""} onChange={(event) => set("meta", { ...draft.meta, [field.key]: event.target.value })} className={inputClass} placeholder={field.placeholder} /></Field>
            ))}
          </div>
        )}
        {config.dateLabel && <Field label={config.dateLabel}><input type="date" value={draft.date} onChange={(event) => set("date", event.target.value)} className={`${inputClass} sm:max-w-xs`} /></Field>}
        <Field label={config.summaryLabel}><textarea rows={2} value={draft.summary} onChange={(event) => set("summary", event.target.value)} className={textareaClass} placeholder={config.summaryPlaceholder} /></Field>
        {config.meta.filter((field) => field.list).map((field) => (
          <Field key={field.key} label={field.label} hint="One per line."><textarea rows={6} value={draft.meta[field.key] ?? ""} onChange={(event) => set("meta", { ...draft.meta, [field.key]: event.target.value })} className={textareaClass} placeholder={field.placeholder} /></Field>
        ))}
        <Field label={config.bodyLabel}><textarea rows={config.key === "recipe" || config.key === "life-log" ? 12 : 6} value={draft.body} onChange={(event) => set("body", event.target.value)} className={textareaClass} placeholder={config.bodyPlaceholder} /></Field>
        {config.imageLabel && <ImageField label={config.imageLabel} value={draft.image} onChange={(url) => set("image", url)} folder={`life/${config.key}`} onError={err} />}
        {config.linkLabel && <Field label={config.linkLabel} required={config.linkRequired}><input type="url" value={draft.link} onChange={(event) => set("link", event.target.value)} className={inputClass} placeholder="https://…" /></Field>}
        {config.media && <MediaField label="Audio, video or GIF (optional)" type={draft.mediaType} url={draft.mediaUrl} onChange={(type, url) => { set("mediaType", type); set("mediaUrl", url) }} folder={`life/${config.key}`} onError={err} allow={["audio", "video", "gif"]} />}
        {config.ownable && <Toggle checked={draft.owned} onChange={(value) => set("owned", value)} label="I own this now" hint="Moves it from Wishlist into “My setup” on the Life page." />}
        <Toggle checked={draft.featured} onChange={(value) => set("featured", value)} label="Show on the homepage" hint="Featured entries appear first in “Life, lately”." />
        <div className="grid gap-4 sm:grid-cols-2">
          <StatusSwitch published={draft.published} onChange={(value) => set("published", value)} />
          <Field label="Web address" hint={draft.id ? "Changing this breaks existing links." : "Created from the title."}><input value={draft.slug} onChange={(event) => { set("slug", slugify(event.target.value)); set("slugTouched", true) }} className={inputClass} placeholder="auto-from-title" /></Field>
        </div>
        <Notice message={message} />
        <div className="flex flex-wrap items-center gap-3">
          <button disabled={saving} className={primaryButton}><Save size={14} aria-hidden="true" /> {saving ? "Saving…" : draft.published ? "Save and publish" : "Save draft"}</button>
          {draft.id && draft.published && <a href={`/life/${draft.slug}`} target="_blank" rel="noopener noreferrer" className={secondaryButton}>View live <ArrowUpRight size={14} aria-hidden="true" /></a>}
          {draft.id && <span className="ml-auto"><DeleteButton label={`Delete ${draft.title}`} onConfirm={async () => { const item = entries.find((entry) => entry.id === draft.id); if (item) await remove(item) }} /></span>}
        </div>
      </form>
    )
  }

  if (picking) {
    return (
      <div className="space-y-6">
        <button type="button" onClick={() => setPicking(false)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={14} aria-hidden="true" /> All life entries</button>
        <PanelHeader title="What are you adding?" description="Each kind has its own fields, so you only fill in what makes sense." />
        <ul className="grid gap-3 sm:grid-cols-2">
          {LIFE_KINDS.map((kind) => (
            <li key={kind.key}>
              <button type="button" onClick={() => { setDraft(blankDraft(kind.key)); setPicking(false); setMessage(null) }} className="h-full w-full rounded-lg border border-border p-4 text-left transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/40">
                <span className="block text-sm font-medium">{kind.label}</span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">{kind.blurb}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const present = LIFE_KINDS.filter((kind) => entries.some((entry) => entry.item_type === kind.key))
  return (
    <div className="space-y-6">
      <PanelHeader title="Life log" count={entries.length} description="Recipes, music, bookmarks, places and everyday things. Shown on the Life page." action={<button type="button" onClick={() => { setPicking(true); setMessage(null) }} className={primaryButton}><Plus size={14} aria-hidden="true" /> New entry</button>} />
      {present.length > 1 && (
        <div role="group" aria-label="Filter by kind" className="flex flex-wrap gap-2">
          {[{ key: "all", label: "All" }, ...present].map((kind) => (
            <button key={kind.key} type="button" aria-pressed={filter === kind.key} onClick={() => setFilter(kind.key)} className={`rounded-full border px-3 py-1 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 ${filter === kind.key ? "border-foreground bg-accent font-medium" : "border-border text-muted-foreground hover:bg-accent/50"}`}>{kind.label}</button>
          ))}
        </div>
      )}
      <Notice message={message} />
      {visible.length === 0 ? <EmptyState title="Nothing here yet">Add a recipe, a song, a bookmark, or a moment from your day.</EmptyState> : (
        <ul className="divide-y divide-border border-y border-border">
          {visible.map((entry) => (
            <li key={entry.id} className="flex items-center gap-3 py-3">
              <button type="button" onClick={() => { setDraft(toDraft(entry)); setMessage(null) }} className="min-w-0 flex-1 text-left">
                <span className="block truncate text-sm font-medium hover:underline">{entry.title}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{getKind(entry.item_type).label} · {formatDate(entry.published_at ?? entry.created_at, "short")}{entry.is_owned ? " · Owned" : ""}</span>
              </button>
              <StatusChip published={entry.published} />
              <DeleteButton compact label={`Delete ${entry.title}`} onConfirm={() => remove(entry)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
