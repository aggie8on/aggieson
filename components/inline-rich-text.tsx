import type { ReactNode } from "react"

function safeSvg(source: string) {
  if (!source || !/<svg[\s>]/i.test(source)) return ""
  return source
    .replace(/<\s*(script|foreignObject|iframe|object|embed)[\s\S]*?<\/\s*\1\s*>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(?:href|xlink:href)\s*=\s*("[^"]*"|'[^']*')/gi, "")
    .replace(/url\s*\([^)]*\)/gi, "none")
    .replace(/<\/?(?!svg\b|g\b|path\b|circle\b|rect\b|line\b|polyline\b|polygon\b|ellipse\b|defs\b|linearGradient\b|radialGradient\b|stop\b|title\b|desc\b)[a-z][^>]*>/gi, "")
}

export function InlineRichText({ children, inlineIconSvg = "", inlineIconUrl = "" }: {
  children: string
  inlineIconSvg?: string
  inlineIconUrl?: string
}) {
  const svg = safeSvg(inlineIconSvg)
  const pieces: ReactNode[] = []
  const pattern = /(\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)|\{\{icon\}\})/g
  let last = 0
  let match: RegExpExecArray | null
  let key = 0
  while ((match = pattern.exec(children)) !== null) {
    if (match.index > last) pieces.push(children.slice(last, match.index))
    if (match[0] === "{{icon}}") {
      if (svg) {
        const icon = <span key={key++} className="mx-1 inline-flex size-[1em] translate-y-[0.12em] items-center justify-center align-baseline [&>svg]:size-full" dangerouslySetInnerHTML={{ __html: svg }} />
        pieces.push(inlineIconUrl ? <a key={key++} href={inlineIconUrl} target="_blank" rel="noopener noreferrer" aria-label="Inline icon link" className="inline-flex items-center">{icon}</a> : icon)
      }
    } else {
      const label = match[2]
      const url = match[3]
      pieces.push(<a key={key++} href={url} target={url.startsWith("mailto:") ? undefined : "_blank"} rel={url.startsWith("mailto:") ? undefined : "noopener noreferrer"} className="text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground">{label}</a>)
    }
    last = pattern.lastIndex
  }
  if (last < children.length) pieces.push(children.slice(last))
  return <>{pieces}</>
}
