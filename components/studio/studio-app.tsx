"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowUpRight, LogOut } from "lucide-react"
import { loadAllItems } from "@/components/studio/api"
import { CollectionPanel } from "@/components/studio/collection-panel"
import { ProjectPanel } from "@/components/studio/project-panel"
import { SiteTextPanel } from "@/components/studio/site-text-panel"
import { WritingPanel } from "@/components/studio/writing-panel"
import { Notice, secondaryButton } from "@/components/studio/ui"
import { PUBLIC_LIFE_TYPES, groupOf, type PortfolioItem } from "@/lib/life-content"
import { createClient } from "@/lib/supabase/client"

const OWNER_EMAIL = "aggie8on@gmail.com"
type TabKey = "writing" | "projects" | "bookmarks" | "lifelog" | "site"
const TABS: { key: TabKey; label: string }[] = [
  { key: "writing", label: "Writing" },
  { key: "projects", label: "Projects" },
  { key: "bookmarks", label: "Bookmarks" },
  { key: "lifelog", label: "Life log" },
  { key: "site", label: "Site text" },
]

export function StudioApp() {
  const router = useRouter()
  const [tab, setTab] = useState<TabKey>("writing")
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const reload = useCallback(async () => {
    const result = await loadAllItems()
    if (!result.ok) setError(result.error); else { setItems(result.data); setError("") }
  }, [])

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("tab")
    if (TABS.some((entry) => entry.key === fromUrl)) setTab(fromUrl as TabKey)
    async function start() {
      const supabase = createClient()
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) { router.replace("/studio/login"); return }
      if (user.email?.toLowerCase() !== OWNER_EMAIL) { await supabase.auth.signOut(); router.replace("/studio/login"); return }
      setEmail(user.email)
      await reload()
      setLoading(false)
    }
    void start()
  }, [reload, router])

  function choose(next: TabKey) {
    setTab(next)
    const url = new URL(window.location.href)
    url.searchParams.set("tab", next)
    window.history.replaceState(null, "", url.pathname + url.search)
  }

  async function signOut() {
    await createClient().auth.signOut()
    router.replace("/studio/login")
    router.refresh()
  }

  if (loading) return <main className="mx-auto max-w-3xl px-5 py-24 text-sm text-muted-foreground">Opening your studio…</main>

  const counts: Record<TabKey, number | undefined> = {
    writing: items.filter((item) => item.item_type === "writing").length,
    projects: items.filter((item) => item.item_type === "project").length,
    bookmarks: items.filter((item) => PUBLIC_LIFE_TYPES.includes(item.item_type) && groupOf(item) === "bookmarks").length,
    lifelog: items.filter((item) => PUBLIC_LIFE_TYPES.includes(item.item_type) && groupOf(item) === "lifelog").length,
    site: undefined,
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5 pb-24 pt-10 sm:px-6 md:pt-14">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Private workspace · {email}</p>
          <h1 className="mt-1 text-4xl font-medium tracking-[-0.05em]">Studio</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" target="_blank" className={secondaryButton}>View site <ArrowUpRight size={14} aria-hidden="true" /></Link>
          <button type="button" onClick={signOut} className={secondaryButton}><LogOut size={14} aria-hidden="true" /> Sign out</button>
        </div>
      </header>

      <div role="tablist" aria-label="Studio sections" className="mt-8 flex gap-1 overflow-x-auto border-b border-border">
        {TABS.map((entry) => (
          <button key={entry.key} role="tab" id={`tab-${entry.key}`} aria-selected={tab === entry.key} aria-controls={`panel-${entry.key}`} type="button" onClick={() => choose(entry.key)}
            className={`-mb-px shrink-0 border-b-2 px-4 py-2.5 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 ${tab === entry.key ? "border-foreground font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {entry.label}{counts[entry.key] !== undefined && <span className="ml-1.5 text-xs text-muted-foreground">{counts[entry.key]}</span>}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="mt-8">
        {error && <div className="mb-6"><Notice message={{ tone: "error", text: error }} /></div>}
        {tab === "writing" && <WritingPanel items={items} onChanged={reload} />}
        {tab === "projects" && <ProjectPanel items={items} onChanged={reload} />}
        {tab === "bookmarks" && <CollectionPanel group="bookmarks" items={items} onChanged={reload} />}
        {tab === "lifelog" && <CollectionPanel group="lifelog" items={items} onChanged={reload} />}
        {tab === "site" && <SiteTextPanel />}
      </div>
    </main>
  )
}
