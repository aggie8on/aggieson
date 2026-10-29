"use client"

import { Instagram, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

function XIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[14px]" fill="currentColor"><path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-7.45L5.53 22H2.4l7.25-8.29L1.9 2h6.4l4.43 6.97L18.9 2Zm-1.1 17.9h1.73L7.37 3.98H5.51L17.8 19.9Z" /></svg>
}

const links = [
  { label: "X", href: "https://x.com/aggie8on", icon: "x" },
  { label: "Instagram", href: "https://www.instagram.com/aggie8on/", icon: "instagram" },
]

export function SocialGlassLinks() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = mounted && resolvedTheme === "dark"
  const iconClass = "relative inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors before:absolute before:-inset-2 before:content-[''] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

  return <nav aria-label="Social links and appearance" className="flex shrink-0 items-center gap-1">
    {links.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label} title={link.label} className={iconClass}>
      {link.icon === "x" ? <XIcon /> : <Instagram size={14} strokeWidth={1.6} />}
    </a>)}
    <span aria-hidden="true" className="mx-1 h-4 w-px bg-border" />
    <button type="button" onClick={() => setTheme(isDark ? "light" : "dark")} aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle color theme"} title={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle color theme"} className={iconClass}>
      {isDark ? <Sun size={14} strokeWidth={1.6} /> : <Moon size={14} strokeWidth={1.6} />}
    </button>
  </nav>
}
