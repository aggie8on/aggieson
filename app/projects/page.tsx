import type { Metadata } from "next"
import { ProjectsOverview } from "@/components/projects-overview"
import { getIcons, getProjects, getSiteSections } from "@/lib/portfolio-data"

export const revalidate = 0
export const metadata: Metadata = { title: "Projects | Aggieson", description: "Selected design work by Aggieson." }

export default async function ProjectsPage() {
  const [sections, projects, icons] = await Promise.all([getSiteSections("projects"), getProjects(), getIcons()])
  return <ProjectsOverview sections={sections} projectItems={projects.data} icons={icons} />
}
