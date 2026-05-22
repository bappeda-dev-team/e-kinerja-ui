import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getRoleName } from "@/lib/roles"
import AdminProfile from "./_roles/admin/ProfileClient"
import ProfileView from "./_roles/programmer/ProfileClient"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  const role = getRoleName(session)

  if (role === "admin") return <AdminProfile />

  return <ProfileView />
}
