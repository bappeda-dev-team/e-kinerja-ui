"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import StatCards from "./StatCards"
import RecentRequests from "./RecentRequests"
import RecentActivity from "./RecentActivity"

import { getPermintaan } from "../../permintaan/_services"
import { getDistribusi } from "../../distribusi/_services"
import { getLaporan } from "../../laporan/_services"

import type { PermintaanResponse } from "../../permintaan/_types"
import type { DistribusiResponse } from "../../distribusi/_types"

export default function DashboardClient() {

  const [permintaan, setPermintaan] = useState<PermintaanResponse[]>([])
  const [distribusi, setDistribusi] = useState<DistribusiResponse[]>([])
  const [laporanCount, setLaporanCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
  }, [])

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
