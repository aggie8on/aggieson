import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto flex max-w-2xl flex-col gap-3 px-6 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>© Aggieson · People, Places & Moments</span>
        <Link
          href="https://x.com/aggie8on"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-1 transition-colors hover:text-foreground"
        >
          X / Twitter <ArrowUpRight size={13} strokeWidth={1.7} />
        </Link>
      </div>
    </footer>
  )
}
