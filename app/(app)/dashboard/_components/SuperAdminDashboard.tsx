"use client"

import DashboardClient from "@/app/super-admin/dashboard/_components/DashboardClient"
import type { Session } from "next-auth"

export default function SuperAdminDashboard({ session }: { session: Session | null }) {
  return <DashboardClient session={session} />
}
