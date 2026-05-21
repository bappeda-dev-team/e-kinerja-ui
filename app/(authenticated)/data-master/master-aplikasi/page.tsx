import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getRoleName } from "@/lib/roles"
import MasterAplikasi from "./_roles/super-admin/MasterAplikasiClient"

export default async function MasterAplikasiPage() {
  const session = await getServerSession(authOptions)
  const role = getRoleName(session)

  if (role === "super_admin") return <MasterAplikasi />

  redirect("/dashboard")
}
