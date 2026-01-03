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
    content: "Childish Gambino - Atavista",
    rotation: -2,
    color: "yellow",
    link: "https://open.spotify.com/album/your-album-id",
  },
  {
    id: "2",
    type: "watching",
    content: "The Bear Season 3",
    rotation: 1,
    color: "cream",
    link: "https://www.youtube.com/watch?v=your-video-id",
  },
  {
    id: "3",
    type: "reading",
    content: "The Creative Act by Rick Rubin",
    rotation: -1,
    color: "white",
    link: "https://www.goodreads.com/book/show/your-book-id",
  },
  {
    id: "4",
    type: "discovery",
    content: "Minimalist web design is making a comeback",
    rotation: 2,
    color: "brown",
    link: "https://example.com/article",
  },
  {
    id: "5",
    type: "listening",
    content: "Tems - Born in the Wild",
    rotation: -1.5,
    color: "white",
    link: "https://open.spotify.com/album/your-album-id",
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
