"use client"

import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent } from "react"
import { X } from "lucide-react"
import Image from "next/image"
import type { Project } from "@/lib/projects"
import { Button } from "@/components/ui/button"

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
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
        className="glass glass-lg relative max-h-[88vh] w-full max-w-[calc(42rem-3rem)] overflow-y-auto overscroll-contain rounded-2xl focus:outline-none motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:duration-200"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={trapFocus}
      >
        <div className="glass-bar sticky top-0 z-10 flex items-center justify-between rounded-t-2xl px-4 py-2.5 md:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <h2 id="project-modal-title" className="text-base md:text-lg font-medium tracking-[-0.02em]">{project.title}</h2>
            <span className="text-sm text-muted-foreground">• {project.year}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="p-4 md:p-6 space-y-5">
          <p className="mx-auto max-w-xl text-center text-sm leading-relaxed text-foreground/75">
            {project.description}
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
          </div>
        </div>
      </div>
    </div>
  )
}
