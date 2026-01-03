export interface Product {
  id: string
  name: string
  price: number
  image: string
  images: string[] // added images array for carousel
  category: string
  description: string
}

export const products: Product[] = [
  {
    id: "print-001",
    name: "Masaba Landscape",
    price: 45,
    image: "/shop/print-masaba.jpg",
    images: ["/shop/print-masaba.jpg", "/shop/print-masaba-2.jpg", "/shop/print-masaba-3.jpg"], // added multiple images
    category: "Prints",
    description: "Limited edition print capturing the essence of Masaba land",
  },
  {
    id: "print-002",
    name: "Urban Moments",
    price: 40,
    image: "/shop/print-urban.jpg",
    images: ["/shop/print-urban.jpg", "/shop/print-urban-2.jpg", "/shop/print-urban-3.jpg"],
    category: "Prints",
    description: "A collection of captured moments from city life",
  },
  {
    id: "zine-001",
    name: "People & Places Zine Vol. 1",
    price: 25,
    image: "/shop/zine-vol1.jpg",
    images: ["/shop/zine-vol1.jpg", "/shop/zine-vol1-2.jpg", "/shop/zine-vol1-3.jpg"],
    category: "Zines",
    description: "First volume exploring the connection between people and their spaces",
  },
  {
    id: "photo-001",
    name: "Signed Photo Set",
    price: 60,
    image: "/shop/photo-set.jpg",
    images: ["/shop/photo-set.jpg", "/shop/photo-set-2.jpg", "/shop/photo-set-3.jpg"],
    category: "Photography",
    description: "Curated set of 5 signed photographs",
  },
  {
    id: "tote-001",
    name: "Aggieson Tote Bag",
    price: 30,
    image: "/shop/tote.jpg",
    images: ["/shop/tote.jpg", "/shop/tote-2.jpg", "/shop/tote-3.jpg"],
    category: "Merchandise",
    description: "Minimalist canvas tote with embroidered logo",
  },
  {
    id: "book-001",
    name: "Collected Writings 2024",
    price: 35,
    image: "/shop/book.jpg",
    images: ["/shop/book.jpg", "/shop/book-2.jpg", "/shop/book-3.jpg"],
    category: "Books",
    description: "A year of thoughts, observations, and reflections",
  },
]
