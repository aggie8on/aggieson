import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// These are public project settings, not service-role credentials. RLS enforces access.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://akgzftoebezfnmvnlokq.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "sb_publishable_dl4mSQ58vvc94xX5i2yVzQ_CN9GUb44"

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Server Components cannot write cookies; route handlers/actions can.
        }
      },
    },
  })
}
