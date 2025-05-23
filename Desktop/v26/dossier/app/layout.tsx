import type React from "react"
import "./globals.css"
import "./components/portfolio.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

// Initialize the Inter font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Rayane Zangui | Portfolio",
  description: "Portfolio de Rayane Zangui, Développeur Web & Data",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={inter.className} suppressHydrationWarning>
      <head>
        {/* Load jQuery directly in the head */}
        <script src="https://code.jquery.com/jquery-3.6.0.min.js" defer></script>
        {/* Load parallax plugin after jQuery */}
        <script src="/scripts/jquery.parallax.js" defer></script>
        {/* Load initialization script after both are loaded */}
        <script src="/scripts/init-parallax.js" defer></script>
      </head>
      <body className="bg-black">{children}</body>
    </html>
  )
}
