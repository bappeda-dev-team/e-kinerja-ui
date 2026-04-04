// app/programmer/laporan/_components/LaporanKinerjaClient.tsx

"use client"

import * as React from "react"
import { useEffect, useState, useMemo } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Table2, LayoutGrid } from "lucide-react"
import { toast } from "sonner"

import LaporanKinerjaGrid from "./LaporanKinerjaGrid"
import AddLaporanKinerja from "./modals/AddLaporanKinerja"
import EditLaporanKinerja from "./modals/EditLaporanKinerja"

import { getLaporan, createLaporan, updateLaporan, deleteLaporan, ajukanVerifikasi } from "../services"
import { LaporanKinerjaItem } from "../types"

function entityLabel(value?: string | { name: string }) {
  if (!value) return "-"
  return typeof value === "string" ? value : value.name
}

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
  const { data: session } = useSession()
  const [data, setData] = useState<LaporanKinerjaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submittingId, setSubmittingId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState<LaporanKinerjaItem | null>(null)
  const [showTable, setShowTable] = useState(false)

  const currentProgrammer = useMemo(() => {
    const user = session?.user as any
    const programmerId = user?.user_id ?? user?.id ?? ""
    const programmerName = user?.full_name ?? user?.name ?? user?.username ?? "Programmer"
    return programmerId
      ? [{ id: programmerId, nama_pegawai: programmerName, jabatan: "Programmer" }]
      : []
  }, [session])

  const permintaanList = useMemo(() => {
    const uniqueMap = new Map<string, { id: string; pemda: string; menu: string }>()
    for (const item of data) {
      const permintaanId = item.permintaan?.id
      if (!permintaanId || uniqueMap.has(permintaanId)) continue
      uniqueMap.set(permintaanId, {
        id: permintaanId,
        pemda: entityLabel(item.permintaan?.pemda),
        menu: item.permintaan?.menu ?? "",
      })
    }
    return Array.from(uniqueMap.values())
  }, [data])

  const fetchData = async () => {
    try {
      setLoading(true)
      const resLaporan = await getLaporan()
      if (resLaporan.status !== 200) throw new Error(resLaporan.data?.message || "Gagal memuat data")

      const rawData = resLaporan.data?.data || []
      const mapped: LaporanKinerjaItem[] = rawData.map((item: any) => {
        const pemda = item.permintaan?.pemda
        const aplikasi = item.permintaan?.aplikasi
        const pemdaName = typeof pemda === "object" ? pemda?.name : pemda
        const aplikasiName = typeof aplikasi === "object" ? aplikasi?.name : aplikasi
        const pemdaLogo = typeof pemda === "object" ? pemda?.logo : undefined
        return {
          id: item.id,
          laporan_progress: item.laporan_progress,
          permintaan: { ...item.permintaan, pemda: pemdaName ?? "-", aplikasi: aplikasiName ?? "-" },
          programmer: item.programmer,
          status: item.status,
          verifikasi: item.verifikasi ?? null,
          created_at: item.created_at,
          updated_at: item.updated_at,
          logo_pemda: pemdaLogo || "",
        }
      })
      const unique = Array.from(new Map(mapped.map((m) => [m.id, m])).values())
      setData(unique)
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan sistem")
    } finally {
      setTimeout(() => setLoading(false), 800)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleAdd = async (item: LaporanKinerjaItem) => {
    const res = await createLaporan({
      laporan_progress: item.laporan_progress,
      permintaan_id: item.permintaan.id,
      status: item.status,
    })
    if (res.status < 200 || res.status >= 300) throw new Error(res.data?.message || "Gagal")
    await fetchData()
  }

  const handleEdit = async (item: LaporanKinerjaItem) => {
    const res = await updateLaporan(item.id, {
      laporan_progress: item.laporan_progress,
      permintaan_id: item.permintaan.id,
      status: item.status,
    })
    if (res.status < 200 || res.status >= 300) throw new Error(res.data?.message || "Gagal")
    await fetchData()
    setEditItem(null)
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
    if (item.verifikasi) {
      toast.error("Laporan ini sudah diajukan untuk verifikasi")
      return
    }

    try {
      setSubmittingId(item.id)
      const res = await ajukanVerifikasi(item.id)
      if (res.status < 200 || res.status >= 300) throw new Error(res.data?.message || "Gagal mengajukan verifikasi")
      await fetchData()
      toast.success("Berhasil diajukan untuk verifikasi!")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSubmittingId(null)
    }
  }

  return (
    <div className="space-y-6 px-3 sm:px-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-[2.1rem] leading-tight font-bold text-[#202224] sm:text-3xl">
          Laporan Kinerja
        </h1>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap lg:w-auto lg:justify-end">
          {!loading && (
            <button
              onClick={() => setShowTable((prev) => !prev)}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition sm:w-auto sm:px-5 sm:py-2.5 ${showTable ? "bg-blue-600 text-white" : "bg-white border"}`}
            >
              {showTable ? <LayoutGrid className="size-4" /> : <Table2 className="size-4" />}
              {showTable ? "Lihat Grid" : "Lihat Tabel"}
            </button>
          )}
          <Button onClick={() => setShowAdd(true)} className="w-full font-bold sm:w-auto">+ Tambah Laporan</Button>
        </div>
      </div>

      {loading ? (
        <HybridLoader />
      ) : (
        <LaporanKinerjaGrid
          data={data}
          showTable={showTable}
          onEdit={setEditItem}
          onDelete={handleDelete}
          onSubmitVerifikasi={handleSubmitVerifikasi}
          submittingId={submittingId}
        />
      )}

      <AddLaporanKinerja open={showAdd} onClose={() => setShowAdd(false)} onSave={handleAdd} permintaanList={permintaanList} masterPegawai={currentProgrammer} />
      <EditLaporanKinerja open={!!editItem} data={editItem} onClose={() => setEditItem(null)} onSave={handleEdit} permintaanList={permintaanList} masterPegawai={currentProgrammer} />
    </div>
  )
}
