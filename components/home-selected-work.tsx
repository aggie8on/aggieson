"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, AudioLines, Bike, Heart, Lightbulb, Smartphone, Sparkles } from "lucide-react"
import { ProjectModal, type Origin } from "@/components/project-modal"
import { Reveal } from "@/components/reveal"
import { BlurredText, LockBadge } from "@/components/project-lock"
import type { Project } from "@/lib/projects"


function CategoryIcon({ category }: { category: string }) {
  const props = { size: 15, strokeWidth: 1.5, "aria-hidden": true as const }
  // Each kind of project gets its own little motion on hover (see globals.css).
  const [Icon, motion] =
    category === "Product Design" ? [Smartphone, "ic-tilt"]
    : category === "Audio Design" ? [AudioLines, "ic-pulse"]
    : category === "Mobility" ? [Bike, "ic-roll"]
    : category === "Wellness" ? [Heart, "ic-beat"]
    : category === "Lighting" ? [Lightbulb, "ic-flicker"]
    : [Sparkles, "ic-spin"]
  return <span className={`inline-flex ${motion}`}><Icon {...props} /></span>
}

export function HomeSelectedWork({ projectItems = [] }: { projectItems?: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [origin, setOrigin] = useState<Origin | null>(null)
  const closeProject = useCallback(() => setSelectedProject(null), [])
  const selectedProjects = projectItems

  return (
    <>
      <section aria-label="Selected work" className="space-y-4">
        <div className="flex justify-start">
          <Link href="/projects" className="-my-2 inline-flex items-center gap-1 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            All projects <ArrowUpRight size={13} strokeWidth={1.7} />
          </Link>
        </div>
        <div className="space-y-4">
          {selectedProjects.map((project, index) => (
            <Reveal key={project.id} delay={index * 60}>
            <button
              type="button"
              onClick={(event) => { const box = event.currentTarget.getBoundingClientRect(); setOrigin({ x: box.left, y: box.top, width: box.width, height: box.height }); setSelectedProject(project) }}
              aria-label={`View ${project.title} project details`}
              className="group relative grid w-full grid-cols-[18px_minmax(0,1fr)] items-start gap-x-3 text-left"
            >
              <span className="mt-1 text-muted-foreground transition-colors group-hover:text-foreground"><CategoryIcon category={project.category} /></span>
              <span className="min-w-0">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium tracking-[-0.02em] relative transition-[transform,color] duration-300 group-hover:translate-x-0.5 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:opacity-40 after:transition-transform after:duration-300 group-hover:after:scale-x-100 motion-reduce:transform-none motion-reduce:transition-none group-hover:text-muted-foreground">{project.title}{project.incomplete && <LockBadge />}</span>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{project.year}</span>
                </span>
                <span className="mt-1 block max-w-xl text-[0.92rem] leading-[1.55] text-muted-foreground">{project.incomplete ? <BlurredText>{project.description}</BlurredText> : project.description}</span>
              </span>
              <span aria-hidden="true" className="absolute -right-6 top-0.5 hidden -translate-x-1 translate-y-1 text-muted-foreground opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transform-none motion-reduce:transition-none sm:block"><ArrowUpRight size={14} strokeWidth={1.5} /></span>
            </button>
            </Reveal>
          ))}
        </div>
      </section>
      <ProjectModal project={selectedProject} origin={origin} onClose={closeProject} />
    </>
  )
}
