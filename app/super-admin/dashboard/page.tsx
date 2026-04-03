import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import DashboardClient from "./_components/DashboardClient"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  return <DashboardClient session={session} />
}
