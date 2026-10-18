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
          <h2 id="projects-heading" className="text-sm font-medium text-muted-foreground">{title}</h2>
          <Link href="/efforts" className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
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
              className="group flex w-full items-baseline justify-between gap-4 py-3 text-left"
            >
              <span className="min-w-0 text-sm font-medium tracking-[-0.02em] transition-colors group-hover:text-muted-foreground">
                {project.title}
              </span>
              <span className="flex shrink-0 items-baseline gap-4 text-xs text-muted-foreground">
                <span>{project.category}</span>
                <span className="tabular-nums">{project.year}</span>
              </span>
            </button>
          ))}
        </div>
      </section>
      <ProjectModal project={selectedProject} onClose={closeProject} />
    </>
  )
}
