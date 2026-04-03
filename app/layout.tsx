// app/layout.tsx

import type { Metadata } from "next"
import { Nunito_Sans, JetBrains_Mono } from "next/font/google" // Ganti Inter ke Nunito_Sans
import { Toaster } from "sonner"
import { Providers } from "@/components/providers"

import "./globals.css"

// Konfigurasi Nunito Sans
const fontSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "600", "700", "800"], // Menambahkan variasi ketebalan agar aman untuk Bold/SemiBold
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
        <Providers>
          {children}
        </Providers>

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