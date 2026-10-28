"use client"

import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { Copy, Plus, Save, Trash2, Upload } from "lucide-react"
import { friendlyError } from "@/components/studio/api"
import { loadIcons, setIconCache } from "@/components/studio/icons-store"
import { Field, Notice, inputClass, primaryButton, secondaryButton, textareaClass, iconButton, type Message } from "@/components/studio/ui"
import { InlineRichText, safeSvg } from "@/components/inline-rich-text"
import { ICON_SIZE_MAX, ICON_SIZE_MIN, clampIconSize, iconName, type SiteIcon } from "@/lib/icons"
import { createClient } from "@/lib/supabase/client"

function Glyph({ svg, size = 20 }: { svg: string; size?: number }) {
  const clean = safeSvg(svg)
  return <span aria-hidden="true" style={{ width: size, height: size }} className="inline-flex shrink-0 items-center justify-center rounded border border-border bg-background p-1 [&>svg]:size-full" dangerouslySetInnerHTML={{ __html: clean || "" }} />
}

/** Slider plus number box for how big an icon is, shown against a line of sample text so the result is obvious. */
function SizeControl({ icon, onChange }: { icon: SiteIcon; onChange: (size: number) => void }) {
  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium">Size</span>
      <div className="flex flex-wrap items-center gap-3">
        <input type="range" min={ICON_SIZE_MIN} max={ICON_SIZE_MAX} step={0.05} value={icon.size} onChange={(event) => onChange(clampIconSize(event.target.value, icon.size))} aria-label={`Size of icon ${icon.name || "preview"}`} className="h-2 min-w-40 flex-1 accent-foreground" />
        <span className="inline-flex items-center gap-1.5">
          <input type="number" min={ICON_SIZE_MIN} max={ICON_SIZE_MAX} step={0.1} value={icon.size} onChange={(event) => onChange(clampIconSize(event.target.value, icon.size))} aria-label="Icon size as a multiple of the text size" className={`${inputClass} h-9 w-20`} />
          <span className="text-xs text-muted-foreground">× text size</span>
        </span>
      </div>
      <p className="rounded-md border border-dashed border-border px-3 py-2 text-sm leading-6">
        <InlineRichText icons={{ preview: { ...icon, name: "preview", url: "" } }}>{"Follow me {{icon:preview}} on this line of text"}</InlineRichText>
      </p>
      <p className="text-xs leading-5 text-muted-foreground">1 is as tall as the words next to it. For one-off sizes, write <code className="rounded bg-muted px-1">{"{{icon:" + (icon.name || "name") + "@2}}"}</code> in any text.</p>
    </div>
  )
}

export function IconsPanel() {
  const [icons, setIcons] = useState<SiteIcon[]>([])
  const [loaded, setLoaded] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<Message>(null)
  const [draft, setDraft] = useState({ name: "", svg: "", url: "", size: 1.5 })
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { void loadIcons(true).then((list) => { setIcons(list); setLoaded(true) }) }, [])

  function change(next: SiteIcon[]) { setIcons(next); setDirty(true); setMessage(null) }

  async function readFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    if (file.size > 200 * 1024) { setMessage({ tone: "error", text: "That SVG is over 200 KB. Use a simpler icon." }); return }
    const text = await file.text()
    setDraft((current) => ({ ...current, svg: text, name: current.name || iconName(file.name.replace(/\.svg$/i, "")) }))
  }

  function add() {
    const name = iconName(draft.name)
    if (!name) { setMessage({ tone: "error", text: "Give the icon a short name, like “x” or “arrow”." }); return }
    if (icons.some((icon) => icon.name === name)) { setMessage({ tone: "error", text: `There is already an icon called “${name}”.` }); return }
    if (!safeSvg(draft.svg)) { setMessage({ tone: "error", text: "Paste the SVG code (it starts with <svg …>) or choose an .svg file." }); return }
    change([...icons, { name, svg: draft.svg.trim(), url: draft.url.trim(), size: clampIconSize(draft.size, 1.5) }])
    setDraft({ name: "", svg: "", url: "", size: 1.5 })
  }

  async function save() {
    setSaving(true); setMessage(null)
    const supabase = createClient()
    const { data, error } = await supabase.from("site_pages").upsert({ slug: "icons", title: "Icons", sections: icons, updated_at: new Date().toISOString() }, { onConflict: "slug" }).select("slug")
    setSaving(false)
    if (error) { setMessage({ tone: "error", text: friendlyError(error) }); return }
    if (!data?.length) { setMessage({ tone: "error", text: "Nothing was saved. Sign out, sign back in as the owner, and try again." }); return }
    setIconCache(icons); setDirty(false)
    setMessage({ tone: "success", text: "Icons saved. You can now use them in any text." })
  }

  return (
    <section className="space-y-5 rounded-lg border border-border p-5" aria-labelledby="icons-heading">
      <div>
        <h3 id="icons-heading" className="text-base font-medium">Icons</h3>
        <p className="text-xs leading-5 text-muted-foreground">Add an icon once, then drop it into any text: site text, writing, or life entries. Use the <strong>Icon</strong> menu above a text box, or type <code className="rounded bg-muted px-1">{"{{icon:name}}"}</code>. To make text or an icon a link, select it and press <strong>Link</strong>, or write <code className="rounded bg-muted px-1">[text](https://…)</code>. An icon inside link text becomes part of that link.</p>
      </div>

      {!loaded ? <p className="text-sm text-muted-foreground">Loading…</p> : icons.length === 0 ? (
        <p className="rounded-md border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">No icons yet. Add your first one below.</p>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {icons.map((icon, index) => (
            <li key={icon.name} className="space-y-3 py-3">
              <div className="flex items-center gap-3">
                <Glyph svg={icon.svg} size={32} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{icon.name}</p>
                  <button type="button" onClick={() => void navigator.clipboard?.writeText(`{{icon:${icon.name}}}`)} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><Copy size={11} aria-hidden="true" /> {`{{icon:${icon.name}}}`}</button>
                </div>
                <button type="button" onClick={() => change(icons.filter((_, position) => position !== index))} aria-label={`Remove icon ${icon.name}`} className={`${iconButton} hover:text-destructive`}><Trash2 size={14} aria-hidden="true" /></button>
              </div>
              <Field label="Link (optional)" hint="Where the icon goes when clicked, when it stands on its own.">
                <input type="url" value={icon.url} onChange={(event) => change(icons.map((entry, position) => (position === index ? { ...entry, url: event.target.value } : entry)))} placeholder="https://…" className={inputClass} />
              </Field>
              <SizeControl icon={icon} onChange={(size) => change(icons.map((entry, position) => (position === index ? { ...entry, size } : entry)))} />
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-3 rounded-md bg-accent/30 p-4">
        <p className="text-sm font-medium">Add an icon</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name" hint="Letters, numbers and dashes."><input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className={inputClass} placeholder="x" /></Field>
          <Field label="Link (optional)"><input type="url" value={draft.url} onChange={(event) => setDraft({ ...draft, url: event.target.value })} className={inputClass} placeholder="https://x.com/you" /></Field>
        </div>
        <Field label="SVG code" hint="Paste the code, or choose a file. Icons that use fill=&quot;currentColor&quot; follow the text colour and work in dark mode.">
          <textarea rows={4} value={draft.svg} onChange={(event) => setDraft({ ...draft, svg: event.target.value })} className={`${textareaClass} font-mono text-xs`} placeholder='<svg viewBox="0 0 24 24">…</svg>' />
        </Field>
        {safeSvg(draft.svg) && <SizeControl icon={{ name: draft.name, svg: draft.svg, url: "", size: draft.size }} onChange={(size) => setDraft((current) => ({ ...current, size }))} />}
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => fileRef.current?.click()} className={secondaryButton}><Upload size={14} aria-hidden="true" /> Choose .svg file</button>
          <input ref={fileRef} type="file" accept=".svg,image/svg+xml" onChange={readFile} className="sr-only" tabIndex={-1} />
          <button type="button" onClick={add} className={secondaryButton}><Plus size={14} aria-hidden="true" /> Add icon</button>
          {safeSvg(draft.svg) && <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">Preview <Glyph svg={draft.svg} size={28} /></span>}
        </div>
      </div>

      <Notice message={message} />
      <button type="button" disabled={saving || !dirty} onClick={() => void save()} className={primaryButton}><Save size={14} aria-hidden="true" /> {saving ? "Saving…" : dirty ? "Save icons" : "Saved"}</button>
    </section>
  )
}
