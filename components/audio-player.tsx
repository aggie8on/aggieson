"use client"

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react"
import { Pause, Play, SkipBack, SkipForward } from "lucide-react"

export type Track = {
  id: string
  title: string
  artist?: string
  src: string
  cover?: string
  note?: string
}

function clock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
  const whole = Math.floor(seconds)
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`
}

/** A thin, quiet progress bar you can click, drag, or move with the arrow keys. */
function ProgressBar({ value, max, onSeek, label }: { value: number; max: number; onSeek: (seconds: number) => void; label: string }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const ratio = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0

  function seekFromPointer(event: PointerEvent<HTMLDivElement>) {
    const box = trackRef.current?.getBoundingClientRect()
    if (!box || box.width === 0 || max <= 0) return
    onSeek(Math.min(1, Math.max(0, (event.clientX - box.left) / box.width)) * max)
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 15 : 5
    if (event.key === "ArrowRight" || event.key === "ArrowUp") onSeek(Math.min(max, value + step))
    else if (event.key === "ArrowLeft" || event.key === "ArrowDown") onSeek(Math.max(0, value - step))
    else if (event.key === "Home") onSeek(0)
    else if (event.key === "End") onSeek(max)
    else return
    event.preventDefault()
  }

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={Math.round(max)}
      aria-valuenow={Math.round(value)}
      aria-valuetext={`${clock(value)} of ${clock(max)}`}
      onKeyDown={onKeyDown}
      onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setDragging(true); seekFromPointer(event) }}
      onPointerMove={(event) => { if (dragging) seekFromPointer(event) }}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      className="group relative flex h-5 w-full cursor-pointer touch-none items-center outline-none"
    >
      <div ref={trackRef} className="relative h-[3px] w-full rounded-full bg-border transition-[height] group-hover:h-1 group-focus-visible:h-1">
        <div className="absolute inset-y-0 left-0 rounded-full bg-foreground" style={{ width: `${ratio * 100}%` }} />
        <span
          aria-hidden="true"
          className={`absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground shadow-sm transition-opacity ${dragging ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"}`}
          style={{ left: `${ratio * 100}%` }}
        />
      </div>
    </div>
  )
}

const control = "inline-flex items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-30 disabled:hover:bg-transparent"

/**
 * The site's own audio player: previous, play/pause and next, a progress bar, and the list of tracks underneath.
 * Black, white and grey only, so it follows light and dark mode with the rest of the site.
 */
export function AudioPlayer({ tracks }: { tracks: Track[] }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [failed, setFailed] = useState(false)
  // Set when the person asks to play, so a track change keeps playing without autoplaying on page load.
  const shouldPlay = useRef(false)

  const track = tracks[Math.min(index, tracks.length - 1)]
  const multiple = tracks.length > 1

  const go = useCallback((next: number, play = true) => {
    shouldPlay.current = play
    setFailed(false); setTime(0); setDuration(0)
    setIndex(((next % tracks.length) + tracks.length) % tracks.length)
  }, [tracks.length])

  // The file can finish loading its details before this component is ready to listen, so read them directly too.
  useEffect(() => {
    const audio = audioRef.current
    if (audio && audio.readyState >= 1 && Number.isFinite(audio.duration)) setDuration(audio.duration)
  }, [index, track?.src])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !shouldPlay.current) return
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
  }, [index])

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      shouldPlay.current = true
      audio.play().then(() => setPlaying(true)).catch(() => { setPlaying(false); setFailed(true) })
    } else {
      shouldPlay.current = false
      audio.pause()
    }
  }

  function previous() {
    const audio = audioRef.current
    // Like most players: past the first few seconds, "back" restarts the track.
    if (audio && audio.currentTime > 3) { audio.currentTime = 0; setTime(0); return }
    go(index - 1, playing || shouldPlay.current)
  }

  function seek(seconds: number) {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = seconds
    setTime(seconds)
  }

  if (!track) return null

  return (
    <section aria-label="Music player" className="rounded-xl border border-border bg-accent/20 p-4">
      <audio
        ref={audioRef}
        src={track.src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onError={() => { setFailed(true); setPlaying(false) }}
        onEnded={() => { if (multiple && index < tracks.length - 1) go(index + 1); else { shouldPlay.current = false; setPlaying(false); setTime(0) } }}
      />

      <div className="flex items-center gap-3">
        {track.cover
          ? <img src={track.cover} alt="" className="size-11 shrink-0 rounded-md border border-border object-cover grayscale" />
          : <span aria-hidden="true" className="size-11 shrink-0 rounded-md border border-border bg-muted/20" />}
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-medium">{track.title}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{failed ? "This file couldn't be played." : track.artist || " "}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button type="button" onClick={previous} disabled={!multiple && time < 1} aria-label={multiple ? "Previous track" : "Restart"} className={`${control} size-9`}><SkipBack size={16} strokeWidth={1.6} aria-hidden="true" /></button>
          <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="inline-flex size-10 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-ring/40">
            {playing ? <Pause size={16} fill="currentColor" strokeWidth={0} aria-hidden="true" /> : <Play size={16} fill="currentColor" strokeWidth={0} className="translate-x-px" aria-hidden="true" />}
          </button>
          <button type="button" onClick={() => go(index + 1, playing || shouldPlay.current)} disabled={!multiple} aria-label="Next track" className={`${control} size-9`}><SkipForward size={16} strokeWidth={1.6} aria-hidden="true" /></button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <span className="w-9 shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">{clock(time)}</span>
        <ProgressBar value={time} max={duration} onSeek={seek} label={`Progress of ${track.title}`} />
        <span className="w-9 shrink-0 text-[11px] tabular-nums text-muted-foreground">{clock(duration)}</span>
      </div>

      {track.note && <p className="mt-2 text-xs leading-5 text-muted-foreground">{track.note}</p>}

      {multiple && (
        <ol aria-label="Tracks" className="mt-3 divide-y divide-border border-t border-border">
          {tracks.map((entry, position) => {
            const current = position === index
            return (
              <li key={entry.id}>
                <button type="button" onClick={() => (current ? toggle() : go(position))} aria-current={current ? "true" : undefined} className="flex w-full items-center gap-3 py-2 text-left text-sm transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40">
                  <span className="w-4 shrink-0 text-center text-[11px] tabular-nums text-muted-foreground">
                    {current && playing ? <span aria-hidden="true" className="inline-flex h-3 items-end gap-[2px]"><i className="eq-bar" /><i className="eq-bar" /><i className="eq-bar" /></span> : position + 1}
                  </span>
                  <span className={`min-w-0 flex-1 truncate ${current ? "font-medium text-foreground" : "text-muted-foreground"}`}>{entry.title}</span>
                  {entry.artist && <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">{entry.artist}</span>}
                </button>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
