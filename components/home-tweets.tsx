import { TweetCard } from "@/components/embeds"
import { Reveal } from "@/components/reveal"
import type { TweetPost } from "@/lib/portfolio-data"

/**
 * Saved X posts on the homepage. Cards keep their natural height (tweets vary in length),
 * and the columns pack them together so there are no big gaps.
 */
export function HomeTweets({ posts, title }: { posts: TweetPost[]; title?: string }) {
  if (posts.length === 0) return null
  return (
    <section aria-label={title || "Posts from X"} className="space-y-4">
      {title && <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>}
      <ul className="columns-1 gap-3 sm:columns-2">
        {posts.map((post, index) => (
          <Reveal as="li" key={post.id} delay={index * 70} className="mb-3 break-inside-avoid">
            <TweetCard tweet={post.tweet} note={post.note} />
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
