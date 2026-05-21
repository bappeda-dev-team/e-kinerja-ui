
"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { User, Shield, Hash } from "lucide-react"

import StatCards from "./StatCards"
import RecentRequests from "./RecentRequests"
import RecentActivity, { PanduanCard } from "./RecentActivity"

import { getSuperadminDashboard } from "@/services/dashboard.service"

import type { DashboardPermintaanItem, DashboardDistribusi } from "@/types/dashboard"
import { getRoleName } from "@/lib/roles"
import { NetworkError } from "@/components/network-error"

export default function DashboardClient({ session }: { session: any }) {
  const u = (session?.user as any)
  const roleName = getRoleName(session)
  const isSuperAdmin = roleName === "super_admin"

  const [permintaan, setPermintaan] = useState<DashboardPermintaanItem[]>([])
  const [distribusi, setDistribusi] = useState<DashboardDistribusi[]>([])
  const [totalPermintaan, setTotalPermintaan] = useState(0)
  const [totalDistribusi, setTotalDistribusi] = useState(0)
  const [totalLaporan, setTotalLaporan] = useState(0)
  const [loading, setLoading] = useState(true)
  const [networkError, setNetworkError] = useState(false)
  const [fetchKey, setFetchKey] = useState(0)

  useEffect(() => {
    if (!roleName) return

    if (!isSuperAdmin) {
      setLoading(false)
      return
    }

    const fetchAll = async () => {
      try {
        setNetworkError(false)
        const res = await getSuperadminDashboard()

        if (res.status === 0) {
          setNetworkError(true)
          return
        }

        const d = res.data?.data

        setPermintaan(d?.permintaan ?? [])
        setTotalPermintaan(d?.total_permintaan ?? 0)
        setTotalDistribusi(d?.total_distribusi ?? 0)
        setTotalLaporan(d?.total_laporan ?? 0)

        // Flatten all distribusi dari semua permintaan untuk RecentActivity
        const allDistribusi = (d?.permintaan ?? []).flatMap((p) => p.distribusi ?? [])
        setDistribusi(allDistribusi)
      } catch {
        toast.error("Gagal memuat data dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [roleName, isSuperAdmin, fetchKey])

  if (networkError) {
    return <NetworkError onRetry={() => setFetchKey((k) => k + 1)} />
  }

  if (!isSuperAdmin) {
    return (
      <div className="space-y-6 px-4">
        <div className="flex flex-1 flex-col gap-4 min-h-screen">
          <h1 className="text-3xl font-bold text-[#202224]">Dashboard</h1>

          <div className="rounded-2xl bg-white p-6 shadow-[6px_6px_54px_rgba(0,0,0,0.05)] max-w-md">
            <h2 className="text-base font-bold text-[#202224] mb-4">Informasi Akun</h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-3 text-[#202224]/80">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                  <User className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-[#202224]/50 font-medium">Username</p>
                  <p className="font-semibold">{u?.username ?? "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[#202224]/80">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50">
                  <Shield className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-[#202224]/50 font-medium">Role</p>
                  <p className="font-semibold">{roleName || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[#202224]/80">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50">
                  <Hash className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-[#202224]/50 font-medium">User ID</p>
                  <p className="font-semibold font-mono text-xs">{u?.user_id ?? "-"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p min-h-screen">

      <StatCards
        totalPermintaan={totalPermintaan}
        totalDistribusi={totalDistribusi}
        totalLaporan={totalLaporan}
        loading={loading}
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <RecentRequests data={permintaan} loading={loading} />
        <div className="flex flex-col gap-5">
          <PanduanCard />
          <RecentActivity data={distribusi} loading={loading} />
        </div>
      </div>

    </div>
  )
}
