import { createClient } from "@/lib/supabase/server"
import { defaultSitePages, normalizeSections } from "@/lib/site-pages"
import { ProjectsOverview } from "@/components/projects-overview"
import { projects as defaultProjects, type Project } from "@/lib/projects"

export const revalidate = 0

export default async function ProjectsPage() {
  let sections = defaultSitePages.projects.sections
  let projectItems: Project[] = defaultProjects
  try {
    const supabase = await createClient()
    const [{ data }, { data: cmsProjects }] = await Promise.all([
      supabase.from("site_pages").select("sections").eq("slug", "projects").maybeSingle(),
      supabase.from("portfolio_items").select("id,slug,title,excerpt,category,cover_image_url,content,sort_order").eq("published", true).eq("item_type", "project").order("sort_order", { ascending: true }),
    ])
    if (data?.sections) sections = normalizeSections(data.sections, sections)
    if (cmsProjects?.length) projectItems = cmsProjects.map((item) => ({
      id: item.slug, title: item.title, description: item.excerpt ?? "",
      year: typeof item.content?.year === "string" ? item.content.year : "",
      category: item.category ?? "Project", image: item.cover_image_url ?? "",
      images: Array.isArray(item.content?.images) ? item.content.images.filter((image: unknown): image is string => typeof image === "string") : (item.cover_image_url ? [item.cover_image_url] : []),
    }))
  } catch {
    // Starter layout is used until the page settings are available.
  }
  return <ProjectsOverview sections={sections} projectItems={projectItems} />
}
