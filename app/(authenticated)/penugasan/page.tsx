import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getRoleName } from "@/lib/roles"
import ProgrammerPenugasan from "./_roles/programmer/PenugasanClient"

export default async function PenugasanPage() {
  const session = await getServerSession(authOptions)
  const role = getRoleName(session)

  if (role === "programmer") return <ProgrammerPenugasan />

  redirect("/dashboard")
}
