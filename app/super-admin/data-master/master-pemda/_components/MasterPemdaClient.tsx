// app/super-admin/data-master/master-pemda/_components/MasterPemdaClient.tsx

'use client'

import * as React from "react"
import { useEffect, useState } from "react"
import { Plus, Loader2, Table2, LayoutGrid } from "lucide-react"
import { toast } from "sonner"

import MasterPemdaTable from "./MasterPemdaTable"
import AddMasterPemda from "./modals/AddMasterPemda"
import EditMasterPemda from "./modals/EditMasterPemda"

import {
  getMasterPemda, createMasterPemda,
  updateMasterPemda, updateMasterPemdaLogo, deleteMasterPemda
} from "../services"

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

export interface MasterPemdaItem {
  id: string
  name: string
  logo: string
  created_at: string
  updated_at: string
}

export default function MasterPemdaClient() {
  const [data, setData] = useState<MasterPemdaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [showTable, setShowTable] = useState(true) // ✅
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await getMasterPemda()
      setData(
        (res.data.data ?? []).map((item: any) => ({
          id: item.id ?? "",
          name: item.name ?? "",
          logo: item.logo ?? "",
          created_at: item.created_at ?? "",
          updated_at: item.updated_at ?? "",
        }))
      )
    } catch {
      toast.error("Gagal mengambil data pemda")
    } finally {
      setTimeout(() => setLoading(false), 800)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteMasterPemda(id)
      toast.success("Pemda berhasil dihapus")
      fetchData()
    } catch {
      toast.error("Gagal menghapus pemda")
    }
  }

  const handleAdd = async (item: { name: string; logo?: File }) => {
    try {
      setActionLoading(true)
      const res = await createMasterPemda({ name: item.name })
      if (res.status !== 200 && res.status !== 201) throw new Error(res.message || "Gagal membuat data Pemda")
      const newId = res.data?.data?.id
      if (item.logo && newId) await updateMasterPemdaLogo(newId, item.logo)
      toast.success("Pemda berhasil ditambahkan")
      fetchData()
      setShowAdd(false)
    } catch (err: any) {
      toast.error(err.message || "Gagal menambahkan pemda")
    } finally {
      setActionLoading(false)
    }
  }

  const handleEdit = async (updated: { id: string; name: string; logoFile?: File }) => {
    try {
      setActionLoading(true)
      const resUpdate = await updateMasterPemda(updated.id, { name: updated.name })
      if (resUpdate.status !== 200) throw new Error(resUpdate.message || "Gagal memperbarui nama Pemda")
      if (updated.logoFile) {
        try {
          await updateMasterPemdaLogo(updated.id, updated.logoFile)
        } catch {
          toast.error("Nama berhasil diubah, namun gagal mengunggah logo.")
        }
      }
      toast.success("Data Pemda berhasil diperbarui")
      fetchData()
      setEditId(null)
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui data")
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-6 px-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-[#202224]">Master Pemda</h1>
        <div className="flex items-center gap-2">
          {/* Toggle Card/Table */}
          {!loading && (
            <button
              onClick={() => setShowTable(prev => !prev)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition active:scale-95 ${showTable
                  ? "bg-white text-[#202224] border border-gray-200 hover:border-blue-300 hover:text-blue-600"
                  : "bg-blue-600 text-white"
                }`}
            >
              {showTable ? <LayoutGrid className="size-4" /> : <Table2 className="size-4" />}
              {showTable ? "Lihat Grid" : "Lihat Tabel"}
            </button>
          )}

          <button
            onClick={() => setShowAdd(true)}
            disabled={actionLoading}
            className="inline-flex items-center gap-2 bg-[#4880FF] hover:bg-[#4880FF]/90 text-white px-4 py-2 rounded-md font-bold text-sm transition disabled:opacity-70 active:scale-95"
          >
            {actionLoading ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            Tambah Pemda
          </button>
        </div>
      </div>

      {loading ? (
        <HybridLoader />
      ) : (
        <MasterPemdaTable
          data={data}
          showTable={showTable} // ✅
          onEdit={setEditId}
          onDelete={handleDelete}
        />
      )}

      <AddMasterPemda open={showAdd} onOpenChange={setShowAdd} onSubmit={handleAdd} />
      <EditMasterPemda
        open={!!editId}
        idPemda={editId}
        data={data}
        onOpenChange={(open) => { if (!open) setEditId(null) }}
        onSubmit={handleEdit}
      />
    </div>
  )
}