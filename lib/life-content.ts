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

export type LifeKind = "bookmark" | "recipe" | "gem" | "desk" | "music" | "photo" | "note"
/** Bookmarks are shown as round linked tiles. The Life log holds music, photos and notes. */
export type LifeGroup = "bookmarks" | "lifelog"

export type MetaField = {
  key: string
  label: string
  placeholder?: string
  /** Entered one per line and shown as a bullet list. */
  list?: boolean
}

export type LifeKindConfig = {
  key: LifeKind
  group: LifeGroup
  /** Singular name, e.g. "Recipe". */
  label: string
  /** Heading used where entries of this kind are grouped. */
  plural: string
  /** One-line explanation shown when choosing what to add. */
  blurb: string
  titleLabel: string
  titlePlaceholder: string
  /** The title can be left blank and is filled in automatically. */
  titleOptional?: boolean
  summaryLabel?: string
  summaryPlaceholder?: string
  meta: MetaField[]
  bodyLabel?: string
  bodyPlaceholder?: string
  bodyRequired?: boolean
  /** Show the body under its own heading on the public page. */
  bodyHeading?: boolean
  imageLabel?: string
  imageHint?: string
  imageRequired?: boolean
  linkLabel?: string
  linkRequired?: boolean
  linkHint?: string
  /** What the link is expected to be, so Studio can preview it. */
  linkKind?: "spotify" | "any"
  dateLabel?: string
  /** Gadgets only: marks that the owner has it. */
  ownable?: boolean
  /** Notes only: pinned notes sit first. */
  pinnable?: boolean
}

export const LIFE_KINDS: LifeKindConfig[] = [
  {
    key: "bookmark", group: "bookmarks", label: "Link", plural: "Links", blurb: "A page, article or post worth keeping. Paste an X post to save it as a card.",
    titleLabel: "Name", titlePlaceholder: "Filled in from the link if you leave it blank", titleOptional: true,
    summaryLabel: "Why it's worth keeping", summaryPlaceholder: "One line (optional).",
    meta: [],
    imageLabel: "Tile image (optional)", imageHint: "Leave empty to use the site's own icon.",
    linkLabel: "Link", linkRequired: true, linkKind: "any", linkHint: "Paste any link. Links to X posts are saved as a preview card.",
  },
  {
    key: "recipe", group: "bookmarks", label: "Recipe", plural: "Recipes", blurb: "Something worth cooking again.",
    titleLabel: "Recipe name", titlePlaceholder: "Peanut stew with greens",
    summaryLabel: "Short description", summaryPlaceholder: "Rich, quick, and better the next day.",
    meta: [
      { key: "time", label: "Time", placeholder: "45 min" },
      { key: "serves", label: "Serves", placeholder: "4" },
      { key: "ingredients", label: "Ingredients", placeholder: "One per line", list: true },
    ],
    bodyLabel: "Method", bodyPlaceholder: "Write the steps. Leave a blank line between steps.", bodyHeading: true,
    imageLabel: "Photo of the dish", imageHint: "Shown as the round tile.",
    linkLabel: "Original recipe link (optional)",
  },
  {
    key: "gem", group: "bookmarks", label: "Hidden gem", plural: "Hidden gems", blurb: "A place or find worth sharing.",
    titleLabel: "Place or find", titlePlaceholder: "Name of the place",
    summaryLabel: "In a line", summaryPlaceholder: "What makes it special.",
    meta: [{ key: "where", label: "Where", placeholder: "Town, neighbourhood or address" }],
    bodyLabel: "Why it's worth finding", bodyPlaceholder: "What to order, when to go, how to get there.",
    imageLabel: "Photo", imageHint: "Shown as the round tile.",
    linkLabel: "Map or website link (optional)",
  },
  {
    key: "desk", group: "bookmarks", label: "Gadget", plural: "Gadgets", blurb: "A tool or gadget I use, or want.",
    titleLabel: "Gadget name", titlePlaceholder: "Keychron K3 keyboard",
    summaryLabel: "What it does for me", summaryPlaceholder: "Why it earns its place.",
    meta: [
      { key: "brand", label: "Brand or maker", placeholder: "Who makes it" },
      { key: "price", label: "Price (optional)", placeholder: "$99" },
    ],
    bodyLabel: "Details and notes", bodyPlaceholder: "How you use it, what you'd change.",
    imageLabel: "Photo", imageHint: "Shown as the round tile.",
    linkLabel: "Product link (optional)", ownable: true,
  },
  {
    key: "music", group: "lifelog", label: "Music", plural: "Music", blurb: "A playlist, album or song. Paste a Spotify link for a player.",
    titleLabel: "Title", titlePlaceholder: "Filled in from Spotify if you leave it blank", titleOptional: true,
    summaryLabel: "Why it's on repeat", summaryPlaceholder: "One line (optional).",
    meta: [],
    linkLabel: "Spotify link", linkRequired: true, linkKind: "spotify", linkHint: "Playlist, album, track, artist or podcast link from Spotify.",
  },
  {
    key: "photo", group: "lifelog", label: "Photo", plural: "Photos", blurb: "A picture from your day.",
    titleLabel: "Caption", titlePlaceholder: "Optional", titleOptional: true,
    meta: [{ key: "where", label: "Where", placeholder: "Optional" }],
    imageLabel: "Photo", imageRequired: true, dateLabel: "Date taken",
  },
  {
    key: "note", group: "lifelog", label: "Note", plural: "Notes", blurb: "A small thought, pinned to the page.",
    titleLabel: "Title (optional)", titlePlaceholder: "Optional", titleOptional: true,
    meta: [],
    bodyLabel: "Note", bodyPlaceholder: "Write freely.", bodyRequired: true, pinnable: true,
  },
]

/** Older entries saved with removed kinds still show up, as the closest current kind. */
const LEGACY_KIND: Record<string, LifeKind> = { wishlist: "desk", "life-log": "note", custom: "note" }

export const LIFE_TYPES: string[] = LIFE_KINDS.map((kind) => kind.key)
export const PUBLIC_LIFE_TYPES: string[] = [...LIFE_TYPES, ...Object.keys(LEGACY_KIND)]

export function isLifeType(type: string) {
  return PUBLIC_LIFE_TYPES.includes(type)
}

export function getKind(type: string): LifeKindConfig {
  const key = (LEGACY_KIND[type] ?? type) as LifeKind
  return LIFE_KINDS.find((kind) => kind.key === key) ?? LIFE_KINDS[LIFE_KINDS.length - 1]
}

export function groupOf(item: Pick<PortfolioItem, "item_type">): LifeGroup {
  return getKind(item.item_type).group
}

/** Kept so existing callers keep working. */
export function effectiveKind(item: Pick<PortfolioItem, "item_type">): LifeKindConfig {
  return getKind(item.item_type)
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
}

export function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

/** Returns a slug that no other item uses, adding a short suffix when needed. */
export function uniqueSlug(base: string, taken: Iterable<{ id: string; slug: string }>, selfId?: string) {
  const used = new Set([...taken].filter((item) => item.id !== selfId).map((item) => item.slug))
  const root = slugify(base) || "entry"
  if (!used.has(root)) return root
  let candidate = root
  while (used.has(candidate)) candidate = `${root}-${Math.random().toString(36).slice(2, 6)}`
  return candidate
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
