import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { SitePageBuilder } from "@/components/site-page-builder"

export default async function StudioPagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email?.toLowerCase() !== "aggie8on@gmail.com") redirect("/studio/login")
  return <SitePageBuilder />
}
