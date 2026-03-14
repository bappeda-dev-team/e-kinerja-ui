"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"

import PermintaanTable from "./PermintaanTable"
import AddPermintaan from "./modals/AddPermintaan"
import EditPermintaan from "./modals/EditPermintaan"

import type { PermintaanResponse, PermintaanRequest } from "../_types"

import {
  getPermintaan,
  createPermintaan,
  updatePermintaan,
  deletePermintaan
} from "../_services"

export default function PermintaanClient() {
  const [data, setData] = useState<PermintaanResponse[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState<PermintaanResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      setLoading(true) // 1. Mulai loading
      const res = await getPermintaan()

      if (res.status === 200) {
        const raw = res.data?.data || []
        const mapped = raw.map((item: any) => ({
          id: item.id,
          pemda: item.pemda,
          aplikasi: item.aplikasi,
          menu: item.menu,
          kondisi_awal: item.kondisi_awal,
          kondisi_diharapkan: item.kondisi_diharapkan,
          tanggal_deadline: item.tanggal_deadline,
          pembuat: item.pembuat,
          created_at: item.created_at,
        }))
        setData(mapped)
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal memuat data")
    } finally {
      // 2. WAJIB: Loading harus dimatikan di sini, 
      // baik request berhasil maupun gagal.
      setLoading(false) 
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAdd = async (val: PermintaanRequest) => {
    try {
      const res = await createPermintaan(val)
      if (res.status === 200 || res.status === 201) {
        toast.success("Permintaan berhasil ditambahkan")
        setShowAdd(false)
        loadData()
      } else {
        toast.error(res.data?.message || res.message)
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal menambah data")
    }
  }

  const handleEdit = async (val: PermintaanRequest, id?: string) => {
    if (!id) return
    try {
      const res = await updatePermintaan(id, val)
      if (res.status === 200) {
        toast.success("Permintaan berhasil diperbarui")
        setEditItem(null)
        loadData()
      } else {
        toast.error(res.data?.message || res.message)
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui data")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await deletePermintaan(id)
      if (res.status === 200) {
        toast.success("Permintaan berhasil dihapus")
        loadData()
      } else {
        toast.error(res.data?.message || res.message)
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus data")
    }
  }

  return (
    <div className="px-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#202224]">
          Permintaan Klien
        </h2>

        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md font-bold text-sm transition"
        >
          + Tambah Permintaan
        </button>
      </div>

      <PermintaanTable
        data={data}
        onEdit={setEditItem}
        onDelete={handleDelete}
        loading={loading}
      />

      {showAdd && (
        <AddPermintaan
          onClose={() => setShowAdd(false)}
          onSave={(val) => handleAdd(val)}
        />
      )}

      {editItem && (
        <EditPermintaan
          data={editItem}
          onClose={() => setEditItem(null)}
          onSave={(val, id) => handleEdit(val, id)}
        />
      )}
    </div>
  )
}