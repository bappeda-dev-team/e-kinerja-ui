"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { User, Shield, Hash } from "lucide-react"

import StatCards from "./StatCards"
import RecentRequests from "./RecentRequests"
import RecentActivity from "./RecentActivity"

import { getPermintaan } from "../../permintaan/_services"
import { getDistribusi } from "../../distribusi/_services"
import { getLaporan } from "../../laporan/_services"

import type { PermintaanResponse } from "../../permintaan/_types"
import type { DistribusiResponse } from "../../distribusi/_types"

const ROLE_ID_MAP: Record<string, string> = {
  "3fc5cfba-e591-4b67-9e99-78562fba36e8": "super_admin",
  "8c0c4dda-eaa9-4abc-b79e-132cf7f696d2": "admin",
  "7726b58e-3223-415e-aef9-3784af6754a6": "programmer",
  "bee727b8-a9c2-4577-bf63-7b4a8d201798": "level2",
}

export default function DashboardClient() {
  const { data: session } = useSession()

  const u = (session?.user as any)
  const roleName = ROLE_ID_MAP[u?.role_id] ?? ""
  const isSuperAdmin = roleName === "super_admin"

  const [permintaan, setPermintaan] = useState<PermintaanResponse[]>([])
  const [distribusi, setDistribusi] = useState<DistribusiResponse[]>([])
  const [laporanCount, setLaporanCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!roleName) return

    if (!isSuperAdmin) {
      setLoading(false)
      return
    }

    const fetchAll = async () => {
      try {
        const [resPermintaan, resDistribusi, resLaporan] = await Promise.all([
          getPermintaan(),
          getDistribusi(),
          getLaporan(),
        ])

        setPermintaan(resPermintaan.data?.data ?? [])
        setDistribusi(resDistribusi.data?.data ?? [])
        setLaporanCount((resLaporan.data?.data ?? []).length)
      } catch {
        toast.error("Gagal memuat data dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [roleName, isSuperAdmin])

  if (!isSuperAdmin) {
    return (
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
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p min-h-screen">

      <h1 className="text-3xl font-bold text-[#202224]">Dashboard</h1>

      <StatCards
        totalPermintaan={permintaan.length}
        totalDistribusi={distribusi.length}
        totalLaporan={laporanCount}
        loading={loading}
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <RecentRequests data={permintaan.slice(0, 10)} loading={loading} />
        <RecentActivity data={distribusi.slice(0, 8)} loading={loading} />
      </div>

    </div>
  )
}
