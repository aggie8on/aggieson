"use client"

import { useMemo, useState, type FormEvent } from "react"
import { ArrowDown, ArrowLeft, ArrowUp, ArrowUpRight, Lock, Plus, Save } from "lucide-react"
import { removeItem, saveItem, friendlyError, type PanelProps } from "@/components/studio/api"
import { DeleteButton, EmptyState, Field, GalleryField, ImageField, Notice, PanelHeader, StatusChip, StatusSwitch, Toggle, iconButton, inputClass, primaryButton, secondaryButton, textareaClass, type Message } from "@/components/studio/ui"
import { createClient } from "@/lib/supabase/client"
import { slugify, type PortfolioItem } from "@/lib/life-content"

type Draft = { id?: string; title: string; slug: string; slugTouched: boolean; year: string; category: string; description: string; cover: string; gallery: string[]; featured: boolean; incomplete: boolean; published: boolean; sortOrder: number; extra: Record<string, unknown> }

function toDraft(item: PortfolioItem): Draft {
  const { body: _body, year, images, incomplete, ...extra } = item.content
  void _body
  return {
    id: item.id, title: item.title, slug: item.slug, slugTouched: true,
    year: typeof year === "string" ? year : "", category: item.category ?? "", description: item.excerpt ?? "",
    cover: item.cover_image_url ?? "", gallery: Array.isArray(images) ? images.filter((image): image is string => typeof image === "string") : [],
    featured: item.featured, incomplete: incomplete === true, published: item.published, sortOrder: item.sort_order ?? 0, extra,
  }
}

export function ProjectPanel({ items, onChanged }: PanelProps) {
  const projects = useMemo(() => items.filter((item) => item.item_type === "project").sort((a, b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at)), [items])
  const categories = useMemo(() => [...new Set(projects.map((project) => project.category).filter(Boolean))], [projects])
  const [draft, setDraft] = useState<Draft | null>(null)
  const [message, setMessage] = useState<Message>(null)
  const [saving, setSaving] = useState(false)

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((current) => (current ? { ...current, [key]: value } : current))

  function blank(): Draft {
    return { title: "", slug: "", slugTouched: false, year: String(new Date().getFullYear()), category: "", description: "", cover: "", gallery: [], featured: false, incomplete: false, published: false, sortOrder: projects.length ? Math.max(...projects.map((project) => project.sort_order)) + 1 : 0, extra: {} }
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    if (!draft) return
    if (!draft.title.trim()) { setMessage({ tone: "error", text: "Add a project name first." }); return }
    if (!draft.cover && draft.gallery.length === 0 && draft.published) { setMessage({ tone: "error", text: "Add a cover image before publishing, so the project has something to show." }); return }
    setSaving(true); setMessage(null)
    const result = await saveItem({
      title: draft.title.trim(), slug: slugify(draft.slug || draft.title), item_type: "project",
      category: draft.category.trim() || "Project", excerpt: draft.description.trim(),
      content: { ...draft.extra, body: draft.description.trim(), year: draft.year.trim(), images: draft.gallery, incomplete: draft.incomplete },
      cover_image_url: draft.cover.trim() || null, external_url: null,
      published: draft.published, featured: draft.featured, is_owned: false, sort_order: draft.sortOrder,
      published_at: draft.published ? (items.find((item) => item.id === draft.id)?.published_at ?? new Date().toISOString()) : null,
    }, draft.id)
    setSaving(false)
    if (!result.ok) { setMessage({ tone: "error", text: result.error }); return }
    setDraft(toDraft(result.data))
    setMessage({ tone: "success", text: draft.published ? "Saved. This project is live." : "Draft saved. It isn't public yet." })
    await onChanged()
  }

  async function remove(item: PortfolioItem) {
    const result = await removeItem(item.id)
    if (!result.ok) { setMessage({ tone: "error", text: result.error }); return }
    if (draft?.id === item.id) setDraft(null)
    setMessage({ tone: "success", text: `“${item.title}” was deleted.` })
    await onChanged()
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= projects.length) return
    const reordered = [...projects]
    ;[reordered[index], reordered[target]] = [reordered[target], reordered[index]]
    const supabase = createClient()
    const results = await Promise.all(reordered.map((project, position) => project.sort_order === position ? null : supabase.from("portfolio_items").update({ sort_order: position }).eq("id", project.id).select("id")))
    const failed = results.find((result) => result && (result.error || !result.data?.length))
    if (failed) setMessage({ tone: "error", text: failed.error ? friendlyError(failed.error) : "The new order could not be saved. Sign out, sign back in and try again." })
    else setMessage(null)
    await onChanged()
  }

  if (draft) {
    return (
      <form onSubmit={save} className="space-y-6">
        <button type="button" onClick={() => { setDraft(null); setMessage(null) }} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={14} aria-hidden="true" /> All projects</button>
        <PanelHeader title={draft.id ? "Edit project" : "New project"} />
        <Field label="Project name" required><input value={draft.title} onChange={(event) => { set("title", event.target.value); if (!draft.slugTouched) set("slug", slugify(event.target.value)) }} className={inputClass} placeholder="Name of the project" /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Year"><input value={draft.year} onChange={(event) => set("year", event.target.value)} className={inputClass} placeholder="2026" inputMode="numeric" /></Field>
          <Field label="Category" hint="Pick an existing one or type a new one.">
            <input list="project-categories" value={draft.category} onChange={(event) => set("category", event.target.value)} className={inputClass} placeholder="Product Design" />
            <datalist id="project-categories">{categories.map((category) => <option key={category} value={category} />)}</datalist>
          </Field>
        </div>
        <Field label="Description" hint="One or two sentences. Shown in the list and at the top of the project."><textarea rows={3} value={draft.description} onChange={(event) => set("description", event.target.value)} className={textareaClass} /></Field>
        <ImageField label="Cover image" value={draft.cover} onChange={(url) => set("cover", url)} folder="projects" onError={(text) => setMessage({ tone: "error", text })} />
        <GalleryField images={draft.gallery} onChange={(images) => set("gallery", images)} folder="projects" onError={(text) => setMessage({ tone: "error", text })} />
        <Field label="Web address" hint={draft.id ? "Changing this breaks links people already have." : "Created from the name."}><input value={draft.slug} onChange={(event) => { set("slug", slugify(event.target.value)); set("slugTouched", true) }} className={inputClass} placeholder="auto-from-name" /></Field>
        <Toggle checked={draft.featured} onChange={(value) => set("featured", value)} label="Show on the homepage" hint="Featured projects appear in “Selected work”. Every published project is always on the Projects page." />
        <Toggle checked={draft.incomplete} onChange={(value) => set("incomplete", value)} label="Not complete yet" hint="Shows a padlock after the name and blurs the description. Opening it shows only the first image; the rest stays hidden behind a locked glass panel. The hidden text and images are never sent to visitors." />
        <StatusSwitch published={draft.published} onChange={(value) => set("published", value)} />
        <Notice message={message} />
        <div className="flex flex-wrap items-center gap-3">
          <button disabled={saving} className={primaryButton}><Save size={14} aria-hidden="true" /> {saving ? "Saving…" : draft.published ? "Save and publish" : "Save draft"}</button>
          {draft.id && draft.published && <a href={`/projects?project=${draft.slug}`} target="_blank" rel="noopener noreferrer" className={secondaryButton}>View live <ArrowUpRight size={14} aria-hidden="true" /></a>}
          {draft.id && <span className="ml-auto"><DeleteButton label={`Delete ${draft.title}`} onConfirm={async () => { const item = projects.find((entry) => entry.id === draft.id); if (item) await remove(item) }} /></span>}
        </div>
      </form>
    )
  }

  return (
    <div className="space-y-6">
      <PanelHeader title="Projects" count={projects.length} description="Your design work. Use the arrows to set the order on the site." action={<button type="button" onClick={() => { setDraft(blank()); setMessage(null) }} className={primaryButton}><Plus size={14} aria-hidden="true" /> New project</button>} />
      <Notice message={message} />
      {projects.length === 0 ? <EmptyState title="No projects yet">Add your first project.</EmptyState> : (
        <ul className="divide-y divide-border border-y border-border">
          {projects.map((project, index) => (
            <li key={project.id} className="flex items-center gap-3 py-3">
              <div className="flex shrink-0 flex-col">
                <button type="button" onClick={() => void move(index, -1)} disabled={index === 0} aria-label={`Move ${project.title} up`} className={iconButton}><ArrowUp size={14} aria-hidden="true" /></button>
                <button type="button" onClick={() => void move(index, 1)} disabled={index === projects.length - 1} aria-label={`Move ${project.title} down`} className={iconButton}><ArrowDown size={14} aria-hidden="true" /></button>
              </div>
              {project.cover_image_url ? <img src={project.cover_image_url} alt="" className="size-12 shrink-0 rounded object-cover" /> : <span className="size-12 shrink-0 rounded bg-muted" aria-hidden="true" />}
              <button type="button" onClick={() => { setDraft(toDraft(project)); setMessage(null) }} className="min-w-0 flex-1 text-left">
                <span className="flex items-center gap-1.5 truncate text-sm font-medium hover:underline">{project.title}{project.content.incomplete === true && <Lock size={12} strokeWidth={1.8} aria-label="Not complete" className="shrink-0 text-muted-foreground" />}</span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">{[typeof project.content.year === "string" ? project.content.year : "", project.category, project.featured ? "On homepage" : "", project.content.incomplete === true ? "Not complete" : ""].filter(Boolean).join(" · ")}</span>
              </button>
              <StatusChip published={project.published} />
              <DeleteButton compact label={`Delete ${project.title}`} onConfirm={() => remove(project)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
