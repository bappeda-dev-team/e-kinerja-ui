'use client'

import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import MasterUserTable from "./MasterUserTable"
import AddMasterUser from "./modals/AddMasterUser"
import EditMasterUser from "./modals/EditMasterUser"

export interface MasterUserItem {
  id: string
  username: string
  full_name: string
  role: string
  active: boolean
  created_at: string
  updated_at: string
}

export default function MasterUserClient() {

  const [data, setData] = useState<MasterUserItem[]>([
    {
      id: "1",
      username: "admin",
      full_name: "Administrator",
      role: "Super Admin",
      active: true,
      created_at: "2024-01-01",
      updated_at: "2024-01-01"
    },
  ])

  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id))
    toast.success("User berhasil dihapus")
  }

  const handleAdd = (newItem: any) => {

    const newData: MasterUserItem = {
      id: Date.now().toString(),
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...newItem
    }

    setData(prev => [...prev, newData])
    toast.success("User berhasil ditambahkan")
  }

  const handleEdit = (updatedItem: MasterUserItem) => {

    setData(prev =>
      prev.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      )
    )

    toast.success("User berhasil diperbarui")
  }

  return (

    <div className="px-4">

      <div className="flex items-center justify-between mb-4">

        <h2 className="text-2xl font-semibold tracking-tight">
          Master Users
        </h2>

        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-bold text-sm transition"
        >
          <Plus className="size-4" />
          Tambah User
        </button>

      </div>

      <MasterUserTable
        data={data}
        onEdit={setEditId}
        onDelete={handleDelete}
      />

      <AddMasterUser
        open={showAdd}
        onOpenChange={setShowAdd}
        onSubmit={handleAdd}
      />

      <EditMasterUser
        open={!!editId}
        idUser={editId}
        data={data}
        onOpenChange={(open) => {
          if (!open) setEditId(null)
        }}
        onSubmit={handleEdit}
      />

    </div>

  )
}