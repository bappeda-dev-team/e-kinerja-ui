'use client'

import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import MasterPemdaTable from "./MasterPemdaTable"
import AddMasterPemda from "./modals/AddMasterPemda"
import EditMasterPemda from "./modals/EditMasterPemda"

export interface MasterPemdaItem {
  id: string
  nama_pemda: string
  created_at: string
  updated_at: string
}

export default function MasterPemdaClient() {

  const today = new Date().toISOString().slice(0,10)

  const [data, setData] = useState<MasterPemdaItem[]>([
    { id: "1",  nama_pemda: "Pemda Kota Bandung",          created_at: today, updated_at: today },
    { id: "2",  nama_pemda: "Pemda Kabupaten Sragen",       created_at: today, updated_at: today },
    { id: "3",  nama_pemda: "Pemda Kabupaten Mahakam Ulu",  created_at: today, updated_at: today },
    { id: "4",  nama_pemda: "Pemda Kota Madiun",            created_at: today, updated_at: today },
    { id: "5",  nama_pemda: "Pemda Kota Surakarta",         created_at: today, updated_at: today },
    { id: "6",  nama_pemda: "Pemda Kabupaten Ngawi",        created_at: today, updated_at: today },
    { id: "7",  nama_pemda: "Pemda Kabupaten Sukoharjo",    created_at: today, updated_at: today },
    { id: "8",  nama_pemda: "Pemda Kota Semarang",          created_at: today, updated_at: today },
    { id: "9",  nama_pemda: "Pemda Kabupaten Semarang",     created_at: today, updated_at: today },
    { id: "10", nama_pemda: "Pemda Kota Blitar",            created_at: today, updated_at: today },
    { id: "11", nama_pemda: "Pemda Kabupaten Madiun",       created_at: today, updated_at: today },
    { id: "12", nama_pemda: "Pemda Kota Kediri",            created_at: today, updated_at: today },
    { id: "13", nama_pemda: "Pemda Kota Malang",            created_at: today, updated_at: today },
    { id: "14", nama_pemda: "Pemda Kabupaten Malang",       created_at: today, updated_at: today },
    { id: "15", nama_pemda: "Pemda Kota Surabaya",          created_at: today, updated_at: today },
    { id: "16", nama_pemda: "Pemda Kabupaten Sidoarjo",     created_at: today, updated_at: today },
    { id: "17", nama_pemda: "Pemda Kota Mojokerto",         created_at: today, updated_at: today },
    { id: "18", nama_pemda: "Pemda Kabupaten Mojokerto",    created_at: today, updated_at: today },
    { id: "19", nama_pemda: "Pemda Kota Pasuruan",          created_at: today, updated_at: today },
    { id: "20", nama_pemda: "Pemda Kabupaten Pasuruan",     created_at: today, updated_at: today },
    { id: "21", nama_pemda: "Pemda Kota Probolinggo",       created_at: today, updated_at: today },
    { id: "22", nama_pemda: "Pemda Kabupaten Probolinggo",  created_at: today, updated_at: today },
    { id: "23", nama_pemda: "Pemda Kota Batu",              created_at: today, updated_at: today },
    { id: "24", nama_pemda: "Pemda Kabupaten Jombang",      created_at: today, updated_at: today },
  ])

  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const handleDelete = (id: string) => {

    setData(prev => prev.filter(item => item.id !== id))

    toast.success("Data berhasil dihapus")
  }

  const handleAdd = (item: { nama_pemda: string }) => {

    const now = new Date().toISOString().slice(0,10)

    setData(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        ...item,
        created_at: now,
        updated_at: now,
      }
    ])

    toast.success("Pemda berhasil ditambahkan")
  }

  const handleEdit = (updated: MasterPemdaItem) => {

    const now = new Date().toISOString().slice(0,10)

    setData(prev =>
      prev.map(item =>
        item.id === updated.id
          ? { ...updated, updated_at: now }
          : item
      )
    )

    toast.success("Data berhasil diperbarui")
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
        onSubmit={handleAdd}
      />

      <EditMasterPemda
        open={!!editId}
        idPemda={editId}
        data={data}
        onOpenChange={(open) => {
          if (!open) setEditId(null)
        }}
        onSubmit={handleEdit}
      />

    </div>

  )
}