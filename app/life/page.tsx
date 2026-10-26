import type { Metadata } from "next"
import { LifeOverview } from "@/components/life-overview"
import { getLifeItems, getSiteSections } from "@/lib/portfolio-data"

export const revalidate = 0
export const metadata: Metadata = { title: "Life | Aggieson", description: "Recipes, music, bookmarks, places and small things from everyday life." }

export default async function LifePage() {
  const [sections, life] = await Promise.all([getSiteSections("life"), getLifeItems()])
  return <LifeOverview items={life.data} sections={sections} />
}
