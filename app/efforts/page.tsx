"use client"

import { ProjectModal } from "@/components/project-modal"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { useEffect, useState } from "react"

import { projects, type Project } from "@/lib/projects"

export default function EffortsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    const projectId = new URLSearchParams(window.location.search).get("project")
    if (!projectId) return

    const project = projects.find((item) => item.id === projectId)
    if (project) {
      setSelectedProject(project)
    } else {
      const url = new URL(window.location.href)
      url.searchParams.delete("project")
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`)
    }
  }, [])

  const openProject = (project: Project) => {
    const url = new URL(window.location.href)
    url.searchParams.set("project", project.id)
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`)
    setSelectedProject(project)
  }

  const closeProject = () => {
    const url = new URL(window.location.href)
    url.searchParams.delete("project")
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`)
    setSelectedProject(null)
  }

  return (
    <>
      <main className="mx-auto w-full max-w-2xl px-6 pb-24 pt-20 md:pt-28">
        <div className="mb-8"><Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">← Aggieson</Link></div>
        <div className="space-y-10">
          <header className="space-y-4">
            <p className="text-sm text-muted-foreground">Selected work</p>
            <h1 className="text-4xl font-medium tracking-[-0.05em] md:text-5xl">Projects & explorations</h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground">
              A selection of ideas across product, audio, mobility, wellness, and everyday objects.
              Select a project to view its images and details.
            </p>
          </header>

          <div className="divide-y divide-border border-y border-border">
            {projects.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => openProject(project)}
                aria-label={`View ${project.title} project details`}
                className="group grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-2 py-5 text-left transition-colors hover:text-muted-foreground sm:grid-cols-[minmax(0,1fr)_116px_42px_16px] sm:items-center"
              >
                <span className="min-w-0 space-y-1">
                  <span className="block font-medium tracking-[-0.025em] text-foreground transition-colors group-hover:text-muted-foreground">
                    {project.title}
                  </span>
                  <span className="block max-w-lg text-sm leading-6 text-muted-foreground">
                    {project.description}
                  </span>
                  <span className="block text-xs text-muted-foreground sm:hidden">{project.category}</span>
                </span>
                <span className="hidden text-sm text-muted-foreground sm:block">{project.category}</span>
                <span className="pt-0.5 text-right text-sm tabular-nums text-muted-foreground sm:pt-0">{project.year}</span>
                <ArrowUpRight className="mt-1 h-3.5 w-3.5 text-muted-foreground sm:mt-0" strokeWidth={1.6} />
              </button>
            ))}
          </div>
        </div>
      </main>
      <ProjectModal project={selectedProject} onClose={closeProject} />
    </>
  )
}
