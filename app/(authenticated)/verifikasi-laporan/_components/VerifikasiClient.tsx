"use client"

import { useState } from "react"
import VerifikasiTable from "./VerifikasiTable"
import VerifikasiModal from "./modals/VerifikasiModal"

export interface VerifikasiItem {
  id: string
  pemda: string
  nama_aplikasi: string
  menu: string
  pelaksana: string
  status: number
  laporan_progress: string

  komentar_verifikator?: string
  ketepatan_waktu?: number
  kualitas?: "sangat baik" | "baik" | "cukup"
  saran?: string
}

export default function VerifikasiClient() {
  const [data, setData] = useState<VerifikasiItem[]>([
    {
      id: "1",
      pemda: "Pemda Kota Bandung",
      nama_aplikasi: "E-Kinerja",
      menu: "Dashboard",
      pelaksana: "ASEP",
      status: 50,
      laporan_progress: "Terdapat kendala optimasi query.",
      ketepatan_waktu: 80,
      kualitas: "baik",
    },
  ])

  const [selected, setSelected] = useState<VerifikasiItem | null>(null)

  const handleSave = (updated: VerifikasiItem) => {
    setData((prev) =>
      prev.map((d) => (d.id === updated.id ? updated : d))
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Verifikasi Laporan</h2>

      <VerifikasiTable
        data={data}
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