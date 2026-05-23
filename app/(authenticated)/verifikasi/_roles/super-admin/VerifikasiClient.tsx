
"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import VerifikasiBoard from "./VerifikasiBoard"
import VerifikasiModal from "./modals/VerifikasiModal"
import { getVerifikasi, updateVerifikasi } from "@/services/verifikasi.service"
import type { VerifikasiRequest, VerifikasiResponse } from "@/types/verifikasi"

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
  id_permintaan: string
  distribusi_id: string
  programmer_id: string
  // Permintaan
  pemda_name: string
  pemda_logo?: string
  aplikasi_name?: string
  aplikasi_logo?: string
  menu?: string
  tanggal_deadline?: string
  // Laporan
  progres_deskripsi?: string
  laporan_status?: string
  // Programmer
  programmer: string
  programmer_avatar?: string
  // Verifikator
  verifikator?: string
  verifikator_avatar?: string
  // Verifikasi
  komentar?: string
  status: "menunggu" | "revisi" | "terverifikasi"
  tanggal_diajukan: string
  tanggal_verifikasi?: string
}

export default function VerifikasiClient() {
  const [data, setData] = useState<VerifikasiItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<VerifikasiItem | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const verifikasiRes = await getVerifikasi()
      const rawData: VerifikasiResponse[] = verifikasiRes.data?.data || []

      const mapped: VerifikasiItem[] = rawData.map((item: VerifikasiResponse) => {
        const programmer = item.laporan?.programmer?.full_name || item.laporan?.programmer?.username || "Belum ada programmer"
        const laporanId = item.laporan?.id || item.id

        let uiStatus: "menunggu" | "revisi" | "terverifikasi" = "menunggu"
        if (item.status_verified === "approved") uiStatus = "terverifikasi"
        else if (item.status_verified === "revision") uiStatus = "revisi"

        return {
          id: item.id,
          id_laporan: laporanId,
          id_permintaan: item.permintaan?.id || "",
          distribusi_id: item.distribusi_id || "",
          programmer_id: item.laporan?.programmer?.id || "",
          // Permintaan
          pemda_name: item.permintaan?.pemda?.name || "-",
          pemda_logo: item.permintaan?.pemda?.logo || "",
          aplikasi_name: item.permintaan?.aplikasi?.name || "",
          aplikasi_logo: item.permintaan?.aplikasi?.logo || "",
          menu: item.permintaan?.menu || "",
          tanggal_deadline: item.permintaan?.tanggal_deadline || "",
          // Laporan
          progres_deskripsi: item.laporan?.laporan_progress || "",
          laporan_status: item.laporan?.status || "",
          // Programmer
          programmer,
          programmer_avatar: item.laporan?.programmer?.profile_picture || "",
          // Verifikator
          verifikator: item.verifikator?.full_name || "",
          verifikator_avatar: item.verifikator?.profile_picture || "",
          // Verifikasi
          komentar: item.komentar || "",
          status: uiStatus,
          tanggal_diajukan: item.created_at,
          tanggal_verifikasi: item.updated_at,
        }
      })
      setData(mapped)
    } catch {
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

      const response = await updateVerifikasi(updated.id, payload)
      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.data?.message || "Gagal memperbarui verifikasi")
      }

      await fetchData()
      toast.success("Berhasil diupdate!")
      setSelected(null)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan!")
    }
  }

  return (
    <div className="space-y-6 px-4">
      <div className="mb-4">
        <h2 className="text-3xl font-bold font-nunito text-[#202224]">Verifikasi Laporan</h2>
      </div>

      {loading ? <HybridLoader /> : <VerifikasiBoard data={data} onVerify={setSelected} />}

      {selected && <VerifikasiModal key={selected.id} data={selected} onClose={() => setSelected(null)} onSave={handleSave} />}
    </div>
  )
}
