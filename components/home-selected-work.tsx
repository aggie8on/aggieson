"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { ProjectModal } from "@/components/project-modal"
import { projects, type Project } from "@/lib/projects"

const selectedProjectIds = ["1", "2", "4", "5"]

export function HomeSelectedWork() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const closeProject = useCallback(() => setSelectedProject(null), [])
  const selectedProjects = selectedProjectIds
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is Project => Boolean(project))

  return (
    <>
      <section aria-labelledby="work-heading" className="space-y-5">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="work-heading" className="text-sm font-medium text-muted-foreground">Selected work</h2>
          <Link href="/efforts" className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
            All work <ArrowUpRight size={13} strokeWidth={1.7} />
          </Link>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {selectedProjects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => setSelectedProject(project)}
              aria-label={`View ${project.title} project details`}
              className="group grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-4 text-left transition-colors hover:text-muted-foreground sm:grid-cols-[minmax(0,1fr)_130px_42px_16px]"
            >
              <span className="font-medium tracking-[-0.025em]">{project.title}</span>
              <span className="hidden text-sm text-muted-foreground sm:block">{project.category}</span>
              <span className="text-right text-sm tabular-nums text-muted-foreground">{project.year}</span>
              <ArrowUpRight className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" strokeWidth={1.6} />
              <span className="col-span-2 -mt-1 text-xs text-muted-foreground sm:hidden">{project.category}</span>
            </button>
          ))}
        </div>
      </section>
      <ProjectModal project={selectedProject} onClose={closeProject} />
    </>
  )
}
