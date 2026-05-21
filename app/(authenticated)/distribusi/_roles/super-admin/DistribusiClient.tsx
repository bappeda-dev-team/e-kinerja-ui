
"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import DistribusiBoard from "./DistribusiBoard"
import KomentarModal from "./modals/KomentarModal"
import AddDistribusiModal from "./modals/AddDistribusiModal"
import EditPelaksanaModal from "./modals/EditPelaksanaModal"
import DistribusiDetailModal from "./modals/DistribusiDetailModal"

import {
  getDistribusi,
  createDistribusi,
  createDistribusiKomentar,
  deleteDistribusi,
  getUsers,
  updateDistribusi,
} from "@/services/distribusi.service"

import type { DistribusiKomentar, DistribusiRequest, DistribusiResponse, UserResponse } from "@/types/distribusi"

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
  komentars: DistribusiKomentar[]
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

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback
}

function getKomentarText(item: DistribusiKomentar) {
  return item.komentar ?? item.komentars ?? ""
}

function normalizeKomentar(item: DistribusiKomentar): DistribusiKomentar {
  return {
    ...item,
    komentar: getKomentarText(item),
  }
}

function mapKomentars(item: DistribusiResponse): DistribusiKomentar[] {
  if (item.komentars?.length) return item.komentars.map(normalizeKomentar)
  if (!item.komentar) return []

  return [{
    id: `komentar-${item.id}`,
    full_name: item.admin?.full_name ?? "Admin",
    komentar: item.komentar,
    created_at: item.created_at ?? "",
  }]
}

export default function DistribusiClient() {
  const [distribusi, setDistribusi] = useState<DistribusiItem[]>([])
  const [users, setUsers] = useState<UserResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [selectedKomentar, setSelectedKomentar] = useState<DistribusiItem | null>(null)
  const [editTarget, setEditTarget] = useState<DistribusiItem | null>(null)
  const [detailItem, setDetailItem] = useState<DistribusiItem | null>(null)

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [distribusiRes, usersRes] = await Promise.all([getDistribusi(), getUsers()])

      setUsers((usersRes.data?.data ?? []).filter((user: UserResponse) => user.is_active))

      const mappedDistribusi: DistribusiItem[] = (distribusiRes.data?.data ?? []).map((item: DistribusiResponse) => {
        const programmerList = (item.pelaksana ?? []).map((pelaksana) => ({
          id: pelaksana.id ?? "",
          nama: pelaksana.full_name ?? pelaksana.username ?? "Programmer",
          pelaksana_id: pelaksana.id ?? "",
        }))
        
        const namaPemda = typeof item.permintaan?.pemda === "object"
          ? item.permintaan.pemda.name
          : item.permintaan?.pemda ?? "-"

        const komentars = mapKomentars(item)

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
          jumlah_komentar: komentars.length,
          komentar: item.komentar ?? "",
          komentars,
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

  const handleAdd = async (val: DistribusiRequest) => {
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
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal menyimpan distribusi"))
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleEdit = async (id: string, val: { komentar: string; pelaksana: string[]; deadline?: string }) => {
    try {
      setSubmitLoading(true)
      const target = distribusi.find((item) => item.id === id)
      if (!target) return

      const res = await updateDistribusi(id, {
        permintaan_id: target.permintaan_id,
        komentar: val.komentar,
        pelaksana: val.pelaksana,
        deadline: val.deadline,
      })

      if (res.status === 200 || res.status === 201) {
        toast.success("Distribusi berhasil diperbarui")
        setEditTarget(null)
        fetchAll()
      } else {
        throw new Error("Gagal memperbarui distribusi")
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal memperbarui distribusi"))
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleSelesai = (id: string) => {
    setDistribusi((prev) => prev.map((item) => item.id === id ? { ...item, status: "approved" } : item))
    toast.success("Pekerjaan ditandai selesai")
  }

  const handleCreateKomentar = async (text: string) => {
    if (!selectedKomentar) return

    try {
      setSubmitLoading(true)
      const res = await createDistribusiKomentar(selectedKomentar.id, { komentars: text })

      if (res.status !== 200 && res.status !== 201) {
        throw new Error(res.data?.message || "Gagal mengirim komentar")
      }

      const created = res.data?.data
      if (!created) {
        fetchAll()
        return
      }

      const normalized = normalizeKomentar(created)
      const applyKomentar = (item: DistribusiItem): DistribusiItem => {
        const nextKomentars = [...item.komentars, normalized]
        return {
          ...item,
          komentars: nextKomentars,
          jumlah_komentar: nextKomentars.length,
        }
      }

      setDistribusi((prev) => prev.map((item) => item.id === selectedKomentar.id ? applyKomentar(item) : item))
      setSelectedKomentar((prev) => prev ? applyKomentar(prev) : prev)
      toast.success("Komentar berhasil dikirim")
    } catch (error) {
      toast.error(getErrorMessage(error, "Gagal mengirim komentar"))
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <div className="space-y-6 px-3 sm:px-4">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="font-nunito text-[2.1rem] leading-tight font-bold text-[#202224] sm:text-3xl">
          Distribusi Pekerjaan
        </h2>
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
          komentars={selectedKomentar.komentars}
          onClose={() => setSelectedKomentar(null)}
          onSend={handleCreateKomentar}
          loading={submitLoading}
        />
      )}

      {showAdd && (
        <AddDistribusiModal
          onClose={() => setShowAdd(false)}
          onSave={handleAdd}
          loading={submitLoading}
        />
      )}

      {editTarget && (
        <EditPelaksanaModal
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
        onShowKomentar={(item) => { setDetailItem(null); setSelectedKomentar(item) }}
        onSelesai={(id) => { setDetailItem(null); handleSelesai(id) }}
      />
    </div>
  )
}
