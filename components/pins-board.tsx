"use client"

import { Music, Tv, Book, Lightbulb, ExternalLink } from "lucide-react"

interface Pin {
  id: string
  type: "listening" | "watching" | "reading" | "discovery"
  content: string
  rotation: number
  color: "cream" | "white" | "brown" | "yellow"
  link?: string
}

const pins: Pin[] = [
  {
    id: "1",
    type: "listening",
    content: "Astar 95 - NAMUNYU",
    rotation: -2,
    color: "yellow",
    link: "https://www.youtube.com/watch?v=l4A2gZz5oe0&list=RDl4A2gZz5oe0&start_radio=1",
  },
  {
    id: "2",
    type: "watching",
    content: "The Minimalists - Netflix",
    rotation: 1,
    color: "cream",
    link: "https://www.netflix.com/title/80114460",
  },
  {
    id: "3",
    type: "reading",
    content: "Less is More by Jason Hickel",
    rotation: -1,
    color: "white",
    link: "https://www.jasonhickel.org/less-is-more",
  },
  {
    id: "4",
    type: "listening",
    content: "Minimalism Playlist - Spotify",
    rotation: 2,
    color: "brown",
    link: "https://open.spotify.com/playlist/25ok5LYx52rPzQaxiiYNYy",
  },
  {
    id: "5",
    type: "listening",
    content: "Mulala - Afrie Music",
    rotation: -1.5,
    color: "white",
    link: "https://youtu.be/9dKeUBye-Gg?si=bS1PtzybtZsugZI1",
  },
  {
    id: "6",
    type: "discovery",
    content: "The art of doing nothing",
    rotation: 1.5,
    color: "yellow",
  },
]

const iconMap = {
  listening: Music,
  watching: Tv,
  reading: Book,
  discovery: Lightbulb,
}

const colorMap = {
  cream: "bg-[#F5F3E7]",
  white: "bg-white",
  brown: "bg-[#E8DCC4]",
  yellow: "bg-[#FFF8DC]",
}

export function PinsBoard() {
  return (
    <section className="space-y-8">
      <h2 className="text-xl font-medium">📌 Pins</h2>
      <div className="relative bg-[#D4C4A8] rounded-lg p-8 md:p-12 shadow-sm min-h-[500px]">
        {/* Cork board texture overlay */}
        <div
          className="absolute inset-0 opacity-5 rounded-lg"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="100" height="100" fill="%23000"/%3E%3C/svg%3E")',
            backgroundSize: "2px 2px",
          }}
        ></div>

        <div className="relative grid grid-cols-2 md:grid-cols-3 gap-6">
          {pins.map((pin) => {
            const Icon = iconMap[pin.type]
            const NoteContent = (
              <>
                {/* Pin */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <div className="w-4 h-4 rounded-full bg-red-500 shadow-md border-2 border-red-600"></div>
                </div>

                {/* Sticky note */}
                <div
                  className={`${colorMap[pin.color]} p-4 rounded-sm shadow-md min-h-[140px] flex flex-col justify-between group-hover:shadow-lg transition-shadow`}
                >
                  <div className="flex items-start gap-2">
                    <Icon className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-800 leading-relaxed font-handwriting">{pin.content}</p>
                  </div>
                  {pin.link && (
                    <div className="flex justify-end mt-2">
                      <ExternalLink className="w-3 h-3 text-gray-500" />
                    </div>
                  )}
                </div>
              </>
            )

            return (
              <div
                key={pin.id}
                className="relative group"
                style={{
                  transform: `rotate(${pin.rotation}deg)`,
                  transition: "transform 0.3s ease",
                }}
              >
                {pin.link ? (
                  <a
                    href={pin.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:scale-105 transition-transform"
                  >
                    {NoteContent}
                  </a>
                ) : (
                  NoteContent
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
