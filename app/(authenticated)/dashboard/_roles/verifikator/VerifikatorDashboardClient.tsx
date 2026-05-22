"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { getVerifikatorDashboard } from "@/services/dashboard.service"
import type { VerifikatorDashboardLaporan, VerifikatorDashboardResponse } from "@/types/dashboard"
import type { VerifikasiListItem, VerifikasiStatus } from "@/app/(authenticated)/verifikasi/_roles/verifikator/utils"
import { getDeadlineTime } from "@/app/(authenticated)/verifikasi/_roles/verifikator/utils"
import { NetworkError } from "@/components/network-error"

import SummaryCards from "./SummaryCards"
import AttentionList from "./AttentionList"
import ActivityFeed from "./ActivityFeed"
import { PanduanCard } from "./PanduanCard"

function mapDashboardLaporan(item: VerifikatorDashboardLaporan): VerifikasiListItem {
  const pemda = typeof item.permintaan?.pemda === "object" ? item.permintaan?.pemda : null
  const aplikasi = typeof item.permintaan?.aplikasi === "object" ? item.permintaan?.aplikasi : null

  let status: VerifikasiStatus = "menunggu"
  if (item.status_verified === "approved") status = "terverifikasi"
  else if (item.status_verified === "revision") status = "revisi"

  return {
    id: item.id,
    status,
    laporanId: item.id,
    laporanStatus: item.status ?? "-",
    progress: item.laporan_progress ?? "-",
    komentar: "",
    verifikator: "-",
    programmer: item.programmer?.full_name ?? item.programmer?.username ?? "-",
    diajukanPada: item.created_at ?? "",
    diperbaruiPada: item.updated_at ?? "",
    tanggalDeadline: item.permintaan?.tanggal_deadline ?? "",
    pemdaName: (pemda as any)?.name ?? (item.permintaan?.pemda as any) ?? "-",
    pemdaLogo: (pemda as any)?.logo,
    aplikasiName: (aplikasi as any)?.name ?? (item.permintaan?.aplikasi as any) ?? "-",
    menu: item.permintaan?.menu ?? "",
    permintaanId: item.permintaan?.id ?? "",
  }
}

export default function VerifikatorDashboardClient() {
  const [items, setItems] = useState<VerifikasiListItem[]>([])
  const [totals, setTotals] = useState({ menunggu: 0, revisi: 0, terverifikasi: 0 })
  const [loading, setLoading] = useState(true)
  const [networkError, setNetworkError] = useState(false)
  const [fetchKey, setFetchKey] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setNetworkError(false)
        const response = await getVerifikatorDashboard()

        if (response.status === 0) {
          setNetworkError(true)
          return
        }

        if (response.status !== 200) {
          throw new Error(response.data?.message || "Gagal memuat data verifikasi")
        }

        const d = response.data?.data as VerifikatorDashboardResponse | undefined
        const mappedItems = (d?.laporan ?? [])
          .map(mapDashboardLaporan)
          .sort((a, b) => new Date(b.diperbaruiPada).getTime() - new Date(a.diperbaruiPada).getTime())

        setItems(mappedItems)
        setTotals({
          menunggu: d?.total_menunggu ?? 0,
          revisi: d?.total_revisi ?? 0,
          terverifikasi: d?.total_terverifikasi ?? 0,
        })
      } catch (error: any) {
        toast.error(error?.message || "Gagal memuat dashboard verifikator")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [fetchKey])

  const summary = useMemo(
    () => ({
      total: totals.menunggu + totals.revisi + totals.terverifikasi,
      ...totals,
    }),
    [totals]
  )

  const attentionItems = useMemo(() => {
    const priority: Record<VerifikasiStatus, number> = { revisi: 0, menunggu: 1, terverifikasi: 2 }
    const now = Date.now()

    return items
      .filter((item) => item.status !== "terverifikasi")
      .filter((item) => {
        const deadlineTime = getDeadlineTime(item.tanggalDeadline)
        return Number.isFinite(deadlineTime) && deadlineTime < now
      })
      .sort((a, b) => {
        const priorityDiff = priority[a.status] - priority[b.status]
        if (priorityDiff !== 0) return priorityDiff
        const deadlineDiff = getDeadlineTime(a.tanggalDeadline) - getDeadlineTime(b.tanggalDeadline)
        if (deadlineDiff !== 0) return deadlineDiff
        return new Date(b.diperbaruiPada).getTime() - new Date(a.diperbaruiPada).getTime()
      })
      .slice(0, 5)
  }, [items])

  const latestActivity = useMemo(
    () =>
      items
        .slice()
        .sort((a, b) => new Date(b.diperbaruiPada).getTime() - new Date(a.diperbaruiPada).getTime())
        .slice(0, 6),
    [items]
  )

  if (networkError) {
    return <NetworkError onRetry={() => setFetchKey((k) => k + 1)} />
  }

  return (
    <div className="space-y-6 px-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-[#202224]">Dashboard</h1>
      </div>

      <SummaryCards menunggu={summary.menunggu} revisi={summary.revisi} terverifikasi={summary.terverifikasi} />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <AttentionList items={attentionItems} loading={loading} />
        <div className="flex flex-col gap-5">
          <PanduanCard />
          <ActivityFeed items={latestActivity} loading={loading} />
        </div>
      </div>
    </div>
  )
}
