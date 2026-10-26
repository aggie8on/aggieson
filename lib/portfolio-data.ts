import { createClient } from "@/lib/supabase/server"
import { blogPosts } from "@/lib/blog-data"
import { projects as staticProjects, type Project } from "@/lib/projects"
import { ITEM_COLUMNS, PUBLIC_LIFE_TYPES, formatDate, readingTime, type PortfolioItem } from "@/lib/life-content"
import { defaultSitePages, normalizeSections, type SiteSection } from "@/lib/site-pages"

/**
 * The database is the single source of truth. The built-in content in lib/blog-data.ts
 * and lib/projects.ts is only used when the database cannot be reached, so deleting
 * something in Studio really removes it from the site.
 */
export type Loaded<T> = { data: T; ok: boolean }

export type WritingPost = {
  slug: string
  title: string
  excerpt: string
  paragraphs: string[]
  readTime: string
  dateLong: string
  dateShort: string
  timestamp: number
  mediaType?: string
  mediaUrl?: string
}

export type SiteProject = Project & { featured: boolean }

function str(value: unknown) {
  return typeof value === "string" ? value : ""
}

function toWriting(row: PortfolioItem): WritingPost {
  const body = str(row.content?.body)
  const dateValue = row.published_at ?? row.created_at
  const legacyAudio = str(row.content?.audio_url)
  const mediaUrl = str(row.content?.media_url) || legacyAudio
  const mediaType = str(row.content?.media_type) || (legacyAudio ? "audio" : "")
  const paragraphs = body.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean)
  if (paragraphs.length === 0 && row.excerpt) paragraphs.push(row.excerpt)
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || paragraphs[0] || "",
    paragraphs,
    readTime: readingTime(body).label,
    dateLong: formatDate(dateValue, "long"),
    dateShort: formatDate(dateValue, "short"),
    timestamp: new Date(dateValue).getTime() || 0,
    mediaType: mediaType || undefined,
    mediaUrl: mediaUrl || undefined,
  }
}

function staticWriting(): WritingPost[] {
  return Object.values(blogPosts).map((post) => {
    const timestamp = new Date(post.date).getTime() || 0
    return {
      slug: post.slug,
      title: post.title,
      excerpt: post.content[0] ?? "",
      paragraphs: post.content,
      readTime: post.readTime,
      dateLong: post.date,
      dateShort: timestamp ? formatDate(new Date(timestamp).toISOString(), "short") : post.date,
      timestamp,
      mediaType: post.audioUrl ? "audio" : undefined,
      mediaUrl: post.audioUrl,
    }
  }).sort((a, b) => b.timestamp - a.timestamp)
}

export async function getWriting(): Promise<Loaded<WritingPost[]>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("portfolio_items").select(ITEM_COLUMNS)
      .eq("item_type", "writing").eq("published", true)
      .order("published_at", { ascending: false }).order("created_at", { ascending: false })
    if (error) throw error
    return { data: ((data ?? []) as PortfolioItem[]).map(toWriting), ok: true }
  } catch {
    return { data: staticWriting(), ok: false }
  }
}

function toProject(row: PortfolioItem): SiteProject {
  const gallery = Array.isArray(row.content?.images) ? row.content.images.filter((image): image is string => typeof image === "string" && image !== "") : []
  const cover = row.cover_image_url ?? ""
  return {
    id: row.slug,
    title: row.title,
    description: row.excerpt ?? "",
    year: str(row.content?.year),
    category: row.category || "Project",
    image: cover || gallery[0] || "",
    images: gallery.length ? gallery : cover ? [cover] : [],
    featured: row.featured,
  }
}

export async function getProjects(): Promise<Loaded<SiteProject[]>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("portfolio_items").select(ITEM_COLUMNS)
      .eq("item_type", "project").eq("published", true)
      .order("sort_order", { ascending: true }).order("created_at", { ascending: true })
    if (error) throw error
    return { data: ((data ?? []) as PortfolioItem[]).map(toProject), ok: true }
  } catch {
    return { data: staticProjects.map((project) => ({ ...project, featured: ["1", "2", "4", "5"].includes(project.id) })), ok: false }
  }
}

export async function getLifeItems(options: { limit?: number; featuredFirst?: boolean } = {}): Promise<Loaded<PortfolioItem[]>> {
  try {
    const supabase = await createClient()
    let query = supabase.from("portfolio_items").select(ITEM_COLUMNS)
      .in("item_type", PUBLIC_LIFE_TYPES).eq("published", true)
    if (options.featuredFirst) query = query.order("featured", { ascending: false })
    query = query.order("published_at", { ascending: false }).order("created_at", { ascending: false })
    if (options.limit) query = query.limit(options.limit)
    const { data, error } = await query
    if (error) throw error
    return { data: (data ?? []) as PortfolioItem[], ok: true }
  } catch {
    return { data: [], ok: false }
  }
}

export async function getLifeItem(slug: string): Promise<PortfolioItem | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from("portfolio_items").select(ITEM_COLUMNS)
      .eq("slug", slug).in("item_type", PUBLIC_LIFE_TYPES).eq("published", true).maybeSingle()
    return (data as PortfolioItem | null) ?? null
  } catch {
    return null
  }
}

export async function getSiteSections(slug: keyof typeof defaultSitePages): Promise<SiteSection[]> {
  const fallback = defaultSitePages[slug].sections
  try {
    const supabase = await createClient()
    const { data } = await supabase.from("site_pages").select("sections").eq("slug", slug).maybeSingle()
    return data?.sections ? normalizeSections(data.sections, fallback) : fallback
  } catch {
    return fallback
  }
}
