import type { ReactNode } from "react"
import type { IconLibrary } from "@/lib/icons"

export function safeSvg(source: string) {
  if (!source || !/<svg[\s>]/i.test(source)) return ""
  return source
    .replace(/<\s*(script|foreignObject|iframe|object|embed)[\s\S]*?<\/\s*\1\s*>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(?:href|xlink:href)\s*=\s*("[^"]*"|'[^']*')/gi, "")
    .replace(/url\s*\([^)]*\)/gi, "none")
    .replace(/<\/?(?!svg\b|g\b|path\b|circle\b|rect\b|line\b|polyline\b|polygon\b|ellipse\b|defs\b|linearGradient\b|radialGradient\b|stop\b|title\b|desc\b)[a-z][^>]*>/gi, "")
}

// [text](link), {{icon:name}}, and the older {{icon}}.
const TOKEN = /\[([^\]]+)\]\(((?:https?:\/\/|mailto:|\/)[^\s)]*)\)|\{\{icon(?::([a-z0-9-]+))?\}\}/g

/**
 * Turns [text](link) into links and {{icon:name}} into inline icons.
 * An icon can sit inside a link label, e.g. [{{icon:x}} Follow me](https://x.com/you), and then the whole label is the link.
 */
export function InlineRichText({ children, icons = {}, inlineIconSvg = "", inlineIconUrl = "" }: {
  children: string
  icons?: IconLibrary
  inlineIconSvg?: string
  inlineIconUrl?: string
}) {
  let key = 0

  function renderIcon(name: string | undefined, insideLink: boolean): ReactNode {
    const entry = name ? icons[name] : icons["icon"]
    const svg = safeSvg(entry?.svg ?? (name ? "" : inlineIconSvg))
    if (!svg) return null
    const url = entry?.url || (name ? "" : inlineIconUrl)
    const label = entry?.name ?? "icon"
    const glyph = <span key={key++} aria-hidden="true" className="mx-0.5 inline-flex size-[1em] translate-y-[0.12em] items-center justify-center align-baseline [&>svg]:size-full" dangerouslySetInnerHTML={{ __html: svg }} />
    if (insideLink || !url) return glyph
    return <a key={key++} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className="inline-flex items-center text-foreground transition-opacity hover:opacity-70">{glyph}</a>
  }

  function render(text: string, insideLink: boolean): ReactNode[] {
    const pieces: ReactNode[] = []
    const pattern = new RegExp(TOKEN.source, "g")
    let last = 0
    let match: RegExpExecArray | null
    while ((match = pattern.exec(text)) !== null) {
      if (match.index > last) pieces.push(text.slice(last, match.index))
      if (match[1] !== undefined) {
        const url = match[2]
        const external = /^https?:/.test(url)
        pieces.push(
          <a key={key++} href={url} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground">
            {render(match[1], true)}
          </a>,
        )
      } else {
        pieces.push(renderIcon(match[3], insideLink))
      }
      last = pattern.lastIndex
    }
    if (last < text.length) pieces.push(text.slice(last))
    return pieces
  }

  return <>{render(children, false)}</>
}
