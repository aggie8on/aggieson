"use client"

import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react"
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Trash2, Upload, X } from "lucide-react"
import { uploadFile, type UploadKind } from "@/components/studio/api"

export const inputClass = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50"
export const textareaClass = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 outline-none transition-shadow placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring/40"
export const primaryButton = "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-60"
export const secondaryButton = "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-4 text-sm transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-60"
export const iconButton = "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-30"

export function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="font-medium">{label}{required && <span aria-hidden="true" className="text-destructive"> *</span>}</span>
      {children}
      {hint && <span className="block text-xs leading-5 text-muted-foreground">{hint}</span>}
    </label>
  )
}

export type Tone = "info" | "success" | "error"
export type Message = { tone: Tone; text: string } | null

export function Notice({ message }: { message: Message }) {
  if (!message) return <div aria-live="polite" />
  const tone = message.tone === "error" ? "border-destructive/40 text-destructive" : message.tone === "success" ? "border-border text-foreground" : "border-border text-muted-foreground"
  return <p role={message.tone === "error" ? "alert" : "status"} aria-live="polite" className={`rounded-md border px-3 py-2.5 text-sm leading-6 ${tone}`}>{message.text}</p>
}

export function StatusChip({ published }: { published: boolean }) {
  return <span className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[11px] ${published ? "border-border text-foreground" : "border-dashed border-border text-muted-foreground"}`}>{published ? "Published" : "Draft"}</span>
}

export function StatusSwitch({ published, onChange }: { published: boolean; onChange: (published: boolean) => void }) {
  const base = "h-9 flex-1 px-4 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring/40"
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium">Status</span>
      <div role="group" aria-label="Status" className="inline-flex overflow-hidden rounded-md border border-border">
        <button type="button" aria-pressed={!published} onClick={() => onChange(false)} className={`${base} ${!published ? "bg-accent font-medium" : "text-muted-foreground hover:bg-accent/50"}`}>Draft</button>
        <button type="button" aria-pressed={published} onClick={() => onChange(true)} className={`${base} border-l border-border ${published ? "bg-accent font-medium" : "text-muted-foreground hover:bg-accent/50"}`}>Published</button>
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">{published ? "Visible on the public site once saved." : "Hidden from the public site until you publish."}</p>
    </div>
  )
}

export function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (checked: boolean) => void; label: string; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-1 size-4 accent-foreground" />
      <span><span className="font-medium">{label}</span>{hint && <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{hint}</span>}</span>
    </label>
  )
}

/** Two-step delete: the first click arms it, the second confirms. Never relies on browser dialogs. */
export function DeleteButton({ onConfirm, label, compact }: { onConfirm: () => Promise<void>; label: string; compact?: boolean }) {
  const [armed, setArmed] = useState(false)
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    if (!armed) return
    const timer = window.setTimeout(() => setArmed(false), 6000)
    return () => window.clearTimeout(timer)
  }, [armed])

  if (busy) return <span className="inline-flex items-center gap-1.5 px-2 text-xs text-muted-foreground"><Loader2 size={13} className="animate-spin" aria-hidden="true" /> Deleting…</span>
  if (!armed) {
    return compact
      ? <button type="button" onClick={() => setArmed(true)} aria-label={label} className={`${iconButton} hover:text-destructive`}><Trash2 size={14} aria-hidden="true" /></button>
      : <button type="button" onClick={() => setArmed(true)} className={`${secondaryButton} text-destructive hover:text-destructive`}><Trash2 size={14} aria-hidden="true" /> Delete</button>
  }
  return (
    <span className="inline-flex items-center gap-2 text-xs">
      <span className="text-muted-foreground">Delete permanently?</span>
      <button type="button" onClick={async () => { setBusy(true); await onConfirm(); setBusy(false); setArmed(false) }} className="rounded-md bg-destructive px-2.5 py-1.5 font-medium text-white focus-visible:ring-2 focus-visible:ring-ring/40">Yes, delete</button>
      <button type="button" onClick={() => setArmed(false)} className="rounded-md border border-border px-2.5 py-1.5 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/40">Keep</button>
    </span>
  )
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-border px-6 py-10 text-center">
      <p className="text-sm font-medium">{title}</p>
      {children && <div className="mt-1 text-sm text-muted-foreground">{children}</div>}
    </div>
  )
}

export function PanelHeader({ title, count, description, action }: { title: string; count?: number; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-xl font-medium tracking-[-0.03em]">{title}{count !== undefined && <span className="ml-2 text-sm font-normal text-muted-foreground">{count}</span>}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
}

/** Photo field: upload a file or paste a link, with a preview and a remove button. */
export function ImageField({ label, value, onChange, folder, onError, hint }: { label: string; value: string; onChange: (url: string) => void; folder: string; onError: (message: string) => void; hint?: string }) {
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  async function handle(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    setBusy(true)
    const result = await uploadFile(file, folder, ["image", "gif"])
    setBusy(false)
    if (!result.ok) onError(result.error); else onChange(result.data.url)
  }
  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium">{label}</span>
      {value ? (
        <div className="relative w-fit">
          <img src={value} alt="Preview" className="max-h-44 rounded-md border border-border object-cover" />
          <button type="button" onClick={() => onChange("")} aria-label={`Remove ${label.toLowerCase()}`} className="absolute -right-2 -top-2 inline-flex size-6 items-center justify-center rounded-full border border-border bg-background shadow-sm hover:bg-accent"><X size={12} aria-hidden="true" /></button>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className={secondaryButton}>
          {busy ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <ImagePlus size={14} aria-hidden="true" />} {busy ? "Uploading…" : value ? "Replace image" : "Upload image"}
        </button>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={handle} className="sr-only" tabIndex={-1} />
        <span className="text-xs text-muted-foreground">or</span>
        <input type="url" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Paste an image link" aria-label={`${label} link`} className={`${inputClass} max-w-xs`} />
      </div>
      <p className="text-xs text-muted-foreground">{hint ?? "JPG, PNG, WebP, GIF or AVIF, up to 10 MB."}</p>
    </div>
  )
}

/** Audio, video or GIF attachment. */
export function MediaField({ label, hint, type, url, onChange, folder, onError, allow }: { label: string; hint?: string; type: string; url: string; onChange: (type: string, url: string) => void; folder: string; onError: (message: string) => void; allow: UploadKind[] }) {
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const accept = [allow.includes("audio") ? "audio/*" : "", allow.includes("video") ? "video/*" : "", allow.includes("gif") ? "image/gif" : ""].filter(Boolean).join(",")
  async function handle(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    setBusy(true)
    const result = await uploadFile(file, folder, allow)
    setBusy(false)
    if (!result.ok) onError(result.error); else onChange(result.data.kind === "image" ? "gif" : result.data.kind, result.data.url)
  }
  return (
    <fieldset className="space-y-3 rounded-md border border-border p-4">
      <legend className="px-1 text-sm font-medium">{label}</legend>
      {hint && <p className="text-xs leading-5 text-muted-foreground">{hint}</p>}
      {url ? (
        <div className="flex items-center justify-between gap-3 rounded-md bg-accent/50 px-3 py-2 text-sm">
          <span className="min-w-0 truncate"><span className="font-medium capitalize">{type === "gif" ? "GIF" : type}</span> attached <span className="text-muted-foreground">· {url.split("/").pop()}</span></span>
          <button type="button" onClick={() => onChange("none", "")} className="shrink-0 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">Remove</button>
        </div>
      ) : null}
      <button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className={secondaryButton}>
        {busy ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <Upload size={14} aria-hidden="true" />} {busy ? "Uploading…" : url ? "Replace file" : "Upload file"}
      </button>
      <input ref={inputRef} type="file" accept={accept} onChange={handle} className="sr-only" tabIndex={-1} />
      <p className="text-xs text-muted-foreground">Up to 50 MB for audio or video, 10 MB for a GIF.</p>
    </fieldset>
  )
}

/** Ordered list of images: upload several, reorder, remove. */
export function GalleryField({ images, onChange, folder, onError, label = "Gallery images", hint = "Shown in order when someone opens the project. If empty, the cover image is used.", coverNote }: { images: string[]; onChange: (images: string[]) => void; folder: string; onError: (message: string) => void; label?: string; hint?: string; coverNote?: string }) {
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState("")
  const [link, setLink] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  async function handle(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ""
    if (files.length === 0) return
    setBusy(true)
    const added: string[] = []
    for (const [position, file] of files.entries()) {
      setProgress(files.length > 1 ? `Uploading ${position + 1} of ${files.length}…` : "")
      const result = await uploadFile(file, folder, ["image", "gif"])
      if (!result.ok) onError(`${file.name}: ${result.error}`); else added.push(result.data.url)
    }
    setBusy(false); setProgress("")
    if (added.length) onChange([...images, ...added])
  }
  function move(index: number, direction: -1 | 1) {
    const next = [...images]
    const target = index + direction
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }
  return (
    <div className="space-y-3">
      <div>
        <span className="block text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">{hint}</span>
      </div>
      {images.length > 0 && (
        <ul className="space-y-2">
          {images.map((image, index) => (
            <li key={`${image}-${index}`} className="flex items-center gap-3 rounded-md border border-border p-2">
              <img src={image} alt={`Gallery image ${index + 1}`} className="size-14 shrink-0 rounded object-cover" />
              <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{index === 0 && coverNote ? <strong className="mr-1.5 font-medium text-foreground">{coverNote}</strong> : null}{image.split("/").pop()}</span>
              <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move image ${index + 1} up`} className={iconButton}><ArrowUp size={14} aria-hidden="true" /></button>
              <button type="button" onClick={() => move(index, 1)} disabled={index === images.length - 1} aria-label={`Move image ${index + 1} down`} className={iconButton}><ArrowDown size={14} aria-hidden="true" /></button>
              <button type="button" onClick={() => onChange(images.filter((_, position) => position !== index))} aria-label={`Remove image ${index + 1}`} className={`${iconButton} hover:text-destructive`}><X size={14} aria-hidden="true" /></button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className={secondaryButton}>
          {busy ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <ImagePlus size={14} aria-hidden="true" />} {busy ? progress || "Uploading…" : "Upload images"}
        </button>
        <input ref={inputRef} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={handle} className="sr-only" tabIndex={-1} />
        <input type="url" value={link} onChange={(event) => setLink(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); if (link.trim()) { onChange([...images, link.trim()]); setLink("") } } }} placeholder="Paste a link, press Enter" aria-label="Add gallery image by link" className={`${inputClass} max-w-xs`} />
      </div>
    </div>
  )
}
