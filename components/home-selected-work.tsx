"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { ProjectModal } from "@/components/project-modal"
import { projects, type Project } from "@/lib/projects"

const selectedProjectIds = ["1", "2", "4", "5"]

export function HomeSelectedWork({ title = "Selected projects" }: { title?: string }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const closeProject = useCallback(() => setSelectedProject(null), [])
  const selectedProjects = selectedProjectIds
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is Project => Boolean(project))

  return (
    <>
      <section aria-labelledby="projects-heading" className="space-y-3">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="projects-heading" className="text-sm font-medium text-muted-foreground">Work</h2>
          <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
            All projects <ArrowUpRight size={13} strokeWidth={1.7} />
          </Link>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {selectedProjects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => setSelectedProject(project)}
              aria-label={`View ${project.title} project details`}
              className="group grid w-full grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-1 py-3 text-left sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
            >
              <span className="min-w-0 text-sm font-medium tracking-[-0.02em] transition-colors group-hover:text-muted-foreground">
                {project.title}
              </span>
              <span className="col-span-2 text-sm leading-5 text-muted-foreground sm:col-span-1 sm:col-start-2 sm:row-start-1">
                <span>{project.description}</span>
                </span>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground sm:col-start-3 sm:row-start-1">{project.year}</span>
            </button>
          ))}
        </div>
      </section>
      <ProjectModal project={selectedProject} onClose={closeProject} />
    </>
  )
}
