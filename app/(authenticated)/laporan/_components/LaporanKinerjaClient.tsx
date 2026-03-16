"use client"

import * as React from "react" // Import React untuk HybridLoader
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import LaporanKinerjaGrid from "./LaporanKinerjaGrid"
import AddLaporanKinerja from "./modals/AddLaporanKinerja"
import EditLaporanKinerja from "./modals/EditLaporanKinerja"

import { getLaporan, createLaporan, updateLaporan, deleteLaporan } from "../_services"
import { LaporanKinerjaItem, LaporanResponse } from "../_types"

// --- Komponen Hybrid Loader ---
const HybridLoader = () => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + Math.floor(Math.random() * 10)));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 min-h-[400px]">
      <div className="relative flex items-center justify-center">
        {/* Lingkaran Progress */}
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-blue-100"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={251.2}
            strokeDashoffset={251.2 - (251.2 * progress) / 100}
            className="text-blue-600 transition-all duration-300 ease-out"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Ikon Jam Pasir di Tengah */}
        <div className="absolute flex flex-col items-center">
          <span className="text-blue-600 animate-bounce text-xl">⏳</span>
          <span className="text-[10px] font-bold text-blue-600">{progress}%</span>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-sm font-semibold text-[#202224]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Sedang memproses...
        </p>
        <p className="text-[11px] text-[#202224]/50" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Mohon tunggu sebentar
        </p>
      </div>
    </div>
  );
};

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
      // Delay sedikit agar jam pasirnya berputar manis
      setTimeout(() => setLoading(false), 800)
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
      await fetchData()
      toast.success("Laporan berhasil ditambahkan")
      setShowAdd(false)
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
      await fetchData()
      toast.success("Laporan berhasil diperbarui")
      setEditItem(null)
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

        <Button 
          onClick={() => setShowAdd(true)}
          className="transition active:scale-95 font-bold"
        >
          + Tambah Laporan
        </Button>
      </div>

      {/* Render Kondisional untuk Loader */}
      {loading ? (
        <HybridLoader />
      ) : (
        <LaporanKinerjaGrid
          data={data}
          loading={loading}
          onEdit={setEditItem}
          onDelete={handleDelete}
        />
      )}

      <AddLaporanKinerja
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={handleAdd}
        permintaanList={[]}
        masterPegawai={[]}
      />

      <EditLaporanKinerja
        open={!!editItem}
        data={editItem}
        onClose={() => setEditItem(null)}
        onSave={handleEdit}
        permintaanList={[]}
        masterPegawai={[]}
      />
    </div>
  )
}