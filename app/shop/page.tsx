"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { products } from "@/lib/shop-data"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-store"
import { ProductDetailModal } from "@/components/product-detail-modal"
import { useState } from "react"
import type { Product } from "@/lib/shop-data"

export default function ShopPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation()
    addItem()
  }

  return (
    <>
      <Navigation />
      <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="space-y-8">
          <header className="space-y-2">
            <h1 className="text-4xl font-medium tracking-tight">Shop</h1>
            <p className="text-muted-foreground">Prints, zines, and other creative works</p>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group space-y-3 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-sm">{product.name}</h3>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                  <p className="text-sm font-medium">${product.price}</p>
                </div>
                <Button
                  size="sm"
                  className="w-full bg-transparent"
                  variant="outline"
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  Add to Cart
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <ProductDetailModal product={selectedProduct} open={!!selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  )
}
