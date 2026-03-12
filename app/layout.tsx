import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Toaster } from "sonner"

import "./globals.css"

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "E-Kinerja",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${fontSans.variable}
          ${fontMono.variable}
          min-h-screen
          bg-background
          font-sans
          antialiased
        `}
      >
        {children}

        <Toaster
          position="top-center"
          richColors
          closeButton
          expand
        />
      </body>
    </html>
  )
}
