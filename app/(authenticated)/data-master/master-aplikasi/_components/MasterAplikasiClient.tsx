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
    { id: "1",  nama_aplikasi: "E-Kinerja",          created_at: today, updated_at: today },
    { id: "2",  nama_aplikasi: "E-Budgeting",         created_at: today, updated_at: today },
    { id: "3",  nama_aplikasi: "Kertas Kerja v1",     created_at: today, updated_at: today },
    { id: "4",  nama_aplikasi: "Kertas Kerja Revamp", created_at: today, updated_at: today },
    { id: "5",  nama_aplikasi: "E-Planning",          created_at: today, updated_at: today },
    { id: "6",  nama_aplikasi: "E-Absensi",           created_at: today, updated_at: today },
    { id: "7",  nama_aplikasi: "E-Office",            created_at: today, updated_at: today },
    { id: "8",  nama_aplikasi: "Data Kinerja",        created_at: today, updated_at: today },
    { id: "9",  nama_aplikasi: "Pohon Kinerja",       created_at: today, updated_at: today },
    { id: "10", nama_aplikasi: "Pengajuan KTA",       created_at: today, updated_at: today },
    { id: "11", nama_aplikasi: "E-KAK",               created_at: today, updated_at: today },
    { id: "12", nama_aplikasi: "Tower Data",          created_at: today, updated_at: today },
    { id: "13", nama_aplikasi: "E-Monev",             created_at: today, updated_at: today },
    { id: "14", nama_aplikasi: "E-Sakip",             created_at: today, updated_at: today },
    { id: "15", nama_aplikasi: "E-Audit",             created_at: today, updated_at: today },
    { id: "16", nama_aplikasi: "E-Procurement",       created_at: today, updated_at: today },
    { id: "17", nama_aplikasi: "E-Perizinan",         created_at: today, updated_at: today },
    { id: "18", nama_aplikasi: "E-Retribusi",         created_at: today, updated_at: today },
    { id: "19", nama_aplikasi: "E-PAD",               created_at: today, updated_at: today },
    { id: "20", nama_aplikasi: "Sistem Informasi ASN",created_at: today, updated_at: today },
    { id: "21", nama_aplikasi: "E-Diklat",            created_at: today, updated_at: today },
    { id: "22", nama_aplikasi: "E-Mutasi",            created_at: today, updated_at: today },
    { id: "23", nama_aplikasi: "E-Disiplin",          created_at: today, updated_at: today },
    { id: "24", nama_aplikasi: "Portal Layanan",      created_at: today, updated_at: today },
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