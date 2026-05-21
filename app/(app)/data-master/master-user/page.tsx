import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getRoleName } from "@/lib/roles"
import MasterUser from "./_components/MasterUser"

export default async function MasterUserPage() {
  const session = await getServerSession(authOptions)
  const role = getRoleName(session)

  if (role === "super_admin") return <MasterUser />

  redirect("/dashboard")
}
