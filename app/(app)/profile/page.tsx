import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getRoleName } from "@/lib/roles"
import { getProfileById } from "@/services/profile.service"
import AdminProfile from "./_components/AdminProfile"
import ProfileView from "./_components/ProfileView"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  const role = getRoleName(session)
  const userId = (session?.user as any)?.user_id ?? (session?.user as any)?.id

  if (role === "admin") {
    let initialProfile = null
    if (userId) {
      const res = await getProfileById(userId)
      if (res.status === 200) initialProfile = res.data?.data ?? null
    }
    return <AdminProfile initialProfile={initialProfile} />
  }

  return <ProfileView />
}
