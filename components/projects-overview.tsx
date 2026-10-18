"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { ProjectModal } from "@/components/project-modal"
import { projects, type Project } from "@/lib/projects"
import type { SiteSection } from "@/lib/site-pages"

export function ProjectsOverview({ sections }: { sections: SiteSection[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  useEffect(() => {
    const projectId = new URLSearchParams(window.location.search).get("project")
    if (projectId) setSelectedProject(projects.find((item) => item.id === projectId) ?? null)
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
      <main className="mx-auto w-full max-w-3xl px-5 pb-16 pt-8 sm:px-6 md:pt-10">
        <div className="mb-5"><Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">← Aggieson</Link></div>
        <div className="space-y-8">
          {sections.filter((section) => section.visible).map((section) => {
            if (section.type === "intro") return <header key={section.id} className={`max-w-2xl ${section.layout === "compact" ? "space-y-1" : "space-y-2"}`}><p className="text-sm text-muted-foreground">{section.eyebrow || "Selected projects"}</p><h1 className="text-3xl font-medium tracking-[-0.045em] md:text-4xl">{section.title || "Projects"}</h1>{section.text && <p className="text-sm leading-6 text-muted-foreground">{section.text}</p>}{section.body && <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{section.body}</p>}{section.image && <img src={section.image} alt={section.title || "Projects"} className="mt-4 max-h-80 w-full rounded-lg object-cover" />}</header>
            if (section.type === "projects") return <section key={section.id} className="space-y-3"><div className="flex items-baseline justify-between gap-4"><h2 className="text-sm font-medium text-muted-foreground">{section.title || "Projects"}</h2><span className="text-xs text-muted-foreground">{projects.length} projects</span></div><div className="divide-y divide-border border-y border-border">{projects.map((project) => <button key={project.id} type="button" onClick={() => openProject(project)} aria-label={`View ${project.title} project details`} className="group flex w-full items-baseline justify-between gap-4 py-3 text-left"><span className="min-w-0"><span className="block text-sm font-medium tracking-[-0.02em] transition-colors group-hover:text-muted-foreground">{project.title}</span><span className="mt-1 block text-xs text-muted-foreground">{project.category}</span></span><span className="shrink-0 text-xs tabular-nums text-muted-foreground">{project.year}</span></button>)}</div></section>
            if (section.type === "image") return <section key={section.id} className="space-y-3">{section.title && <h2 className="text-sm font-medium text-muted-foreground">{section.title}</h2>}{section.image && <img src={section.image} alt={section.title || "Project image"} className="max-h-[32rem] w-full rounded-lg object-cover" />}{section.text && <p className="text-sm leading-6 text-muted-foreground">{section.text}</p>}</section>
            if (section.type === "text" || section.type === "links") return <section key={section.id} className="space-y-2">{section.eyebrow && <p className="text-xs text-muted-foreground">{section.eyebrow}</p>}{section.title && <h2 className="text-sm font-medium">{section.title}</h2>}{section.text && <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{section.text}</p>}{section.body && (section.type === "links" ? <a href={section.body} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm underline underline-offset-4">Open link <ArrowUpRight size={13} /></a> : <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{section.body}</p>)}</section>
            return <section key={section.id} className="space-y-2">{section.eyebrow && <p className="text-xs text-muted-foreground">{section.eyebrow}</p>}{section.title && <h2 className="text-sm font-medium">{section.title}</h2>}{section.text && <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{section.text}</p>}{section.body && <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{section.body}</p>}{section.image && <img src={section.image} alt={section.title || "Section image"} className="max-h-80 w-full rounded-lg object-cover" />}</section>
          })}
        </div>
      </main>
      <ProjectModal project={selectedProject} onClose={closeProject} />
    </>
  )
}
