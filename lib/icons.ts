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

/** Greys, blacks and whites: colours that should follow the page's text colour rather than stay fixed. */
function isNeutralColor(value: string) {
  const color = value.trim().toLowerCase()
  if (/^(black|white|gr[ae]y|silver|gainsboro|whitesmoke|dimgr[ae]y|lightgr[ae]y|darkgr[ae]y)$/.test(color)) return true
  let channels: number[] | null = null
  const hex = color.match(/^#([0-9a-f]{3,8})$/)
  if (hex) {
    const digits = hex[1].length <= 4 ? hex[1].split("").map((char) => char + char).join("") : hex[1]
    channels = [0, 2, 4].map((start) => Number.parseInt(digits.slice(start, start + 2), 16))
  }
  const rgb = color.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/)
  if (rgb) channels = [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])]
  return Boolean(channels && channels.every(Number.isFinite) && Math.max(...channels) - Math.min(...channels) < 24)
}

/**
 * Makes an SVG follow light and dark mode. Logos exported from design tools often carry a fixed grey or black fill
 * (usually inside a <style> block), which then disappears on the other theme. Neutral colours become "currentColor",
 * so the icon takes the text colour; real brand colours are left alone. Run this on the raw SVG, before other clean-up.
 */
export function themeSvg(source: string) {
  const classColors: Record<string, Record<string, string>> = {}
  for (const block of source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) {
    for (const rule of block[1].matchAll(/([^{}]+)\{([^}]*)\}/g)) {
      const props: Record<string, string> = {}
      for (const prop of ["fill", "stroke"]) {
        const found = rule[2].match(new RegExp(`(?:^|;|\\s)${prop}\\s*:\\s*([^;]+)`, "i"))
        if (found) props[prop] = found[1].trim()
      }
      for (const selector of rule[1].matchAll(/\.([\w-]+)/g)) classColors[selector[1]] = { ...classColors[selector[1]], ...props }
    }
  }

  return source
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<(svg|g|path|circle|rect|line|polyline|polygon|ellipse)\b([^>]*?)(\/?)>/gi, (_tag, name: string, rawAttrs: string, close: string) => {
      const attrs: Record<string, string> = {}
      for (const attr of rawAttrs.matchAll(/([\w:.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) attrs[attr[1]] = attr[2] ?? attr[3] ?? ""
      for (const cls of (attrs.class ?? "").split(/\s+/).filter(Boolean)) {
        for (const [prop, value] of Object.entries(classColors[cls] ?? {})) if (attrs[prop] === undefined) attrs[prop] = value
      }
      if (attrs.style) {
        const kept: string[] = []
        for (const declaration of attrs.style.split(";").map((part) => part.trim()).filter(Boolean)) {
          const [prop, ...rest] = declaration.split(":")
          if (/^(fill|stroke)$/i.test(prop.trim())) attrs[prop.trim().toLowerCase()] = rest.join(":").trim()
          else kept.push(declaration)
        }
        if (kept.length) attrs.style = kept.join(";"); else delete attrs.style
      }
      for (const prop of ["fill", "stroke"]) if (attrs[prop] !== undefined && isNeutralColor(attrs[prop])) attrs[prop] = "currentColor"
      if (name.toLowerCase() === "svg" && attrs.fill === undefined) attrs.fill = "currentColor"
      const text = Object.entries(attrs).map(([key, value]) => ` ${key}="${value.replace(/"/g, "&quot;")}"`).join("")
      return `<${name}${text}${close}>`
    })
}
