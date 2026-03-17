"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Table2, LayoutGrid } from "lucide-react"
import { toast } from "sonner"

import LaporanKinerjaGrid from "./LaporanKinerjaGrid"
import AddLaporanKinerja from "./modals/AddLaporanKinerja"
import EditLaporanKinerja from "./modals/EditLaporanKinerja"

import { getLaporan, createLaporan, updateLaporan, deleteLaporan, getPemda } from "../_services"
import { createVerifikasi } from "@/app/(authenticated)/verifikasi/_services"
import { LaporanKinerjaItem, LaporanResponse } from "../_types"
import { getPermintaan } from "@/app/(authenticated)/permintaan/_services"
import { getUsers } from "@/app/(authenticated)/data-master/master-user/_services"
import type { PermintaanResponse } from "@/app/(authenticated)/permintaan/_types"
import type { UserResponse } from "@/app/(authenticated)/data-master/master-user/_types"

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

export default function LaporanKinerjaClient() {
  const [data, setData] = useState<LaporanKinerjaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submittingId, setSubmittingId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState<LaporanKinerjaItem | null>(null)
  const [showTable, setShowTable] = useState(false)

  const [permintaanList, setPermintaanList] = useState<{ id: string; pemda: string; menu: string }[]>([])
  const [masterPegawai, setMasterPegawai] = useState<{ id: string; nama_pegawai: string; jabatan: string }[]>([])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [resLaporan, resPemda] = await Promise.all([getLaporan(), getPemda()])
      
      if (resLaporan.status !== 200) throw new Error(resLaporan.data?.message || "Gagal memuat data")

      const rawData = resLaporan.data?.data || []
      const masterPemda = resPemda.data?.data || []

      const mapped: LaporanKinerjaItem[] = rawData.map((item: LaporanResponse) => {
        const pemdaDetail = masterPemda.find((p: any) => p.name === item.permintaan?.pemda)
        return {
          id: item.id,
          laporan_progress: item.laporan_progress,
          permintaan: item.permintaan,
          programmer: item.programmer,
          status: item.status,
          created_at: item.created_at,
          logo_pemda: pemdaDetail?.logo || ""
        }
      })
      setData(mapped)
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan sistem")
    } finally {
      setTimeout(() => setLoading(false), 800)
    }
  }

  const fetchDropdownData = async () => {
    try {
      const [permRes, userRes] = await Promise.all([getPermintaan(), getUsers()])
      if (permRes.status === 200) {
        setPermintaanList((permRes.data?.data ?? []).map((p: PermintaanResponse) => ({
          id: p.id, pemda: p.pemda?.name ?? "", menu: p.menu ?? ""
        })))
      }
      if (userRes.status === 200) {
        setMasterPegawai((userRes.data?.data ?? []).map((u: UserResponse) => ({
          id: u.id, nama_pegawai: u.full_name, jabatan: "Programmer"
        })))
      }
    } catch {}
  }

  useEffect(() => { fetchData(); fetchDropdownData(); }, [])

  const handleAdd = async (item: LaporanKinerjaItem) => {
    const res = await createLaporan({ laporan_progress: item.laporan_progress, permintaan_id: item.permintaan.id })
    if (res.status < 200 || res.status >= 300) throw new Error(res.data?.message || "Gagal")
    await fetchData()
  }

  const handleEdit = async (item: LaporanKinerjaItem) => {
    const res = await updateLaporan(item.id, { laporan_progress: item.laporan_progress, permintaan_id: item.permintaan.id })
    if (res.status < 200 || res.status >= 300) throw new Error(res.data?.message || "Gagal")
    await fetchData(); setEditItem(null)
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteLaporan(id)
      if (res.status < 200 || res.status >= 300) throw new Error(res.message)
      setData((prev) => prev.filter((d) => d.id !== id))
      toast.success("Berhasil dihapus")
    } catch (err: any) { toast.error(err.message) }
  }

  const handleSubmitVerifikasi = async (item: LaporanKinerjaItem) => {
    try {
      setSubmittingId(item.id)
      const res = await createVerifikasi({ laporan_id: item.id, status_verified: "pending", komentar: "" })
      if (res.status < 200 || res.status >= 300) throw new Error(res.message)
      await fetchData()
      toast.success("Berhasil disubmit untuk verifikasi!")
    } catch (err: any) { toast.error(err.message) } finally { setSubmittingId(null) }
  }

  return (
    <div className="space-y-6 px-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-[#202224]">Laporan Kinerja</h1>
        <div className="flex items-center gap-3">
          {!loading && (
            <button onClick={() => setShowTable((prev) => !prev)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${showTable ? "bg-blue-600 text-white" : "bg-white border"}`}>
              {showTable ? <LayoutGrid className="size-4" /> : <Table2 className="size-4" />}
              {showTable ? "Lihat Grid" : "Lihat Tabel"}
            </button>
          )}
          <Button onClick={() => setShowAdd(true)} className="font-bold">+ Tambah Laporan</Button>
        </div>
      </div>
      {loading ? <HybridLoader /> : (
        <LaporanKinerjaGrid data={data} showTable={showTable} onEdit={setEditItem} onDelete={handleDelete} onSubmitVerifikasi={handleSubmitVerifikasi} submittingId={submittingId} />
      )}
      <AddLaporanKinerja open={showAdd} onClose={() => setShowAdd(false)} onSave={handleAdd} permintaanList={permintaanList} masterPegawai={masterPegawai} />
      <EditLaporanKinerja open={!!editItem} data={editItem} onClose={() => setEditItem(null)} onSave={handleEdit} permintaanList={permintaanList} masterPegawai={masterPegawai} />
    </div>
  )
}