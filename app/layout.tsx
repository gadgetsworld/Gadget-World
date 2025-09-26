
import type React from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Suspense } from "react"
import { LayoutClient } from "@/components/layout-client"
import { Analytics } from "@vercel/analytics/next"

import "./globals.css"

export const metadata: import("next").Metadata = {
  title: "Gadgets World | Buy, Sell & Repair Gadgets",
  description:
    "Buy, sell, and repair phones, laptops, and tablets. Trusted marketplace with instant quotes, doorstep pickup, and expert repairs.",
  generator: "v0.app",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Navbar />
        <Suspense>
          <LayoutClient>
            <main className="min-h-[calc(100dvh-240px)]">{children}</main>
          </LayoutClient>
        </Suspense>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
