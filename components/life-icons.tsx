import { Bookmark, Camera, ChefHat, Cpu, Gem, Music, Pin, type LucideIcon } from "lucide-react"

const icons: Record<string, LucideIcon> = {
  bookmark: Bookmark,
  recipe: ChefHat,
  gem: Gem,
  desk: Cpu,
  music: Music,
  photo: Camera,
  note: Pin,
}

export function KindIcon({ kind, size = 20, className, strokeWidth = 1.5 }: { kind: string; size?: number; className?: string; strokeWidth?: number }) {
  const Icon = icons[kind] ?? Bookmark
  return <Icon size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />
}
