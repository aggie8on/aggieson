"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Save } from "lucide-react"
import { friendlyError } from "@/components/studio/api"
import { IconsPanel } from "@/components/studio/icons-panel"
import { RichTextField } from "@/components/studio/rich-field"
import { Field, Notice, PanelHeader, inputClass, primaryButton, type Message } from "@/components/studio/ui"
import { createClient } from "@/lib/supabase/client"
import { defaultSitePages, normalizeSections, type SiteSection } from "@/lib/site-pages"

type PageSlug = "home" | "blog" | "projects" | "life"
const PAGES: { slug: PageSlug; label: string; hint: string }[] = [
  { slug: "home", label: "Homepage", hint: "Your name, role and introduction at the top of the site." },
  { slug: "blog", label: "Writing page", hint: "The heading and intro above your list of posts." },
  { slug: "projects", label: "Projects page", hint: "The heading and intro above your projects." },
  { slug: "life", label: "Life page", hint: "The heading and intro above your life entries." },
]

function introOf(sections: SiteSection[], slug: PageSlug): SiteSection {
  return sections.find((section) => section.type === "intro") ?? defaultSitePages[slug].sections.find((section) => section.type === "intro")!
}

function PageForm({ slug, label, hint, sections, onSaved }: { slug: PageSlug; label: string; hint: string; sections: SiteSection[]; onSaved: (sections: SiteSection[]) => void }) {
  const [intro, setIntro] = useState(() => introOf(sections, slug))
  const [message, setMessage] = useState<Message>(null)
  const [saving, setSaving] = useState(false)
  const update = (patch: Partial<SiteSection>) => setIntro((current) => ({ ...current, ...patch }))

  async function save(event: FormEvent) {
    event.preventDefault()
    setSaving(true); setMessage(null)
    const hasIntro = sections.some((section) => section.type === "intro")
    const next = hasIntro ? sections.map((section) => (section.type === "intro" && section.id === intro.id ? intro : section)) : [intro, ...sections]
    const supabase = createClient()
    const { data, error } = await supabase.from("site_pages").upsert({ slug, title: defaultSitePages[slug].title, sections: next, updated_at: new Date().toISOString() }, { onConflict: "slug" }).select("slug")
    setSaving(false)
    if (error) { setMessage({ tone: "error", text: friendlyError(error) }); return }
    if (!data?.length) { setMessage({ tone: "error", text: "Nothing was saved. Sign out, sign back in as the owner, and try again." }); return }
    onSaved(next)
    setMessage({ tone: "success", text: "Saved. The change is live." })
  }

  return (
    <form onSubmit={save} className="space-y-4 rounded-lg border border-border p-5">
      <div>
        <h3 className="text-base font-medium">{label}</h3>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      {slug !== "home" && <Field label="Small line above the heading"><input value={intro.eyebrow} onChange={(event) => update({ eyebrow: event.target.value })} className={inputClass} /></Field>}
      <div className={slug === "home" ? "grid gap-4 sm:grid-cols-2" : ""}>
        <Field label={slug === "home" ? "Name" : "Heading"}><input value={intro.title} onChange={(event) => update({ title: event.target.value })} className={inputClass} /></Field>
        {slug === "home" && <Field label="Role or title" hint="Shown under your name."><input value={intro.role ?? ""} onChange={(event) => update({ role: event.target.value })} className={inputClass} placeholder="Human designer" /></Field>}
      </div>
      <RichTextField label={slug === "home" ? "Introduction" : "Intro text"} hint={slug === "home" ? "The word “Toothless” links to toothless.design automatically, until you add your own links here." : undefined} value={intro.text} onChange={(text) => update({ text })} rows={4} />
      <RichTextField label="Second paragraph (optional)" value={intro.body} onChange={(body) => update({ body })} rows={3} />
      <Notice message={message} />
      <button disabled={saving} className={primaryButton}><Save size={14} aria-hidden="true" /> {saving ? "Saving…" : "Save changes"}</button>
    </form>
  )
}

export function SiteTextPanel() {
  const [pages, setPages] = useState<Record<PageSlug, SiteSection[]> | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false
    async function load() {
      const supabase = createClient()
      const { data, error: loadError } = await supabase.from("site_pages").select("slug,sections")
      if (cancelled) return
      if (loadError) { setError(friendlyError(loadError)); return }
      const next = Object.fromEntries(PAGES.map(({ slug }) => {
        const row = data?.find((entry) => entry.slug === slug)
        return [slug, row?.sections ? normalizeSections(row.sections, defaultSitePages[slug].sections) : defaultSitePages[slug].sections]
      })) as Record<PageSlug, SiteSection[]>
      setPages(next)
    }
    void load()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="space-y-6">
      <PanelHeader title="Site text" description="The words at the top of each page, and the icons you can use in any text. Posts, projects and life entries are edited in their own tabs." />
      <IconsPanel />
      {error && <Notice message={{ tone: "error", text: error }} />}
      {!pages && !error && <p className="text-sm text-muted-foreground">Loading…</p>}
      {pages && PAGES.map((page) => <PageForm key={page.slug} {...page} sections={pages[page.slug]} onSaved={(sections) => setPages((current) => (current ? { ...current, [page.slug]: sections } : current))} />)}
    </div>
  )
}
