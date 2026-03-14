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
      const mapped: VerifikasiItem[] = rawData.map((item: any) => {
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
      })

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

      toast.success("Verifikasi berhasil disimpan")
      setSelected(null)
      await fetchData()
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