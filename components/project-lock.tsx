import { Lock } from "lucide-react"

/** The small padlock shown right after the name of a project that is not complete yet. */
export function LockBadge({ className = "" }: { className?: string }) {
  return <Lock size={12} strokeWidth={1.8} role="img" aria-label="Not complete yet" className={`ml-1.5 inline-block shrink-0 -translate-y-px text-muted-foreground ${className}`} />
}

/** A description that is not for reading yet: blurred stand-in text, with the real meaning kept for screen readers. */
export function BlurredText({ children, className = "" }: { children: string; className?: string }) {
  return (
    <>
      <span aria-hidden="true" className={`select-none blur-[5px] ${className}`}>{children}</span>
      <span className="sr-only">Description hidden until this project is complete.</span>
    </>
  )
}
