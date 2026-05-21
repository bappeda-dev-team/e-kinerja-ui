
'use client'

import * as React from "react"
import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import MasterAplikasiTable from "./MasterAplikasiTable"
import AddMasterAplikasi from "./modals/AddMasterAplikasi"
import EditMasterAplikasi from "./modals/EditMasterAplikasi"

import {
  getMasterAplikasi, createMasterAplikasi,
  updateMasterAplikasi, updateMasterAplikasiLogo, // ✅ tambah import
  deleteMasterAplikasi,
} from "@/services/master-aplikasi.service"

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
            className="text-blue-600 transition-all duration-300 ease-out" strokeLinecap="round" />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-blue-600 animate-bounce text-xl">⏳</span>
          <span className="text-[10px] font-bold text-blue-600">{progress}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-[#202224]">Sedang memproses...</p>
        <p className="text-[11px] text-[#202224]/50">Mohon tunggu sebentar</p>
      </div>
    </div>
  )
}

export interface MasterAplikasiItem {
  id: string
  nama_aplikasi: string
  logo: string
  link: string
  created_at: string
  updated_at: string
}

export default function MasterAplikasiClient() {
  const [data, setData] = useState<MasterAplikasiItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await getMasterAplikasi()
      const mapped = (res.data.data ?? []).map((item: any) => ({
        id: item.id,
        nama_aplikasi: item.name,
        logo: item.logo ?? "",
        link: item.link ?? "",
        created_at: item.created_at,
        updated_at: item.updated_at,
      }))
      setData(mapped)
    } catch {
      toast.error("Gagal mengambil data aplikasi")
    } finally {
      setTimeout(() => setLoading(false), 800)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteMasterAplikasi(id)
      toast.success("Aplikasi berhasil dihapus")
      fetchData()
    } catch {
      toast.error("Gagal menghapus aplikasi")
    }
  }

  const handleAdd = async (newItem: { nama_aplikasi: string; link: string; logo?: File }) => {
    try {
      const res = await createMasterAplikasi({ name: newItem.nama_aplikasi, link: newItem.link })
      if (res.status !== 200 && res.status !== 201) throw new Error(res.message || "Gagal membuat aplikasi")
      const newId = res.data?.data?.id
      if (newItem.logo && newId) {
        await updateMasterAplikasiLogo(newId, newItem.logo) // ✅
      }
      toast.success("Aplikasi berhasil ditambahkan")
      fetchData()
    } catch (err: any) {
      toast.error(err.message || "Gagal menambahkan aplikasi")
    }
  }

  const handleEdit = async (updated: MasterAplikasiItem & { logoFile?: File }) => {
    try {
      await updateMasterAplikasi(updated.id, { name: updated.nama_aplikasi, link: updated.link })
      if (updated.logoFile) {
        try {
          await updateMasterAplikasiLogo(updated.id, updated.logoFile) // 
        } catch {
          toast.error("Nama berhasil diubah, namun gagal mengunggah logo.")
        }
      }
      toast.success("Aplikasi berhasil diperbarui")
      fetchData()
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui aplikasi")
    }
  }

  const selectedData = data.find(item => item.id === editId)

  return (
    <div className="px-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#202224]">Master Aplikasi</h1>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-bold text-sm transition active:scale-95"
          >
            <Plus className="size-4" />
            Tambah Aplikasi
          </button>
        </div>
      </div>

      {loading ? (
        <HybridLoader />
      ) : (
        <MasterAplikasiTable
          data={data}
          showTable={true} 
          onEdit={setEditId}
          onDelete={handleDelete}
        />
      )}

      {showAdd && (
        <AddMasterAplikasi
          onClose={() => setShowAdd(false)}
          onSave={(data) => { handleAdd(data); setShowAdd(false) }}
        />
      )}

      {editId && selectedData && (
        <EditMasterAplikasi
          data={selectedData}
          onClose={() => setEditId(null)}
          onSave={(updated) => { handleEdit(updated); setEditId(null) }}
        />
      )}
    </div>
  )
}