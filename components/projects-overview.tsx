"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { ProjectModal } from "@/components/project-modal"
import type { Project } from "@/lib/projects"
import type { SiteSection } from "@/lib/site-pages"
import { PageNav } from "@/components/page-nav"
import { InlineRichText } from "@/components/inline-rich-text"

export function ProjectsOverview({ sections, projectItems = [] }: { sections: SiteSection[]; projectItems?: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  useEffect(() => {
    const syncProjectFromUrl = () => {
      const projectId = new URLSearchParams(window.location.search).get("project")
      setSelectedProject(projectItems.find((item) => item.id === projectId) ?? null)
    }
    syncProjectFromUrl()
    window.addEventListener("popstate", syncProjectFromUrl)
    return () => window.removeEventListener("popstate", syncProjectFromUrl)
  }, [projectItems])

  const openProject = (project: Project) => {
    const url = new URL(window.location.href)
    url.searchParams.set("project", project.id)
    window.history.pushState({ ...window.history.state, projectModal: true }, "", `${url.pathname}${url.search}${url.hash}`)
    setSelectedProject(project)
  }

  const closeProject = () => {
    if (window.history.state?.projectModal) {
      window.history.back()
      return
    }
    const url = new URL(window.location.href)
    url.searchParams.delete("project")
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`)
    setSelectedProject(null)
  }

  return (
    <>
      <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-10 sm:px-6 md:pt-14">
        <PageNav />
        <div className="space-y-12">
          {sections.filter((section) => section.visible).map((section) => {
            if (section.type === "intro") return <header key={section.id} className="max-w-2xl space-y-5"><p className="text-sm text-muted-foreground">{section.eyebrow || "Selected projects"}</p><h1 className="text-2xl font-medium leading-[1.2] tracking-[-0.045em] sm:text-[1.65rem]">{section.title || "Projects"}</h1>{section.text && <p className="text-sm leading-6 text-muted-foreground"><InlineRichText inlineIconSvg={section.inlineIconSvg} inlineIconUrl={section.inlineIconUrl}>{section.text}</InlineRichText></p>}{section.body && <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground"><InlineRichText inlineIconSvg={section.inlineIconSvg} inlineIconUrl={section.inlineIconUrl}>{section.body}</InlineRichText></p>}{section.image && <img src={section.image} alt={section.title || "Projects"} className="mt-4 max-h-80 w-full rounded-lg object-cover" />}</header>
            if (section.type === "projects") return <section key={section.id} className="space-y-3"><div className="flex items-baseline justify-between gap-4"><span className="text-xs text-muted-foreground">{projectItems.length} projects</span></div><div className="space-y-4">{projectItems.map((project) => <button key={project.id} type="button" onClick={() => openProject(project)} aria-label={`View ${project.title} project details`} className="group grid w-full grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-1 text-left sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"><span className="min-w-0 text-[0.92rem] font-medium tracking-[-0.02em] transition-colors group-hover:text-muted-foreground">{project.title}</span><span className="col-span-2 text-sm leading-5 text-muted-foreground sm:col-span-1 sm:col-start-2 sm:row-start-1">{project.description}</span><span className="inline-flex shrink-0 items-center gap-2 text-xs tabular-nums text-muted-foreground sm:col-start-3 sm:row-start-1">{project.year}<ArrowUpRight size={13} strokeWidth={1.5} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span></button>)}</div></section>
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
