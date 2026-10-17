"use client"

import { Navigation } from "@/components/navigation"
import { ProjectModal } from "@/components/project-modal"
import { ArrowUpRight } from "lucide-react"
import { useState } from "react"

export interface Project {
  id: string
  title: string
  description: string
  year: string
  category: string
  image: string
  images: string[]
}

const projects: Project[] = [
  {
    id: "1",
    title: "Phone 3(a) Community Edition",
    description: "A community-driven smartphone design that brings together user feedback and innovative features.",
    year: "2024",
    category: "Product Design",
    image: "/efforts/phone-3a.jpg",
    images: ["/efforts/phone-3a-1.jpg", "/efforts/phone-3a-2.jpg", "/efforts/phone-3a-3.jpg"],
  },
  {
    id: "2",
    title: "Ear(Open) Concept",
    description: "Open-ear audio technology designed to balance awareness with an immersive listening experience.",
    year: "2024",
    category: "Audio Design",
    image: "/efforts/ear-open.jpg",
    images: ["/efforts/ear-open-1.jpg", "/efforts/ear-open-2.jpg", "/efforts/ear-open-3.jpg"],
  },
  {
    id: "3",
    title: "Snarl",
    description: "An exploration of form and function in consumer electronics.",
    year: "2023",
    category: "Concept Design",
    image: "/efforts/snarl.jpg",
    images: ["/efforts/snarl-1.jpg", "/efforts/snarl-2.jpg", "/efforts/snarl-3.jpg"],
  },
  {
    id: "4",
    title: "Skarper",
    description: "An e-bike conversion system that transforms a bicycle into an electric vehicle.",
    year: "2023",
    category: "Mobility",
    image: "/efforts/skarper.jpg",
    images: ["/efforts/skarper-1.jpg", "/efforts/skarper-2.jpg", "/efforts/skarper-3.jpg"],
  },
  {
    id: "5",
    title: "Inaya",
    description: "A wellness concept designed around mindfulness and everyday care.",
    year: "2023",
    category: "Wellness",
    image: "/efforts/inaya.jpg",
    images: ["/efforts/inaya-1.jpg", "/efforts/inaya-2.jpg", "/efforts/inaya-3.jpg"],
  },
  {
    id: "6",
    title: "taschlight",
    description: "A portable lighting concept focused on function and minimal form.",
    year: "2022",
    category: "Lighting",
    image: "/efforts/taschlight.jpg",
    images: ["/efforts/taschlight-1.jpg", "/efforts/taschlight-2.jpg", "/efforts/taschlight-3.jpg"],
  },
  {
    id: "7",
    title: "Superstitious Objects",
    description: "An exploration of belief, ritual, and everyday objects.",
    year: "2022",
    category: "Concept Design",
    image: "/efforts/superstitious.jpg",
    images: ["/efforts/superstitious-1.jpg", "/efforts/superstitious-2.jpg"],
  },
  {
    id: "8",
    title: "Somvai",
    description: "A concept exploring how rest and short naps can fit into daily life.",
    year: "2023",
    category: "Wellness",
    image: "/efforts/somvai.jpg",
    images: ["/efforts/somvai-1.jpg", "/efforts/somvai-2.jpg", "/efforts/somvai-3.jpg"],
  },
]

export default function EffortsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <>
      <Navigation />
      <main className="mx-auto w-full max-w-2xl px-6 pb-24 pt-20 md:pt-28">
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
                onClick={() => setSelectedProject(project)}
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
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  )
}
