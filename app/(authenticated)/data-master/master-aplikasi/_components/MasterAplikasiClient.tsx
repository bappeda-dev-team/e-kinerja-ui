'use client'

import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import MasterAplikasiTable from "./MasterAplikasiTable"
import AddMasterAplikasi from "./modals/AddMasterAplikasi"
import EditMasterAplikasi from "./modals/EditMasterAplikasi"

export interface MasterAplikasiItem {
  id: string
  nama_aplikasi: string
  created_at: string
  updated_at: string
}

export default function MasterAplikasiClient() {

  const today = new Date().toISOString().slice(0,10)

  const [data, setData] = useState<MasterAplikasiItem[]>([
    { id:"1", nama_aplikasi:"E-Kinerja", created_at:today, updated_at:today },
    { id:"2", nama_aplikasi:"E-Planning", created_at:today, updated_at:today },
    { id:"3", nama_aplikasi:"E-Budgeting", created_at:today, updated_at:today },
    { id:"4", nama_aplikasi:"E-Absensi", created_at:today, updated_at:today },
    { id:"5", nama_aplikasi:"E-Office", created_at:today, updated_at:today },
  ])

  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const handleDelete = (id: string) => {

    setData(prev => prev.filter(item => item.id !== id))

    toast.success("Aplikasi berhasil dihapus")
  }

  const handleAdd = (newItem: { nama_aplikasi: string }) => {

    const now = new Date().toISOString().slice(0,10)

    const newData: MasterAplikasiItem = {
      id: Date.now().toString(),
      ...newItem,
      created_at: now,
      updated_at: now,
    }

    setData(prev => [...prev, newData])

    toast.success("Aplikasi berhasil ditambahkan")
  }

  const handleEdit = (updated: MasterAplikasiItem) => {

    const now = new Date().toISOString().slice(0,10)

    setData(prev =>
      prev.map(item =>
        item.id === updated.id
          ? { ...updated, updated_at: now }
          : item
      )
    )

    toast.success("Aplikasi berhasil diperbarui")
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