"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/shop-data"
import Image from "next/image"
import { X, Banknote, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { BankDetailsModal } from "./bank-details-modal"
import { ContactFormModal } from "./contact-form-modal"

interface ProductDetailModalProps {
  product: Product | null
  open: boolean
  onClose: () => void
}

export function ProductDetailModal({ product, open, onClose }: ProductDetailModalProps) {
  const [showBankDetails, setShowBankDetails] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!product) return null

  const images = product.images || [product.image]
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md p-0 gap-0">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          <div className="space-y-6 p-6">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
              <Image
                src={images[currentImageIndex] || "/placeholder.svg"}
                alt={`${product.name} - Image ${currentImageIndex + 1}`}
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />

              {images.length > 1 && (
                <>
                  {/* Navigation Arrows */}
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* Dot Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/75"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-medium">{product.name}</h2>
                <p className="text-sm text-muted-foreground">{product.category}</p>
                <p className="text-xl font-medium">${product.price}</p>
              </div>

              <p className="text-sm text-muted-foreground">{product.description}</p>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <Button onClick={() => setShowBankDetails(true)} className="gap-2" variant="default">
                  <Banknote className="h-4 w-4" />
                  Pay Now
                </Button>
                <Button onClick={() => setShowContactForm(true)} className="gap-2" variant="outline">
                  <MessageCircle className="h-4 w-4" />
                  Pay In Person
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BankDetailsModal open={showBankDetails} onClose={() => setShowBankDetails(false)} />

      <ContactFormModal open={showContactForm} onClose={() => setShowContactForm(false)} product={product} />
    </>
  )
}
