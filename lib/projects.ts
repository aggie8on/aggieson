export interface Project {
  id: string
  title: string
  description: string
  year: string
  category: string
  image: string
  images: string[]
}

export const projects: Project[] = [
  {
    id: "1",
    title: "Phone 3(a) Community Edition",
    description: "A community-driven smartphone design that brings together user feedback and innovative features.",
    year: "2024",
    category: "Product Design",
    image: "/efforts/phone-3a.jpg",
    images: ["/efforts/phone-3a-1.jpg", "/efforts/phone-3a-2.jpg", "/efforts/phone-3a-3.jpg"],
  },
  {
    id: "2",
    title: "Ear(Open) Concept",
    description: "Open-ear audio technology designed to balance awareness with an immersive listening experience.",
    year: "2024",
    category: "Audio Design",
    image: "/efforts/ear-open.jpg",
    images: ["/efforts/ear-open-1.jpg", "/efforts/ear-open-2.jpg", "/efforts/ear-open-3.jpg"],
  },
  {
    id: "3",
    title: "Snarl",
    description: "An exploration of form and function in consumer electronics.",
    year: "2023",
    category: "Concept Design",
    image: "/efforts/snarl.jpg",
    images: ["/efforts/snarl-1.jpg", "/efforts/snarl-2.jpg", "/efforts/snarl-3.jpg"],
  },
  {
    id: "4",
    title: "Skarper",
    description: "An e-bike conversion system that transforms a bicycle into an electric vehicle.",
    year: "2023",
    category: "Mobility",
    image: "/efforts/skarper.jpg",
    images: ["/efforts/skarper-1.jpg", "/efforts/skarper-2.jpg", "/efforts/skarper-3.jpg"],
  },
  {
    id: "5",
    title: "Inaya",
    description: "A wellness concept designed around mindfulness and everyday care.",
    year: "2023",
    category: "Wellness",
    image: "/efforts/inaya.jpg",
    images: ["/efforts/inaya-1.jpg", "/efforts/inaya-2.jpg", "/efforts/inaya-3.jpg"],
  },
  {
    id: "6",
    title: "taschlight",
    description: "A portable lighting concept focused on function and minimal form.",
    year: "2022",
    category: "Lighting",
    image: "/efforts/taschlight.jpg",
    images: ["/efforts/taschlight-1.jpg", "/efforts/taschlight-2.jpg", "/efforts/taschlight-3.jpg"],
  },
  {
    id: "7",
    title: "Superstitious Objects",
    description: "An exploration of belief, ritual, and everyday objects.",
    year: "2022",
    category: "Concept Design",
    image: "/efforts/superstitious.jpg",
    images: ["/efforts/superstitious-1.jpg", "/efforts/superstitious-2.jpg"],
  },
  {
    id: "8",
    title: "Somvai",
    description: "A concept exploring how rest and short naps can fit into daily life.",
    year: "2023",
    category: "Wellness",
    image: "/efforts/somvai.jpg",
    images: ["/efforts/somvai-1.jpg", "/efforts/somvai-2.jpg", "/efforts/somvai-3.jpg"],
  },
]
