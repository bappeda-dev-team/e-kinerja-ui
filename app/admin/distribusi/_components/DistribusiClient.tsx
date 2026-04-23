// app/admin/distribusi/_components/DistribusiClient.tsx

"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import DistribusiBoard from "./DistribusiBoard"
import KomentarModal from "@/app/super-admin/distribusi/_components/modals/KomentarModal"
import EditDistribusiModal from "./modals/EditDistribusiModal"
import DistribusiDetailModal from "@/app/super-admin/distribusi/_components/modals/DistribusiDetailModal"
import { NetworkError } from "@/components/network-error"

import {
  getDistribusi,
  updateDistribusi,
  deleteDistribusi,
  getUsers,
} from "../services"

import type { DistribusiResponse, UserResponse } from "@/app/super-admin/distribusi/types"

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
  permintaan_id: string
  nama_pemda: string
  logo_pemda?: string
  aplikasi: string
  menu: string
  awal: string
  target: string
  admin: string
  programmer: { id: string; nama: string; pelaksana_id: string }[]
  deadline: string
  created_at: string
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

export default function AdminDistribusiClient() {
  const [distribusi, setDistribusi] = useState<DistribusiItem[]>([])
  const [users, setUsers] = useState<UserResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [networkError, setNetworkError] = useState(false)
  const [fetchKey, setFetchKey] = useState(0)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [selectedKomentar, setSelectedKomentar] = useState<string | null>(null)
  const [editTarget, setEditTarget] = useState<DistribusiItem | null>(null)
  const [detailItem, setDetailItem] = useState<DistribusiItem | null>(null)

  const fetchAll = async () => {
    try {
      setLoading(true)
      setNetworkError(false)
      const [distribusiRes, usersRes] = await Promise.all([getDistribusi(), getUsers()])

      if (distribusiRes.status === 0 || usersRes.status === 0) {
        setNetworkError(true)
        return
      }

      setUsers((usersRes.data?.data ?? []).filter((u: UserResponse) => u.is_active))

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
          permintaan_id: item.permintaan?.id ?? "",
          nama_pemda: namaPemda,
          logo_pemda: typeof item.permintaan?.pemda === "object" ? item.permintaan.pemda.logo ?? "" : "",
          aplikasi: typeof item.permintaan?.aplikasi === "object"
            ? item.permintaan.aplikasi.name
            : item.permintaan?.aplikasi ?? "-",
          menu: item.permintaan?.menu ?? "-",
          awal: item.permintaan?.kondisi_awal ?? "-",
          target: item.permintaan?.kondisi_diharapkan ?? "-",
          deadline: item.permintaan?.tanggal_deadline ?? "",
          created_at: item.created_at ?? "",
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

  useEffect(() => { fetchAll() }, [fetchKey])

  const handleDelete = async (id: string) => {
    try {
      await deleteDistribusi(id)
      setDistribusi((prev) => prev.filter((item) => item.id !== id))
      toast.success("Data berhasil dihapus")
    } catch {
      toast.error("Gagal menghapus data")
    }
  }

  const handleEdit = async (id: string, val: { komentar: string; programmer_ids: string[] }) => {
    try {
      setSubmitLoading(true)
      const target = distribusi.find((d) => d.id === id)
      if (!target) return
      const res = await updateDistribusi(id, {
        permintaan_id: target.permintaan_id,
        komentar: val.komentar,
        pelaksana: val.programmer_ids,
      })
      if (res.status === 200 || res.status === 201) {
        toast.success("Distribusi berhasil diperbarui")
        setEditTarget(null)
        fetchAll()
      } else {
        throw new Error(res.data?.message || "Gagal memperbarui distribusi")
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui distribusi")
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleSelesai = (id: string) => {
    setDistribusi((prev) => prev.map((item) => item.id === id ? { ...item, status: "approved" } : item))
    toast.success("Pekerjaan ditandai selesai")
  }

  if (networkError) {
    return <NetworkError onRetry={() => setFetchKey((k) => k + 1)} />
  }

  return (
    <div className="space-y-6 px-3 sm:px-4">
      <div className="mb-4">
        <h2 className="font-nunito text-[2.1rem] leading-tight font-bold text-[#202224] sm:text-3xl">
          Distribusi Pekerjaan
        </h2>
        <p className="text-sm text-[#797A7C] mt-1">Kelola distribusi pekerjaan ke programmer. Untuk mendistribusikan, gunakan halaman <span className="font-semibold text-[#4880FF]">Permintaan Klien</span>.</p>
      </div>

      {loading ? <HybridLoader /> : (
        <DistribusiBoard
          distribusi={distribusi}
          onSelesai={handleSelesai}
          onDelete={handleDelete}
          onShowKomentar={setSelectedKomentar}
          onEdit={setEditTarget}
          onRowClick={setDetailItem}
        />
      )}

      {selectedKomentar && (
        <KomentarModal
          komentar={selectedKomentar}
          onClose={() => setSelectedKomentar(null)}
        />
      )}

      {editTarget && (
        <EditDistribusiModal
          item={editTarget}
          users={users}
          onClose={() => setEditTarget(null)}
          onSave={handleEdit}
          loading={submitLoading}
        />
      )}

      <DistribusiDetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onEdit={(item) => { setDetailItem(null); setEditTarget(item) }}
        onDelete={(id) => { setDetailItem(null); handleDelete(id) }}
        onShowKomentar={(text) => { setDetailItem(null); setSelectedKomentar(text) }}
        onSelesai={(id) => { setDetailItem(null); handleSelesai(id) }}
      />
    </div>
  )
}
