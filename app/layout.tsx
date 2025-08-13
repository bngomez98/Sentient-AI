import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@/components/analytics"
import { Suspense } from "react"
import { ScrollToTop } from "@/components/scroll-to-top"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Fresh 535 — A Movement for Congressional Accountability",
  description:
    "A non-partisan civic movement to restore functional governance by replacing all 535 members of Congress with new, uncaptured representatives.",
  keywords: [
    "Fresh 535",
    "congressional accountability",
    "vote them out",
    "political reform",
    "democracy",
    "electoral reform",
    "anti-incumbent",
    "Project 2025",
  ],
  authors: [{ name: "Fresh 535" }],
  creator: "Fresh 535",
  publisher: "Fresh 535",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fresh535.org",
    title: "Fresh 535 — A Movement for Congressional Accountability",
    description:
      "Join the non-partisan movement to restore functional governance. If they're in, they're out. #Fresh535",
    siteName: "Fresh 535",
    images: [
      {
        url: "/brand-logo.png",
        width: 1200,
        height: 630,
        alt: "Fresh 535 Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fresh 535 — A Movement for Congressional Accountability",
    description:
      "Join the non-partisan movement to restore functional governance. If they're in, they're out. #Fresh535",
    images: ["/brand-logo.png"],
    creator: "@Fresh535",
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-brand-cream text-brand-charcoal antialiased">
        <Suspense>
          <ScrollToTop />
          <Header />
          <main className="pt-20">{children}</main>
          <Footer />
          <Toaster />
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
