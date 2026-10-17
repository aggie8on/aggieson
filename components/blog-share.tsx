"use client"

import { useState } from "react"
import { Twitter, Facebook, Linkedin, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

type CopyStatus = "copied" | "error" | null

export function BlogShare({ title }: { title: string }) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>(null)

  const handleShare = async (platform: "twitter" | "facebook" | "linkedin" | "copy") => {
    const url = window.location.href

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
          "_blank",
          "noopener,noreferrer",
        )
        break
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank",
          "noopener,noreferrer",
        )
        break
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          "_blank",
          "noopener,noreferrer",
        )
        break
      case "copy":
        try {
          await navigator.clipboard.writeText(url)
          setCopyStatus("copied")
        } catch {
          setCopyStatus("error")
        }
        window.setTimeout(() => setCopyStatus(null), 2500)
        break
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-y border-border py-4">
      <span className="mr-2 text-sm text-muted-foreground">Share:</span>
      <Button variant="ghost" size="icon" onClick={() => void handleShare("twitter")} className="h-8 w-8">
        <Twitter className="h-4 w-4" />
        <span className="sr-only">Share on X</span>
      </Button>
      <Button variant="ghost" size="icon" onClick={() => void handleShare("facebook")} className="h-8 w-8">
        <Facebook className="h-4 w-4" />
        <span className="sr-only">Share on Facebook</span>
      </Button>
      <Button variant="ghost" size="icon" onClick={() => void handleShare("linkedin")} className="h-8 w-8">
        <Linkedin className="h-4 w-4" />
        <span className="sr-only">Share on LinkedIn</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => void handleShare("copy")}
        className="h-8 w-8"
        title={copyStatus === "copied" ? "Copied!" : copyStatus === "error" ? "Copy failed" : "Copy link"}
      >
        <LinkIcon className="h-4 w-4" />
        <span className="sr-only">Copy link</span>
      </Button>
      {copyStatus === "copied" && <span role="status" className="text-xs text-muted-foreground">Copied!</span>}
      {copyStatus === "error" && (
        <span role="status" className="text-xs text-muted-foreground">
          Couldn’t copy. Copy the URL from your address bar.
        </span>
      )}
    </div>
  )
}
