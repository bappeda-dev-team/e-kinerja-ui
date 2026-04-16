// app/admin/layout.tsx

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { AdminShell } from "@/components/admin-shell"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  return <AdminShell session={session}>{children}</AdminShell>
}
