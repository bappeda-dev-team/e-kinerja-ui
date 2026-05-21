import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getRoleName } from "@/lib/roles"
import MasterRoles from "./_roles/super-admin/MasterRolesClient"

export default async function MasterRolesPage() {
  const session = await getServerSession(authOptions)
  const role = getRoleName(session)

  if (role === "super_admin") return <MasterRoles />

  redirect("/dashboard")
}
