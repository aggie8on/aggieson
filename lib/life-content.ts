export type PortfolioItem = {
  id: string
  title: string
  slug: string
  item_type: string
  category: string
  excerpt: string
  content: { body?: string; [key: string]: unknown }
  cover_image_url: string | null
  external_url: string | null
  published: boolean
  featured: boolean
  is_owned: boolean
  sort_order: number
  published_at: string | null
  created_at: string
}

export const itemTypeLabels: Record<string, string> = {
  writing: "Writing",
  recipe: "Recipes",
  music: "Music",
  desk: "Desk setup",
  wishlist: "Wishlist",
  bookmark: "Bookmarks",
  gem: "Hidden gems",
  "life-log": "Life log",
  note: "Notes",
  custom: "Custom",
}

export function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}
