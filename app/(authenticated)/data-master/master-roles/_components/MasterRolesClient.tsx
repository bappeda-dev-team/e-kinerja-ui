'use client'

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import MasterRolesGrid from "./MasterRolesGrid"
import MasterRolesPagination from "./MasterRolesPagination"
import AddMasterRoles from "./modals/AddMasterRoles"
import EditMasterRoles from "./modals/EditMasterRoles"

import { getRoles } from "../_services"
import type { Roles } from "../_types"

export interface MasterRolesItem {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}

export default function MasterRolesClient() {

  const [data, setData] = useState<MasterRolesItem[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(4)

  const fetchData = async () => {

    try {

      const res = await getRoles()

      const mapped = (res.data.data ?? []).map((item: Roles) => ({
        id: item.id ?? "",
        name: item.name ?? "",
        description: item.description ?? "",
        created_at: item.created_at ?? "",
        updated_at: item.updated_at ?? "",
      }))

      setData(mapped)

    } catch {

      toast.error("Gagal mengambil data roles")

    }

  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = (id: string) => {

    setData(prev => prev.filter(item => item.id !== id))

    toast.success("Role berhasil dihapus")

  }

  const handleAdd = (item: { name: string; description: string }) => {

    const now = new Date().toISOString()

    setData(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: item.name,
        description: item.description,
        created_at: now,
        updated_at: now,
      }
    ])

    toast.success("Role berhasil ditambahkan")

    setShowAdd(false)

  }

  const handleEdit = (updated: MasterRolesItem) => {

    setData(prev =>
      prev.map(item =>
        item.id === updated.id ? updated : item
      )
    )

    toast.success("Role berhasil diperbarui")

    setEditId(null)

  }

  const selectedData = data.find(item => item.id === editId)

  const paginated = data.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  return (

    <div className="flex flex-1 flex-col gap-6 p min-h-screen">

      <div className="flex items-center justify-between">

        <h1 className="text-3xl font-bold text-[#202224]">
          Master Roles
        </h1>

        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold"
        >
          <Plus className="h-4 w-4" />
          Tambah Role
        </button>

      </div>

      <MasterRolesGrid
        data={paginated}
        onEdit={setEditId}
        onDelete={handleDelete}
      />

      <MasterRolesPagination
        page={page}
        pageSize={pageSize}
        total={data.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      {showAdd && (

        <AddMasterRoles
          onClose={() => setShowAdd(false)}
          onSave={handleAdd}
        />

      )}

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