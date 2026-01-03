"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Copy, Check } from "lucide-react"
import { useState } from "react"

interface BankDetailsModalProps {
  open: boolean
  onClose: () => void
}

export function BankDetailsModal({ open, onClose }: BankDetailsModalProps) {
  const [copied, setCopied] = useState(false)
  const accountNumber = "6008840820"

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
            <h2 className="text-xl font-medium">Bank Transfer</h2>
            <p className="text-sm text-muted-foreground">Send payment to the account below</p>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
              <p className="text-xs text-muted-foreground">Bank Name</p>
              <p className="font-medium">ABSA UGANDA</p>
            </div>

            <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
              <p className="text-xs text-muted-foreground">Account Number</p>
              <div className="flex items-center justify-between">
                <p className="font-medium font-mono">{accountNumber}</p>
                <Button size="sm" variant="ghost" onClick={handleCopy} className="h-8 w-8 p-0">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="rounded-lg bg-muted/30 p-4 space-y-2">
              <p className="text-sm">After payment, share screenshot of proof to:</p>
              <a
                href="https://wa.link/5ae14w"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-foreground hover:underline inline-block"
              >
                +256749639250
              </a>
            </div>
          </div>

          <Button onClick={onClose} className="w-full">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
