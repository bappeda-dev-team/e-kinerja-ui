"use client"

import { useState } from "react"
import { toast } from "sonner"

import DistribusiBoard from "./DistribusiBoard"
import AssignDistribusiModal from "./modals/AssignDistribusiModal"

export interface PermintaanItem {
  id: string
  nama_pemda: string
  aplikasi: string
  menu: string
  awal: string
  target: string
  deadline: string
}

export interface DistribusiItem {
  id: string
  nama_pemda: string
  aplikasi: string
  menu: string
  admin: string
  programmer: string[]
  deadline: string
  status: "didistribusikan" | "selesai"
  hasil?: string
  kualitas?: string
  ketepatan?: "Tepat waktu" | "Terlambat"
  jumlah_komentar?: number
}

export default function DistribusiClient() {

  const [permintaan, setPermintaan] = useState<PermintaanItem[]>([
    {
      id: "p1",
      nama_pemda: "Pemda Kota Bandung",
      aplikasi: "E-Kinerja",
      menu: "Dashboard",
      awal: "Laman login tidak bisa redirecting",
      target: "Laman login berfungsi normal",
      deadline: "2026-04-10",
    },
    {
      id: "p2",
      nama_pemda: "Pemda Kab Ngawi",
      aplikasi: "Pengajuan KTA",
      menu: "Register",
      awal: "Pengguna tidak bisa mendaftarkan akun baru",
      target: "Pengguna bisa mendaftarkan akun baru",
      deadline: "2026-05-03",
    },
    {
      id: "p3",
      nama_pemda: "Pemda Kota Kediri",
      aplikasi: "E-KAK",
      menu: "Laporan Kinerja",
      awal: "Tidak bisa mengunduh PDF",
      target: "Bisa mengunduh PDF",
      deadline: "2026-06-07",
    },
  ])

  const [distribusi, setDistribusi] = useState<DistribusiItem[]>([
    {
      id: "d1",
      nama_pemda: "Pemda Kab Sragen",
      aplikasi: "E-Budgeting",
      menu: "Login",
      admin: "Ilham",
      programmer: ["Daniel", "Maura"],
      deadline: "2026-04-21",
      status: "didistribusikan",
      jumlah_komentar: 3,
    },
    {
      id: "d2",
      nama_pemda: "Pemda Kota Madiun",
      aplikasi: "E-Kinerja",
      menu: "Dashboard",
      admin: "Ilham",
      programmer: ["Zul", "Myko"],
      deadline: "2026-05-11",
      status: "didistribusikan",
      jumlah_komentar: 3,
    },
    {
      id: "d3",
      nama_pemda: "Pemda Kota Blitar",
      aplikasi: "Kertas Kerja",
      menu: "Pohon Cascading",
      admin: "Ilham",
      programmer: ["Agnar", "Maura"],
      deadline: "2026-06-15",
      status: "didistribusikan",
      jumlah_komentar: 3,
    },
    {
      id: "d4",
      nama_pemda: "Pemda Kota Semarang",
      aplikasi: "Kertas Kerja",
      menu: "Pohon Kinerja",
      admin: "Ilham",
      programmer: ["Reza", "Dimas"],
      deadline: "2026-05-01",
      status: "selesai",
      hasil: "Pokin berfungsi dengan baik",
      kualitas: "Baik",
      ketepatan: "Tepat waktu",
      jumlah_komentar: 3,
    },
    {
      id: "d5",
      nama_pemda: "Pemda Kab Madiun",
      aplikasi: "E-Planning",
      menu: "Dashboard",
      admin: "Ilham",
      programmer: ["Reza", "Dimas"],
      deadline: "2026-06-01",
      status: "selesai",
      hasil: "Dashboard memuat ringkasan data",
      kualitas: "Sangat Baik",
      ketepatan: "Tepat waktu",
      jumlah_komentar: 3,
    },
    {
      id: "d6",
      nama_pemda: "Pemda Kota Surakarta",
      aplikasi: "Data Kinerja",
      menu: "Data Master",
      admin: "Ilham",
      programmer: ["Reza", "Dimas"],
      deadline: "2026-06-21",
      status: "selesai",
      hasil: "Data master bisa menambahkan data",
      kualitas: "Cukup",
      ketepatan: "Terlambat",
      jumlah_komentar: 3,
    },
  ])

  const [assignItem, setAssignItem] = useState<PermintaanItem | null>(null)

  const handleSaveAssign = (val: {
    admin: string
    programmer: string[]
    deadline: string
  }) => {

    if (!assignItem) return

    const newItem: DistribusiItem = {
      id: crypto.randomUUID(),
      nama_pemda: assignItem.nama_pemda,
      aplikasi: assignItem.aplikasi,
      menu: assignItem.menu,
      admin: val.admin,
      programmer: val.programmer,
      deadline: val.deadline,
      status: "didistribusikan",
      jumlah_komentar: 0,
    }

    setDistribusi(prev => [...prev, newItem])
    setPermintaan(prev => prev.filter(p => p.id !== assignItem.id))
    toast.success("Pekerjaan berhasil didistribusikan")
    setAssignItem(null)
  }

  const handleSelesai = (id: string) => {
    setDistribusi(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: "selesai", ketepatan: "Tepat waktu", hasil: "-", kualitas: "-" }
          : item
      )
    )
    toast.success("Pekerjaan ditandai selesai")
  }

  const handleDelete = (id: string) => {
    setDistribusi(prev => prev.filter(item => item.id !== id))
    toast.success("Data berhasil dihapus")
  }

  return (
    <div className="space-y-6 px-4">

      <h2 className="text-2xl font-bold text-[#202224]">
        Distribusi Pekerjaan
      </h2>

      <DistribusiBoard
        permintaan={permintaan}
        distribusi={distribusi}
        onAssign={(item) => setAssignItem(item)}
        onSelesai={handleSelesai}
        onDelete={handleDelete}
      />

      {assignItem && (
        <AssignDistribusiModal
          item={assignItem}
          onClose={() => setAssignItem(null)}
          onSave={handleSaveAssign}
        />
      )}

    </div>
  )
}
