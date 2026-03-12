"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import DistribusiBoard from "./DistribusiBoard"
import AssignDistribusiModal from "./modals/AssignDistribusiModal"

import {
  getDistribusi,
  createDistribusi,
  deleteDistribusi,
} from "../_services"

import type { DistribusiResponse } from "../_types"

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
  jumlah_komentar?: number
  komentar?: string
}

export default function DistribusiClient() {

  const [permintaan, setPermintaan] = useState<PermintaanItem[]>([])
  const [distribusi, setDistribusi] = useState<DistribusiItem[]>([])
  const [assignItem, setAssignItem] = useState<PermintaanItem | null>(null)

  const [selectedKomentar, setSelectedKomentar] = useState<string | null>(null)

  const fetchDistribusi = async () => {

    try {

      const res = await getDistribusi()

      const mapped: DistribusiItem[] =
        (res.data.data ?? []).map((item: DistribusiResponse) => ({

          id: item.id ?? "",

          // backend belum kirim data ini
          nama_pemda: "Pemda (Tidak diketahui)",
          aplikasi: "Aplikasi (Tidak diketahui)",
          menu: "-",
          deadline: "",

          admin: item.admin_id ?? "Admin",

          programmer: [],

          status: "didistribusikan",

          jumlah_komentar: item.komentar ? 1 : 0,

          komentar: item.komentar ?? "",

        }))

      setDistribusi(mapped)

    } catch {

      toast.error("Gagal mengambil data distribusi")

    }

  }

  useEffect(() => {

    fetchDistribusi()

  }, [])

  const handleSaveAssign = async (val: {
    admin: string
    programmer: string[]
    deadline: string
  }) => {

    if (!assignItem) return

    try {

      const payload = {

        permintaan_id: assignItem.id,

        komentar: "",

      }

      const res = await createDistribusi(payload)

      const newDistribusi = res.data.data

      if (!newDistribusi) return

      const newItem: DistribusiItem = {

        id: newDistribusi.id ?? crypto.randomUUID(),

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

      setPermintaan(prev =>
        prev.filter(p => p.id !== assignItem.id)
      )

      toast.success("Pekerjaan berhasil didistribusikan")

      setAssignItem(null)

    } catch {

      toast.error("Gagal mendistribusikan pekerjaan")

    }

  }

  const handleDelete = async (id: string) => {

    try {

      await deleteDistribusi(id)

      setDistribusi(prev =>
        prev.filter(item => item.id !== id)
      )

      toast.success("Data berhasil dihapus")

    } catch {

      toast.error("Gagal menghapus data")

    }

  }

  const handleSelesai = (id: string) => {

    setDistribusi(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: "selesai" }
          : item
      )
    )

    toast.success("Pekerjaan ditandai selesai")

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
        onShowKomentar={(text) => setSelectedKomentar(text)}
      />

      {assignItem && (

        <AssignDistribusiModal
          item={assignItem}
          onClose={() => setAssignItem(null)}
          onSave={handleSaveAssign}
        />

      )}

      {selectedKomentar && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white rounded-xl p-6 w-[420px] shadow-lg">

            <h3 className="text-lg font-bold mb-3">
              Komentar Distribusi
            </h3>

            <p className="text-sm text-gray-600">
              {selectedKomentar}
            </p>

            <button
              onClick={() => setSelectedKomentar(null)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Tutup
            </button>

          </div>

        </div>

      )}

    </div>

  )
}