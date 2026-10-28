/**
 * Icons you add once in Studio and then drop into any text with {{icon:name}}.
 * `size` is a multiple of the surrounding text size (1 = as tall as the text). A single use can override it: {{icon:name@2}}.
 */
export type SiteIcon = { name: string; svg: string; url: string; size: number }
export type IconLibrary = Record<string, SiteIcon>

export const ICON_SIZE_MIN = 0.5
export const ICON_SIZE_MAX = 6
export const ICON_SIZE_DEFAULT = 1

export function clampIconSize(value: unknown, fallback = ICON_SIZE_DEFAULT) {
  const number = typeof value === "number" ? value : typeof value === "string" ? Number.parseFloat(value) : Number.NaN
  if (!Number.isFinite(number)) return fallback
  return Math.min(ICON_SIZE_MAX, Math.max(ICON_SIZE_MIN, Math.round(number * 100) / 100))
}

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
    icons.push({ name, svg, url: typeof record.url === "string" ? record.url.trim() : "", size: clampIconSize(record.size) })
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
    .replace(/\{\{icon(?::[a-z0-9-]+(?:@\d+(?:\.\d+)?)?)?\}\}/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .trim()
}

export function usesRichText(value: string) {
  return /\]\(|\{\{icon/.test(value)
}
