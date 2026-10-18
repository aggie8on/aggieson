"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, AudioLines, Bike, Heart, Lightbulb, Smartphone, Sparkles } from "lucide-react"
import { ProjectModal } from "@/components/project-modal"
import { projects, type Project } from "@/lib/projects"

const selectedProjectIds = ["1", "2", "4", "5"]

function CategoryIcon({ category }: { category: string }) {
  const props = { size: 15, strokeWidth: 1.5, "aria-hidden": true as const }
  if (category === "Product Design") return <Smartphone {...props} />
  if (category === "Audio Design") return <AudioLines {...props} />
  if (category === "Mobility") return <Bike {...props} />
  if (category === "Wellness") return <Heart {...props} />
  if (category === "Lighting") return <Lightbulb {...props} />
  return <Sparkles {...props} />
}

export function HomeSelectedWork({ title = "Selected projects" }: { title?: string }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const closeProject = useCallback(() => setSelectedProject(null), [])
  const selectedProjects = selectedProjectIds
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is Project => Boolean(project))

  return (
    <>
      <section aria-labelledby="projects-heading" className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="projects-heading" className="text-sm font-medium text-muted-foreground">{title || "Work"}</h2>
          <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
            All projects <ArrowUpRight size={13} strokeWidth={1.7} />
          </Link>
        </div>
        <div className="space-y-4">
          {selectedProjects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => setSelectedProject(project)}
              aria-label={`View ${project.title} project details`}
              className="group grid w-full grid-cols-[18px_minmax(0,1fr)_auto] items-start gap-x-3 text-left"
            >
              <span className="mt-1 text-muted-foreground transition-colors group-hover:text-foreground"><CategoryIcon category={project.category} /></span>
              <span className="min-w-0">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium tracking-[-0.02em] transition-colors group-hover:text-muted-foreground">{project.title}</span>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{project.year}</span>
                </span>
                <span className="mt-1 block max-w-xl text-[0.8125rem] leading-[1.55] text-muted-foreground">{project.description}</span>
              </span>
              <span className="mt-0.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"><ArrowUpRight size={14} strokeWidth={1.5} /></span>
            </button>
          ))}
        </div>
      </section>
      <ProjectModal project={selectedProject} onClose={closeProject} />
    </>
  )
}
