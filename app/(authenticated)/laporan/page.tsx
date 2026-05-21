import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getRoleName } from "@/lib/roles"
import ProgrammerLaporan from "./_roles/programmer/LaporanKinerjaClient"
import SuperAdminLaporan from "./_roles/super-admin/LaporanKinerjaClient"

export default async function LaporanPage() {
  const session = await getServerSession(authOptions)
  const role = getRoleName(session)

  if (role === "programmer") return <ProgrammerLaporan />
  if (role === "super_admin") return <SuperAdminLaporan mode="rekap-only" />

  redirect("/dashboard")
}
