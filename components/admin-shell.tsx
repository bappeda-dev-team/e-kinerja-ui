"use client"

import { Session } from "next-auth"

import { AdminNavbar } from "@/components/admin-navbar"

interface Props {
  children: React.ReactNode
  session: Session | null
}

export function AdminShell({ children, session }: Props) {
  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <AdminNavbar session={session} />
      <main className="px-4 py-6 md:px-8">{children}</main>
    </div>
  )
}
