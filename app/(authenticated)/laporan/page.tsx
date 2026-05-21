import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getRoleName } from "@/lib/roles"
import ProgrammerLaporan from "./_components/programmer/_components/LaporanKinerjaClient"
import SuperAdminLaporan from "./_components/super-admin/_components/LaporanKinerjaClient"

export default async function LaporanPage() {
  const session = await getServerSession(authOptions)
  const role = getRoleName(session)

  if (role === "programmer") return <ProgrammerLaporan />
  if (role === "super_admin") return <SuperAdminLaporan mode="rekap-only" />

  redirect("/dashboard")
}
