"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

import { getAdminDashboard } from "@/services/dashboard.service"
import type { AdminPermintaanItem, AdminDashboardSummary, AdminDashboardResponse } from "@/types/dashboard"
import { AdminDashboardStats } from "./AdminDashboardStats"
import { PendingPanel } from "./PendingPanel"
import { RecentDistribusiPanel } from "./RecentDistribusiPanel"
import { PanduanCard } from "./PanduanCard"
import { NetworkError } from "@/components/network-error"

export default function AdminDashboardClient() {
  const { data: session } = useSession()
  const currentUserId = (session?.user as any)?.user_id as string | undefined

  const [items, setItems] = useState<AdminPermintaanItem[]>([])
  const [totals, setTotals] = useState({ total_permintaan: 0, total_distribusi: 0, total_pelaksana: 0 })
  const [loading, setLoading] = useState(true)
  const [networkError, setNetworkError] = useState(false)
  const [fetchKey, setFetchKey] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setNetworkError(false)
        const res = await getAdminDashboard()

        if (res.status === 0) {
          setNetworkError(true)
          return
        }

        const d = res.data?.data as AdminDashboardResponse | undefined

        setTotals({
          total_permintaan: d?.total_permintaan ?? 0,
          total_distribusi: d?.total_distribusi ?? 0,
          total_pelaksana: d?.total_pelaksana ?? 0,
        })

        const mapped: AdminPermintaanItem[] = (d?.permintaan ?? []).map((p) => {
          const distribusiList = p.distribusi ?? []
          // Distribusi milik admin yang sedang login (untuk "Distribusi Terbaru" panel)
          const mine = currentUserId
            ? distribusiList.find((dist) => dist.admin?.id === currentUserId)
            : distribusiList[0]
          const sudahDistribusi = distribusiList.length > 0

          // Unique pelaksana names dari semua distribusi
          const allProgrammerNames = Array.from(
            new Map(
              distribusiList.flatMap((dist) =>
                (dist.pelaksana ?? []).map((pel) => [pel.id, pel.full_name ?? pel.username ?? "Programmer"] as const),
              ),
            ).values(),
          )

          return {
            id: p.id,
            nama_pemda: p.pemda?.name ?? "-",
            logo_pemda: p.pemda?.logo,
            aplikasi: p.aplikasi?.name ?? "-",
            menu: p.menu ?? "-",
            deadline: p.tanggal_deadline ?? "",
            sudahDistribusi,
            distribusiId: mine?.id ?? distribusiList[0]?.id,
            programmers: allProgrammerNames,
            updatedAt: mine?.updated_at ?? mine?.created_at ?? p.updated_at ?? p.created_at ?? "",
          }
        })

        setItems(mapped)
      } catch (error: any) {
        toast.error(error?.message || "Gagal memuat dashboard admin")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [fetchKey, currentUserId])

  const summary = useMemo<AdminDashboardSummary>(() => {
    const sudah = items.filter((item) => item.sudahDistribusi).length
    return {
      total: totals.total_permintaan || items.length,
      sudahDistribusi: sudah,
      belumDistribusi: items.length - sudah,
    }
  }, [items, totals.total_permintaan])

  const pendingItems = useMemo(() => {
    return items
      .filter((item) => !item.sudahDistribusi)
      .sort((a, b) => {
        const tA = new Date(a.deadline).getTime()
        const tB = new Date(b.deadline).getTime()
        return (Number.isNaN(tA) ? Infinity : tA) - (Number.isNaN(tB) ? Infinity : tB)
      })
  }, [items])

  const recentDistribusi = useMemo(() => {
    return items
      .filter((item) => item.sudahDistribusi)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }, [items])

  if (networkError) {
    return <NetworkError onRetry={() => setFetchKey((k) => k + 1)} />
  }

  return (
    <div className="space-y-3">
      <AdminDashboardStats summary={summary} />
      <div className="grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
        <PendingPanel items={pendingItems} loading={loading} />
        <div className="flex flex-col gap-6">
          <PanduanCard />
          <RecentDistribusiPanel items={recentDistribusi} loading={loading} />
        </div>
      </div>
    </div>
  )
}
