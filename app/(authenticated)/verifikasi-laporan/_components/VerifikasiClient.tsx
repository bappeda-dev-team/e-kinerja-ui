"use client"

import { useState } from "react"
import { toast } from "sonner"

import VerifikasiBoard from "./VerifikasiBoard"
import VerifikasiModal from "./modals/VerifikasiModal"

export interface VerifikasiItem {
  id: string
  nama_pemda: string
  aplikasi: string
  menu: string
  verifikator?: string
  komentar?: string
  deadline?: string
  catatan_revisi?: string
  status: "menunggu" | "revisi" | "terverifikasi"
  tanggal_diajukan: string
  tanggal_verifikasi?: string
}

export default function VerifikasiClient() {

  const [data, setData] = useState<VerifikasiItem[]>([
    {
      id: "1",
      nama_pemda: "Pemda Kota Bandung",
      aplikasi: "E-Kinerja",
      menu: "Dashboard",
      status: "menunggu",
      tanggal_diajukan: "2026-04-12",
    },
    {
      id: "2",
      nama_pemda: "Pemda Kab Ngawi",
      aplikasi: "Pengajuan KTA",
      menu: "Register",
      status: "menunggu",
      tanggal_diajukan: "2026-04-12",
    },
    {
      id: "3",
      nama_pemda: "Pemda Kota Kediri",
      aplikasi: "E-KAK",
      menu: "Laporan Kinerja",
      status: "menunggu",
      tanggal_diajukan: "2026-04-12",
    },
    {
      id: "4",
      nama_pemda: "Pemda Kota Kediri",
      aplikasi: "E-KAK",
      menu: "Laporan Kinerja",
      status: "menunggu",
      tanggal_diajukan: "2026-04-12",
    },
    {
      id: "5",
      nama_pemda: "Pemda Kota Kediri",
      aplikasi: "E-KAK",
      menu: "Laporan Kinerja",
      status: "menunggu",
      tanggal_diajukan: "2026-04-12",
    },
    {
      id: "6",
      nama_pemda: "Pemda Kab Sragen",
      aplikasi: "E-Budgeting",
      menu: "Login",
      catatan_revisi: "Laman login masih tidak bisa redirecting",
      deadline: "2026-04-23",
      status: "revisi",
      tanggal_diajukan: "2026-04-10",
    },
    {
      id: "7",
      nama_pemda: "Pemda Kota Madiun",
      aplikasi: "E-Kinerja",
      menu: "Dashboard",
      catatan_revisi: "Dashboard masih tidak muncul, ada bug",
      deadline: "2026-05-14",
      status: "revisi",
      tanggal_diajukan: "2026-04-10",
    },
    {
      id: "8",
      nama_pemda: "Pemda Kota Blitar",
      aplikasi: "Kertas Kerja",
      menu: "Pohon Cascading",
      catatan_revisi: "Pohon cascading masih tidak muncul",
      deadline: "2026-06-15",
      status: "revisi",
      tanggal_diajukan: "2026-04-08",
    },
    {
      id: "9",
      nama_pemda: "Pemda Kota Blitar",
      aplikasi: "Kertas Kerja",
      menu: "Pohon Cascading",
      catatan_revisi: "Pohon cascading masih tidak muncul",
      deadline: "2026-06-20",
      status: "revisi",
      tanggal_diajukan: "2026-04-08",
    },
    {
      id: "10",
      nama_pemda: "Pemda Kota Semarang",
      aplikasi: "Kertas Kerja",
      menu: "Pohon Kinerja",
      verifikator: "Ryan",
      komentar: "Laporan telah diverifikasi, hasil sesuai",
      status: "terverifikasi",
      tanggal_diajukan: "2026-03-20",
      tanggal_verifikasi: "2026-05-01",
    },
    {
      id: "11",
      nama_pemda: "Pemda Kab Madiun",
      aplikasi: "E-Planning",
      menu: "Dashboard",
      verifikator: "Ryan",
      komentar: "Laporan telah diverifikasi, hasil sesuai",
      status: "terverifikasi",
      tanggal_diajukan: "2026-03-22",
      tanggal_verifikasi: "2026-06-01",
    },
    {
      id: "12",
      nama_pemda: "Pemda Kota Surakarta",
      aplikasi: "Data Kinerja",
      menu: "Data Master",
      verifikator: "Ryan",
      komentar: "Laporan telah diverifikasi, hasil sesuai",
      status: "terverifikasi",
      tanggal_diajukan: "2026-03-25",
      tanggal_verifikasi: "2026-06-21",
    },
  ])

  const [selected, setSelected] = useState<VerifikasiItem | null>(null)

  const handleSave = (updated: VerifikasiItem) => {
    setData(prev =>
      prev.map(d => d.id === updated.id ? updated : d)
    )
    toast.success("Verifikasi laporan berhasil disimpan")
  }

  return (
    <div className="space-y-6 px-4">

      <h2 className="text-2xl font-bold text-[#202224]">
        Verifikasi Laporan
      </h2>

      <VerifikasiBoard
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
