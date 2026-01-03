export interface Effort {
  id: string
  title: string
  image: string
  category: string
  year: string
  description: string
  images: string[]
  details: string[]
}

export const efforts: Effort[] = [
  {
    id: "phone-3a",
    title: "Phone 3(a) Community Edition",
    image: "/efforts/phone-3a.png",
    category: "Product Design",
    year: "2024",
    description: "A community-driven smartphone design that brings together user feedback and innovative features.",
    images: ["/efforts/phone-3a-1.png", "/efforts/phone-3a-2.png", "/efforts/phone-3a-3.png"],
    details: [
      "Collaborated with the community to create a unique smartphone design",
      "Focused on user experience and customization",
      "Implemented sustainable materials and practices",
    ],
  },
  {
    id: "ear-open",
    title: "Ear(Open) Concept",
    image: "/efforts/ear-open.png",
    category: "Audio Design",
    year: "2024",
    description: "Revolutionary open-ear audio technology that balances awareness with immersive sound.",
    images: ["/efforts/ear-open-1.png", "/efforts/ear-open-2.png", "/efforts/ear-open-3.png"],
    details: [
      "Designed for comfort during extended wear",
      "Innovative open-ear acoustic design",
      "Perfect balance of ambient awareness and audio quality",
    ],
  },
  {
    id: "snarl",
    title: "Snarl",
    image: "/efforts/snarl.png",
    category: "Concept Design",
    year: "2023",
    description: "An aggressive yet elegant exploration of form and function in consumer electronics.",
    images: ["/efforts/snarl-1.png", "/efforts/snarl-2.png", "/efforts/snarl-3.png"],
    details: [
      "Bold geometric forms meet functional design",
      "Explored new manufacturing techniques",
      "Pushed boundaries of conventional product design",
    ],
  },
  {
    id: "skarper",
    title: "Skarper",
    image: "/efforts/skarper.png",
    category: "Mobility",
    year: "2023",
    description: "Revolutionary e-bike conversion system that transforms any bicycle into an electric vehicle.",
    images: ["/efforts/skarper-1.png", "/efforts/skarper-2.png", "/efforts/skarper-3.png"],
    details: [
      "Clip-on electric drive system for any bike",
      "Smart connectivity and performance tracking",
      "Sustainable urban mobility solution",
    ],
  },
  {
    id: "inaya",
    title: "Inaya",
    image: "/efforts/inaya.png",
    category: "Wellness",
    year: "2023",
    description: "A thoughtful wellness device designed to support mental health and mindfulness practices.",
    images: ["/efforts/inaya-1.png", "/efforts/inaya-2.png", "/efforts/inaya-3.png"],
    details: [
      "Combines technology with mindfulness practices",
      "Intuitive interaction design",
      "Focus on user well-being and mental health",
    ],
  },
  {
    id: "taschlight",
    title: "taschlight",
    image: "/efforts/taschlight.png",
    category: "Lighting",
    year: "2022",
    description: "Portable lighting solution that merges functionality with minimalist aesthetic.",
    images: ["/efforts/taschlight-1.png", "/efforts/taschlight-2.png", "/efforts/taschlight-3.png"],
    details: ["Compact and portable design", "Long-lasting battery life", "Versatile mounting options"],
  },
]
