// components/authenticated-shell.tsx

"use client"

import dynamic from "next/dynamic"
import { Session } from "next-auth"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

const Header = dynamic(() => import("@/components/header").then(m => m.Header), { ssr: false })

interface Props {
  children: React.ReactNode
  session: Session | null
}

export function AuthenticatedShell({ children, session }: Props) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar session={session} />
        <SidebarInset className="flex flex-1 flex-col">
          <Header title="Aplikasi Penunjang Kinerja" session={session} />
          <main className="flex-1 p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
