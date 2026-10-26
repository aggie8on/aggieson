import Link from "next/link"
import { ArrowLeft } from "lucide-react"

/**
 * One consistent way back on every inner page: "← Aggieson" on top-level pages,
 * "← Aggieson / Writing" on detail pages, so there is always a path to Home and to the parent list.
 */
export function PageNav({ trail = [] }: { trail?: { label: string; href: string }[] }) {
  const linkClass = "text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground"
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
