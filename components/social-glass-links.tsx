"use client"

import { Instagram, Mail, Youtube, ArrowUpRight } from "lucide-react"

function XIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[15px]" fill="currentColor"><path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-7.45L5.53 22H2.4l7.25-8.29L1.9 2h6.4l4.43 6.97L18.9 2Zm-1.1 17.9h1.73L7.37 3.98H5.51L17.8 19.9Z" /></svg>
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
    <nav aria-label="Contact and social links" className="flex flex-wrap items-center gap-1.5 pt-1">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith("mailto:") ? undefined : "_blank"}
          rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
          aria-label={link.label}
          title={link.label}
          className="group inline-flex size-8 items-center justify-center rounded-full border border-white/50 bg-white/35 text-foreground/75 shadow-[0_1px_5px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-colors hover:bg-white/65 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:border-white/10 dark:bg-white/[0.05] dark:text-foreground/80 dark:hover:bg-white/[0.12]"
        >
          {link.icon === "toothless" ? <span className="inline-flex items-center gap-0.5 text-[9px] font-medium tracking-[-0.04em]">toothless<ArrowUpRight className="size-2.5" /></span>
            : link.icon === "email" ? <Mail size={15} strokeWidth={1.6} />
            : link.icon === "x" ? <XIcon />
            : link.icon === "instagram" ? <Instagram size={15} strokeWidth={1.6} />
            : <Youtube size={16} strokeWidth={1.6} />}
        </a>
      ))}
    </nav>
  )
}
