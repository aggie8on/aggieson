"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const OWNER_EMAIL = "aggie8on@gmail.com"

export default function StudioLoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage("")
    if (password.length < 8) { setMessage("Use a password with at least 8 characters."); return }
    setBusy(true)
    try {
      const supabase = createClient()
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email: OWNER_EMAIL, password, options: { emailRedirectTo: `${window.location.origin}/studio` } })
        if (error) throw error
        setMessage("Account request sent. If email confirmation is enabled, open the confirmation link in your inbox, then sign in.")
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: OWNER_EMAIL, password })
        if (error) throw error
        router.replace("/studio")
        router.refresh()
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to authenticate. Check your Supabase setup.")
    } finally { setBusy(false) }
  }

  return (
    <main className="mx-auto w-full max-w-md px-6 pb-24 pt-20 md:pt-28">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to portfolio</Link>
      <section className="mt-10 space-y-3">
        <p className="text-sm text-muted-foreground">Private workspace</p>
        <h1 className="text-4xl font-medium tracking-[-0.05em]">Studio</h1>
        <p className="text-sm leading-6 text-muted-foreground">Manage writing, recipes, music, bookmarks, wishlist items, and the little things you want to keep.</p>
      </section>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <div className="space-y-2"><label htmlFor="email" className="text-sm font-medium">Owner email</label><input id="email" type="email" value={OWNER_EMAIL} readOnly autoComplete="username" className="h-11 w-full rounded-md border border-input bg-muted/40 px-3 text-sm outline-none" /></div>
        <div className="space-y-2"><label htmlFor="password" className="text-sm font-medium">Password</label><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div>
        {message && <p role="status" className="rounded-md border border-border px-3 py-3 text-sm leading-6 text-muted-foreground">{message}</p>}
        <button disabled={busy} className="h-11 w-full rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60">{busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create owner account"}</button>
      </form>
      <button type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMessage("") }} className="mt-4 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">{mode === "login" ? "First time here? Create the owner account" : "Already have an account? Sign in"}</button>
      <p className="mt-8 text-xs leading-5 text-muted-foreground">Editing is restricted to the configured owner email. Public visitors can only read items you publish.</p>
    </main>
  )
}
