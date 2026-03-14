"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import LaporanKinerjaGrid from "./LaporanKinerjaGrid"
import AddLaporanKinerja from "./modals/AddLaporanKinerja"
import EditLaporanKinerja from "./modals/EditLaporanKinerja"

import { getLaporan, createLaporan, updateLaporan, deleteLaporan } from "../_services"
import { LaporanKinerjaItem, LaporanResponse } from "../_types"

export default function LaporanKinerjaClient() {
  const [data, setData] = useState<LaporanKinerjaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState<LaporanKinerjaItem | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await getLaporan()

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Gagal memuat data")
      }

      const rawData = res.data?.data || []
      const mapped: LaporanKinerjaItem[] = rawData.map((item: LaporanResponse) => ({
        id: item.id,
        laporan_progress: item.laporan_progress,
        permintaan: item.permintaan,
        programmer: item.programmer,
        status: item.status,
        created_at: item.created_at,
      }))

      setData(mapped)
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan sistem")
    } finally {
      // Menjamin loading berhenti
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAdd = async (item: LaporanKinerjaItem) => {
    try {
      const res = await createLaporan({
        laporan_progress: item.laporan_progress,
        permintaan_id: item.permintaan.id,
      })

      if (res.status < 200 || res.status >= 300) throw new Error(res.message)
      
      toast.success("Laporan berhasil ditambahkan")
      setShowAdd(false)
      await fetchData()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleEdit = async (item: LaporanKinerjaItem) => {
    try {
      const res = await updateLaporan(item.id, {
        laporan_progress: item.laporan_progress,
        permintaan_id: item.permintaan.id,
      })

      if (res.status < 200 || res.status >= 300) throw new Error(res.message)

      toast.success("Laporan berhasil diperbarui")
      setEditItem(null)
      await fetchData()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteLaporan(id)
      if (res.status < 200 || res.status >= 300) throw new Error(res.message)

      setData((prev) => prev.filter((d) => d.id !== id))
      toast.success("Laporan berhasil dihapus")
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#202224]">
          Laporan Kinerja
        </h1>

        <Button onClick={() => setShowAdd(true)}>
          + Tambah Laporan
        </Button>
      </div>

      <LaporanKinerjaGrid
        data={data}
        loading={loading}
        onEdit={setEditItem}
        onDelete={handleDelete}
      />

      <AddLaporanKinerja
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={handleAdd}
        permintaanList={[]}
        masterPegawai={[]}
      />

      {editItem && (
        <EditLaporanKinerja
          open={!!editItem}
          data={editItem}
          onClose={() => setEditItem(null)}
          onSave={handleEdit}
          permintaanList={[]}
          masterPegawai={[]}
        />
      )}
    </div>
  )
}