'use client'

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import MasterAplikasiTable from "./MasterAplikasiTable"
import AddMasterAplikasi from "./modals/AddMasterAplikasi"
import EditMasterAplikasi from "./modals/EditMasterAplikasi"

import {
  getMasterAplikasi,
  createMasterAplikasi,
  updateMasterAplikasi,
  deleteMasterAplikasi,
} from "../_services"

export interface MasterAplikasiItem {
  id: string
  nama_aplikasi: string
  created_at: string
  updated_at: string
}

export default function MasterAplikasiClient() {

  const [data, setData] = useState<MasterAplikasiItem[]>([])
  const [loading, setLoading] = useState(true)

  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  // =========================
  // FETCH DATA
  // =========================
  const fetchData = async () => {
    try {

      setLoading(true)

      const res = await getMasterAplikasi()

      const mapped = (res.data.data ?? []).map((item: any) => ({
        id: item.id,
        nama_aplikasi: item.name,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }))

      setData(mapped)

    } catch (error) {

      toast.error("Gagal mengambil data aplikasi")

    } finally {

      setLoading(false)

    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id: string) => {

    try {

      await deleteMasterAplikasi(id)

      toast.success("Aplikasi berhasil dihapus")

      fetchData()

    } catch {

      toast.error("Gagal menghapus aplikasi")

    }

  }

  // =========================
  // ADD
  // =========================
  const handleAdd = async (newItem: { nama_aplikasi: string }) => {

    try {

      await createMasterAplikasi({
        name: newItem.nama_aplikasi,
      })

      toast.success("Aplikasi berhasil ditambahkan")

      fetchData()

    } catch {

      toast.error("Gagal menambahkan aplikasi")

    }

  }

  // =========================
  // EDIT
  // =========================
  const handleEdit = async (updated: MasterAplikasiItem) => {

    try {

      await updateMasterAplikasi(updated.id, {
        name: updated.nama_aplikasi,
      })

      toast.success("Aplikasi berhasil diperbarui")

      fetchData()

    } catch {

      toast.error("Gagal memperbarui aplikasi")

    }

  }

  const selectedData = data.find(item => item.id === editId)

  return (

    <div className="px-4 space-y-4">

      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-semibold tracking-tight">
          Master Aplikasi
        </h2>

        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-bold text-sm transition"
        >
          <Plus className="size-4" />
          Tambah Aplikasi
        </button>

      </div>

      <MasterAplikasiTable
        data={data}
        onEdit={setEditId}
        onDelete={handleDelete}
        loading={loading}
      />

      {showAdd && (

        <AddMasterAplikasi
          onClose={() => setShowAdd(false)}
          onSave={(data) => {

            handleAdd(data)

            setShowAdd(false)

          }}
        />

      )}

      {editId && selectedData && (

        <EditMasterAplikasi
          data={selectedData}
          onClose={() => setEditId(null)}
          onSave={(updated) => {

            handleEdit(updated)

            setEditId(null)

          }}
        />

      )}

    </div>
  )
}