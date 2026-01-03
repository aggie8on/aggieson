"use client"

import { Navigation } from "@/components/navigation"
import { ProjectCard } from "@/components/project-card"
import { ProjectModal } from "@/components/project-modal"
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
    description: "Revolutionary open-ear audio technology that balances awareness with immersive sound.",
    year: "2024",
    category: "Audio Design",
    image: "/efforts/ear-open.jpg",
    images: ["/efforts/ear-open-1.jpg", "/efforts/ear-open-2.jpg", "/efforts/ear-open-3.jpg"],
  },
  {
    id: "3",
    title: "Snarl",
    description: "An aggressive yet elegant exploration of form and function in consumer electronics.",
    year: "2023",
    category: "Concept Design",
    image: "/efforts/snarl.jpg",
    images: ["/efforts/snarl-1.jpg", "/efforts/snarl-2.jpg", "/efforts/snarl-3.jpg"],
  },
  {
    id: "4",
    title: "Skarper",
    description: "Revolutionary e-bike conversion system that transforms any bicycle into an electric vehicle.",
    year: "2023",
    category: "Mobility",
    image: "/efforts/skarper.jpg",
    images: ["/efforts/skarper-1.jpg", "/efforts/skarper-2.jpg", "/efforts/skarper-3.jpg"],
  },
  {
    id: "5",
    title: "Inaya",
    description: "A thoughtful wellness device designed to support mental health and mindfulness practices.",
    year: "2023",
    category: "Wellness",
    image: "/efforts/inaya.jpg",
    images: ["/efforts/inaya-1.jpg", "/efforts/inaya-2.jpg", "/efforts/inaya-3.jpg"],
  },
  {
    id: "6",
    title: "taschlight",
    description: "Portable lighting solution that merges functionality with minimalist aesthetic.",
    year: "2022",
    category: "Lighting",
    image: "/efforts/taschlight.jpg",
    images: ["/efforts/taschlight-1.jpg", "/efforts/taschlight-2.jpg", "/efforts/taschlight-3.jpg"],
  },
  {
    id: "7",
    title: "Superstitious Objects",
    description: "Exploring the intersection of belief, ritual, and everyday objects in modern life.",
    year: "2022",
    category: "Concept Design",
    image: "/efforts/superstitious.jpg",
    images: ["/efforts/superstitious-1.jpg", "/efforts/superstitious-2.jpg"],
  },
  {
    id: "8",
    title: "Somvai",
    description: "Optimize your naps to be more productive with this innovative wellness device.",
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
      <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="space-y-12">
          <section className="space-y-4">
            <h1 className="text-4xl font-medium tracking-tight text-balance">Efforts</h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              A collection of projects exploring design, innovation, and the spaces in between.
            </p>
          </section>

          <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
            ))}
          </div>
        </div>
      </main>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  )
}
