import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getRoleName } from "@/lib/roles"
import AdminDistribusi from "./_components/admin/_components/DistribusiClient"
import SuperAdminDistribusi from "./_components/super-admin/_components/DistribusiClient"

export default async function DistribusiPage() {
  const session = await getServerSession(authOptions)
  const role = getRoleName(session)

  if (role === "admin") return <AdminDistribusi />
  if (role === "super_admin") return <SuperAdminDistribusi />

  redirect("/dashboard")
}
