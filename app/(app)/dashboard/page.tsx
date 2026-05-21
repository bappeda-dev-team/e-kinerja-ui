import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getRoleName } from "@/lib/roles"
import AdminDashboard from "./_components/AdminDashboard"
import ProgrammerDashboard from "./_components/ProgrammerDashboard"
import SuperAdminDashboard from "./_components/SuperAdminDashboard"
import VerifikatorDashboard from "./_components/VerifikatorDashboard"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const role = getRoleName(session)

  if (role === "admin") return <AdminDashboard />
  if (role === "programmer") return <ProgrammerDashboard />
  if (role === "super_admin") return <SuperAdminDashboard session={session} />
  if (role === "verifikator") return <VerifikatorDashboard />

  redirect("/unauthorized")
}
