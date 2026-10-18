"use client"

export function ContentMedia({ type, url, title }: { type?: string; url?: string; title: string }) {
  if (!url || !type || type === "none") return null
  if (type === "audio") return <div className="mt-6 space-y-2"><p className="text-sm font-medium">Listen to this post</p><audio controls preload="none" className="w-full"><source src={url} />Your browser does not support audio playback.</audio></div>
  if (type === "video") return <video controls preload="metadata" playsInline className="mt-6 max-h-[560px] w-full rounded-lg bg-black" aria-label={title}><source src={url} />Your browser does not support video playback.</video>
  if (type === "gif") return <img src={url} alt={title} loading="lazy" className="mt-6 max-h-[560px] w-auto max-w-full rounded-lg object-contain" />
  return null
}
