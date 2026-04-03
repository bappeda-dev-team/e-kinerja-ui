// app/super-admin/verifikasi/_components/VerifikasiClient.tsx

"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Table2, LayoutGrid } from "lucide-react"
import VerifikasiBoard from "./VerifikasiBoard"
import VerifikasiModal from "./modals/VerifikasiModal"
import { getVerifikasi, updateVerifikasi, getPemda } from "../services" // ✅ Tambah getPemda
import { getLaporan } from "@/app/super-admin/laporan/services"
import type { VerifikasiRequest } from "../types"

const HybridLoader = () => {
  const [progress, setProgress] = React.useState(0)
  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + Math.floor(Math.random() * 10)))
    }, 200)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 min-h-[400px]">
      <div className="relative flex items-center justify-center">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-blue-100" />
          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent"
            strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * progress) / 100}
            className="text-blue-600 transition-all duration-300 ease-out" strokeLinecap="round" />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-blue-600 animate-bounce text-xl">⏳</span>
          <span className="text-[10px] font-bold text-blue-600">{progress}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-[#202224]">Sedang memproses...</p>
        <p className="text-[11px] text-[#202224]/50">Mohon tunggu sebentar</p>
      </div>
    </div>
  )
}

export interface VerifikasiItem {
  id: string
  id_laporan: string
  verifikator?: string
  komentar?: string
  status: "menunggu" | "revisi" | "terverifikasi"
  tanggal_diajukan: string
  tanggal_verifikasi?: string
  deadline?: string
  nama_pemda?: string
  logo_pemda?: string // ✅ Tambah field logo
  aplikasi?: string
  menu?: string
  progres_deskripsi?: string
}

export default function VerifikasiClient() {
  const [data, setData] = useState<VerifikasiItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showTable, setShowTable] = useState(false)
  const [selected, setSelected] = useState<VerifikasiItem | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [verifikasiRes, laporanRes, pemdaRes] = await Promise.all([
        getVerifikasi(),
        getLaporan(),
        getPemda(), // ✅ Fetch master pemda
      ])

      const rawData = verifikasiRes.data?.data || []
      const laporanList = laporanRes.data?.data || []
      const masterPemda = pemdaRes.data?.data || [] // ✅ Data logo

      const laporanMap = new Map(laporanList.map((l: any) => [l.id, l]))

      const mapped: VerifikasiItem[] = rawData.map((item: any) => {
        const laporan = item.laporan || {}
        const laporanDetail = laporanMap.get(laporan.id) || {}
        const permintaan = (laporanDetail as any).permintaan || {}
        
        const namaPemda = typeof permintaan.pemda === "object"
          ? permintaan.pemda?.name || ""
          : permintaan.pemda || ""

        // ✅ Cari logo berdasarkan nama pemda
        const pemdaDetail = masterPemda.find((p: any) => p.name === namaPemda)

        let uiStatus: "menunggu" | "revisi" | "terverifikasi" = "menunggu"
        if (item.status_verified === "approved") uiStatus = "terverifikasi"
        else if (item.status_verified === "revision" || (item.status_verified === "pending" && item.komentar)) {
          uiStatus = "revisi"
        }

        return {
          id: item.id,
          id_laporan: laporan.id || "",
          verifikator: item.verifikator?.full_name || "",
          komentar: item.komentar || "",
          status: uiStatus,
          tanggal_diajukan: item.created_at,
          tanggal_verifikasi: item.updated_at,
          nama_pemda: namaPemda,
          logo_pemda: pemdaDetail?.logo || "", // ✅ Masukkan logo
          aplikasi: typeof permintaan.aplikasi === "object" ? permintaan.aplikasi?.name || "" : permintaan.aplikasi || "",
          menu: permintaan.menu || "",
          deadline: permintaan.tanggal_deadline || "",
          progres_deskripsi: laporan.laporan_progress || "",
        }
      })
      setData(mapped)
    } catch (err: any) {
      toast.error("Gagal memuat data")
    } finally {
      setTimeout(() => setLoading(false), 500)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleSave = async (updated: VerifikasiItem) => {
    try {
      let apiStatus = "pending"
      if (updated.status === "terverifikasi") apiStatus = "approved"
      if (updated.status === "revisi") apiStatus = "revision"

      const payload: VerifikasiRequest = {
        laporan_id: updated.id_laporan,
        status_verified: apiStatus,
        komentar: updated.komentar ?? "",
      }

      await updateVerifikasi(updated.id, payload)
      await fetchData()
      toast.success("Berhasil diupdate!")
      setSelected(null)
    } catch (err: any) {
      toast.error("Gagal menyimpan!")
    }
  }

  return (
    <div className="space-y-6 px-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold font-nunito text-[#202224]">Verifikasi Laporan</h2>
        {!loading && (
          <button
            onClick={() => setShowTable(prev => !prev)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition active:scale-95 ${
              showTable ? "bg-blue-600 text-white" : "bg-white text-[#202224] border border-gray-200 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            {showTable ? <LayoutGrid className="size-4" /> : <Table2 className="size-4" />}
            {showTable ? "Lihat Board" : "Lihat Semua (Tabel)"}
          </button>
        )}
      </div>

      {loading ? <HybridLoader /> : <VerifikasiBoard data={data} showTable={showTable} onVerify={setSelected} />}

      {selected && <VerifikasiModal data={selected} onClose={() => setSelected(null)} onSave={handleSave} />}
    </div>
  )
}