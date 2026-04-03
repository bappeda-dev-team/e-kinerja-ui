// app/programmer/laporan/_components/LaporanKinerjaClient.tsx

"use client"

import * as React from "react"
import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Table2, LayoutGrid, Users, ChevronDown, ChevronRight } from "lucide-react"
import { toast } from "sonner"

import LaporanKinerjaGrid from "./LaporanKinerjaGrid"
import AddLaporanKinerja from "./modals/AddLaporanKinerja"
import EditLaporanKinerja from "./modals/EditLaporanKinerja"

import { getLaporan, createLaporan, updateLaporan, deleteLaporan } from "../services"
import { createVerifikasi } from "@/app/super-admin/verifikasi/services"
import { LaporanKinerjaItem } from "../types"
import { getPermintaan } from "@/app/super-admin/permintaan/services"
import { getUsers } from "@/app/super-admin/data-master/master-user/services"
import type { PermintaanResponse } from "@/app/super-admin/permintaan/types"
import type { UserResponse } from "@/app/super-admin/data-master/master-user/types"

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

type Tab = "semua" | "rekap"
type Mode = "full" | "rekap-only"

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
]

const STATUS_CFG: Record<string, { label: string; dot: string; badge: string }> = {
  hijau:  { label: "Terverifikasi", dot: "bg-[#00B69B]", badge: "bg-[#00B69B]/10 text-[#00B69B]" },
  putih:  { label: "Menunggu",      dot: "bg-[#FFA756]", badge: "bg-[#FFA756]/10 text-[#FFA756]" },
  merah:  { label: "Ditolak",       dot: "bg-[#FD5454]", badge: "bg-[#FD5454]/10 text-[#FD5454]" },
  kuning: { label: "Revisi",        dot: "bg-[#FFA756]", badge: "bg-[#FFA756]/10 text-[#FFA756]" },
}

function entityLabel(value?: string | { name: string }) {
  if (!value) return "-"
  return typeof value === "string" ? value : value.name
}

function RekapPerUser({ data }: { data: LaporanKinerjaItem[] }) {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth())
  const [year, setYear]   = useState(now.getFullYear())
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const years = useMemo(() => {
    const s = new Set(data.map((d) => new Date(d.created_at ?? "").getFullYear()).filter(Boolean))
    s.add(now.getFullYear())
    return Array.from(s).sort((a, b) => b - a)
  }, [data])

  const filtered = useMemo(() => data.filter((d) => {
    if (!d.created_at) return false
    const dt = new Date(d.created_at)
    return dt.getMonth() === month && dt.getFullYear() === year
  }), [data, month, year])

  const groups = useMemo(() => {
    const map = new Map<string, { programmer: LaporanKinerjaItem["programmer"]; items: LaporanKinerjaItem[] }>()
    for (const item of filtered) {
      const key = item.programmer?.id ?? "unknown"
      if (!map.has(key)) map.set(key, { programmer: item.programmer, items: [] })
      map.get(key)!.items.push(item)
    }
    return Array.from(map.values()).sort((a, b) =>
      (a.programmer?.full_name ?? "").localeCompare(b.programmer?.full_name ?? "")
    )
  }, [filtered])

  const toggle = (id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] }))

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <span className="text-sm text-[#202224]/50 font-medium">
          {filtered.length} laporan · {groups.length} programmer
        </span>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center text-sm text-[#202224]/40 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
          Tidak ada laporan di {MONTHS[month]} {year}.
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map(({ programmer, items }) => {
            const key = programmer?.id ?? "unknown"
            const name = programmer?.full_name ?? programmer?.username ?? "Unknown"
            const initials = name.slice(0, 2).toUpperCase()
            const isOpen = expanded[key] ?? true
            const selesai = items.filter((i) => i.status === "hijau").length

            return (
              <div key={key} className="rounded-2xl bg-white shadow-[6px_6px_54px_rgba(0,0,0,0.05)] overflow-hidden">
                <button
                  onClick={() => toggle(key)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-600 text-sm font-bold flex items-center justify-center shrink-0">
                      {initials}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-[#202224]">{name}</p>
                      <p className="text-xs text-[#202224]/50">{programmer?.username ?? "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 text-xs font-semibold text-[#202224]/60">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#00B69B] inline-block" />
                        {selesai} selesai
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#FFA756] inline-block" />
                        {items.length - selesai} pending
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                      {items.length} task
                    </span>
                    {isOpen
                      ? <ChevronDown className="h-4 w-4 text-[#202224]/40" />
                      : <ChevronRight className="h-4 w-4 text-[#202224]/40" />
                    }
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#F8F9FC] text-[#202224]/50 text-xs font-semibold">
                          <th className="px-5 py-2.5 text-left w-8">#</th>
                          <th className="px-5 py-2.5 text-left">Pemda</th>
                          <th className="px-5 py-2.5 text-left">Aplikasi</th>
                          <th className="px-5 py-2.5 text-left">Menu</th>
                          <th className="px-5 py-2.5 text-left">Progress</th>
                          <th className="px-5 py-2.5 text-left">Deadline</th>
                          <th className="px-5 py-2.5 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, i) => {
                          const s = STATUS_CFG[item.status?.toLowerCase() ?? ""] ?? STATUS_CFG.putih
                          const deadline = item.permintaan?.tanggal_deadline
                            ? new Date(item.permintaan.tanggal_deadline).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                            : "-"
                          return (
                            <tr key={item.id} className="border-t border-gray-50 hover:bg-gray-50/40 transition-colors">
                              <td className="px-5 py-3 text-[#202224]/40 text-xs">{i + 1}</td>
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded bg-white border flex items-center justify-center overflow-hidden shrink-0">
                                    {item.logo_pemda
                                      ? <img src={item.logo_pemda} className="w-full h-full object-contain p-0.5" />
                                      : <span className="text-xs">🏛️</span>}
                                  </div>
                                  <span className="font-semibold text-[#202224] text-xs">{entityLabel(item.permintaan?.pemda)}</span>
                                </div>
                              </td>
                              <td className="px-5 py-3 text-xs text-[#797A7C]">{entityLabel(item.permintaan?.aplikasi)}</td>
                              <td className="px-5 py-3 text-xs text-[#797A7C] max-w-[140px] truncate">{item.permintaan?.menu ?? "-"}</td>
                              <td className="px-5 py-3 text-xs text-[#202224]/70 max-w-[180px] truncate">{item.laporan_progress}</td>
                              <td className="px-5 py-3 text-xs font-semibold text-red-500">{deadline}</td>
                              <td className="px-5 py-3">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${s.badge}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                                  {s.label}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

interface Props {
  mode?: Mode
}

export default function LaporanKinerjaClient({ mode = "full" }: Props) {
  const [data, setData] = useState<LaporanKinerjaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submittingId, setSubmittingId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState<LaporanKinerjaItem | null>(null)
  const [showTable, setShowTable] = useState(false)
  const [tab, setTab] = useState<Tab>(mode === "rekap-only" ? "rekap" : "semua")

  const [permintaanList, setPermintaanList] = useState<{ id: string; pemda: string; menu: string }[]>([])
  const [masterPegawai, setMasterPegawai] = useState<{ id: string; nama_pegawai: string; jabatan: string }[]>([])

  const fetchData = async () => {
    try {
      setLoading(true)
      const resLaporan = await getLaporan()

      if (resLaporan.status !== 200) throw new Error(resLaporan.data?.message || "Gagal memuat data")

      const rawData = resLaporan.data?.data || []

      const mapped: LaporanKinerjaItem[] = rawData.map((item: any) => {
        const pemda   = item.permintaan?.pemda
        const aplikasi = item.permintaan?.aplikasi
        const pemdaName   = typeof pemda   === "object" ? pemda?.name   : pemda
        const aplikasiName = typeof aplikasi === "object" ? aplikasi?.name : aplikasi
        const pemdaLogo   = typeof pemda   === "object" ? pemda?.logo   : undefined
        return {
          id: item.id,
          laporan_progress: item.laporan_progress,
          permintaan: {
            ...item.permintaan,
            pemda: pemdaName ?? "-",
            aplikasi: aplikasiName ?? "-",
          },
          programmer: item.programmer,
          status: item.status,
          created_at: item.created_at,
          updated_at: item.updated_at,
          logo_pemda: pemdaLogo || ""
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
    if (mode === "rekap-only") return
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

  useEffect(() => {
    fetchData()
    fetchDropdownData()
  }, [mode])

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#202224]">Laporan Kinerja</h1>
        <div className="flex items-center gap-3">
          {mode === "full" && tab === "semua" && !loading && (
            <button
              onClick={() => setShowTable((prev) => !prev)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${showTable ? "bg-blue-600 text-white" : "bg-white border"}`}
            >
              {showTable ? <LayoutGrid className="size-4" /> : <Table2 className="size-4" />}
              {showTable ? "Lihat Grid" : "Lihat Tabel"}
            </button>
          )}
          {mode === "full" && tab === "semua" && (
            <Button onClick={() => setShowAdd(true)} className="font-bold">+ Tambah Laporan</Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      {mode === "full" ? (
        <div className="flex gap-1 border-b border-gray-200">
          <button
            onClick={() => setTab("semua")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              tab === "semua" ? "border-blue-600 text-blue-600" : "border-transparent text-[#202224]/50 hover:text-[#202224]"
            }`}
          >
            <Table2 className="size-4" />
            Semua Laporan
          </button>
          <button
            onClick={() => setTab("rekap")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              tab === "rekap" ? "border-blue-600 text-blue-600" : "border-transparent text-[#202224]/50 hover:text-[#202224]"
            }`}
          >
            <Users className="size-4" />
            Rekap Per User
          </button>
        </div>
      ) : null}

      {/* Content */}
      {loading ? (
        <HybridLoader />
      ) : tab === "semua" ? (
        <LaporanKinerjaGrid
          data={data}
          showTable={showTable}
          onEdit={setEditItem}
          onDelete={handleDelete}
          onSubmitVerifikasi={handleSubmitVerifikasi}
          submittingId={submittingId}
        />
      ) : (
        <RekapPerUser data={data} />
      )}

      {mode === "full" ? (
        <>
          <AddLaporanKinerja open={showAdd} onClose={() => setShowAdd(false)} onSave={handleAdd} permintaanList={permintaanList} masterPegawai={masterPegawai} />
          <EditLaporanKinerja open={!!editItem} data={editItem} onClose={() => setEditItem(null)} onSave={handleEdit} permintaanList={permintaanList} masterPegawai={masterPegawai} />
        </>
      ) : null}
    </div>
  )
}
