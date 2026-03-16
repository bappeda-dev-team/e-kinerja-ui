"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"

import PermintaanTable from "./PermintaanTable"
import AddPermintaan from "./modals/AddPermintaan"

import type { PermintaanResponse, PermintaanRequest } from "../_types"
import {
  getPermintaan,
  createPermintaan,
  updatePermintaan,
  deletePermintaan,
  uploadPermintaanAttachment
} from "../_services"

// --- Komponen Hybrid Loader ---
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
          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * progress) / 100} className="text-blue-600 transition-all duration-300 ease-out" strokeLinecap="round" />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-blue-600 animate-bounce text-xl">⏳</span>
          <span className="text-[10px] font-bold text-blue-600">{progress}%</span>
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

  const loadData = async () => {
    try {
      setLoading(true)
      const res = await getPermintaan()
      if (res.status === 200) setData(res.data?.data || [])
    } catch (err: any) {
      toast.error(err.message || "Gagal memuat data")
    } finally {
      setTimeout(() => setLoading(false), 800)
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
    <div className="px-4 space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#202224]">Permintaan Klien</h2>
        <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 bg-[#4880FF] hover:bg-blue-600 text-white px-4 py-2 rounded-md font-bold text-sm transition active:scale-95">
          <Plus className="size-4" /> Tambah Permintaan
        </button>
      </div>

      { (loading || actionLoading) ? <HybridLoader /> : (
        <PermintaanTable data={data} onEdit={setEditItem} onDelete={handleDelete} />
      )}

      {(showAdd || editItem) && (
        <AddPermintaan 
          initialData={editItem || undefined} 
          onClose={() => { setShowAdd(false); setEditItem(null); }} 
          onSave={editItem ? handleEdit : handleAdd} 
        />
      )}
    </div>
  )
}