"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { normalizeIcons, type SiteIcon } from "@/lib/icons"

let cache: SiteIcon[] | null = null
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())

export async function loadIcons(force = false): Promise<SiteIcon[]> {
  if (cache && !force) return cache
  const supabase = createClient()
  const { data } = await supabase.from("site_pages").select("sections").eq("slug", "icons").maybeSingle()
  cache = normalizeIcons(data?.sections)
  notify()
  return cache
}

export function setIconCache(list: SiteIcon[]) {
  cache = list
  notify()
}

/** The icon library, shared by every text field in Studio. */
export function useIcons(): SiteIcon[] {
  const [list, setList] = useState<SiteIcon[]>(cache ?? [])
  useEffect(() => {
    const update = () => setList(cache ?? [])
    listeners.add(update)
    void loadIcons().then(update)
    return () => { listeners.delete(update) }
  }, [])
  return list
}
