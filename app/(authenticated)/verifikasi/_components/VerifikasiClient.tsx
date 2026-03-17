"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Table2, LayoutGrid } from "lucide-react"
import VerifikasiBoard from "./VerifikasiBoard"
import VerifikasiModal from "./modals/VerifikasiModal"
import { getVerifikasi, updateVerifikasi, getPemda } from "../_services" // ✅ Tambah getPemda
import { getLaporan } from "@/app/(authenticated)/laporan/_services"
import type { VerifikasiRequest } from "../_types"

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

      {loading ? <p>Loading...</p> : <VerifikasiBoard data={data} showTable={showTable} onVerify={setSelected} />}

      {selected && <VerifikasiModal data={selected} onClose={() => setSelected(null)} onSave={handleSave} />}
    </div>
  )
}