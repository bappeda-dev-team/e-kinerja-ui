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
  (res.data.data ?? []).map((item) => ({
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

  const handleAdd = async (item: { name: string }) => {

    try {

      await createMasterPemda(item)

      toast.success("Pemda berhasil ditambahkan")

      fetchData()

    } catch {

      toast.error("Gagal menambahkan pemda")

    }

  }

  const handleEdit = async (updated: MasterPemdaItem) => {

    try {

      await updateMasterPemda(updated.id, {
        name: updated.name
      })

      toast.success("Data berhasil diperbarui")

      fetchData()

    } catch {

      toast.error("Gagal memperbarui data")

    }

  }

  return (

    <div className="px-4">

      <div className="flex items-center justify-between mb-4">

        <h2 className="text-2xl font-semibold tracking-tight">
          Master Pemda
        </h2>

        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-bold text-sm transition"
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
        onSubmit={(item) => {
          handleAdd(item)
          setShowAdd(false)
        }}
      />

      <EditMasterPemda
        open={!!editId}
        idPemda={editId}
        data={data}
        onOpenChange={(open) => {
          if (!open) setEditId(null)
        }}
        onSubmit={(updated) => {
          handleEdit(updated)
          setEditId(null)
        }}
      />

    </div>
  )
}