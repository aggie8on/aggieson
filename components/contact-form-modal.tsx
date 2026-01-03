"use client"

import type React from "react"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import { useState } from "react"
import type { Product } from "@/lib/shop-data"

interface ContactFormModalProps {
  open: boolean
  onClose: () => void
  product: Product
}

export function ContactFormModal({ open, onClose, product }: ContactFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const emailBody = `
Product: ${product.name}
Price: $${product.price}

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}

Message:
${formData.message}
    `.trim()

    // Create mailto link
    const mailtoLink = `mailto:aggie8on@gmail.com?subject=Order Request: ${encodeURIComponent(product.name)}&body=${encodeURIComponent(emailBody)}`

    window.location.href = mailtoLink

    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: "", email: "", phone: "", message: "" })
      onClose()
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="space-y-6 pt-2">
          <div className="space-y-2">
            <h2 className="text-xl font-medium">Pay In Person</h2>
            <p className="text-sm text-muted-foreground">Fill out the form to arrange payment in person</p>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-2">
              <div className="text-4xl">✓</div>
              <p className="text-sm font-medium">Message sent!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Let me know when you'd like to meet..."
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
