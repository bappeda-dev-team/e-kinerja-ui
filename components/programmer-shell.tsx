"use client"

import { Session } from "next-auth"
import { ProgrammerNavbar } from "./programmer-navbar"

interface Props {
  children: React.ReactNode
  session: Session | null
}

export function ProgrammerShell({ children, session }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC]">
      <ProgrammerNavbar session={session} />
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-2 pt-0 sm:p-6 sm:pt-2 md:p-8 md:pt-4">
        {children}
      </main>
    </div>
  )
}
