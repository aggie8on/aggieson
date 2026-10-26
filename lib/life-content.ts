export type PortfolioItem = {
  id: string
  title: string
  slug: string
  item_type: string
  category: string
  excerpt: string
  content: { body?: string; meta?: Record<string, string>; [key: string]: unknown }
  cover_image_url: string | null
  external_url: string | null
  published: boolean
  featured: boolean
  is_owned: boolean
  sort_order: number
  published_at: string | null
  created_at: string
  updated_at?: string
}

export const ITEM_COLUMNS =
  "id,title,slug,item_type,category,excerpt,content,cover_image_url,external_url,published,featured,is_owned,sort_order,published_at,created_at,updated_at"

export type LifeKind = "recipe" | "music" | "desk" | "wishlist" | "bookmark" | "gem" | "life-log" | "note"

export type MetaField = {
  key: string
  label: string
  placeholder?: string
  /** Rendered as a bullet list; entered one per line. */
  list?: boolean
}

export type LifeKindConfig = {
  key: LifeKind
  /** Singular name, e.g. "Recipe". */
  label: string
  /** Heading used to group entries on the public Life page. */
  plural: string
  /** One-line explanation shown when choosing what to add. */
  blurb: string
  titleLabel: string
  titlePlaceholder: string
  summaryLabel: string
  summaryPlaceholder: string
  meta: MetaField[]
  bodyLabel: string
  bodyPlaceholder: string
  /** Show the body under its own heading on the public page. */
  bodyHeading?: boolean
  /** Label for the photo upload. Omit when this kind has no photo. */
  imageLabel?: string
  /** Label for the link field. Omit when this kind has no link. */
  linkLabel?: string
  linkRequired?: boolean
  /** Allows an audio clip, GIF or video attachment. */
  media?: boolean
  /** Shows a date picker, stored as the entry's date. */
  dateLabel?: string
  /** Wishlist only: lets the owner mark that they now own the item. */
  ownable?: boolean
}

export const LIFE_KINDS: LifeKindConfig[] = [
  {
    key: "recipe", label: "Recipe", plural: "Recipes", blurb: "Something worth cooking again.",
    titleLabel: "Recipe name", titlePlaceholder: "Peanut stew with greens",
    summaryLabel: "Short description", summaryPlaceholder: "Rich, quick, and better the next day.",
    meta: [
      { key: "time", label: "Time", placeholder: "45 min" },
      { key: "serves", label: "Serves", placeholder: "4" },
      { key: "ingredients", label: "Ingredients", placeholder: "One per line", list: true },
    ],
    bodyLabel: "Method", bodyPlaceholder: "Write the steps. Leave a blank line between steps.", bodyHeading: true,
    imageLabel: "Photo of the dish", linkLabel: "Original recipe link (optional)",
  },
  {
    key: "music", label: "Music", plural: "Music", blurb: "A song, album or playlist on repeat.",
    titleLabel: "Title", titlePlaceholder: "Song, album or playlist name",
    summaryLabel: "Why it's on repeat", summaryPlaceholder: "One line on how it feels.",
    meta: [
      { key: "artist", label: "Artist", placeholder: "Who made it" },
      { key: "format", label: "Type", placeholder: "Song, album or playlist" },
    ],
    bodyLabel: "Notes (optional)", bodyPlaceholder: "Anything more you want to say about it.",
    imageLabel: "Cover art", linkLabel: "Listen link", linkRequired: true, media: true,
  },
  {
    key: "desk", label: "Desk setup", plural: "My setup", blurb: "Something I use every day.",
    titleLabel: "Item name", titlePlaceholder: "Keychron K3 keyboard",
    summaryLabel: "What it does for me", summaryPlaceholder: "Why it earns its place on the desk.",
    meta: [
      { key: "brand", label: "Brand or maker", placeholder: "Who makes it" },
      { key: "price", label: "Price (optional)", placeholder: "$99" },
    ],
    bodyLabel: "Details and notes", bodyPlaceholder: "How you use it, what you'd change.",
    imageLabel: "Photo", linkLabel: "Product link (optional)",
  },
  {
    key: "wishlist", label: "Wishlist", plural: "Wishlist", blurb: "Something I'd like to get.",
    titleLabel: "Item name", titlePlaceholder: "What you want",
    summaryLabel: "Why I want it", summaryPlaceholder: "One line.",
    meta: [
      { key: "brand", label: "Brand or maker", placeholder: "Who makes it" },
      { key: "price", label: "Approx. price", placeholder: "$250" },
    ],
    bodyLabel: "Notes (optional)", bodyPlaceholder: "Models you're comparing, where to buy.",
    imageLabel: "Photo", linkLabel: "Where to buy (optional)", ownable: true,
  },
  {
    key: "bookmark", label: "Bookmark", plural: "Bookmarks", blurb: "A link worth keeping.",
    titleLabel: "Title", titlePlaceholder: "Name of the page or article",
    summaryLabel: "Why it's worth saving", summaryPlaceholder: "One line.",
    meta: [{ key: "source", label: "Source", placeholder: "Site or author" }],
    bodyLabel: "Notes (optional)", bodyPlaceholder: "A takeaway or favourite quote of your own.",
    linkLabel: "Link", linkRequired: true,
  },
  {
    key: "gem", label: "Hidden gem", plural: "Hidden gems", blurb: "A place or find worth sharing.",
    titleLabel: "Place or find", titlePlaceholder: "Name of the place",
    summaryLabel: "In a line", summaryPlaceholder: "What makes it special.",
    meta: [{ key: "where", label: "Where", placeholder: "Town, neighbourhood or address" }],
    bodyLabel: "Why it's worth finding", bodyPlaceholder: "What to order, when to go, how to get there.",
    imageLabel: "Photo", linkLabel: "Map or website link (optional)",
  },
  {
    key: "life-log", label: "Life log", plural: "Life log", blurb: "A moment worth remembering.",
    titleLabel: "Title", titlePlaceholder: "A short title for the day",
    summaryLabel: "One-line summary", summaryPlaceholder: "What happened.",
    meta: [],
    bodyLabel: "Entry", bodyPlaceholder: "Write freely.",
    imageLabel: "Photo (optional)", media: true, dateLabel: "Date",
  },
  {
    key: "note", label: "Note", plural: "Notes", blurb: "A small thought that doesn't fit elsewhere.",
    titleLabel: "Title", titlePlaceholder: "Title",
    summaryLabel: "Short description", summaryPlaceholder: "One line.",
    meta: [],
    bodyLabel: "Note", bodyPlaceholder: "Write freely.",
    imageLabel: "Photo (optional)", linkLabel: "Link (optional)",
  },
]

export const LIFE_TYPES: string[] = LIFE_KINDS.map((kind) => kind.key)
// "custom" can still exist in older data, so it keeps appearing on the public page.
export const PUBLIC_LIFE_TYPES: string[] = [...LIFE_TYPES, "custom"]

export function isLifeType(type: string) {
  return PUBLIC_LIFE_TYPES.includes(type)
}

export function getKind(type: string): LifeKindConfig {
  return LIFE_KINDS.find((kind) => kind.key === type) ?? { ...LIFE_KINDS[LIFE_KINDS.length - 1], key: "note", label: "Note", plural: "Notes" }
}

/** Wishlist items marked as owned move into the "My setup" group. */
export function effectiveKind(item: Pick<PortfolioItem, "item_type" | "is_owned">): LifeKindConfig {
  return item.item_type === "wishlist" && item.is_owned ? getKind("desk") : getKind(item.item_type)
}

export function readMeta(item: Pick<PortfolioItem, "content">): Record<string, string> {
  const meta = item.content?.meta
  if (!meta || typeof meta !== "object") return {}
  return Object.fromEntries(Object.entries(meta).filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].trim() !== ""))
}

export const itemTypeLabels: Record<string, string> = {
  writing: "Writing",
  project: "Projects",
  ...Object.fromEntries(LIFE_KINDS.map((kind) => [kind.key, kind.label])),
  custom: "Custom",
}

export function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

export function formatDate(value: string | null | undefined, style: "long" | "short" = "long") {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleDateString("en-US", { month: style === "long" ? "long" : "short", day: "numeric", year: "numeric", timeZone: "UTC" })
}

export function readingTime(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  return { words, label: `${Math.max(1, Math.ceil(words / 200))} min read` }
}
