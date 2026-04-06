// app/programmer/layout.tsx

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ProgrammerShell } from "@/components/programmer-shell"

export default async function ProgrammerLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  return <ProgrammerShell session={session}>{children}</ProgrammerShell>
}
