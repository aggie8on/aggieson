"use client"

import { useEffect, useState } from "react"

function dateOnly(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
}

function dateAndTime(iso: string) {
  const date = new Date(iso)
  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  const day = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  return `${time} · ${day}`
}

/**
 * When a post was made. The server can only know the date, so it shows that first;
 * once the page loads, it switches to the visitor's own time zone and adds the time of day.
 */
export function TweetTime({ iso, className }: { iso: string; className?: string }) {
  const valid = !Number.isNaN(new Date(iso).getTime())
  const [text, setText] = useState(() => (valid ? dateOnly(iso) : ""))
  useEffect(() => { if (valid) setText(dateAndTime(iso)) }, [iso, valid])
  if (!valid) return null
  return <time dateTime={iso} className={className}>{text}</time>
}
