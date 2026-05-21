import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getRoleName } from "@/lib/roles"
import { AuthenticatedShell } from "@/components/authenticated-shell"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const role = getRoleName(session)
  if (!role) redirect("/unauthorized")

  return <AuthenticatedShell session={session}>{children}</AuthenticatedShell>
}
