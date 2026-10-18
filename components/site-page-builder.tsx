"use client"

import { ChangeEvent, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowDown, ArrowLeft, ArrowUp, Eye, EyeOff, ImagePlus, LayoutTemplate, Plus, Save, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { defaultSitePages, normalizeSections, type SitePage, type SiteSection, type SiteSectionType } from "@/lib/site-pages"
import { InlineRichText } from "@/components/inline-rich-text"

const pageChoices = [
  { slug: "home", label: "Homepage" },
  { slug: "projects", label: "Projects" },
  { slug: "blog", label: "Writing" },
  { slug: "life", label: "Life" },
]
const sectionChoices: { type: SiteSectionType; label: string }[] = [
  { type: "intro", label: "Introduction" },
  { type: "projects", label: "Projects list" },
  { type: "writing", label: "Writing list" },
  { type: "life", label: "Life list" },
  { type: "text", label: "Text section" },
  { type: "image", label: "Image section" },
  { type: "links", label: "Link section" },
]
const layouts: SiteSection["layout"][] = ["stack", "compact", "split", "wide"]

function makeSection(type: SiteSectionType): SiteSection {
  return {
    id: `${type}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    title: sectionChoices.find((entry) => entry.type === type)?.label ?? "New section",
    eyebrow: "",
    text: "",
    body: "",
    image: "",
    inlineIconSvg: "",
    inlineIconUrl: "",
    visible: true,
    layout: "stack",
  }
}

export function SitePageBuilder() {
  const [pageSlug, setPageSlug] = useState("home")
  const [pages, setPages] = useState<Record<string, SitePage>>(defaultSitePages)
  const [selectedId, setSelectedId] = useState("intro")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState("")
  const [draggedId, setDraggedId] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    async function load() {
      const supabase = createClient()
      const { data, error } = await supabase.from("site_pages").select("slug,title,sections")
      if (!active) return
      if (error) setNotice(`Using starter layouts for now: ${error.message}`)
      else if (data) {
        setPages((current) => {
          const next = { ...current }
          for (const row of data) {
            if (row.slug in defaultSitePages) {
              next[row.slug] = {
                slug: row.slug,
                title: typeof row.title === "string" ? row.title : defaultSitePages[row.slug].title,
                sections: normalizeSections(row.sections, defaultSitePages[row.slug].sections),
              }
            }
          }
          return next
        })
      }
      setLoading(false)
    }
    void load()
    return () => { active = false }
  }, [])

  const page = pages[pageSlug] ?? defaultSitePages.home
  const selected = page.sections.find((section) => section.id === selectedId) ?? page.sections[0]
  const visibleSections = page.sections.filter((section) => section.visible)

  function updatePage(updater: (current: SitePage) => SitePage) {
    setPages((current) => ({ ...current, [pageSlug]: updater(current[pageSlug] ?? defaultSitePages[pageSlug]) }))
  }
  function updateSection<K extends keyof SiteSection>(key: K, value: SiteSection[K]) {
    if (!selected) return
    updatePage((current) => ({ ...current, sections: current.sections.map((section) => section.id === selected.id ? { ...section, [key]: value } : section) }))
  }
  function addSection(type: SiteSectionType) {
    const section = makeSection(type)
    updatePage((current) => ({ ...current, sections: [...current.sections, section] }))
    setSelectedId(section.id)
    setNotice("")
  }
  function removeSection(id: string) {
    const next = page.sections.filter((section) => section.id !== id)
    updatePage((current) => ({ ...current, sections: next }))
    setSelectedId(next[0]?.id ?? "")
  }
  function moveSection(id: string, targetId: string) {
    if (id === targetId) return
    const next = [...page.sections]
    const from = next.findIndex((section) => section.id === id)
    const to = next.findIndex((section) => section.id === targetId)
    if (from < 0 || to < 0) return
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    updatePage((current) => ({ ...current, sections: next }))
  }
  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file || !selected) return
    if (file.size > 10 * 1024 * 1024) { setNotice("Choose an image under 10 MB."); return }
    setNotice("Uploading image…")
    const supabase = createClient()
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-")
    const path = `page-builder/${Date.now()}-${safeName}`
    const { error } = await supabase.storage.from("portfolio-media").upload(path, file, { upsert: false })
    if (error) { setNotice(error.message); return }
    const { data } = supabase.storage.from("portfolio-media").getPublicUrl(path)
    updateSection("image", data.publicUrl)
    setNotice("Image uploaded.")
  }
  async function savePage() {
    setSaving(true)
    setNotice("")
    const supabase = createClient()
    const payload = { slug: page.slug, title: page.title, sections: page.sections, updated_at: new Date().toISOString() }
    const { error } = await supabase.from("site_pages").upsert(payload, { onConflict: "slug" })
    setNotice(error ? `Couldn't save: ${error.message}` : "Page layout saved. Refresh the public page to see your changes.")
    setSaving(false)
  }

  const previewTitle = useMemo(() => page.title || pageChoices.find((choice) => choice.slug === pageSlug)?.label || "Page", [page.title, pageSlug])

  if (loading) return <main className="mx-auto max-w-6xl px-6 py-24 text-sm text-muted-foreground">Opening visual page builder…</main>

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-6 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <Link href="/studio" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft size={13} /> Back to Studio</Link>
          <div className="mt-3 flex items-center gap-2"><LayoutTemplate size={18} /><h1 className="text-2xl font-medium tracking-[-0.04em]">Visual page builder</h1></div>
          <p className="mt-1 text-sm text-muted-foreground">Arrange sections, edit copy and images, and preview the page before saving.</p>
        </div>
        <button type="button" onClick={() => void savePage()} disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60"><Save size={15} />{saving ? "Saving…" : "Save page"}</button>
      </header>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {pageChoices.map((choice) => <button key={choice.slug} type="button" onClick={() => { setPageSlug(choice.slug); setSelectedId((pages[choice.slug] ?? defaultSitePages[choice.slug]).sections[0]?.id ?? ""); setNotice("") }} className={`rounded-full border px-3 py-2 text-sm transition-colors ${pageSlug === choice.slug ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"}`}>{choice.label}</button>)}
        <span className="ml-auto text-xs text-muted-foreground">Drag sections to reorder · changes stay in draft until saved</span>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)_320px]">
        <aside className="rounded-xl border border-border p-3">
          <div className="flex items-center justify-between px-1 py-2"><h2 className="text-sm font-medium">Page sections</h2><span className="text-xs text-muted-foreground">{page.sections.length}</span></div>
          <div className="mt-2 space-y-1">
            {page.sections.map((section, index) => (
              <div key={section.id} draggable onDragStart={() => setDraggedId(section.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (draggedId) moveSection(draggedId, section.id); setDraggedId(null) }} onDragEnd={() => setDraggedId(null)} className={`group flex items-center gap-1 rounded-lg border p-2 ${selected?.id === section.id ? "border-foreground/40 bg-accent" : "border-transparent hover:border-border"} ${draggedId === section.id ? "opacity-40" : ""}`}>
                <span aria-hidden="true" className="cursor-grab px-1 text-muted-foreground">⠿</span>
                <button type="button" onClick={() => setSelectedId(section.id)} className="min-w-0 flex-1 text-left"><span className="block truncate text-sm">{section.title || sectionChoices.find((entry) => entry.type === section.type)?.label}</span><span className="block text-xs text-muted-foreground">{section.type}{section.visible ? "" : " · hidden"}</span></button>
                <button type="button" aria-label={index === 0 ? "Already first" : "Move section up"} disabled={index === 0} onClick={() => moveSection(section.id, page.sections[index - 1].id)} className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-25"><ArrowUp size={13} /></button>
                <button type="button" aria-label={index === page.sections.length - 1 ? "Already last" : "Move section down"} disabled={index === page.sections.length - 1} onClick={() => moveSection(page.sections[index + 1].id, section.id)} className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-25"><ArrowDown size={13} /></button>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-border pt-3"><p className="mb-2 px-1 text-xs font-medium text-muted-foreground">Add a section</p><div className="grid grid-cols-2 gap-2">{sectionChoices.map((choice) => <button key={choice.type} type="button" onClick={() => addSection(choice.type)} className="inline-flex min-h-9 items-center justify-start gap-1 rounded-md border border-border px-2 text-xs hover:bg-accent"><Plus size={12} />{choice.label}</button>)}</div></div>
        </aside>

        <section className="min-w-0 rounded-xl border border-border bg-muted/20 p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3"><div><p className="text-xs text-muted-foreground">Live preview</p><h2 className="mt-1 text-lg font-medium">{previewTitle}</h2></div><span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Eye size={13} /> Preview canvas</span></div>
          <div className="mx-auto min-h-[560px] max-w-2xl rounded-lg border border-border bg-background px-5 py-8 sm:px-8">
            <div className="space-y-10">
              {visibleSections.map((section) => <article key={section.id} onClick={() => setSelectedId(section.id)} className={`cursor-pointer rounded-md transition-shadow ${selected?.id === section.id ? "ring-1 ring-foreground/30 ring-offset-4 ring-offset-background" : "hover:ring-1 hover:ring-border hover:ring-offset-4 hover:ring-offset-background"} ${section.layout === "compact" ? "space-y-1" : section.layout === "wide" ? "space-y-5" : "space-y-3"}`}>
                {section.eyebrow && <p className="text-xs text-muted-foreground">{section.eyebrow}</p>}
                {section.title && <h3 className={`font-medium tracking-[-0.04em] ${section.type === "intro" ? "text-3xl sm:text-4xl" : "text-sm text-muted-foreground"}`}>{section.title}</h3>}
                {section.text && <p className="max-w-xl whitespace-pre-wrap text-sm leading-6 text-muted-foreground"><InlineRichText inlineIconSvg={section.inlineIconSvg} inlineIconUrl={section.inlineIconUrl}>{section.text}</InlineRichText></p>}
                {section.body && <p className="max-w-xl whitespace-pre-wrap text-sm leading-6 text-muted-foreground"><InlineRichText inlineIconSvg={section.inlineIconSvg} inlineIconUrl={section.inlineIconUrl}>{section.body}</InlineRichText></p>}
                {section.image && <img src={section.image} alt={section.title || "Section preview"} className={`rounded-lg object-cover ${section.layout === "wide" ? "w-full" : "max-h-64 max-w-full"}`} />}
                {["projects", "writing", "life"].includes(section.type) && <div className="space-y-2 border-y border-border py-3">{(section.type === "projects" ? ["Project title", "Another project"] : section.type === "writing" ? ["A note on making things", "Things I am learning"] : ["A recipe worth keeping", "A good thing I found"]).map((label) => <div key={label} className="flex items-baseline justify-between gap-3 text-sm"><span>{label}</span><span className="text-xs text-muted-foreground">Preview</span></div>)}</div>}
              </article>)}
              {visibleSections.length === 0 && <p className="py-16 text-center text-sm text-muted-foreground">All sections are hidden. Add a section or make one visible.</p>}
            </div>
          </div>
        </section>

        <aside className="rounded-xl border border-border p-4">
          <h2 className="text-sm font-medium">Section settings</h2>
          {selected ? (
            <div className="mt-4 space-y-4">
              <label className="block space-y-1.5 text-sm"><span>Section type</span><select value={selected.type} onChange={(event) => updateSection("type", event.target.value as SiteSectionType)} className="h-10 w-full rounded-md border border-input bg-background px-3">{sectionChoices.map((choice) => <option key={choice.type} value={choice.type}>{choice.label}</option>)}</select></label>
              <label className="block space-y-1.5 text-sm"><span>Heading</span><input value={selected.title} onChange={(event) => updateSection("title", event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3" placeholder="Section heading" /></label>
              <label className="block space-y-1.5 text-sm"><span>Eyebrow / small label</span><input value={selected.eyebrow} onChange={(event) => updateSection("eyebrow", event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3" placeholder="Optional label" /></label>
              <label className="block space-y-1.5 text-sm"><span>Text</span><textarea rows={4} value={selected.text} onChange={(event) => updateSection("text", event.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-6" placeholder="Main copy, description, or intro." /></label>
              <label className="block space-y-1.5 text-sm"><span>Additional text / URL</span><textarea rows={3} value={selected.body} onChange={(event) => updateSection("body", event.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-6" placeholder="Additional copy or a URL for link sections." /></label>
              <label className="block space-y-1.5 text-sm"><span>Image URL</span><input value={selected.image} onChange={(event) => updateSection("image", event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3" placeholder="https://…" /></label>
              <label className="block space-y-1.5 text-sm"><span>Inline SVG icon</span><textarea rows={5} value={selected.inlineIconSvg ?? ""} onChange={(event) => updateSection("inlineIconSvg", event.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-xs" placeholder="Paste SVG markup here" /></label>
              <label className="block space-y-1.5 text-sm"><span>Icon link URL (optional)</span><input value={selected.inlineIconUrl ?? ""} onChange={(event) => updateSection("inlineIconUrl", event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3" placeholder="https://example.com" /></label>
              <p className="text-xs leading-5 text-muted-foreground">Type <code>{"{{icon}}"}</code> in Text or Additional text to place the icon inline. Add links as <code>[link text](https://example.com)</code>.</p>
              <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-accent"><ImagePlus size={15} /><span>Upload image</span><input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={uploadImage} className="sr-only" /></label>
              {selected.image && <img src={selected.image} alt="Selected section preview" className="max-h-36 w-full rounded-md object-cover" />}
              <label className="block space-y-1.5 text-sm"><span>Layout</span><select value={selected.layout} onChange={(event) => updateSection("layout", event.target.value as SiteSection["layout"])} className="h-10 w-full rounded-md border border-input bg-background px-3">{layouts.map((layout) => <option key={layout} value={layout}>{layout[0].toUpperCase() + layout.slice(1)}</option>)}</select></label>
              <button type="button" onClick={() => updateSection("visible", !selected.visible)} className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-border text-sm hover:bg-accent">{selected.visible ? <EyeOff size={14} /> : <Eye size={14} />}{selected.visible ? "Hide section" : "Show section"}</button>
              <button type="button" onClick={() => removeSection(selected.id)} className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-destructive/30 text-sm text-destructive hover:bg-destructive/5"><Trash2 size={14} />Remove section</button>
            </div>
          ) : <p className="mt-4 text-sm text-muted-foreground">Select a section on the left or add a new one.</p>}
          {notice && <p role="status" className="mt-4 rounded-md border border-border p-3 text-xs leading-5 text-muted-foreground">{notice}</p>}
        </aside>
      </div>
    </main>
  )
}
