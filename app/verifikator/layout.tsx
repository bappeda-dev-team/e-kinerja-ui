// app/verifikator/layout.tsx

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { VerifikatorShell } from "@/components/verifikator-shell"

export default async function VerifikatorLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  return <VerifikatorShell session={session}>{children}</VerifikatorShell>
}
