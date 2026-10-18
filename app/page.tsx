import { HomePageSections } from "@/components/home-page-sections"
import { blogPosts } from "@/lib/blog-data"
import { createClient } from "@/lib/supabase/server"
import { defaultSitePages, normalizeSections } from "@/lib/site-pages"
import { type PortfolioItem } from "@/lib/life-content"

export const revalidate = 0

export default async function HomePage() {
  const latestPosts = Object.values(blogPosts)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  let sections = defaultSitePages.home.sections
  let lifeItems: PortfolioItem[] = []
  try {
    const supabase = await createClient()
    const [{ data: pageData }, { data: itemData }] = await Promise.all([
      supabase.from("site_pages").select("sections").eq("slug", "home").maybeSingle(),
      supabase.from("portfolio_items")
        .select("id,title,slug,item_type,category,excerpt,external_url,featured,sort_order,published_at,created_at,is_owned")
        .eq("published", true)
        .order("featured", { ascending: false })
        .order("sort_order", { ascending: true })
        .order("published_at", { ascending: false })
        .limit(3),
    ])
    if (pageData?.sections) sections = normalizeSections(pageData.sections, sections)
    lifeItems = (itemData ?? []) as PortfolioItem[]
  } catch {
    // The default layout keeps the public page available if the CMS is unavailable.
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5 pb-16 pt-12 sm:px-6 md:pt-16">
      <HomePageSections sections={sections} posts={latestPosts} lifeItems={lifeItems} />
    </main>
  )
}
