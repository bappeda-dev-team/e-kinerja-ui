"use client"

import { Session } from "next-auth"

import { VerifikatorNavbar } from "./verifikator-navbar"

interface Props {
  children: React.ReactNode
  session: Session | null
}

export function VerifikatorShell({ children, session }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC]">
      <VerifikatorNavbar session={session} />
      <main className="mx-auto flex w-full max-w-[1600px] flex-1 p-2 pt-0 sm:p-6 sm:pt-2 md:p-8 md:pt-4">
        <div className="w-full">{children}</div>
      </main>
    </div>
  )
}
