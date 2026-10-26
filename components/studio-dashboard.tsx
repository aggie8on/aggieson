"use client"

import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowUpRight, LogOut, Plus, Save, Trash2, Upload } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { itemTypeLabels, slugify, type PortfolioItem } from "@/lib/life-content"
import { projects } from "@/lib/projects"
import { blogPosts } from "@/lib/blog-data"

const OWNER_EMAIL = "aggie8on@gmail.com"
const types = Object.entries(itemTypeLabels)
type EditorState = { id?: string; title: string; slug: string; item_type: string; category: string; excerpt: string; body: string; cover_image_url: string; external_url: string; media_type: "none" | "audio" | "gif" | "video"; media_url: string; published: boolean; featured: boolean; is_owned: boolean; sort_order: number; published_at: string | null }
const blankItem: EditorState = { title: "", slug: "", item_type: "note", category: "Notes", excerpt: "", body: "", cover_image_url: "", external_url: "", media_type: "none", media_url: "", published: false, featured: false, is_owned: false, sort_order: 0, published_at: null }

export function StudioDashboard() {
  const router = useRouter()
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [editor, setEditor] = useState<EditorState>(blankItem)
  const [userEmail, setUserEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState("")
  const [filter, setFilter] = useState("all")
  const loadItems = useCallback(async () => {
    const supabase = createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) { router.replace("/studio/login"); return }
    if (user.email?.toLowerCase() !== OWNER_EMAIL) { await supabase.auth.signOut(); router.replace("/studio/login"); return }
    setUserEmail(user.email)
    const { data: existing } = await supabase.from("portfolio_items").select("slug,item_type")
    if (existing) {
      const keys = new Set(existing.map((item) => item.item_type + ":" + item.slug))
      const projectSeeds = projects.filter((project) => !keys.has("project:" + project.id)).map((project, index) => ({
        title: project.title, slug: project.id, item_type: "project", category: project.category,
        excerpt: project.description, content: { body: project.description, year: project.year, images: project.images },
        cover_image_url: project.image, external_url: null, published: true, featured: index < 4,
        is_owned: true, sort_order: index, published_at: new Date(project.year + "-01-01T12:00:00Z").toISOString(),
      }))
      const writingSeeds = Object.values(blogPosts).filter((post) => !keys.has("writing:" + post.slug)).map((post, index) => ({
        title: post.title, slug: post.slug, item_type: "writing", category: "Writing",
        excerpt: post.content[0] ?? "", content: { body: post.content.join("\n\n"), legacy_date: post.date, legacy_read_time: post.readTime, audio_url: post.audioUrl ?? "" },
        cover_image_url: null, external_url: null, published: true, featured: false, is_owned: true, sort_order: index,
        published_at: Number.isNaN(new Date(post.date).getTime()) ? new Date().toISOString() : new Date(post.date).toISOString(),
      }))
      const seeds = [...projectSeeds, ...writingSeeds]
      if (seeds.length) {
        const { error: seedError } = await supabase.from("portfolio_items").insert(seeds)
        if (seedError) setNotice("Import existing content: " + seedError.message)
      }
    }
  }, [router])
  useEffect(() => { void loadItems() }, [loadItems])
  function editItem(item: PortfolioItem) {
    setEditor({ id: item.id, title: item.title, slug: item.slug, item_type: item.item_type, category: item.category, excerpt: item.excerpt ?? "", body: typeof item.content?.body === "string" ? item.content.body : "", cover_image_url: item.cover_image_url ?? "", external_url: item.external_url ?? "", media_type: ["audio", "gif", "video"].includes(String(item.content?.media_type)) ? item.content.media_type as "audio" | "gif" | "video" : "none", media_url: typeof item.content?.media_url === "string" ? item.content.media_url : "", published: item.published, featured: item.featured, is_owned: item.is_owned, sort_order: item.sort_order ?? 0, published_at: item.published_at ?? null })
    setNotice(""); window.scrollTo({ top: 0, behavior: "smooth" })
  }
  function update<K extends keyof EditorState>(key: K, value: EditorState[K]) { setEditor((current) => ({ ...current, [key]: value })) }
  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { setNotice("Choose an image under 10 MB."); return }
    setNotice("Uploading image…")
    const supabase = createClient()
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-")
    const path = `${Date.now()}-${safeName}`
    const { error } = await supabase.storage.from("portfolio-media").upload(path, file, { upsert: false })
    if (error) { setNotice(error.message); return }
    const { data } = supabase.storage.from("portfolio-media").getPublicUrl(path)
    update("cover_image_url", data.publicUrl); setNotice("Image uploaded.")
  }
  async function uploadMedia(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const allowed = file.type.startsWith("audio/") || file.type.startsWith("video/") || file.type === "image/gif"
    if (!allowed) { setNotice("Choose an audio file, video file, or GIF."); return }
    if (file.size > 50 * 1024 * 1024) { setNotice("Choose media under 50 MB."); return }
    setNotice("Uploading media…")
    const supabase = createClient()
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-")
    const path = `writing-media/${Date.now()}-${safeName}`
    const { error } = await supabase.storage.from("portfolio-media").upload(path, file, { upsert: false })
    if (error) { setNotice(error.message); return }
    const { data } = supabase.storage.from("portfolio-media").getPublicUrl(path)
    const mediaType = file.type.startsWith("audio/") ? "audio" : file.type.startsWith("video/") ? "video" : "gif"
    update("media_type", mediaType)
    update("media_url", data.publicUrl)
    setNotice("Media uploaded.")
  }
  async function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editor.title.trim()) { setNotice("Add a title first."); return }
    setSaving(true); setNotice("")
    const supabase = createClient()
    const existingContent = items.find((item) => item.id === editor.id)?.content ?? {}
    const payload = { title: editor.title.trim(), slug: slugify(editor.slug || editor.title), item_type: editor.item_type, category: editor.category.trim() || itemTypeLabels[editor.item_type] || "Life", excerpt: editor.excerpt.trim(), content: { ...existingContent, body: editor.body, ...(editor.media_type !== "none" && editor.media_url.trim() ? { media_type: editor.media_type, media_url: editor.media_url.trim() } : { media_type: undefined, media_url: undefined }) }, cover_image_url: editor.cover_image_url.trim() || null, external_url: editor.external_url.trim() || null, published: editor.published, featured: editor.featured, is_owned: editor.is_owned, sort_order: Number(editor.sort_order) || 0, published_at: editor.published ? (editor.published_at || new Date().toISOString()) : null }
    const query = editor.id ? supabase.from("portfolio_items").update(payload).eq("id", editor.id) : supabase.from("portfolio_items").insert(payload)
    const { error } = await query
    if (error) setNotice(error.message)
    else { setNotice(editor.published ? "Saved and published." : "Draft saved."); setEditor(blankItem); await loadItems() }
    setSaving(false)
  }
  async function deleteItem(item: PortfolioItem) {
    if (!window.confirm(`Delete “${item.title}” permanently?`)) return
    const supabase = createClient()
    const { error } = await supabase.from("portfolio_items").delete().eq("id", item.id)
    if (error) setNotice(error.message)
    else { setItems((current) => current.filter((entry) => entry.id !== item.id)); if (editor.id === item.id) setEditor(blankItem); setNotice("Item deleted.") }
  }
  async function signOut() { const supabase = createClient(); await supabase.auth.signOut(); router.replace("/studio/login"); router.refresh() }
  const visibleItems = items.filter((item) => filter === "all" || (filter === "published" ? item.published : filter === "drafts" ? !item.published : item.item_type === filter))
  if (loading) return <main className="mx-auto max-w-5xl px-6 py-24 text-sm text-muted-foreground">Opening your studio…</main>
  return <main className="mx-auto w-full max-w-5xl px-6 pb-24 pt-12 md:pt-16">
    <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex flex-wrap items-center gap-x-4 gap-y-2"><Link href="/life" className="text-xs text-muted-foreground hover:text-foreground">View public Life page <ArrowUpRight className="inline size-3" /></Link><Link href="/studio/pages" className="text-xs font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground">Open visual page builder ↗</Link></div><p className="mt-4 text-sm text-muted-foreground">Private workspace · {userEmail}</p><h1 className="mt-1 text-4xl font-medium tracking-[-0.05em]">Studio</h1><p className="mt-2 text-sm text-muted-foreground">Write once, publish when ready. Changes appear on the public Life page.</p></div><button onClick={signOut} className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-md border border-border px-3 text-sm hover:bg-accent sm:self-auto"><LogOut size={14} /> Sign out</button></header>
    <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
      <section><div className="flex items-center justify-between"><h2 className="text-lg font-medium">{editor.id ? "Edit item" : "New item"}</h2><button type="button" onClick={() => { setEditor(blankItem); setNotice("") }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><Plus size={14} /> New</button></div>
        <form onSubmit={saveItem} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-sm"><span>Title</span><input required value={editor.title} onChange={(e) => { update("title", e.target.value); if (!editor.id && !editor.slug) update("slug", slugify(e.target.value)) }} className="h-10 w-full rounded-md border border-input bg-background px-3" placeholder="A good thing I found" /></label><label className="space-y-1.5 text-sm"><span>URL slug</span><input value={editor.slug} onChange={(e) => update("slug", slugify(e.target.value))} className="h-10 w-full rounded-md border border-input bg-background px-3" placeholder="auto-from-title" /></label><label className="space-y-1.5 text-sm"><span>Type</span><select value={editor.item_type} onChange={(e) => update("item_type", e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3">{types.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="space-y-1.5 text-sm"><span>Section / category</span><input value={editor.category} onChange={(e) => update("category", e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3" placeholder="Recipes, Music, Tools…" /></label></div>
          <label className="block space-y-1.5 text-sm"><span>Short description</span><textarea rows={2} value={editor.excerpt} onChange={(e) => update("excerpt", e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2" placeholder="A sentence to introduce it." /></label>
          <label className="block space-y-1.5 text-sm"><span>Content / notes</span><textarea rows={8} value={editor.body} onChange={(e) => update("body", e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 leading-6" placeholder="Write freely. Line breaks are preserved." /></label>
          <div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-sm"><span>Cover image URL</span><input type="url" value={editor.cover_image_url} onChange={(e) => update("cover_image_url", e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3" placeholder="https://…" /></label><label className="space-y-1.5 text-sm"><span>External link</span><input type="url" value={editor.external_url} onChange={(e) => update("external_url", e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3" placeholder="https://…" /></label></div>
          <fieldset className="space-y-3 rounded-md border border-border p-4"><legend className="px-1 text-sm font-medium">Optional media</legend><p className="text-xs leading-5 text-muted-foreground">Add audio for a listenable writing, a GIF, or a video. Leave as “No media” when the entry has none.</p><div className="grid gap-3 sm:grid-cols-2"><label className="space-y-1.5 text-sm"><span>Media type</span><select value={editor.media_type} onChange={(e) => update("media_type", e.target.value as EditorState["media_type"])} className="h-10 w-full rounded-md border border-input bg-background px-3"><option value="none">No media</option><option value="audio">Audio player</option><option value="gif">GIF</option><option value="video">Video</option></select></label><label className="space-y-1.5 text-sm"><span>Media URL (optional)</span><input type="url" value={editor.media_url} onChange={(e) => update("media_url", e.target.value)} disabled={editor.media_type === "none"} className="h-10 w-full rounded-md border border-input bg-background px-3 disabled:opacity-50" placeholder="https://… or uploaded file" /></label></div><label className="flex cursor-pointer items-center gap-2 text-sm"><Upload size={14} /><span>Upload audio, GIF, or video (max 50 MB)</span><input type="file" accept="audio/*,video/*,image/gif" onChange={uploadMedia} className="sr-only" /></label>{editor.media_type !== "none" && editor.media_url && <p className="break-all text-xs text-muted-foreground">Attached {editor.media_type}: {editor.media_url}</p>}</fieldset>
          <label className="flex cursor-pointer items-center gap-2 text-sm"><Upload size={14} /><span>Upload cover image (max 10 MB)</span><input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={uploadImage} className="sr-only" /></label>{editor.cover_image_url && <img src={editor.cover_image_url} alt="Cover preview" className="max-h-40 rounded-md object-cover" />}
          <div className="grid gap-3 sm:grid-cols-2"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editor.published} onChange={(e) => update("published", e.target.checked)} /> Published</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editor.featured} onChange={(e) => update("featured", e.target.checked)} /> Featured</label>{editor.item_type === "wishlist" && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editor.is_owned} onChange={(e) => update("is_owned", e.target.checked)} /> I own this now (move to setup)</label>}<label className="flex items-center gap-2 text-sm"><span className="shrink-0">Sort order</span><input type="number" value={editor.sort_order} onChange={(e) => update("sort_order", Number(e.target.value))} className="h-9 w-24 rounded-md border border-input bg-background px-2" /></label></div>
          {notice && <p role="status" className="rounded-md border border-border px-3 py-3 text-sm leading-6 text-muted-foreground">{notice}</p>}
          <div className="flex flex-wrap gap-2"><button disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60"><Save size={14} /> {saving ? "Saving…" : "Save item"}</button>{editor.id && <button type="button" onClick={() => { setEditor(blankItem); setNotice("") }} className="h-10 rounded-md border border-border px-4 text-sm">Cancel edit</button>}</div>
        </form>
      </section>
      <section><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h2 className="text-lg font-medium">Your content <span className="text-sm font-normal text-muted-foreground">({items.length})</span></h2><select aria-label="Filter items" value={filter} onChange={(e) => setFilter(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm"><option value="all">Everything</option><option value="published">Published</option><option value="drafts">Drafts</option>{types.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></div>
        <div className="mt-4 divide-y divide-border border-y border-border">{visibleItems.map((item) => <article key={item.id} className="py-4"><div className="flex items-start justify-between gap-3"><button onClick={() => editItem(item)} className="text-left"><span className="block text-sm font-medium hover:underline">{item.title}</span><span className="mt-1 block text-xs text-muted-foreground">{item.category} · {item.published ? "Published" : "Draft"}{item.item_type === "wishlist" ? item.is_owned ? " · Owned" : " · Wishlist" : ""}</span></button><button onClick={() => void deleteItem(item)} aria-label={`Delete ${item.title}`} className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-destructive"><Trash2 size={14} /></button></div></article>)}{visibleItems.length === 0 && <p className="py-6 text-sm text-muted-foreground">Nothing here yet. Add your first item on the left.</p>}</div>
      </section>
    </div>
  </main>
}
