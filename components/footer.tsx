"use client"

import { Instagram, Moon, Sun, Youtube } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle color theme"}
      title={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle color theme"}
      className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {isDark ? <Sun size={16} strokeWidth={1.7} /> : <Moon size={16} strokeWidth={1.7} />}
    </button>
  )
}

function XIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[17px]" fill="currentColor">
      <path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-7.45L5.53 22H2.4l7.25-8.29L1.9 2h6.4l4.43 6.97L18.9 2Zm-1.1 17.9h1.73L7.37 3.98H5.51L17.8 19.9Z" />
    </svg>
  )
}

const socials = [
  { label: "X", href: "https://x.com/aggie8on", icon: XIcon },
  { label: "Instagram", href: "https://www.instagram.com/aggie8on/", icon: Instagram },
  { label: "YouTube", href: "https://www.youtube.com/@aggie8on", icon: Youtube },
]

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-6 py-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs tracking-wide">© Aggieson · People, Places & Moments</span>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {socials.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="inline-flex size-8 items-center justify-center rounded-full transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Icon size={17} strokeWidth={1.7} />
            </a>
          ))}
          <span aria-hidden="true" className="mx-1 h-4 w-px bg-border" />
          <ThemeToggle />
        </div>
      </div>
    </footer>
  )
}
