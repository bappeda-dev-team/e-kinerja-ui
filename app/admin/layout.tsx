import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { AuthenticatedShell } from "@/components/authenticated-shell"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  return <AuthenticatedShell session={session}>{children}</AuthenticatedShell>
}
