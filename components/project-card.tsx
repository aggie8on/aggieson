"use client"

import Image from "next/image"
import type { Project } from "@/app/efforts/page"

interface ProjectCardProps {
  project: Project
  onClick: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <div onClick={onClick} className="group cursor-pointer relative aspect-[4/5] overflow-hidden bg-muted rounded-lg">
      <Image
        src={project.image || "/placeholder.svg"}
        alt={project.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
        <h3 className="font-medium text-base mb-1 text-balance">{project.title}</h3>
        <p className="text-xs text-white/90">{project.category}</p>
      </div>
    </div>
  )
}
