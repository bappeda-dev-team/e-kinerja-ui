import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getRoleName } from "@/lib/roles"
import AdminDashboard from "./_components/admin/_components/AdminDashboardClient"
import ProgrammerDashboard from "./_components/programmer/_components/ProgrammerDashboardClient"
import SuperAdminDashboard from "./_components/super-admin/_components/DashboardClient"
import VerifikatorDashboard from "./_components/verifikator/_components/VerifikatorDashboardClient"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const role = getRoleName(session)

  if (role === "admin") return <AdminDashboard />
  if (role === "programmer") return <ProgrammerDashboard />
  if (role === "super_admin") return <SuperAdminDashboard session={session} />
  if (role === "verifikator") return <VerifikatorDashboard />

  redirect("/unauthorized")
}
