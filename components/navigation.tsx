"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { ShoppingCart, Menu, X } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const itemCount = useCartStore((state) => state.itemCount)

  const links = [
    { href: "/efforts", label: "Work" },
    { href: "/blog", label: "Writing" },
    { href: "/guestbook", label: "Guestbook" },
  ]

  const shopLink = (
    <Link
      href="/shop"
      aria-label="Shop"
      className={cn(
        "relative inline-flex items-center transition-colors hover:text-foreground",
        pathname === "/shop" ? "text-foreground" : "text-muted-foreground",
      )}
    >
      <ShoppingCart className="h-[17px] w-[17px]" strokeWidth={1.7} />
      {itemCount > 0 && <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#ff6321]" />}
      <span className="sr-only">Shop</span>
    </Link>
  )

  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto max-w-3xl px-6">
        <div className="flex h-[68px] items-center justify-between">
          <Link
            href="/"
            className="text-[15px] font-semibold tracking-[-0.04em] transition-colors hover:text-muted-foreground"
          >
            Aggieson<span className="text-[#ff6321]">.</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <ul className="flex items-center gap-6">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-[13px] transition-colors hover:text-foreground",
                      pathname === link.href ? "font-medium text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            {shopLink}
          </div>

          <div className="flex items-center gap-4 md:hidden">
            {shopLink}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <ul className="flex flex-col gap-4">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "block text-sm transition-colors hover:text-foreground",
                      pathname === link.href ? "font-medium text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}
