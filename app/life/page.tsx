import type { Metadata } from "next"
import { LifeOverview } from "@/components/life-overview"
import { getIcons, getLifeItems, getSiteSections } from "@/lib/portfolio-data"

export const revalidate = 0
export const metadata: Metadata = { title: "Life | Aggieson", description: "Recipes, music, bookmarks, places and small things from everyday life." }

export default async function LifePage() {
  const [sections, life, icons] = await Promise.all([getSiteSections("life"), getLifeItems(), getIcons()])
  return <LifeOverview items={life.data} sections={sections} icons={icons} />
}
