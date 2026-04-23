// app/super-admin/permintaan/_components/PermintaanClient.tsx

"use client"

import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { toast } from "sonner"
import { Archive, Plus } from "lucide-react"

import PermintaanTable from "./PermintaanTable"
import AddPermintaan from "./modals/AddPermintaan"
import PermintaanDetailModal from "./modals/PermintaanDetailModal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import type { PermintaanResponse, PermintaanRequest } from "../types"
import {
  getPermintaan,
  getArchivedPermintaan,
  createPermintaan,
  updatePermintaan,
  deletePermintaan,
  toggleArchivePermintaan,
  uploadPermintaanAttachment,
  getMasterPemda // ✅ Fungsi service baru untuk ambil logo
} from "../services"

// --- Loader Hybrid ---
const HybridLoader = () => {
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + Math.floor(Math.random() * 10)));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 min-h-[400px]">
      <div className="relative flex items-center justify-center">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-blue-100" />
          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * progress) / 100} className="text-[#4880FF] transition-all duration-300 ease-out" strokeLinecap="round" />
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
  );
};

function getMonthKey(item: PermintaanResponse) {
  const rawDate = item.tanggal_pesanan || item.created_at
  if (!rawDate) return ""

  const date = new Date(rawDate)
  if (Number.isNaN(date.getTime())) return ""

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

function formatMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number)
  const date = new Date(year, (month || 1) - 1, 1)

  return date.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  })
}

export default function PermintaanClient() {
  const [data, setData] = useState<PermintaanResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState<PermintaanResponse | null>(null)
  const [detailItem, setDetailItem] = useState<PermintaanResponse | null>(null)
  const [showArchived, setShowArchived] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState("all")

  const loadData = async () => {
    try {
      setLoading(true)
      const [resPermintaan, resPemda] = await Promise.all([
        showArchived ? getArchivedPermintaan() : getPermintaan(),
        getMasterPemda()
      ])

      if (resPermintaan.status === 200 && resPemda.status === 200) {
        const pemdaList = resPemda.data?.data || []
        const permintaanList = resPermintaan.data?.data || []

        // ✅ Mapping logo pemda ke data permintaan
        const enrichedData = permintaanList.map(item => {
          const matchPemda = pemdaList.find((p: any) => p.id === item.pemda?.id)
          return {
            ...item,
            pemda: {
              ...item.pemda,
              logo: matchPemda?.logo || "" 
            }
          }
        })
        setData(enrichedData)
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal memuat data")
    } finally {
      setTimeout(() => setLoading(false), 500)
    }
  }

  useEffect(() => { loadData() }, [showArchived])

  const archivedMonthOptions = useMemo(() => {
    const monthMap = new Map<string, string>()

    data.forEach((item) => {
      const monthKey = getMonthKey(item)
      if (!monthKey || monthMap.has(monthKey)) return
      monthMap.set(monthKey, formatMonthLabel(monthKey))
    })

    return Array.from(monthMap.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([value, label]) => ({ value, label }))
  }, [data])

  const filteredData = useMemo(() => {
    if (!showArchived || selectedMonth === "all") return data
    return data.filter((item) => getMonthKey(item) === selectedMonth)
  }, [data, selectedMonth, showArchived])

  useEffect(() => {
    if (!showArchived) {
      setSelectedMonth("all")
      return
    }

    if (selectedMonth !== "all" && !archivedMonthOptions.some((option) => option.value === selectedMonth)) {
      setSelectedMonth("all")
    }
  }, [archivedMonthOptions, selectedMonth, showArchived])

  const handleAdd = async (val: PermintaanRequest, files: File[]) => {
    try {
      setActionLoading(true)
      const res = await createPermintaan(val)
      if (res.status === 200 || res.status === 201) {
        const newId = res.data?.data?.id
        if (files.length > 0 && newId) {
          try { await uploadPermintaanAttachment(newId, files) } 
          catch (e) { toast.error("Lampiran gagal diunggah") }
        }
        toast.success("Permintaan berhasil ditambahkan")
        setShowAdd(false)
        loadData()
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal menambah data")
    } finally { setActionLoading(false) }
  }

  const handleEdit = async (val: PermintaanRequest, files: File[], id?: string) => {
    if (!id) return
    try {
      setActionLoading(true)
      const res = await updatePermintaan(id, val)
      if (res.status === 200) {
        if (files.length > 0) {
          try { await uploadPermintaanAttachment(id, files) }
          catch (e) { toast.error("Lampiran gagal diperbarui") }
        }
        toast.success("Permintaan berhasil diperbarui")
        setEditItem(null)
        loadData()
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui data")
    } finally { setActionLoading(false) }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await deletePermintaan(id)
      if (res.status === 200) {
        toast.success("Permintaan berhasil dihapus")
        loadData()
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus data")
    }
  }

  const handleArchive = async (item: PermintaanResponse) => {
    const nextArchived = !item.is_archived

    try {
      setActionLoading(true)
      const res = await toggleArchivePermintaan(item, nextArchived)

      if (res.status === 200) {
        toast.success(nextArchived ? "Permintaan berhasil diarsipkan" : "Permintaan berhasil dikembalikan dari arsip")
        if (detailItem?.id === item.id) {
          setDetailItem(null)
        }
        await loadData()
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal mengubah status arsip")
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-6 px-3 sm:px-4">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="font-nunito text-[2.1rem] leading-tight font-bold text-[#202224] sm:text-3xl">
          Permintaan Klien
        </h2>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          {showArchived && (
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="h-auto w-full rounded-xl border-[#D6D9E2] bg-white px-4 py-3 text-sm font-semibold text-[#202224] shadow-none sm:w-[220px]">
                <SelectValue placeholder="Filter bulan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Bulan</SelectItem>
                {archivedMonthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <button
            onClick={() => setShowArchived((prev) => !prev)}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-bold transition active:scale-95 sm:w-auto sm:px-6 sm:py-2.5 ${
              showArchived
                ? "border-[#4880FF] bg-[#EAF1FF] text-[#4880FF]"
                : "border-[#D6D9E2] bg-white text-[#202224] hover:border-[#4880FF] hover:text-[#4880FF]"
            }`}
          >
            <Archive className="size-4" /> Arsip
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#4880FF] px-5 py-3 text-sm font-bold text-white shadow-[0_4px_14px_0_rgba(72,128,255,0.39)] transition hover:bg-blue-600 active:scale-95 sm:w-auto sm:px-6 sm:py-2.5"
          >
            <Plus className="size-4" /> Tambah Permintaan
          </button>
        </div>
      </div>

      {(loading || actionLoading) ? <HybridLoader /> : (
        <PermintaanTable
          data={filteredData}
          showTable={true}
          onEdit={setEditItem}
          onDelete={handleDelete}
          onArchive={handleArchive}
          onCardClick={setDetailItem}
        />
      )}

      {(showAdd || editItem) && (
        <AddPermintaan
          initialData={editItem || undefined}
          onClose={() => { setShowAdd(false); setEditItem(null) }}
          onSave={editItem ? handleEdit : handleAdd}
        />
      )}

      <PermintaanDetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onEdit={(item) => { setDetailItem(null); setEditItem(item) }}
        onDelete={(id) => { setDetailItem(null); handleDelete(id) }}
        onArchive={(item) => handleArchive(item)}
      />
    </div>
  )
}
