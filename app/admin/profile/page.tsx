import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getProfileById } from "@/services/profile.service"
import ProfileClient from "./_components/ProfileClient"
import logger from "@/lib/logger"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.user_id ?? (session?.user as any)?.id

  let initialProfile = null

  if (userId) {
    const start = Date.now()
    const res = await getProfileById(userId)
    const ms = Date.now() - start

    if (res.status === 200) {
      initialProfile = res.data?.data ?? null
      logger.info("profile fetched", { userId, ms })
    } else {
      logger.warn("profile fetch failed", { userId, status: res.status, message: res.data?.message })
    }
  } else {
    logger.warn("profile page: no userId in session")
  }

  return <ProfileClient initialProfile={initialProfile} />
}
