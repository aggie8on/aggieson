import { HomePageSections } from "@/components/home-page-sections"
import { blogPosts } from "@/lib/blog-data"
import { createClient } from "@/lib/supabase/server"
import { defaultSitePages, normalizeSections } from "@/lib/site-pages"
import { type PortfolioItem } from "@/lib/life-content"
import { projects as defaultProjects, type Project } from "@/lib/projects"

export const revalidate = 0

export default async function HomePage() {
  let latestPosts = Object.values(blogPosts)
    .map((post) => ({ slug: post.slug, title: post.title, date: post.date, timestamp: new Date(post.date).getTime() }))
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 3)
    .map(({ slug, title, date }) => ({ slug, title, date }))

  let sections = defaultSitePages.home.sections
  let lifeItems: PortfolioItem[] = []
  let projectItems: Project[] = defaultProjects.filter((project) => ["1", "2", "4", "5"].includes(project.id))
  try {
    const supabase = await createClient()
    const [{ data: pageData }, { data: itemData }, { data: writingData }, { data: projectData }] = await Promise.all([
      supabase.from("site_pages").select("sections").eq("slug", "home").maybeSingle(),
      supabase.from("portfolio_items")
        .select("id,title,slug,item_type,category,excerpt,external_url,featured,sort_order,published_at,created_at,is_owned")
        .eq("published", true)
        .neq("item_type", "writing")
        .order("featured", { ascending: false })
        .order("sort_order", { ascending: true })
        .order("published_at", { ascending: false })
        .limit(3),
      supabase.from("portfolio_items")
        .select("slug,title,published_at,created_at")
        .eq("published", true)
        .eq("item_type", "writing")
        .order("published_at", { ascending: false })
        .order("created_at", { ascending: false }),
      supabase.from("portfolio_items")
        .select("slug,title,excerpt,category,cover_image_url,content,sort_order")
        .eq("published", true).eq("item_type", "project").order("sort_order", { ascending: true }),
    ])
    if (pageData?.sections) sections = normalizeSections(pageData.sections, sections)
    lifeItems = (itemData ?? []) as PortfolioItem[]
    if (projectData?.length) projectItems = projectData.map((item) => ({
      id: item.slug, title: item.title, description: item.excerpt ?? "",
      year: typeof item.content?.year === "string" ? item.content.year : "",
      category: item.category ?? "Project", image: item.cover_image_url ?? "",
      images: Array.isArray(item.content?.images) ? item.content.images.filter((image: unknown): image is string => typeof image === "string") : (item.cover_image_url ? [item.cover_image_url] : []),
    }))
    const cmsPosts = (writingData ?? []).map((post) => {
      const timestamp = new Date(post.published_at ?? post.created_at).getTime()
      return {
        slug: post.slug,
        title: post.title,
        date: new Date(post.published_at ?? post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        timestamp,
      }
    })
    latestPosts = [
      ...Object.values(blogPosts).map((post) => ({ slug: post.slug, title: post.title, date: post.date, timestamp: new Date(post.date).getTime() })),
      ...cmsPosts,
    ]
      .filter((post, index, all) => all.findIndex((candidate) => candidate.slug === post.slug) === index)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3)
      .map(({ slug, title, date }) => ({ slug, title, date }))
  } catch {
    // The default layout keeps the public page available if the CMS is unavailable.
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-10 sm:px-6 md:pt-14">
      <HomePageSections sections={sections} posts={latestPosts} lifeItems={lifeItems} projectItems={projectItems} />
    </main>
  )
}
