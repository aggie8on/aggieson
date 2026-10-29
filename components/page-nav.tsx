import Link from "next/link"
import { ArrowLeft } from "lucide-react"

/**
 * One consistent way back on every inner page: "← Aggieson" on top-level pages,
 * "← Aggieson / Writing" on detail pages, so there is always a path to Home and to the parent list.
 */
export function PageNav({ trail = [], showHome = true }: { trail?: { label: string; href: string }[]; showHome?: boolean }) {
  const linkClass = "-my-2 py-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground"
  // Without the Home link, show a single "back" link to the parent list.
  if (!showHome && trail.length > 0) {
    const parent = trail[trail.length - 1]
    return (
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link href={parent.href} className={`inline-flex items-center gap-1.5 text-sm ${linkClass}`}>
          <ArrowLeft size={14} aria-hidden="true" /> {parent.label}
        </Link>
      </nav>
    )
  }
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <li>
          <Link href="/" className={`inline-flex items-center gap-1.5 ${linkClass}`}>
            <ArrowLeft size={14} aria-hidden="true" /> Aggieson
          </Link>
        </li>
        {trail.map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-2">
            <span aria-hidden="true" className="text-muted-foreground/50">/</span>
            <Link href={crumb.href} className={linkClass}>{crumb.label}</Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}
