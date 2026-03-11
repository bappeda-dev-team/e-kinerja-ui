'use client'

import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import MasterRolesGrid from "./MasterRolesGrid"
import MasterRolesPagination from "./MasterRolesPagination"
import AddMasterRoles from "./modals/AddMasterRoles"
import EditMasterRoles from "./modals/EditMasterRoles"

import { initialData } from "../data"
import type { MasterRolesItem } from "../data"

export type { MasterRolesItem }

export default function MasterRolesClient() {
  const [data, setData] = useState<MasterRolesItem[]>(initialData)
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(4)

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id))
    toast.success("Role berhasil dihapus")
  }

  const handleAdd = (newItem: Omit<MasterRolesItem, "id" | "created_at" | "updated_at">) => {
    const now = new Date().toISOString()
    setData((prev) => [
      ...prev,
      { id: Date.now().toString(), ...newItem, created_at: now, updated_at: now },
    ])
    toast.success("Role berhasil ditambahkan")
    setShowAdd(false)
  }

  const handleEdit = (updated: MasterRolesItem) => {
    setData((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
    toast.success("Role berhasil diperbarui")
    setEditId(null)
  }

  const selectedData = data.find((item) => item.id === editId)
  const paginated = data.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="flex flex-1 flex-col gap-6 p min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#202224]">Master Roles</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold"
        >
          <Plus className="h-4 w-4" />
          Tambah Role
        </button>
      </div>

      {/* GRID */}
      <MasterRolesGrid
        data={paginated}
        onEdit={setEditId}
        onDelete={handleDelete}
      />

      {/* PAGINATION */}
      <MasterRolesPagination
        page={page}
        pageSize={pageSize}
        total={data.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      {/* MODAL ADD */}
      {showAdd && (
        <AddMasterRoles
          onClose={() => setShowAdd(false)}
          onSave={handleAdd}
        />
      )}

      {/* MODAL EDIT */}
      {editId && selectedData && (
        <EditMasterRoles
          data={selectedData}
          onClose={() => setEditId(null)}
          onSave={handleEdit}
        />
      )}

    </div>
  )
}
