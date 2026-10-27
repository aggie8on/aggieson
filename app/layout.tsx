import type React from "react"
import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" })

export const metadata: Metadata = {
  title: "Aggieson - IndieDesigner",
  description: "The personal site of Aggieson: design work, writing, and notes from everyday life.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex-1">{children}</div>
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
