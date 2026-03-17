"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Table2 } from "lucide-react"

import DistribusiBoard from "./DistribusiBoard"
import AssignDistribusiModal from "./modals/AssignDistribusiModal"
import EditPelaksanaModal from "./modals/EditPelaksanaModal"
import KomentarModal from "./modals/KomentarModal"

import {
  getPermintaan, getDistribusi, getPelaksana,
  createDistribusi, createPelaksana,
  deleteDistribusi, deletePelaksana, getUsers, getPemda,
} from "../_services"
import { getVerifikasi } from "@/app/(authenticated)/verifikasi/_services"
import { getLaporan } from "@/app/(authenticated)/laporan/_services"

import type { DistribusiResponse, PelaksanaResponse, PermintaanResponse } from "../_types"

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

export interface PermintaanItem {
  id: string
  nama_pemda: string
  logo_pemda?: string
  aplikasi: string
  menu: string
  awal: string
  target: string
  deadline: string
  lampiran: string[]
}

export interface DistribusiItem {
  id: string
  nama_pemda: string
  logo_pemda?: string
  aplikasi: string
  menu: string
  admin: string
  programmer: { id: string; nama: string; pelaksana_id: string }[]
  deadline: string
  status: "didistribusikan" | "selesai"
  jumlah_komentar?: number
  komentar?: string
  hasil?: string
  kualitas?: string
  ketepatan?: string
  lampiran: string[]
}

export interface UserItem {
  id: string
  full_name: string
  username: string
}

export default function DistribusiClient() {
  const [permintaan, setPermintaan] = useState<PermintaanItem[]>([])
  const [distribusi, setDistribusi] = useState<DistribusiItem[]>([])
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showTable, setShowTable] = useState(false)
  const [assignItem, setAssignItem] = useState<PermintaanItem | null>(null)
  const [editItem, setEditItem] = useState<DistribusiItem | null>(null)
  const [selectedKomentar, setSelectedKomentar] = useState<string | null>(null)

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [
        permintaanRes, 
        distribusiRes, 
        pelaksanaRes, 
        usersRes, 
        verifikasiRes, 
        laporanRes,
        pemdaRes
      ] = await Promise.all([
        getPermintaan(), 
        getDistribusi(), 
        getPelaksana(), 
        getUsers(),
        getVerifikasi(), 
        getLaporan(),
        getPemda()
      ])

      const pelaksanaList: PelaksanaResponse[] = pelaksanaRes.data?.data ?? []
      const verifikasiList = verifikasiRes.data?.data ?? []
      const laporanList = laporanRes.data?.data ?? []
      const masterPemda = pemdaRes.data?.data ?? []

      const laporanToPermintaan = new Map(
        laporanList.map((l: any) => [l.id, l.permintaan?.id])
      )

      const approvedPermintaanIds = new Set(
        verifikasiList
          .filter((v: any) => v.status_verified === "approved")
          .map((v: any) => laporanToPermintaan.get(v.laporan?.id))
          .filter(Boolean)
      )

      const allUsers = usersRes.data?.data ?? []
      const programmerUsers = allUsers
        .filter((u: any) => u.is_active)
        .map((u: any) => ({ id: u.id, full_name: u.full_name, username: u.username }))
      setUsers(programmerUsers)

      const mappedDistribusi: DistribusiItem[] = (distribusiRes.data?.data ?? []).map((item: DistribusiResponse) => {
        const pelaksanaForThis = pelaksanaList.filter((p: any) =>
          (p.distribusi?.id ?? p.distribusi_id) === item.id
        )
        const programmerList = pelaksanaForThis.map((p: any) => ({
          id: p.programmer?.id ?? "",
          nama: p.programmer?.full_name ?? p.programmer?.username ?? "Programmer",
          pelaksana_id: p.id ?? "",
        }))

        const permintaanId = item.permintaan?.id
        const isApproved = approvedPermintaanIds.has(permintaanId)
        
        const namaPemda = typeof item.permintaan?.pemda === "object"
            ? item.permintaan.pemda.name
            : item.permintaan?.pemda ?? "-";
        
        const pemdaDetail = masterPemda.find((p: any) => p.name === namaPemda);

        return {
          id: item.id,
          nama_pemda: namaPemda,
          logo_pemda: pemdaDetail?.logo || "",
          aplikasi: typeof item.permintaan?.aplikasi === "object"
            ? item.permintaan.aplikasi.name
            : item.permintaan?.aplikasi ?? "-",
          menu: item.permintaan?.menu ?? "-",
          deadline: item.permintaan?.tanggal_deadline ?? "",
          admin: item.admin?.full_name ?? "-",
          programmer: programmerList,
          status: isApproved ? "selesai" : "didistribusikan",
          jumlah_komentar: item.komentar ? 1 : 0,
          komentar: item.komentar ?? "",
          lampiran: item.permintaan?.lampiran ?? [],
        }
      })

      const distribusiPermintaanIds = new Set(
        (distribusiRes.data?.data ?? []).map((d: any) => d.permintaan?.id).filter(Boolean)
      )

      const mappedPermintaan: PermintaanItem[] = (permintaanRes.data?.data ?? [])
        .filter((p: PermintaanResponse) => !distribusiPermintaanIds.has(p.id))
        .map((p: PermintaanResponse) => {
          const pemdaDetail = masterPemda.find((pem: any) => pem.name === p.pemda?.name);
          return {
            id: p.id,
            nama_pemda: p.pemda?.name ?? "-",
            logo_pemda: pemdaDetail?.logo || "",
            aplikasi: p.aplikasi?.name ?? "-",
            menu: p.menu ?? "-",
            awal: p.kondisi_awal ?? "-",
            target: p.kondisi_diharapkan ?? "-",
            deadline: p.tanggal_deadline ?? "",
            lampiran: p.lampiran ?? [],
          }
        })

      setDistribusi(mappedDistribusi)
      setPermintaan(mappedPermintaan)
    } catch {
      toast.error("Gagal mengambil data")
    } finally {
      setTimeout(() => setLoading(false), 800)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleSaveAssign = async (val: { programmer_ids: string[]; komentar: string }) => {
    if (!assignItem) return
    try {
      const distribusiRes = await createDistribusi({ permintaan_id: assignItem.id, komentar: val.komentar })
      const newDistribusi = distribusiRes.data?.data
      if (!newDistribusi?.id) throw new Error("Gagal membuat distribusi")
      await Promise.all(val.programmer_ids.map((programmer_id) =>
        createPelaksana({ distribusi_id: newDistribusi.id, programmer_id })
      ))
      toast.success("Pekerjaan berhasil didistribusikan")
      setAssignItem(null)
      await fetchAll()
    } catch {
      toast.error("Gagal mendistribusikan pekerjaan")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteDistribusi(id)
      setDistribusi((prev) => prev.filter((item) => item.id !== id))
      toast.success("Data berhasil dihapus")
    } catch {
      toast.error("Gagal menghapus data")
    }
  }

  const handleAddPelaksana = async (distribusi_id: string, programmer_id: string) => {
    try {
      await createPelaksana({ distribusi_id, programmer_id })
      await fetchAll()
      toast.success("Programmer berhasil ditambahkan")
    } catch {
      toast.error("Gagal menambahkan programmer")
    }
  }

  const handleDeletePelaksana = async (pelaksana_id: string, distribusi_id: string) => {
    try {
      await deletePelaksana(pelaksana_id)
      await fetchAll()
      toast.success("Programmer berhasil dihapus")
    } catch {
      toast.error("Gagal menghapus programmer")
    }
  }

  const handleSelesai = (id: string) => {
    setDistribusi((prev) => prev.map((item) => item.id === id ? { ...item, status: "selesai" } : item))
    toast.success("Pekerjaan ditandai selesai")
  }

  return (
    <div className="space-y-6 px-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold text-[#202224]">Distribusi Pekerjaan</h2>
        {!loading && (
          <button
            onClick={() => setShowTable((prev) => !prev)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition active:scale-95 ${
              showTable
                ? "bg-blue-600 text-white"
                : "bg-white text-[#202224] border border-gray-200 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            <Table2 className="size-4" />
            {showTable ? "Lihat Board" : "Lihat Semua (Tabel)"}
          </button>
        )}
      </div>

      {loading ? <HybridLoader /> : (
        <DistribusiBoard
          permintaan={permintaan}
          distribusi={distribusi}
          showTable={showTable}
          onAssign={setAssignItem}
          onSelesai={handleSelesai}
          onDelete={handleDelete}
          onEditPelaksana={setEditItem}
          onShowKomentar={setSelectedKomentar}
        />
      )}

      {assignItem && (
        <AssignDistribusiModal
          item={assignItem}
          users={users}
          onClose={() => setAssignItem(null)}
          onSave={handleSaveAssign}
        />
      )}

      {editItem && (
        <EditPelaksanaModal
          item={editItem}
          users={users}
          onClose={() => setEditItem(null)}
          onAddPelaksana={handleAddPelaksana}
          onDeletePelaksana={handleDeletePelaksana}
        />
      )}

      {selectedKomentar && (
        <KomentarModal
          komentar={selectedKomentar}
          onClose={() => setSelectedKomentar(null)}
        />
      )}
    </div>
  )
}