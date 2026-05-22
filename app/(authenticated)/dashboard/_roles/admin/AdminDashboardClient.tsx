"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { getAdminDashboard } from "@/services/dashboard.service"
import type { AdminPermintaanItem, AdminDashboardSummary, AdminDashboardResponse } from "@/types/dashboard"
import { AdminDashboardStats } from "./AdminDashboardStats"
import { PendingPanel } from "./PendingPanel"
import { RecentDistribusiPanel } from "./RecentDistribusiPanel"
import { PanduanCard } from "./PanduanCard"
import { NetworkError } from "@/components/network-error"

export default function AdminDashboardClient() {
  const [items, setItems] = useState<AdminPermintaanItem[]>([])
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

        const distribusiMap = new Map<string, { id: string; programmers: string[]; updatedAt: string }>()
        ;(d?.distribusi ?? []).forEach((dist) => {
          if (dist.permintaan?.id) {
            distribusiMap.set(dist.permintaan.id, {
              id: dist.id,
              programmers: (dist.pelaksana ?? []).map((p) => p.full_name ?? p.username ?? "Programmer"),
              updatedAt: dist.updated_at ?? dist.created_at ?? "",
            })
          }
        })

        const mapped: AdminPermintaanItem[] = (d?.permintaan ?? []).map((p) => {
          const distribusi = distribusiMap.get(p.id)
          return {
            id: p.id,
            nama_pemda: typeof p.pemda === "object" ? p.pemda?.name ?? "-" : (p.pemda as any) ?? "-",
            logo_pemda: typeof p.pemda === "object" ? (p.pemda as any)?.logo : undefined,
            aplikasi: typeof p.aplikasi === "object" ? p.aplikasi?.name ?? "-" : (p.aplikasi as any) ?? "-",
            menu: p.menu ?? "-",
            deadline: p.tanggal_deadline ?? "",
            sudahDistribusi: !!distribusi,
            distribusiId: distribusi?.id,
            programmers: distribusi?.programmers ?? [],
            updatedAt: distribusi?.updatedAt ?? p.created_at ?? "",
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
  }, [fetchKey])

  const summary = useMemo<AdminDashboardSummary>(() => {
    return items.reduce(
      (acc, item) => {
        acc.total += 1
        if (item.sudahDistribusi) acc.sudahDistribusi += 1
        else acc.belumDistribusi += 1
        return acc
      },
      { total: 0, sudahDistribusi: 0, belumDistribusi: 0 }
    )
  }, [items])

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
