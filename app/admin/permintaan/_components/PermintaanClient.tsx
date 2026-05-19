// app/admin/permintaan/_components/PermintaanClient.tsx

"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { toast } from "sonner"

import AdminPermintaanTable, { type PermintaanRow } from "./AdminPermintaanTable"
import PermintaanDetailModal from "@/app/super-admin/permintaan/_components/modals/PermintaanDetailModal"
import AddPermintaan from "@/app/super-admin/permintaan/_components/modals/AddPermintaan"
import DistribusiModal from "./modals/DistribusiModal"
import { NetworkError } from "@/components/network-error"

import type { PermintaanResponse, PermintaanRequest } from "@/app/super-admin/permintaan/types"
import type { DistribusiResponse } from "@/app/super-admin/distribusi/types"
import {
  getPermintaan,
  updatePermintaan,
  deletePermintaan,
  uploadPermintaanAttachment,
} from "@/services/permintaan.service"
import {
  getDistribusi,
  createDistribusi,
  updateDistribusi,
} from "@/services/distribusi.service"

const HybridLoader = () => {
  const [progress, setProgress] = React.useState(0)
  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + Math.floor(Math.random() * 10)))
    }, 200)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 min-h-[400px]">
      <div className="relative flex items-center justify-center">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-blue-100" />
          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent"
            strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * progress) / 100}
            className="text-[#4880FF] transition-all duration-300 ease-out" strokeLinecap="round" />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-[#4880FF] animate-bounce text-xl">⏳</span>
          <span className="text-[10px] font-bold text-[#4880FF]">{progress}%</span>
        </div>
      </div>
      <div className="text-center font-sans">
        <p className="text-sm font-semibold text-[#202224]">Sedang memproses...</p>
        <p className="text-[11px] text-[#202224]/50">Mohon tunggu sebentar</p>
      </div>
    </div>
  )
}

export default function AdminPermintaanClient() {
  const [data, setData] = useState<PermintaanRow[]>([])
  const [loading, setLoading] = useState(true)
  const [networkError, setNetworkError] = useState(false)
  const [fetchKey, setFetchKey] = useState(0)
  const [actionLoading, setActionLoading] = useState(false)
  const [editItem, setEditItem] = useState<PermintaanRow | null>(null)
  const [detailItem, setDetailItem] = useState<PermintaanRow | null>(null)
  const [distribusiTarget, setDistribusiTarget] = useState<PermintaanRow | null>(null)

  const fetchAll = async () => {
    try {
      setLoading(true)
      setNetworkError(false)
      const [permRes, distRes] = await Promise.all([getPermintaan(), getDistribusi()])

      if (permRes.status === 0 || distRes.status === 0) {
        setNetworkError(true)
        return
      }

      const distribusiMap = new Map<string, DistribusiResponse>()
      ;(distRes.data?.data ?? []).forEach((d: DistribusiResponse) => {
        if (d.permintaan?.id) distribusiMap.set(d.permintaan.id, d)
      })

      const mapped: PermintaanRow[] = (permRes.data?.data ?? []).map((p: PermintaanResponse) => ({
        ...p,
        sudahDistribusi: distribusiMap.has(p.id),
        distribusiId: distribusiMap.get(p.id)?.id,
        programmerIds: (distribusiMap.get(p.id)?.pelaksana ?? []).map((pelaksana) => pelaksana.id),
        komentarDistribusi: distribusiMap.get(p.id)?.komentar ?? "",
      }))

      mapped.sort((a, b) => {
        if (a.sudahDistribusi !== b.sudahDistribusi) return a.sudahDistribusi ? 1 : -1
        return 0
      })

      setData(mapped)
    } catch {
      toast.error("Gagal memuat data permintaan")
    } finally {
      setTimeout(() => setLoading(false), 500)
    }
  }

  useEffect(() => { fetchAll() }, [fetchKey])

  const handleEdit = async (val: PermintaanRequest, files: File[], id?: string) => {
    if (!id) return
    try {
      setActionLoading(true)
      const res = await updatePermintaan(id, val)
      if (res.status === 200) {
        if (files.length > 0) {
          try { await uploadPermintaanAttachment(id, files) } catch { toast.error("Lampiran gagal diperbarui") }
        }
        toast.success("Permintaan berhasil diperbarui")
        setEditItem(null)
        fetchAll()
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memperbarui data"
      toast.error(message)
    } finally { setActionLoading(false) }
  }

  const handleDelete = async (id: string) => {
    try {
      await deletePermintaan(id)
      toast.success("Permintaan berhasil dihapus")
      fetchAll()
    } catch { toast.error("Gagal menghapus permintaan") }
  }

  const handleDistribusi = async (val: { programmer_ids: string[]; komentar: string }) => {
    if (!distribusiTarget) return
    try {
      setActionLoading(true)
      let res
      if (distribusiTarget.distribusiId) {
        res = await updateDistribusi(distribusiTarget.distribusiId, {
          permintaan_id: distribusiTarget.id,
          komentar: val.komentar,
          pelaksana: val.programmer_ids,
        })
      } else {
        res = await createDistribusi({
          permintaan_id: distribusiTarget.id,
          komentar: val.komentar,
          programmer_ids: val.programmer_ids,
        })
      }
      if (res.status === 200 || res.status === 201) {
        toast.success(distribusiTarget.distribusiId ? "Distribusi berhasil diperbarui" : "Distribusi pekerjaan berhasil dibuat")
        setDistribusiTarget(null)
        fetchAll()
      } else {
        throw new Error("Gagal menyimpan distribusi")
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menyimpan distribusi"
      toast.error(message)
    } finally { setActionLoading(false) }
  }

  if (networkError) {
    return <NetworkError onRetry={() => setFetchKey((k) => k + 1)} />
  }

  return (
    <div className="space-y-6 px-3 sm:px-4">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-nunito text-[2.1rem] leading-tight font-bold text-[#202224] sm:text-3xl">
            Permintaan Klien
          </h2>
          <p className="text-sm text-[#797A7C]">Daftar semua permintaan dan status pendistribusiannya.</p>
        </div>
      </div>

      {(loading || actionLoading) ? <HybridLoader /> : (
        <AdminPermintaanTable
          data={data}
          onEdit={setEditItem}
          onDelete={handleDelete}
          onCardClick={setDetailItem}
          onDistribusi={(item) => { setDetailItem(null); setDistribusiTarget(item) }}
        />
      )}

      <PermintaanDetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onEdit={(item) => { setDetailItem(null); setEditItem(item) }}
        onDelete={(id) => { setDetailItem(null); handleDelete(id) }}
        onDistribusi={(item) => {
          setDetailItem(null)
          setDistribusiTarget(item as PermintaanRow)
        }}
      />

      {editItem && (
        <AddPermintaan
          initialData={editItem}
          onClose={() => setEditItem(null)}
          onSave={handleEdit}
        />
      )}

      {distribusiTarget && (
        <DistribusiModal
          item={{
            id: distribusiTarget.id,
            nama_pemda: typeof distribusiTarget.pemda === "object" ? distribusiTarget.pemda?.name ?? "-" : distribusiTarget.pemda ?? "-",
            aplikasi: typeof distribusiTarget.aplikasi === "object" ? distribusiTarget.aplikasi?.name ?? "-" : distribusiTarget.aplikasi ?? "-",
            menu: distribusiTarget.menu ?? "-",
            programmer_ids: distribusiTarget.programmerIds ?? [],
            komentar: distribusiTarget.komentarDistribusi ?? "",
          }}
          onClose={() => setDistribusiTarget(null)}
          onSave={handleDistribusi}
          loading={actionLoading}
        />
      )}
    </div>
  )
}
