"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
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
      <section aria-labelledby="work-heading" className="space-y-3">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="work-heading" className="text-sm font-medium text-muted-foreground">Selected work</h2>
          <Link href="/efforts" className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
            All work <ArrowUpRight size={13} strokeWidth={1.7} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
          {selectedProjects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => setSelectedProject(project)}
              aria-label={`View ${project.title} project details`}
              className="group min-w-0 text-left"
            >
              <span className="relative block aspect-[4/3] overflow-hidden bg-muted">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </span>
              <span className="mt-2 flex items-baseline justify-between gap-3">
                <span className="min-w-0 text-sm font-medium tracking-[-0.02em] transition-colors group-hover:text-muted-foreground">{project.title}</span>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{project.year}</span>
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">{project.category}</span>
            </button>
          ))}
        </div>
      </section>
      <ProjectModal project={selectedProject} onClose={closeProject} />
    </>
  )
}
