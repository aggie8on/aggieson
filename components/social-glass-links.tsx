"use client"

import { Instagram, Mail, Youtube, ArrowUpRight } from "lucide-react"

function XIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[16px]" fill="currentColor"><path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-7.45L5.53 22H2.4l7.25-8.29L1.9 2h6.4l4.43 6.97L18.9 2Zm-1.1 17.9h1.73L7.37 3.98H5.51L17.8 19.9Z" /></svg>
}

const links = [
  { label: "Toothless", href: "https://www.toothless.design", icon: "toothless" },
  { label: "Email", href: "mailto:aggie8on@gmail.com", icon: "email" },
  { label: "X", href: "https://x.com/aggie8on", icon: "x" },
  { label: "Instagram", href: "https://www.instagram.com/aggie8on/", icon: "instagram" },
  { label: "YouTube", href: "https://www.youtube.com/@aggie8on", icon: "youtube" },
]

export function SocialGlassLinks() {
  return (
    <nav aria-label="Contact and social links" className="flex flex-wrap items-center gap-2 pt-1">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith("mailto:") ? undefined : "_blank"}
          rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
          aria-label={link.label}
          title={link.label}
          className="group inline-flex size-10 items-center justify-center rounded-full border border-white/40 bg-white/45 text-foreground/80 shadow-[0_3px_12px_rgba(0,0,0,0.045)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-white/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:border-white/10 dark:bg-white/[0.06] dark:text-foreground/80 dark:shadow-[0_3px_12px_rgba(0,0,0,0.12)] dark:hover:bg-white/[0.12]"
        >
          {link.icon === "toothless" ? <span className="relative flex size-5 items-center justify-center rounded-md border border-current/70 text-[11px] font-semibold tracking-[-0.08em]">T<ArrowUpRight className="absolute -right-1.5 -top-1.5 size-2.5" /></span>
            : link.icon === "email" ? <Mail size={16} strokeWidth={1.7} />
            : link.icon === "x" ? <XIcon />
            : link.icon === "instagram" ? <Instagram size={16} strokeWidth={1.7} />
            : <Youtube size={17} strokeWidth={1.7} />}
        </a>
      ))}
    </nav>
  )
}
