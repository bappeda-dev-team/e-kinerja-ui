import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getRoleName } from "@/lib/roles"
import MasterPemda from "./_roles/super-admin/MasterPemdaClient"

export default async function MasterPemdaPage() {
  const session = await getServerSession(authOptions)
  const role = getRoleName(session)

  if (role === "super_admin") return <MasterPemda />

  redirect("/dashboard")
}
