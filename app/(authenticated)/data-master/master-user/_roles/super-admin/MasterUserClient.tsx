
'use client'

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import MasterUserTable from "./MasterUserTable"
import AddMasterUser from "./modals/AddMasterUser"
import EditMasterUser from "./modals/EditMasterUser"

import { getUsers, deleteUser, createUser, updateUser } from "@/services/master-user.service"
import type { RegisterUserRequest, UserResponse, UserRequest } from "@/types/master-user"

function getErrorMessage(payload: any, fallback: string) {
  const fieldErrors = payload?.errors

  if (fieldErrors && typeof fieldErrors === "object") {
    const firstError = Object.values(fieldErrors)
      .flat()
      .find((value) => typeof value === "string")

    if (typeof firstError === "string" && firstError.trim()) {
      return firstError
    }
  }

  return payload?.message || fallback
}

export default function MasterUserClient() {
  const [data, setData] = useState<UserResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const res = await getUsers()
      if (res.status === 200) {
        setData(res.data?.data ?? [])
      } else {
        toast.error(res.data?.message || "Gagal memuat data")
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal memuat data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteUser(id)
      if (res.status === 200) {
        setData(prev => prev.filter(item => item.id !== id))
        toast.success("User berhasil dihapus")
      } else {
        toast.error(res.data?.message || "Gagal menghapus user")
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus user")
    }
  }

  const handleAdd = async (val: RegisterUserRequest) => {
    try {
      const res = await createUser(val)
      if (res.status === 200 || res.status === 201) {
        toast.success("User berhasil ditambahkan")
        setShowAdd(false)
        loadData()
      } else {
        toast.error(getErrorMessage(res.data, "Gagal menambah user"))
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal menambah user")
    }
  }

  const handleEdit = async (val: UserRequest, id?: string) => {
    if (!id) return
    try {
      const res = await updateUser(id, val)
      if (res.status === 200) {
        toast.success("User berhasil diperbarui")
        setEditId(null)
        loadData()
      } else {
        toast.error(res.data?.message || "Gagal memperbarui user")
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui user")
    }
  }

  return (
    <div className="space-y-6 px-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-[#202224]">Master User</h1>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-bold text-sm transition"
          >
            <Plus className="size-4" />
            Tambah User
          </button>
        </div>
      </div>

      <MasterUserTable
        data={data}
        loading={loading}
        showTable={true}
        onEdit={setEditId}
        onDelete={handleDelete}
      />

      <AddMasterUser open={showAdd} onOpenChange={setShowAdd} onSubmit={handleAdd} />
      <EditMasterUser
        open={!!editId}
        idUser={editId}
        data={data}
        onOpenChange={(open) => { if (!open) setEditId(null) }}
        onSubmit={handleEdit}
      />
    </div>
  )
}
