"use client"

import * as React from "react" // Import React untuk HybridLoader hooks
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
  const [loading, setLoading] = useState(true) // 1. Tambahkan state loading

  const [assignItem, setAssignItem] = useState<PermintaanItem | null>(null)
  const [selectedKomentar, setSelectedKomentar] = useState<string | null>(null)

  const fetchDistribusi = async () => {
    try {
      setLoading(true) // 2. Mulai loading
      const res = await getDistribusi()

      const mapped: DistribusiItem[] =
        (res.data.data ?? []).map((item: DistribusiResponse) => ({
          id: item.id,
          nama_pemda: item.permintaan?.pemda ?? "-",
          aplikasi: item.permintaan?.aplikasi ?? "-",
          menu: item.permintaan?.menu ?? "-",
          deadline: item.permintaan?.tanggal_deadline ?? "",
          admin: item.admin?.full_name ?? "-",
          programmer: [],
          status: "didistribusikan",
          jumlah_komentar: item.komentar ? 1 : 0,
          komentar: item.komentar ?? "",
        }))

      setDistribusi(mapped)
    } catch {
      toast.error("Gagal mengambil data distribusi")
    } finally {
      // 3. Matikan loading dengan sedikit delay biar smooth
      setTimeout(() => setLoading(false), 800)
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

      {/* 4. Tampilkan HybridLoader saat loading, jika sudah selesai tampilkan Board */}
      {loading ? (
        <HybridLoader />
      ) : (
        <DistribusiBoard
          permintaan={permintaan}
          distribusi={distribusi}
          onAssign={(item) => setAssignItem(item)}
          onSelesai={handleSelesai}
          onDelete={handleDelete}
          onShowKomentar={(text) => setSelectedKomentar(text)}
        />
      )}

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
            <h3 className="text-lg font-bold mb-3">
              Komentar Distribusi
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {selectedKomentar}
            </p>
            <button
              onClick={() => setSelectedKomentar(null)}
              className="mt-6 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition active:scale-95"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}