"use client"

import { Instagram, Mail, Youtube } from "lucide-react"

function XIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[15px]" fill="currentColor">
      <path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-7.45L5.53 22H2.4l7.25-8.29L1.9 2h6.4l4.43 6.97L18.9 2Zm-1.1 17.9h1.73L7.37 3.98H5.51L17.8 19.9Z" />
    </svg>
  )
}

const links = [
  { label: "Email", href: "mailto:aggie8on@gmail.com", icon: "email" },
  { label: "X", href: "https://x.com/aggie8on", icon: "x" },
  { label: "Instagram", href: "https://www.instagram.com/aggie8on/", icon: "instagram" },
  { label: "YouTube", href: "https://www.youtube.com/@aggie8on", icon: "youtube" },
]

export function SocialGlassLinks() {
  return (
    <nav aria-label="Contact and social links" className="flex shrink-0 items-center gap-2">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith("mailto:") ? undefined : "_blank"}
          rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
          aria-label={link.label}
          title={link.label}
          className="group inline-flex size-7 items-center justify-center rounded-md border border-border/70 bg-background/65 text-muted-foreground backdrop-blur-md transition-colors hover:border-border hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {link.icon === "email" ? <Mail size={14} strokeWidth={1.6} />
            : link.icon === "x" ? <XIcon />
            : link.icon === "instagram" ? <Instagram size={14} strokeWidth={1.6} />
            : <Youtube size={15} strokeWidth={1.6} />}
        </a>
      ))}
    </nav>
  )
}
