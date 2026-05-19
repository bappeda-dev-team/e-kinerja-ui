"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { getVerifikasi } from "@/services/verifikasi.service"
import { getDeadlineTime, mapVerifikasiItem, type VerifikasiListItem } from "@/app/verifikator/verifikasi/utils"

import SummaryCards from "./SummaryCards"
import AttentionList from "./AttentionList"
import ActivityFeed from "./ActivityFeed"
import { PanduanCard } from "./PanduanCard"

export default function VerifikatorDashboardClient() {
  const [items, setItems] = useState<VerifikasiListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await getVerifikasi()
        if (response.status !== 200) {
          throw new Error(response.data?.message || "Gagal memuat data verifikasi")
        }
        const mappedItems = (response.data?.data ?? [])
          .map(mapVerifikasiItem)
          .sort((a, b) => new Date(b.diperbaruiPada).getTime() - new Date(a.diperbaruiPada).getTime())
        setItems(mappedItems)
      } catch (error: any) {
        toast.error(error?.message || "Gagal memuat dashboard verifikator")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const summary = useMemo(
    () =>
      items.reduce(
        (acc, item) => {
          acc.total += 1
          acc[item.status] += 1
          return acc
        },
        { total: 0, menunggu: 0, revisi: 0, terverifikasi: 0 }
      ),
    [items]
  )

  const attentionItems = useMemo(() => {
    const priority = { revisi: 0, menunggu: 1, terverifikasi: 2 }
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
