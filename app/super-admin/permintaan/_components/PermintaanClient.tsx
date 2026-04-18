// app/super-admin/permintaan/_components/PermintaanClient.tsx

"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"

import PermintaanTable from "./PermintaanTable"
import AddPermintaan from "./modals/AddPermintaan"
import PermintaanDetailModal from "./modals/PermintaanDetailModal"

import type { PermintaanResponse, PermintaanRequest } from "../types"
import {
  getPermintaan,
  createPermintaan,
  updatePermintaan,
  deletePermintaan,
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

export default function PermintaanClient() {
  const [data, setData] = useState<PermintaanResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState<PermintaanResponse | null>(null)
  const [detailItem, setDetailItem] = useState<PermintaanResponse | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      // ✅ Ambil data permintaan dan master pemda secara paralel
      const [resPermintaan, resPemda] = await Promise.all([
        getPermintaan(),
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

  useEffect(() => { loadData() }, [])

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

  return (
    <div className="space-y-6 px-3 sm:px-4">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="font-nunito text-[2.1rem] leading-tight font-bold text-[#202224] sm:text-3xl">
          Permintaan Klien
        </h2>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#4880FF] px-5 py-3 text-sm font-bold text-white shadow-[0_4px_14px_0_rgba(72,128,255,0.39)] transition hover:bg-blue-600 active:scale-95 sm:w-auto sm:px-6 sm:py-2.5"
        >
          <Plus className="size-4" /> Tambah Permintaan
        </button>
      </div>

      {(loading || actionLoading) ? <HybridLoader /> : (
        <PermintaanTable
          data={data}
          showTable={false}
          onEdit={setEditItem}
          onDelete={handleDelete}
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
      />
    </div>
  )
}
