/** Icons you add once in Studio and then drop into any text with {{icon:name}}. */
export type SiteIcon = { name: string; svg: string; url: string }
export type IconLibrary = Record<string, SiteIcon>

export function iconName(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "")
}

export function normalizeIcons(value: unknown): SiteIcon[] {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  const icons: SiteIcon[] = []
  for (const item of value) {
    if (!item || typeof item !== "object") continue
    const record = item as Record<string, unknown>
    const name = iconName(typeof record.name === "string" ? record.name : "")
    const svg = typeof record.svg === "string" ? record.svg.trim() : ""
    if (!name || !svg || seen.has(name)) continue
    seen.add(name)
    icons.push({ name, svg, url: typeof record.url === "string" ? record.url.trim() : "" })
  }
  return icons
}

export function toLibrary(list: SiteIcon[]): IconLibrary {
  return Object.fromEntries(list.map((icon) => [icon.name, icon]))
}

/** Text with links and icons removed, for previews and descriptions where markup would show up raw. */
export function plainText(value: string) {
  return value
    .replace(/\[([^\]]+)\]\((?:https?:\/\/|mailto:|\/)[^\s)]*\)/g, "$1")
    .replace(/\{\{icon(?::[a-z0-9-]+)?\}\}/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .trim()
}

export function usesRichText(value: string) {
  return /\]\(|\{\{icon/.test(value)
}
