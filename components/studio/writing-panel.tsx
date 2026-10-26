"use client"

import { useMemo, useState, type FormEvent } from "react"
import { ArrowLeft, ArrowUpRight, Plus, Save } from "lucide-react"
import { removeItem, saveItem, type PanelProps } from "@/components/studio/api"
import { DeleteButton, EmptyState, Field, MediaField, Notice, PanelHeader, StatusChip, StatusSwitch, inputClass, primaryButton, secondaryButton, textareaClass, type Message } from "@/components/studio/ui"
import { formatDate, readingTime, slugify, type PortfolioItem } from "@/lib/life-content"

type Draft = { id?: string; title: string; slug: string; slugTouched: boolean; date: string; excerpt: string; body: string; mediaType: string; mediaUrl: string; published: boolean; extra: Record<string, unknown>; cover: string | null }

const today = () => new Date().toISOString().slice(0, 10)

function blankDraft(): Draft {
  return { title: "", slug: "", slugTouched: false, date: today(), excerpt: "", body: "", mediaType: "none", mediaUrl: "", published: false, extra: {}, cover: null }
}

function toDraft(item: PortfolioItem): Draft {
  const { body, media_type, media_url, audio_url, ...extra } = item.content
  const legacyAudio = typeof audio_url === "string" ? audio_url : ""
  return {
    id: item.id, title: item.title, slug: item.slug, slugTouched: true,
    date: (item.published_at ?? item.created_at).slice(0, 10), excerpt: item.excerpt ?? "",
    body: typeof body === "string" ? body : "",
    mediaType: typeof media_type === "string" ? media_type : legacyAudio ? "audio" : "none",
    mediaUrl: typeof media_url === "string" ? media_url : legacyAudio,
    published: item.published, extra, cover: item.cover_image_url,
  }
}

export function WritingPanel({ items, onChanged }: PanelProps) {
  const posts = useMemo(() => items.filter((item) => item.item_type === "writing")
    .sort((a, b) => new Date(b.published_at ?? b.created_at).getTime() - new Date(a.published_at ?? a.created_at).getTime()), [items])
  const [draft, setDraft] = useState<Draft | null>(null)
  const [message, setMessage] = useState<Message>(null)
  const [saving, setSaving] = useState(false)

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((current) => (current ? { ...current, [key]: value } : current))

  async function save(event: FormEvent) {
    event.preventDefault()
    if (!draft) return
    if (!draft.title.trim()) { setMessage({ tone: "error", text: "Add a title first." }); return }
    setSaving(true); setMessage(null)
    const { audio_url: _legacy, ...extra } = draft.extra as Record<string, unknown>
    void _legacy
    const content: Record<string, unknown> = { ...extra, body: draft.body }
    if (draft.mediaType !== "none" && draft.mediaUrl) { content.media_type = draft.mediaType; content.media_url = draft.mediaUrl }
    const result = await saveItem({
      title: draft.title.trim(), slug: slugify(draft.slug || draft.title), item_type: "writing", category: "Writing",
      excerpt: draft.excerpt.trim(), content, cover_image_url: draft.cover, external_url: null,
      published: draft.published, featured: false, is_owned: false, sort_order: 0,
      published_at: `${draft.date || today()}T12:00:00Z`,
    }, draft.id)
    setSaving(false)
    if (!result.ok) { setMessage({ tone: "error", text: result.error }); return }
    setDraft(toDraft(result.data))
    setMessage({ tone: "success", text: draft.published ? "Saved. This post is live." : "Draft saved. It isn't public yet." })
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
    const reading = readingTime(draft.body)
    return (
      <form onSubmit={save} className="space-y-6">
        <button type="button" onClick={() => { setDraft(null); setMessage(null) }} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={14} aria-hidden="true" /> All writing</button>
        <PanelHeader title={draft.id ? "Edit post" : "New post"} />
        <Field label="Title" required><input value={draft.title} onChange={(event) => { set("title", event.target.value); if (!draft.slugTouched) set("slug", slugify(event.target.value)) }} className={inputClass} placeholder="What is this about?" /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date" hint="Posts are sorted newest first."><input type="date" value={draft.date} onChange={(event) => set("date", event.target.value)} className={inputClass} /></Field>
          <Field label="Web address" hint={draft.id ? "Changing this breaks links people already have." : "Created from the title."}><input value={draft.slug} onChange={(event) => { set("slug", slugify(event.target.value)); set("slugTouched", true) }} className={inputClass} placeholder="auto-from-title" /></Field>
        </div>
        <Field label="Summary" hint="Shown in the writing list. Leave blank to use the first lines of the post."><textarea rows={2} value={draft.excerpt} onChange={(event) => set("excerpt", event.target.value)} className={textareaClass} /></Field>
        <Field label="Post" hint={`Leave a blank line between paragraphs. ${reading.words} words · ${reading.label}.`}><textarea rows={18} value={draft.body} onChange={(event) => set("body", event.target.value)} className={textareaClass} placeholder="Start writing…" /></Field>
        <MediaField label="Audio, video or GIF (optional)" hint="Add a recording of the post for people to listen to, or a GIF or video to go with it." type={draft.mediaType} url={draft.mediaUrl} onChange={(type, url) => { set("mediaType", type); set("mediaUrl", url) }} folder="writing" onError={(text) => setMessage({ tone: "error", text })} allow={["audio", "video", "gif"]} />
        <StatusSwitch published={draft.published} onChange={(value) => set("published", value)} />
        <Notice message={message} />
        <div className="flex flex-wrap items-center gap-3">
          <button disabled={saving} className={primaryButton}><Save size={14} aria-hidden="true" /> {saving ? "Saving…" : draft.published ? "Save and publish" : "Save draft"}</button>
          {draft.id && draft.published && <a href={`/blog/${draft.slug}`} target="_blank" rel="noopener noreferrer" className={secondaryButton}>View live <ArrowUpRight size={14} aria-hidden="true" /></a>}
          {draft.id && <span className="ml-auto"><DeleteButton label={`Delete ${draft.title}`} onConfirm={async () => { const item = posts.find((entry) => entry.id === draft.id); if (item) await remove(item) }} /></span>}
        </div>
      </form>
    )
  }

  return (
    <div className="space-y-6">
      <PanelHeader title="Writing" count={posts.length} description="Essays and notes. Shown on the Writing page and the homepage." action={<button type="button" onClick={() => { setDraft(blankDraft()); setMessage(null) }} className={primaryButton}><Plus size={14} aria-hidden="true" /> New post</button>} />
      <Notice message={message} />
      {posts.length === 0 ? <EmptyState title="No posts yet">Write your first post.</EmptyState> : (
        <ul className="divide-y divide-border border-y border-border">
          {posts.map((post) => (
            <li key={post.id} className="flex items-center gap-3 py-3">
              <button type="button" onClick={() => { setDraft(toDraft(post)); setMessage(null) }} className="min-w-0 flex-1 text-left">
                <span className="block truncate text-sm font-medium hover:underline">{post.title}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{formatDate(post.published_at ?? post.created_at, "short")}</span>
              </button>
              <StatusChip published={post.published} />
              <DeleteButton compact label={`Delete ${post.title}`} onConfirm={() => remove(post)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
