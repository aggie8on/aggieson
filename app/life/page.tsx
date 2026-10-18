import { createClient } from "@/lib/supabase/server"
import { type PortfolioItem } from "@/lib/life-content"
import { defaultSitePages, normalizeSections } from "@/lib/site-pages"
import { LifeOverview } from "@/components/life-overview"

export const revalidate = 0

export default async function LifePage() {
  let items: PortfolioItem[] = []
  let sections = defaultSitePages.life.sections
  try {
    const supabase = await createClient()
    const [{ data: itemData }, { data: pageData }] = await Promise.all([
      supabase.from("portfolio_items")
        .select("id,title,slug,item_type,category,excerpt,content,cover_image_url,external_url,published,featured,is_owned,sort_order,published_at,created_at")
        .eq("published", true)
        .neq("item_type", "writing")
        .order("sort_order", { ascending: true })
        .order("published_at", { ascending: false }),
      supabase.from("site_pages").select("sections").eq("slug", "life").maybeSingle(),
    ])
    items = (itemData ?? []) as PortfolioItem[]
    if (pageData?.sections) sections = normalizeSections(pageData.sections, sections)
  } catch {
    // Keep the Life page available with starter copy if the CMS is unavailable.
  }
  return <LifeOverview items={items} sections={sections} />
}
