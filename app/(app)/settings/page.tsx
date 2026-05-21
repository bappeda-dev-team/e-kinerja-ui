import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getRoleName } from "@/lib/roles"
import SuperAdminSettings from "./_components/SuperAdminSettings"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  const role = getRoleName(session)

  if (role === "super_admin") return <SuperAdminSettings />

  redirect("/dashboard")
}
