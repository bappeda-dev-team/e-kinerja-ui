// app/super-admin/distribusi/_components/DistribusiClient.tsx

"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"

import DistribusiBoard from "./DistribusiBoard"
import KomentarModal from "./modals/KomentarModal"
import AddDistribusiModal from "./modals/AddDistribusiModal"

import {
  getDistribusi,
  createDistribusi,
  deleteDistribusi,
} from "../services"

import type { DistribusiResponse } from "../types"

const HybridLoader = () => {
  const [progress, setProgress] = React.useState(0)
  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + Math.floor(Math.random() * 10)))
    }, 200)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 min-h-[400px]">
      <div className="relative flex items-center justify-center">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-blue-100" />
          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent"
            strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * progress) / 100}
            className="text-blue-600 transition-all duration-300 ease-out" strokeLinecap="round" />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-blue-600 animate-bounce text-xl">⏳</span>
          <span className="text-[10px] font-bold text-blue-600">{progress}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-[#202224]">Sedang memproses...</p>
        <p className="text-[11px] text-[#202224]/50">Mohon tunggu sebentar</p>
      </div>
    </div>
  )
}

export interface DistribusiItem {
  id: string
  nama_pemda: string
  logo_pemda?: string
  aplikasi: string
  menu: string
  awal: string
  target: string
  admin: string
  programmer: { id: string; nama: string; pelaksana_id: string }[]
  deadline: string
  status: "didistribusikan" | "pending" | "revision" | "approved"
  jumlah_komentar?: number
  komentar?: string
  hasil?: string
  kualitas?: string
  ketepatan?: string
  lampiran: string[]
}

function mapDistribusiStatus(item: DistribusiResponse): DistribusiItem["status"] {
  const verificationStatus = item.verifikasi?.status_verified?.toLowerCase()

  if (verificationStatus === "approved") return "approved"
  if (verificationStatus === "revision") return "revision"
  if (verificationStatus === "pending") return "pending"

  return "didistribusikan"
}

export default function DistribusiClient() {
  const [distribusi, setDistribusi] = useState<DistribusiItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [selectedKomentar, setSelectedKomentar] = useState<string | null>(null)

  const fetchAll = async () => {
    try {
      setLoading(true)
      const distribusiRes = await getDistribusi()

      const mappedDistribusi: DistribusiItem[] = (distribusiRes.data?.data ?? []).map((item: DistribusiResponse) => {
        const programmerList = (item.pelaksana ?? []).map((pelaksana) => ({
          id: pelaksana.id ?? "",
          nama: pelaksana.full_name ?? pelaksana.username ?? "Programmer",
          pelaksana_id: pelaksana.id ?? "",
        }))
        
        const namaPemda = typeof item.permintaan?.pemda === "object"
          ? item.permintaan.pemda.name
          : item.permintaan?.pemda ?? "-"

        return {
          id: item.id,
          nama_pemda: namaPemda,
          logo_pemda: typeof item.permintaan?.pemda === "object" ? item.permintaan.pemda.logo ?? "" : "",
          aplikasi: typeof item.permintaan?.aplikasi === "object"
            ? item.permintaan.aplikasi.name
            : item.permintaan?.aplikasi ?? "-",
          menu: item.permintaan?.menu ?? "-",
          awal: item.permintaan?.kondisi_awal ?? "-",
          target: item.permintaan?.kondisi_diharapkan ?? "-",
          deadline: item.permintaan?.tanggal_deadline ?? "",
          admin: item.admin?.full_name ?? "-",
          programmer: programmerList,
          status: mapDistribusiStatus(item),
          jumlah_komentar: item.komentar ? 1 : 0,
          komentar: item.komentar ?? "",
          lampiran: item.permintaan?.lampiran ?? [],
        }
      })

      setDistribusi(mappedDistribusi)
    } catch {
      toast.error("Gagal mengambil data")
    } finally {
      setTimeout(() => setLoading(false), 800)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteDistribusi(id)
      setDistribusi((prev) => prev.filter((item) => item.id !== id))
      toast.success("Data berhasil dihapus")
    } catch {
      toast.error("Gagal menghapus data")
    }
  }

  const handleAdd = async (val: { permintaan_id: string; komentar?: string }) => {
    try {
      setSubmitLoading(true)
      const res = await createDistribusi(val)
      if (res.status === 200 || res.status === 201) {
        toast.success("Distribusi pekerjaan berhasil dibuat")
        setShowAdd(false)
        fetchAll()
      } else {
        throw new Error("Gagal menyimpan distribusi")
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan distribusi")
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleSelesai = (id: string) => {
    setDistribusi((prev) => prev.map((item) => item.id === id ? { ...item, status: "approved" } : item))
    toast.success("Pekerjaan ditandai selesai")
  }

  return (
    <div className="space-y-6 px-3 sm:px-4">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="font-nunito text-[2.1rem] leading-tight font-bold text-[#202224] sm:text-3xl">
          Distribusi Pekerjaan
        </h2>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap lg:w-auto lg:justify-end">
          <button 
            onClick={() => setShowAdd(true)} 
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#4880FF] px-5 py-3 text-sm font-bold text-white shadow-[0_4px_14px_0_rgba(72,128,255,0.39)] transition hover:bg-blue-600 active:scale-95 sm:w-auto sm:px-6 sm:py-2.5"
          >
            <Plus className="size-4" /> Tambah Distribusi
          </button>
        </div>
      </div>

      {loading ? <HybridLoader /> : (
        <DistribusiBoard
          distribusi={distribusi}
          onSelesai={handleSelesai}
          onDelete={handleDelete}
          onShowKomentar={setSelectedKomentar}
        />
      )}

      {selectedKomentar && (
        <KomentarModal
          komentar={selectedKomentar}
          onClose={() => setSelectedKomentar(null)}
        />
      )}

      {showAdd && (
        <AddDistribusiModal
          onClose={() => setShowAdd(false)}
          onSave={handleAdd}
          loading={submitLoading}
        />
      )}
    </div>
  )
}
