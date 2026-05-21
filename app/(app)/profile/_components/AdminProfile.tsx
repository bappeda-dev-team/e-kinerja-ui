"use client"

import ProfileClient from "@/app/admin/profile/_components/ProfileClient"
import type { ProfileResponse } from "@/app/admin/profile/types"

export default function AdminProfile({ initialProfile }: { initialProfile: ProfileResponse | null }) {
  return <ProfileClient initialProfile={initialProfile} />
}
