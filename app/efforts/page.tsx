"use client"

import Image from "next/image"
import Link from "next/link"
import { ProjectModal } from "@/components/project-modal"
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
      <main className="mx-auto w-full max-w-5xl px-5 pb-16 pt-8 sm:px-6 md:pt-10">
        <div className="mb-5">
          <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">← Aggieson</Link>
        </div>
        <div className="space-y-7">
          <header className="max-w-2xl space-y-2">
            <p className="text-sm text-muted-foreground">Selected work</p>
            <h1 className="text-3xl font-medium tracking-[-0.045em] md:text-4xl">Projects & explorations</h1>
            <p className="text-sm leading-6 text-muted-foreground">
              A selection of things I have made, explored, and learned from.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => openProject(project)}
                aria-label={`View ${project.title} project details`}
                className="group min-w-0 text-left"
              >
                <span className="relative block aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
        </div>
      </main>
      <ProjectModal project={selectedProject} onClose={closeProject} />
    </>
  )
}
