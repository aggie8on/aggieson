"use client"

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react"

/**
 * Fades its content up a few pixels the first time it scrolls into view. `delay` (in ms) staggers neighbours.
 * The styles live in globals.css. Content is visible until the page is ready; people who ask for reduced motion, or have scripts off, just see it.
 */
export function Reveal({ children, delay = 0, as = "div", className = "" }: { children: ReactNode; delay?: number; as?: ElementType; className?: string }) {
  const ref = useRef<HTMLElement>(null)
  // Visible by default, so the page is readable before scripts load (slow connections) and with scripts off.
  // Only things that start below the fold are hidden once the page is ready, then revealed as they scroll in.
  const [shown, setShown] = useState(true)
  const Tag = as

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (element.getBoundingClientRect().top < window.innerHeight * 0.94) return
    setShown(false)
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setShown(true); observer.disconnect() }
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return <Tag ref={ref} data-reveal={shown ? "in" : "out"} style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }} className={`reveal ${className}`}>{children}</Tag>
}
