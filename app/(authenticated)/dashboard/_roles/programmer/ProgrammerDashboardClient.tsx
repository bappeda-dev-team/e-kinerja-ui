"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { getProgrammerDashboard } from "@/services/dashboard.service"
import type { ProgrammerTaskItem, DashboardSummary, ProgrammerDashboardResponse } from "@/types/dashboard"
import { mapReportStatus } from "./utils"
import { DashboardStats } from "./DashboardStats"
import { AttentionPanel } from "./AttentionPanel"
import { ActivityPanel } from "./ActivityPanel"
import { PanduanCard } from "./PanduanCard"
import { NetworkError } from "@/components/network-error"

export default function ProgrammerDashboardClient() {
  const [items, setItems] = useState<ProgrammerTaskItem[]>([])
  const [loading, setLoading] = useState(true)
  const [networkError, setNetworkError] = useState(false)
  const [fetchKey, setFetchKey] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setNetworkError(false)
        const response = await getProgrammerDashboard()

        if (response.status === 0) {
          setNetworkError(true)
          return
        }

        if (response.status !== 200) {
          throw new Error(response.data?.message || "Gagal memuat data dashboard")
        }

        const d = response.data?.data as ProgrammerDashboardResponse | undefined
        const laporan = d?.laporan ?? []

        const mappedItems = laporan.map((item) => {
          const permintaan = item.permintaan
          const pemda = typeof permintaan?.pemda === "object" ? (permintaan?.pemda as any)?.name ?? "-" : (permintaan?.pemda as any) ?? "-"
          const aplikasi = typeof permintaan?.aplikasi === "object" ? (permintaan?.aplikasi as any)?.name ?? "-" : (permintaan?.aplikasi as any) ?? "-"
          return {
            id: item.id,
            pemda,
            kategori: aplikasi,
            alasan: permintaan?.kondisi_diharapkan ?? permintaan?.menu ?? "Perbaikan/Fitur Baru",
            menu: permintaan?.menu ?? "-",
            kondisiAwal: permintaan?.kondisi_awal ?? "-",
            kondisiDiharapkan: permintaan?.kondisi_diharapkan ?? "-",
            progress: item.laporan_progress ?? "-",
            programmer: "-",
            status: item.status ?? "0",
            statusLabel: mapReportStatus(item.status),
            deadline: permintaan?.tanggal_deadline ?? "",
            createdAt: item.created_at ?? "",
            updatedAt: item.updated_at ?? "",
          } satisfies ProgrammerTaskItem
        })

        mappedItems.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        setItems(mappedItems)
      } catch (error: any) {
        toast.error(error?.message || "Gagal memuat dashboard programmer")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [fetchKey])

  const summary = useMemo<DashboardSummary>(() => {
    return items.reduce(
      (acc, item) => {
        acc.total += 1
        acc[item.statusLabel] += 1
        return acc
      },
      { total: 0, menunggu: 0, revisi: 0, terverifikasi: 0 }
    )
  }, [items])

  const needsAttention = useMemo(() => {
    return items
      .filter((item) => item.statusLabel === "revisi" || item.statusLabel === "menunggu")
      .sort((a, b) => {
        const tA = new Date(a.deadline).getTime()
        const tB = new Date(b.deadline).getTime()
        return (Number.isNaN(tA) ? Infinity : tA) - (Number.isNaN(tB) ? Infinity : tB)
      })
  }, [items])

  const latestActivity = useMemo(
    () => [...items].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [items]
  )

  if (networkError) {
    return <NetworkError onRetry={() => setFetchKey((k) => k + 1)} />
  }

  return (
    <div className="space-y-3">
      <DashboardStats summary={summary} />
      <div className="grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
        <AttentionPanel items={needsAttention} loading={loading} />
        <div className="flex flex-col gap-6">
          <PanduanCard />
          <ActivityPanel items={latestActivity} loading={loading} />
        </div>
      </div>
    </div>
  )
}
