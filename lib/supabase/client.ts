import { createBrowserClient } from "@supabase/ssr"

// Supabase publishable keys are designed for browser use; RLS protects all data.
// Environment variables can override these defaults for local/staging deployments.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://akgzftoebezfnmvnlokq.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "sb_publishable_dl4mSQ58vvc94xX5i2yVzQ_CN9GUb44"

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey)
}
