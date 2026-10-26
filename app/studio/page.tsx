import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StudioApp } from "@/components/studio/studio-app"

export default async function StudioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email?.toLowerCase() !== "aggie8on@gmail.com") {
    redirect("/studio/login")
  }
  return <StudioApp />
}
