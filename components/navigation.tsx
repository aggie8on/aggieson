"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { ShoppingCart } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"

export function Navigation() {
  const pathname = usePathname()
  const [datetime, setDatetime] = useState("")
  const itemCount = useCartStore((state) => state.itemCount)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const month = String(now.getMonth() + 1).padStart(2, "0")
      const day = String(now.getDate())
      const hours = String(now.getHours()).padStart(2, "0")
      const minutes = String(now.getMinutes()).padStart(2, "0")
      setDatetime(`${month}' ${day}  ${hours}:${minutes}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  const links = [
    { href: "/efforts", label: "Efforts" },
    { href: "/blog", label: "Blog" },
    { href: "/guestbook", label: "Guestbook" },
  ]

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-4xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg font-medium tracking-tight hover:text-muted-foreground transition-colors">
            Aggieson
          </Link>

          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 text-sm text-muted-foreground font-mono">
            {datetime}
          </div>

          <ul className="flex items-center gap-6">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-sm transition-colors hover:text-foreground",
                    pathname === link.href ? "text-foreground font-medium" : "text-muted-foreground",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/shop"
                className={cn(
                  "transition-colors hover:text-foreground relative",
                  pathname === "/shop" ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full" />}
                <span className="sr-only">Shop</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
