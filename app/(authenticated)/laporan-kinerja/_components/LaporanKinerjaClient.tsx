"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import LaporanKinerjaGrid from "./LaporanKinerjaGrid"
import AddLaporanKinerja from "./modals/AddLaporanKinerja"
import EditLaporanKinerja from "./modals/EditLaporanKinerja"
import { initialData, masterPegawai, permintaanList } from "../data"
import type { LaporanKinerjaItem } from "../data"

export default function LaporanKinerjaClient() {
  const [data, setData] = useState<LaporanKinerjaItem[]>(initialData)
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState<LaporanKinerjaItem | null>(null)

  const handleAdd = (item: LaporanKinerjaItem) => {
    setData((prev) => [...prev, item])
    toast.success("Laporan kinerja berhasil ditambahkan")
  }

  const handleEdit = (item: LaporanKinerjaItem) => {
    setData((prev) => prev.map((d) => (d.id === item.id ? item : d)))
    toast.success("Laporan kinerja berhasil diperbarui")
  }

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((d) => d.id !== id))
    toast.success("Laporan kinerja berhasil dihapus")
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#202224]">Laporan Kinerja</h1>
        <Button onClick={() => setShowAdd(true)}>
          + Tambah Laporan
        </Button>
      </div>

      {/* GRID CARDS */}
      <LaporanKinerjaGrid
        data={data}
        onEdit={setEditItem}
        onDelete={handleDelete}
      />

      {/* MODAL ADD */}
      <AddLaporanKinerja
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={handleAdd}
        permintaanList={permintaanList}
        masterPegawai={masterPegawai}
      />

      {/* MODAL EDIT */}
      <EditLaporanKinerja
        open={!!editItem}
        data={editItem}
        onClose={() => setEditItem(null)}
        onSave={handleEdit}
        permintaanList={permintaanList}
        masterPegawai={masterPegawai}
      />

    </div>
  )
}
