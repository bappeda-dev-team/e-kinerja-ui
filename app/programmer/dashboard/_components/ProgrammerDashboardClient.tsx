"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { getLaporan } from "@/app/super-admin/laporan/services"
import type { ProgrammerTaskItem, DashboardSummary } from "./types"
import { mapReportStatus, getProgrammerName } from "./utils"
import { DashboardStats } from "./DashboardStats"
import { AttentionPanel } from "./AttentionPanel"
import { ActivityPanel } from "./ActivityPanel"
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
        const response = await getLaporan()

        if (response.status === 0) {
          setNetworkError(true)
          return
        }

        if (response.status !== 200) {
          throw new Error(response.data?.message || "Gagal memuat data laporan")
        }

        const mappedItems = (response.data?.data ?? []).map((item) => ({
          id: item.id,
          pemda: typeof item.permintaan?.pemda === "object" ? (item.permintaan.pemda as any)?.name ?? "-" : (item.permintaan?.pemda as any) ?? "-",
          kategori: typeof item.permintaan?.aplikasi === "object" ? (item.permintaan.aplikasi as any)?.name ?? "-" : (item.permintaan?.aplikasi as any) ?? "-",
          menu: item.permintaan?.menu ?? "-",
          alasan: item.permintaan?.kondisi_diharapkan ?? item.permintaan?.menu ?? "Perbaikan/Fitur Baru",
          kondisiAwal: item.permintaan?.kondisi_awal ?? "-",
          kondisiDiharapkan: item.permintaan?.kondisi_diharapkan ?? "-",
          progress: item.laporan_progress ?? "-",
          programmer: getProgrammerName(item),
          status: item.status ?? "putih",
          statusLabel: mapReportStatus(item.status),
          deadline: item.permintaan?.tanggal_deadline ?? "",
          createdAt: item.created_at ?? "",
          updatedAt: item.updated_at ?? "",
        }))

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
        <ActivityPanel items={latestActivity} loading={loading} />
      </div>
    </div>
  )
}
