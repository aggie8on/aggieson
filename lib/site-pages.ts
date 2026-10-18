export type SiteSectionType = "intro" | "projects" | "writing" | "life" | "text" | "image" | "links"

export type SiteSection = {
  id: string
  type: SiteSectionType
  title: string
  eyebrow: string
  text: string
  body: string
  image: string
  visible: boolean
  layout: "stack" | "split" | "wide" | "compact"
}

export type SitePage = { slug: string; title: string; sections: SiteSection[] }

export const defaultSitePages: Record<string, SitePage> = {
  home: {
    slug: "home",
    title: "Homepage",
    sections: [
      { id: "intro", type: "intro", title: "Aggieson", eyebrow: "", text: "Human designer. Currently at Toothless working on identities and systems — crafting interfaces and building design tooling.", body: "I enjoy making useful things and care a lot about making them feel simple and considered.", image: "", visible: true, layout: "stack" },
      { id: "projects", type: "projects", title: "Selected projects", eyebrow: "", text: "", body: "", image: "", visible: true, layout: "stack" },
      { id: "writing", type: "writing", title: "Recent writing", eyebrow: "", text: "", body: "", image: "", visible: true, layout: "stack" },
      { id: "life", type: "life", title: "Life, lately", eyebrow: "", text: "", body: "", image: "", visible: true, layout: "stack" },
    ],
  },
  projects: {
    slug: "projects",
    title: "Projects",
    sections: [
      { id: "projects-intro", type: "intro", title: "Projects", eyebrow: "Selected work", text: "A collection of things I have helped make, explored, and learned from.", body: "", image: "", visible: true, layout: "stack" },
      { id: "projects-list", type: "projects", title: "Projects", eyebrow: "", text: "", body: "", image: "", visible: true, layout: "stack" },
    ],
  },
  life: {
    slug: "life",
    title: "Life, lately.", 
    sections: [
      { id: "life-intro", type: "intro", title: "Life, lately.", eyebrow: "Outside the portfolio", text: "A growing collection of things I enjoy, keep close, cook, listen to, use, and want to remember.", body: "", image: "", visible: true, layout: "stack" },
      { id: "life-list", type: "life", title: "Everything", eyebrow: "", text: "", body: "", image: "", visible: true, layout: "stack" },
    ],
  },
}

export function normalizeSections(value: unknown, fallback: SiteSection[]): SiteSection[] {
  if (!Array.isArray(value)) return fallback
  return value.filter((item): item is SiteSection => Boolean(item && typeof item === "object" && typeof item.id === "string" && typeof item.type === "string"))
    .map((item) => ({
      id: item.id,
      type: (["intro", "projects", "writing", "life", "text", "image", "links"].includes(item.type) ? item.type : "text") as SiteSectionType,
      title: typeof item.title === "string" ? item.title : "",
      eyebrow: typeof item.eyebrow === "string" ? item.eyebrow : "",
      text: typeof item.text === "string" ? item.text : "",
      body: typeof item.body === "string" ? item.body : "",
      image: typeof item.image === "string" ? item.image : "",
      visible: item.visible !== false,
      layout: (["stack", "split", "wide", "compact"].includes(item.layout) ? item.layout : "stack") as SiteSection["layout"],
    }))
}
