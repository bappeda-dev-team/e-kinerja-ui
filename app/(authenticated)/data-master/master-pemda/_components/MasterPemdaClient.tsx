'use client'

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import MasterPemdaTable from "./MasterPemdaTable"
import AddMasterPemda from "./modals/AddMasterPemda"
import EditMasterPemda from "./modals/EditMasterPemda"

import {
  getMasterPemda,
  createMasterPemda,
  updateMasterPemda,
  updateMasterPemdaLogo,
  deleteMasterPemda
} from "../_services"

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
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

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
      setLoading(true)
      // 1. Create Pemda (Nama)
      const res = await createMasterPemda({ name: item.name })
      const newId = res.data?.data?.id

      // 2. Upload Logo jika ada
      if (item.logo && newId) {
        await updateMasterPemdaLogo(newId, item.logo)
      }

      toast.success("Pemda berhasil ditambahkan")
      fetchData()
      setShowAdd(false)
    } catch (err: any) {
      toast.error(err.message || "Gagal menambahkan pemda")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (updated: { id: string; name: string; logo?: File }) => {
    try {
      setLoading(true)
      // 1. Update Nama
      await updateMasterPemda(updated.id, { name: updated.name })

      // 2. Update Logo jika ada file baru
      if (updated.logo) {
        await updateMasterPemdaLogo(updated.id, updated.logo)
      }

      toast.success("Data berhasil diperbarui")
      fetchData()
      setEditId(null)
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui data")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold tracking-tight">Master Pemda</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 bg-[#4880FF] hover:bg-[#4880FF]/90 text-white px-4 py-2 rounded-md font-bold text-sm transition"
        >
          <Plus className="size-4" />
          Tambah Pemda
        </button>
      </div>

      <MasterPemdaTable
        data={data}
        onEdit={setEditId}
        onDelete={handleDelete}
      />

      <AddMasterPemda
        open={showAdd}
        onOpenChange={setShowAdd}
        onSubmit={handleAdd}
      />

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