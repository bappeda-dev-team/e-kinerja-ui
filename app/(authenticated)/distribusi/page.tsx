import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getRoleName } from "@/lib/roles"
import AdminDistribusi from "./_roles/admin/DistribusiClient"
import SuperAdminDistribusi from "./_roles/super-admin/DistribusiClient"

export default async function DistribusiPage() {
  const session = await getServerSession(authOptions)
  const role = getRoleName(session)

  if (role === "admin") return <AdminDistribusi />
  if (role === "super_admin") return <SuperAdminDistribusi />

  redirect("/dashboard")
}
