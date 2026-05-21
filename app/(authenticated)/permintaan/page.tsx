import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getRoleName } from "@/lib/roles"
import AdminPermintaan from "./_roles/admin/PermintaanClient"
import SuperAdminPermintaan from "./_roles/super-admin/PermintaanClient"

export default async function PermintaanPage() {
  const session = await getServerSession(authOptions)
  const role = getRoleName(session)

  if (role === "admin") return <AdminPermintaan />
  if (role === "super_admin") return <SuperAdminPermintaan />

  redirect("/dashboard")
}
