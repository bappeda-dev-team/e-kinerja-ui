"use client"

import StatCards from "./StatCards"
import RecentRequests from "./RecentRequests"
import RecentActivity from "./RecentActivity"

export default function DashboardClient() {
  return (
    <div className="flex flex-1 flex-col gap-4 p min-h-screen">

      <h1 className="text-3xl font-bold text-[#202224]">Dashboard</h1>

      <StatCards />

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <RecentRequests />
        <RecentActivity />
      </div>

    </div>
  )
}
