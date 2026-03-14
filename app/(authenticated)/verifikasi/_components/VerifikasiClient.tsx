"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import VerifikasiBoard from "./VerifikasiBoard"
import VerifikasiModal from "./modals/VerifikasiModal"

import { getVerifikasi, updateVerifikasi } from "../_services"
import type { VerifikasiResponse, VerifikasiRequest } from "../_types"

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

      // 1. Cek dari HTTP status-nya dulu
      if (res.status !== 200) {
        throw new Error(res.data?.message || "Gagal mengambil data verifikasi")
      }

      // 2. Ambil data array aslinya
      const rawData = res.data?.data || []

      // 3. Mapping data & terjemahkan statusnya
      const mapped: VerifikasiItem[] = rawData.map(
        (item: any) => {
          
          // Translator ajaib: API -> UI Board
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
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSave = async (updated: VerifikasiItem) => {
    try {
      // Translator balik: dari UI Board -> API
      let apiStatus = "pending"
      if (updated.status === "terverifikasi") apiStatus = "approved"
      if (updated.status === "revisi") apiStatus = "revision" // Sesuaikan dengan standar backend kamu

      const payload: VerifikasiRequest = {
        status_verified: apiStatus,
        komentar: updated.komentar,
        laporan_id: updated.laporan_id // 💡 Fixed: Sekarang id-nya dikirim beneran!
      }

      const res = await updateVerifikasi(updated.id, payload)

      // Cek sukses dari wrapper
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

      <VerifikasiBoard
        data={data}
        loading={loading}
        onVerify={(item) => setSelected(item)}
      />

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