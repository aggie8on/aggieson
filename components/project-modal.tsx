"use client"

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react"
import { Lock, X } from "lucide-react"
import Image from "next/image"
import type { Project } from "@/lib/projects"
import { Button } from "@/components/ui/button"
import { BlurredText } from "@/components/project-lock"

/** Where the clicked row was on screen, so the pop-up can grow out of it. */
export type Origin = { x: number; y: number; width: number; height: number }

interface ProjectModalProps {
  project: Project | null
  origin?: Origin | null
  onClose: () => void
}

export function ProjectModal({ project, origin = null, onClose }: ProjectModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const [jiggle, setJiggle] = useState(0)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!project) return

    const previousOverflow = document.body.style.overflow
    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    document.body.style.overflow = "hidden"
    dialogRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      previouslyFocusedRef.current?.focus()
      previouslyFocusedRef.current = null
    }
  }, [project])

  useLayoutEffect(() => setJiggle(0), [project])

  // The pop-up opens as a band the size of the row you clicked, then unfolds to full size.
  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!project || !origin || !dialog || typeof dialog.animate !== "function") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const box = dialog.getBoundingClientRect()
    if (!box.width || !box.height) return
    const dx = origin.x + origin.width / 2 - (box.left + box.width / 2)
    const dy = origin.y + origin.height / 2 - (box.top + box.height / 2)
    const band = Math.max(0, (box.height - origin.height) / 2)
    dialog.animate(
      [
        { transform: `translate(${dx}px, ${dy}px)`, clipPath: `inset(${band}px 0px round 10px)`, opacity: 0.3 },
        { transform: "translate(0, 0)", clipPath: "inset(0px 0px round 16px)", opacity: 1 },
      ],
      { duration: 460, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
    )
  }, [project, origin])

  useEffect(() => {
    if (!project) return
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose, project])

  function trapFocus(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") return
    const dialog = dialogRef.current
    if (!dialog) return
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )).filter((element) => element.offsetParent !== null)
    if (focusable.length === 0) {
      event.preventDefault()
      dialog.focus()
      return
    }
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog)) {
      event.preventDefault()
      first.focus()
    }
  }

  if (!project) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/15 px-5 py-6 backdrop-blur-md motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-200 sm:px-6 dark:bg-black/45"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        tabIndex={-1}
        className={`glass glass-lg relative max-h-[88vh] w-full max-w-[calc(42rem-3rem)] overflow-y-auto overscroll-contain rounded-2xl focus:outline-none ${origin ? "" : "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:duration-200"}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={trapFocus}
      >
        <div className="glass-bar sticky top-0 z-10 flex items-center justify-between rounded-t-2xl px-4 py-2.5 md:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <h2 id="project-modal-title" className="flex items-center gap-2 text-base md:text-lg font-medium tracking-[-0.02em]">{project.title}{project.incomplete && <Lock size={14} strokeWidth={1.8} role="img" aria-label="Not complete yet" className="shrink-0 text-muted-foreground" />}</h2>
            <span className="text-sm text-muted-foreground">• {project.year}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="p-4 md:p-6 space-y-5">
          <p className="mx-auto max-w-xl text-center text-sm leading-relaxed text-foreground/75">
            {project.incomplete ? <BlurredText>{project.description}</BlurredText> : project.description}
          </p>

          <div className="space-y-4">
            {project.images.map((image, index) => (
              <div key={index} className="relative aspect-video w-full overflow-hidden rounded-lg border border-border/60 bg-foreground/5">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${project.title} - Image ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 672px) 100vw, 624px"
                />
              </div>
            ))}
            {project.incomplete && (
              <button type="button" onClick={() => setJiggle((count) => count + 1)} aria-label="More of this project is hidden until it is complete" className="group/lock relative block aspect-video w-full cursor-pointer overflow-hidden rounded-lg border border-border/60 bg-foreground/5 text-left focus-visible:ring-2 focus-visible:ring-ring/60">
                {/* Only the first image is ever sent, so the glass sits over a heavily blurred copy of it. */}
                {project.images[0] && <Image src={project.images[0]} alt="" fill aria-hidden="true" className="scale-125 object-cover blur-2xl" sizes="624px" />}
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 border border-white/30 bg-white/25 backdrop-blur-xl dark:border-white/10 dark:bg-black/30">
                  <span key={jiggle} className={`flex size-12 items-center justify-center rounded-full border border-white/40 bg-white/40 shadow-sm backdrop-blur-md transition-transform duration-300 group-hover/lock:scale-105 motion-reduce:transform-none dark:border-white/15 dark:bg-white/10 ${jiggle ? "lock-jiggle" : ""}`}><Lock size={20} strokeWidth={1.6} aria-hidden="true" className="text-foreground" /></span>
                  <span className="text-xs text-foreground/70">Project still in development</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
