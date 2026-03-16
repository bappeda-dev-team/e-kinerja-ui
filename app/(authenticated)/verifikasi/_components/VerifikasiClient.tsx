"use client"

import * as React from "react" // Import React untuk HybridLoader
import { useEffect, useState } from "react"
import { toast } from "sonner"

import VerifikasiBoard from "./VerifikasiBoard"
import VerifikasiModal from "./modals/VerifikasiModal"

import { getVerifikasi, updateVerifikasi } from "../_services"
import type { VerifikasiResponse, VerifikasiRequest } from "../_types"

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

export interface VerifikasiItem {
  id: string
  laporan_id: string
  verifikator?: string
  komentar?: string
  status: "menunggu" | "revisi" | "terverifikasi"
  tanggal_diajukan: string
  tanggal_verifikasi?: string
  deadline?: string
  catatan_revisi?: string
  nama_pemda?: string
  aplikasi?: string
  menu?: string
}

export default function VerifikasiClient() {
  const [data, setData] = useState<VerifikasiItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<VerifikasiItem | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await getVerifikasi()

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Gagal mengambil data verifikasi")
      }

      const rawData = res.data?.data || []

      const mapped: VerifikasiItem[] = rawData.map(
        (item: any) => {
          let uiStatus: "menunggu" | "revisi" | "terverifikasi" = "menunggu"
          if (item.status_verified === "approved") {
            uiStatus = "terverifikasi"
          } else if (item.status_verified === "rejected" || item.status_verified === "revision") {
            uiStatus = "revisi"
          }

          return {
            id: item.id,
            laporan_id: item.laporan_id,
            verifikator: item.verifikator_id,
            komentar: item.komentar,
            status: uiStatus,
            tanggal_diajukan: item.created_at,
            tanggal_verifikasi: item.updated_at,
          }
        }
      )

      setData(mapped)
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan sistem")
    } finally {
      // Delay agar animasi progres loader terlihat mulus
      setTimeout(() => setLoading(false), 800)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSave = async (updated: VerifikasiItem) => {
    try {
      let apiStatus = "pending"
      if (updated.status === "terverifikasi") apiStatus = "approved"
      if (updated.status === "revisi") apiStatus = "revision"

      const payload: VerifikasiRequest = {
        status_verified: apiStatus,
        komentar: updated.komentar,
        laporan_id: updated.laporan_id 
      }

      const res = await updateVerifikasi(updated.id, payload)

      if (res.status !== 200 && res.status !== 201) {
        throw new Error(res.data?.message || "Gagal menyimpan verifikasi")
      }

      await fetchData()
      toast.success("Verifikasi berhasil disimpan")
      setSelected(null)
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan verifikasi")
    }
  }

  return (
    <div className="space-y-6 px-4">
      <h2 className="text-2xl font-bold text-[#202224]">
        Verifikasi Laporan
      </h2>

      {/* Render Kondisional: HybridLoader vs Board */}
      {loading ? (
        <HybridLoader />
      ) : (
        <VerifikasiBoard
          data={data}
          loading={loading}
          onVerify={(item) => setSelected(item)}
        />
      )}

      {selected && (
        <VerifikasiModal
          data={selected}
          onClose={() => setSelected(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}