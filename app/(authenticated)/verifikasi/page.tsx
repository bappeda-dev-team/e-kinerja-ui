import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getRoleName } from "@/lib/roles"
import SuperAdminVerifikasi from "./_components/super-admin/_components/VerifikasiClient"
import VerifikatorVerifikasi from "./_components/verifikator/_components/VerifikasiPipelineClient"

export default async function VerifikasiPage() {
  const session = await getServerSession(authOptions)
  const role = getRoleName(session)

  if (role === "super_admin") return <SuperAdminVerifikasi />
  if (role === "verifikator") return <VerifikatorVerifikasi />

  redirect("/dashboard")
}
