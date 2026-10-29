/**
 * A quiet sky across the very top of every page, behind the content. In dark mode: a deep blue dusk with faint
 * stars and a small moon. In light mode: pale daylight, soft drifting clouds, and sunlight arriving from the far
 * east (the top-right corner). Both fade out well before the text, and which one shows follows the theme (see the
 * Sky section of globals.css). It is decorative only.
 */

function seeded(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Fixed positions, so the server and the browser draw exactly the same stars.
const STARS = (() => {
  const random = seeded(11)
  return Array.from({ length: 70 }, (_, index) => ({
    x: Math.round(random() * 10000) / 10,
    y: Math.round(Math.pow(random(), 1.4) * 5200) / 10,
    r: Math.round((0.45 + random() * 0.85) * 100) / 100,
    o: Math.round((0.3 + random() * 0.6) * 100) / 100,
    group: index % 3,
  }))
})()

export function Sky() {
  return (
    <div aria-hidden="true" className="sky print:hidden">
      <div className="sky-night">
        <svg className="sky-stars" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMin slice">
          {[0, 1, 2].map((group) => (
            <g key={group} className={`star-group star-g${group}`}>
              {STARS.filter((star) => star.group === group).map((star, index) => <circle key={index} cx={star.x} cy={star.y} r={star.r} opacity={star.o} />)}
            </g>
          ))}
        </svg>
        <span className="sky-moon" />
      </div>
      <div className="sky-day">
        <span className="sky-sun" />
        <span className="sky-cloud sky-cloud-a" />
        <span className="sky-cloud sky-cloud-b" />
        <span className="sky-cloud sky-cloud-c" />
      </div>
    </div>
  )
}
