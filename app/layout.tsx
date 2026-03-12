'use client'

import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { usePathname } from "next/navigation"

import "./globals.css"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"

import { Toaster } from "sonner"

/* =========================
   Fonts
========================= */

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

/* =========================
   Layout
========================= */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const pathname = usePathname()

  /* route tanpa sidebar & header */
  const noLayoutRoutes = ["/login"]

  const showLayout = !noLayoutRoutes.includes(pathname)

  /* =========================
     LOGIN PAGE (tanpa layout)
  ========================= */

  if (!showLayout) {
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

  /* =========================
     HALAMAN DENGAN LAYOUT
  ========================= */

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
        <SidebarProvider>

          <div className="flex min-h-screen w-full">

            {/* Sidebar */}
            <AppSidebar />

            {/* Main */}
            <SidebarInset className="flex flex-1 flex-col">

              <Header
                title="Aplikasi Penunjang Kinerja"
                userName="Maw"
                role="super_admin"
                avatarUrl=""
              />

              <main className="flex-1 p-6">
                {children}
              </main>

            </SidebarInset>

          </div>

        </SidebarProvider>

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