import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="mx-auto max-w-4xl px-6 py-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>©</span>
            <span>People, Places & Moments 2025</span>
          </div>

          <Link
            href="https://x.com/aggie8on"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Follow X
          </Link>
        </div>
      </div>
    </footer>
  )
}
