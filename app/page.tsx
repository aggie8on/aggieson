import Link from "next/link"
import { ArrowUpRight, Download } from "lucide-react"
import { blogPosts } from "@/lib/blog-data"

const selectedWork = [
  { title: "Phone 3(a) Community Edition", category: "Product design", year: "2024" },
  { title: "Ear(Open) Concept", category: "Audio design", year: "2024" },
  { title: "Skarper", category: "Mobility", year: "2023" },
  { title: "Inaya", category: "Wellness", year: "2023" },
]

export default function HomePage() {
  const latestPosts = Object.values(blogPosts)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  return (
    <>
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-16 md:pt-24">
        <div className="space-y-20 md:space-y-24">
          <section aria-labelledby="intro-heading" className="space-y-7">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Designer · Creator · Curious human</p>
              <h1 id="intro-heading" className="text-4xl font-medium tracking-[-0.045em] md:text-5xl">
                Aggieson
              </h1>
              <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                People, places & moments. Helping people set up podcasts, usually with a camera nearby.
                I share the things I make, notice, and learn along the way.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="#contact"
                className="inline-flex h-9 items-center gap-2 rounded-md bg-[#ff6321] px-5 text-[13px] font-medium tracking-[-0.02em] text-white shadow-[0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_0.75px_rgba(255,255,255,0.12),inset_0_-1px_0_#d95017] transition-transform hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6321] focus-visible:ring-offset-2"
              >
                Book a call <ArrowUpRight size={14} strokeWidth={1.8} />
              </Link>
              <a
                href="/cv.pdf"
                download
                className="inline-flex h-9 items-center gap-2 rounded-md border border-black/[0.09] bg-white px-5 text-[13px] font-medium tracking-[-0.02em] text-[#4e4e4e] shadow-[0_1px_3px_rgba(11,19,36,0.07),inset_0_-1px_0_rgba(0,0,0,0.12)] transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
              >
                Download CV <Download size={13} strokeWidth={1.7} />
              </a>
            </div>
          </section>

          <section aria-labelledby="work-heading" className="space-y-5">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="work-heading" className="text-sm font-medium text-muted-foreground">Selected work</h2>
              <Link href="/efforts" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                All work <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="divide-y divide-border border-y border-border">
              {selectedWork.map((project) => (
                <Link
                  key={project.title}
                  href="/efforts"
                  className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4 transition-colors hover:text-muted-foreground sm:grid-cols-[minmax(0,1fr)_150px_44px]"
                >
                  <span className="font-medium tracking-[-0.02em]">{project.title}</span>
                  <span className="hidden text-sm text-muted-foreground sm:block">{project.category}</span>
                  <span className="text-right text-sm tabular-nums text-muted-foreground">{project.year}</span>
                </Link>
              ))}
            </div>
          </section>

          <section aria-labelledby="writing-heading" className="space-y-5">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="writing-heading" className="text-sm font-medium text-muted-foreground">Recent writing</h2>
              <Link href="/blog" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                All writing <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="divide-y divide-border border-y border-border">
              {latestPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  <span className="font-medium tracking-[-0.02em] transition-colors group-hover:text-muted-foreground">
                    {post.title}
                  </span>
                  <span className="shrink-0 text-sm text-muted-foreground">{post.date}</span>
                </Link>
              ))}
              {latestPosts.length === 0 && (
                <p className="py-4 text-sm text-muted-foreground">New writing coming soon.</p>
              )}
            </div>
          </section>

          <section id="contact" aria-labelledby="contact-heading" className="flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <h2 id="contact-heading" className="text-xl font-medium tracking-tight">Have something in mind?</h2>
              <p className="max-w-md text-sm leading-6 text-muted-foreground">
                For projects, collaborations, or a good conversation, reach out.
              </p>
            </div>
            <Link
              href="https://x.com/aggie8on"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-1 text-sm font-medium transition-colors hover:text-muted-foreground"
            >
              Get in touch <ArrowUpRight size={14} strokeWidth={1.8} />
            </Link>
          </section>
        </div>
      </main>
    </>
  )
}
