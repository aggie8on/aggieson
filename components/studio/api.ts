import { createClient } from "@/lib/supabase/client"
import { ITEM_COLUMNS, type PortfolioItem } from "@/lib/life-content"

export type ItemPayload = {
  title: string
  slug: string
  item_type: string
  category: string
  excerpt: string
  content: Record<string, unknown>
  cover_image_url: string | null
  external_url: string | null
  published: boolean
  featured: boolean
  is_owned: boolean
  sort_order: number
  published_at: string | null
}

export type Outcome<T> = { ok: true; data: T } | { ok: false; error: string }

export function friendlyError(error: { message?: string; code?: string } | null | undefined) {
  if (!error) return "Something went wrong. Please try again."
  if (error.code === "23505") return "That URL is already used by another item. Change the URL slug and save again."
  if (error.code === "42501" || /row-level security|permission denied/i.test(error.message ?? "")) {
    return "The database refused this change. Sign out, sign back in as the owner, and try again."
  }
  return error.message || "Something went wrong. Please try again."
}

export async function loadAllItems(): Promise<Outcome<PortfolioItem[]>> {
  const supabase = createClient()
  const { data, error } = await supabase.from("portfolio_items").select(ITEM_COLUMNS).order("created_at", { ascending: false })
  if (error) return { ok: false, error: friendlyError(error) }
  return { ok: true, data: (data ?? []) as PortfolioItem[] }
}

export async function saveItem(payload: ItemPayload, id?: string): Promise<Outcome<PortfolioItem>> {
  const supabase = createClient()
  const query = id
    ? supabase.from("portfolio_items").update(payload).eq("id", id)
    : supabase.from("portfolio_items").insert(payload)
  const { data, error } = await query.select(ITEM_COLUMNS).maybeSingle()
  if (error) return { ok: false, error: friendlyError(error) }
  if (!data) return { ok: false, error: "The change was not saved. Sign out, sign back in as the owner, and try again." }
  return { ok: true, data: data as PortfolioItem }
}

/** Deletes one item and checks that a row was really removed, so a blocked delete never looks like a success. */
export async function removeItem(id: string): Promise<Outcome<true>> {
  const supabase = createClient()
  const { data, error } = await supabase.from("portfolio_items").delete().eq("id", id).select("id")
  if (error) return { ok: false, error: friendlyError(error) }
  if (!data || data.length === 0) return { ok: false, error: "Nothing was deleted. Your session may have expired. Sign out, sign back in and try again." }
  return { ok: true, data: true }
}

export type UploadKind = "image" | "audio" | "video" | "gif"

export async function uploadFile(file: File, folder: string, allow: UploadKind[]): Promise<Outcome<{ url: string; kind: UploadKind }>> {
  const isGif = file.type === "image/gif"
  const kind: UploadKind | null = isGif ? (allow.includes("gif") ? "gif" : allow.includes("image") ? "image" : null)
    : file.type.startsWith("image/") ? (allow.includes("image") ? "image" : null)
    : file.type.startsWith("audio/") ? (allow.includes("audio") ? "audio" : null)
    : file.type.startsWith("video/") ? (allow.includes("video") ? "video" : null)
    : null
  if (!kind) return { ok: false, error: `That file type isn't allowed here. Choose ${allow.map((entry) => (entry === "image" ? "an image" : entry === "gif" ? "a GIF" : `an ${entry === "audio" ? "audio" : "video"} file`)).join(" or ")}.` }
  const limitMb = kind === "image" || kind === "gif" ? 10 : 50
  if (file.size > limitMb * 1024 * 1024) return { ok: false, error: `Choose a file under ${limitMb} MB.` }

  const supabase = createClient()
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-")
  const path = `${folder}/${Date.now()}-${safeName}`
  const { error } = await supabase.storage.from("portfolio-media").upload(path, file, { upsert: false })
  if (error) return { ok: false, error: friendlyError(error) }
  const { data } = supabase.storage.from("portfolio-media").getPublicUrl(path)
  return { ok: true, data: { url: data.publicUrl, kind } }
}

export type PanelProps = {
  items: PortfolioItem[]
  /** Reloads items from the database after any change. */
  onChanged: () => Promise<void>
}
