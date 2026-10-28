"use client"

import { useId, useMemo, useRef, useState } from "react"
import { Link2, Smile } from "lucide-react"
import { InlineRichText } from "@/components/inline-rich-text"
import { useIcons } from "@/components/studio/icons-store"
import { iconButton, inputClass, secondaryButton, textareaClass } from "@/components/studio/ui"
import { toLibrary, usesRichText } from "@/lib/icons"

function cleanUrl(value: string) {
  const url = value.trim()
  if (!url) return ""
  if (/^(https?:\/\/|mailto:|\/)/i.test(url)) return url
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url)) return `mailto:${url}`
  return `https://${url}`
}

/**
 * A text box with a small toolbar: select text and press Link to make it a link,
 * or press Icon to drop one of your saved icons in at the cursor. Shows a preview when the text has either.
 */
export function RichTextField({ label, hint, value, onChange, rows = 4, placeholder, required }: {
  label: string
  hint?: string
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
  required?: boolean
}) {
  const id = useId()
  const ref = useRef<HTMLTextAreaElement>(null)
  const selection = useRef({ start: 0, end: 0 })
  const icons = useIcons()
  const library = useMemo(() => toLibrary(icons), [icons])
  const [linking, setLinking] = useState(false)
  const [url, setUrl] = useState("")
  const [linkError, setLinkError] = useState("")

  const remember = () => {
    const el = ref.current
    if (el) selection.current = { start: el.selectionStart, end: el.selectionEnd }
  }

  function splice(replacement: string, selectLength = 0, selectFrom = 0) {
    const { start, end } = selection.current
    onChange(value.slice(0, start) + replacement + value.slice(end))
    requestAnimationFrame(() => {
      const el = ref.current
      if (!el) return
      el.focus()
      const from = start + selectFrom
      el.setSelectionRange(from, from + selectLength)
      selection.current = { start: from, end: from + selectLength }
    })
  }

  function applyLink() {
    const target = cleanUrl(url)
    if (!target) { setLinkError("Paste a web address first."); return }
    const { start, end } = selection.current
    const selected = value.slice(start, end)
    const text = selected || "link text"
    splice(`[${text}](${target})`, text.length, 1)
    setLinking(false); setUrl(""); setLinkError("")
  }

  const used = [...value.matchAll(/\{\{icon:([a-z0-9-]+)(?:@\d+(?:\.\d+)?)?\}\}/g)].map((match) => match[1])
  const missing = [...new Set(used.filter((name) => !library[name]))]
  const showPreview = usesRichText(value)

  return (
    <div className="space-y-1.5 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className="font-medium">{label}{required && <span aria-hidden="true" className="text-destructive"> *</span>}</label>
        <div className="flex items-center gap-1" role="toolbar" aria-label={`${label} tools`}>
          <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => { remember(); setLinking((open) => !open); setLinkError("") }} aria-expanded={linking} className={`${iconButton} w-auto gap-1.5 px-2 text-xs`}>
            <Link2 size={14} aria-hidden="true" /> Link
          </button>
          <select
            aria-label="Insert an icon"
            value=""
            disabled={icons.length === 0}
            onMouseDown={remember}
            onChange={(event) => { if (event.target.value) splice(`{{icon:${event.target.value}}}`, 0, `{{icon:${event.target.value}}}`.length) }}
            className="h-8 rounded-md border border-transparent bg-transparent px-2 text-xs text-muted-foreground hover:bg-accent disabled:opacity-40"
            title={icons.length === 0 ? "Add icons in Site text first" : "Insert an icon"}
          >
            <option value="">{icons.length === 0 ? "No icons yet" : "Icon…"}</option>
            {icons.map((icon) => <option key={icon.name} value={icon.name}>{icon.name}</option>)}
          </select>
        </div>
      </div>

      {linking && (
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-border p-2">
          <input autoFocus type="text" value={url} onChange={(event) => { setUrl(event.target.value); setLinkError("") }} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); applyLink() } if (event.key === "Escape") setLinking(false) }} placeholder="Paste a web address, then press Enter" aria-label="Link address" className={`${inputClass} h-9 min-w-0 flex-1`} />
          <button type="button" onClick={applyLink} className={`${secondaryButton} h-9`}>Add link</button>
          <p className="w-full text-xs text-muted-foreground">{linkError || "Select some text first to link it. With nothing selected, a placeholder is added for you to rename."}</p>
        </div>
      )}

      <textarea id={id} ref={ref} rows={rows} value={value} placeholder={placeholder} required={required}
        onChange={(event) => { onChange(event.target.value); remember() }} onSelect={remember} onBlur={remember} onKeyUp={remember} onClick={remember}
        className={textareaClass} />

      {hint && <p className="text-xs leading-5 text-muted-foreground">{hint}</p>}
      {missing.length > 0 && <p role="alert" className="text-xs leading-5 text-destructive">No icon called {missing.map((name) => `“${name}”`).join(", ")}. Add it under Site text → Icons, or it won't show.</p>}
      {showPreview && (
        <div className="rounded-md border border-dashed border-border px-3 py-2">
          <p className="mb-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Preview</p>
          <p className="whitespace-pre-wrap text-sm leading-6"><InlineRichText icons={library}>{value}</InlineRichText></p>
        </div>
      )}
    </div>
  )
}
