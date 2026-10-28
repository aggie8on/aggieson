import { HomePageSections } from "@/components/home-page-sections"
import { getIcons, getLifeItems, getProjects, getSiteSections, getTweetPosts, getWriting } from "@/lib/portfolio-data"

export const revalidate = 0

export default async function HomePage() {
  const [sections, writing, projects, life, tweets, icons] = await Promise.all([
    getSiteSections("home"),
    getWriting(),
    getProjects(),
    getLifeItems({ limit: 8, featuredFirst: true }),
    getTweetPosts(6),
    getIcons(),
  ])

  const posts = writing.data.slice(0, 3).map((post) => ({ slug: post.slug, title: post.title, date: post.dateShort }))
  const featuredProjects = projects.data.filter((project) => project.featured)

  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-10 sm:px-6 md:pt-14">
      <HomePageSections sections={sections} posts={posts} lifeItems={life.data} projectItems={featuredProjects} tweetPosts={tweets.data} icons={icons} />
    </main>
  )
}
