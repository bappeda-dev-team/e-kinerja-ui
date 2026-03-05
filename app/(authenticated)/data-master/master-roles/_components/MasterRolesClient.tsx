'use client'

import { useState } from "react"
import { Plus } from "lucide-react"
import MasterRolesTable from "./MasterRolesTable"
import AddMasterRoles from "./modals/AddMasterRoles"
import EditMasterRoles from "./modals/EditMasterRoles"

export interface MasterRolesItem {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}

export default function MasterRolesClient() {

  const [data, setData] = useState<MasterRolesItem[]>([
  {
    id: "1",
    name: "super_admin",
    description: "Akses penuh sistem",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "admin",
    description: "Mengelola distribusi pekerjaan",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "programmer",
    description: "Programmer - Level 1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "verifikator",
    description: "Verifikator - Level 2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
])

  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id))
  }

  const handleAdd = (newItem: Omit<MasterRolesItem, "id" | "created_at" | "updated_at">) => {
    const now = new Date().toISOString()

    const newData: MasterRolesItem = {
      id: Date.now().toString(),
      ...newItem,
      created_at: now,
      updated_at: now,
    }

    setData(prev => [...prev, newData])
  }

  const handleEdit = (updated: MasterRolesItem) => {
    setData(prev =>
      prev.map(item =>
        item.id === updated.id ? updated : item
      )
    )
  }

  const selectedData = data.find(item => item.id === editId)

  return (
    <div className="px-4 space-y-4">

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Master Roles</h2>

        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold"
        >
          <Plus className="h-4 w-4" />
          Tambah Role
        </button>
      </div>

      <MasterRolesTable
        data={data}
        onEdit={setEditId}
        onDelete={handleDelete}
      />

      {showAdd && (
        <AddMasterRoles
          onClose={() => setShowAdd(false)}
          onSave={(data) => {
            handleAdd(data)
            setShowAdd(false)
          }}
        />
      )}

      {editId && selectedData && (
        <EditMasterRoles
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