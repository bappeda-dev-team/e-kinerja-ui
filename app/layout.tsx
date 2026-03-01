// app/layout.tsx
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"

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
   Metadata
========================= */

export const metadata: Metadata = {
  title: "E-Kinerja",
  description: "Sistem Laporan Kinerja",
}

/* =========================
   Layout
========================= */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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

            {/* Main Area */}
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
      </body>
    </html>
  )
}