import Link from "next/link"

const links = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/efforts" },
  { label: "Writing", href: "/blog" },
  { label: "Life", href: "/life" },
]

export function SiteHeader() {
  return (
    <header className="mx-auto w-full max-w-3xl px-5 pt-6 sm:px-6 md:pt-8">
      <div className="flex items-center justify-between gap-5 border-b border-border pb-4">
        <Link href="/" className="shrink-0 text-sm font-medium tracking-[-0.025em] text-foreground transition-opacity hover:opacity-65">
          Aggieson
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-4 sm:gap-5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
