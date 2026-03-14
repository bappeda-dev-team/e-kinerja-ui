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
  hasil?: string
  kualitas?: string
  ketepatan?: string
}

export default function DistribusiClient() {
  const [permintaan, setPermintaan] = useState<PermintaanItem[]>([])
  const [distribusi, setDistribusi] = useState<DistribusiItem[]>([])
  const [assignItem, setAssignItem] = useState<PermintaanItem | null>(null)
  const [loading, setLoading] = useState(true) // State Loading ditambahkan

  const [selectedKomentar, setSelectedKomentar] = useState<string | null>(null)

  const fetchDistribusi = async () => {
    try {
      setLoading(true) // Mulai loading
      const res = await getDistribusi()

      const mapped: DistribusiItem[] = (res.data.data ?? []).map((item: DistribusiResponse) => ({
        id: item.id,
        nama_pemda: item.permintaan?.pemda ?? "-",
        aplikasi: item.permintaan?.aplikasi ?? "-",
        menu: item.permintaan?.menu ?? "-",
        deadline: item.permintaan?.tanggal_deadline ?? "",
        admin: item.admin?.full_name ?? "-",
        programmer: [], // Sesuaikan jika ada data programmer dari API
        status: "didistribusikan",
        jumlah_komentar: item.komentar ? 1 : 0,
        komentar: item.komentar ?? "",
      }))

      setDistribusi(mapped)
    } catch (err) {
      toast.error("Gagal mengambil data distribusi")
    } finally {
      // WAJIB: Mematikan loading agar hybrid loader hilang
      setLoading(false)
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
        // Tambahkan admin & programmer ke payload sesuai kebutuhan API
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
      setPermintaan(prev => prev.filter(p => p.id !== assignItem.id))
      
      toast.success("Pekerjaan berhasil didistribusikan")
      setAssignItem(null)
    } catch {
      toast.error("Gagal mendistribusikan pekerjaan")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteDistribusi(id)
      setDistribusi(prev => prev.filter(item => item.id !== id))
      toast.success("Data berhasil dihapus")
    } catch {
      toast.error("Gagal menghapus data")
    }
  }

  const handleSelesai = (id: string) => {
    // Simulasi status selesai (sesuaikan dengan API patch jika ada)
    setDistribusi(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: "selesai" } : item
      )
    )
    toast.success("Pekerjaan ditandai selesai")
  }

  return (
    <div className="space-y-6 px-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#202224]">
          Distribusi Pekerjaan
        </h2>
      </div>

      <DistribusiBoard
        permintaan={permintaan}
        distribusi={distribusi}
        onAssign={(item) => setAssignItem(item)}
        onSelesai={handleSelesai}
        onDelete={handleDelete}
        onShowKomentar={(text) => setSelectedKomentar(text)}
        loading={loading} // Kirim prop loading ke Board
      />

      {assignItem && (
        <AssignDistribusiModal
          item={assignItem}
          onClose={() => setAssignItem(null)}
          onSave={handleSaveAssign}
        />
      )}

      {selectedKomentar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[420px] shadow-lg animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold mb-3 text-[#202224]">
              Komentar Distribusi
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed italic">
              "{selectedKomentar}"
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedKomentar(null)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}