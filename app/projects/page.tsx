import { createClient } from "@/lib/supabase/server"
import { defaultSitePages, normalizeSections } from "@/lib/site-pages"
import { ProjectsOverview } from "@/components/projects-overview"

export const revalidate = 0

export default async function ProjectsPage() {
  let sections = defaultSitePages.projects.sections
  try {
    const supabase = await createClient()
    const { data } = await supabase.from("site_pages").select("sections").eq("slug", "projects").maybeSingle()
    if (data?.sections) sections = normalizeSections(data.sections, sections)
  } catch {
    // Starter layout is used until the page settings are available.
  }
  return <ProjectsOverview sections={sections} />
}
