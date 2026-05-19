// app/super-admin/laporan/_components/LaporanKinerjaClient.tsx

"use client"

import * as React from "react"
import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Table2, LayoutGrid, Users, ChevronDown } from "lucide-react"
import { toast } from "sonner"

import LaporanKinerjaGrid from "./LaporanKinerjaGrid"
import AddLaporanKinerja from "./modals/AddLaporanKinerja"
import EditLaporanKinerja from "./modals/EditLaporanKinerja"

import { getLaporan, createLaporan, updateLaporan, deleteLaporan } from "@/services/laporan.service"
import { createVerifikasi } from "@/services/verifikasi.service"
import { LaporanKinerjaItem } from "../types"
import { getPermintaan } from "@/services/permintaan.service"
import { getUsers } from "@/services/master-user.service"
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
  hijau: { label: "Terverifikasi", dot: "bg-[#00B69B]", badge: "bg-[#00B69B]/10 text-[#00B69B]" },
  putih: { label: "Menunggu", dot: "bg-orange-500", badge: "bg-orange-50 text-orange-700" },
  merah: { label: "Ditolak", dot: "bg-red-600", badge: "bg-red-50 text-red-700" },
  kuning: { label: "Revisi", dot: "bg-[#FFA756]", badge: "bg-[#FFA756]/10 text-[#FFA756]" },
}

function entityLabel(value?: string | { name: string }) {
  if (!value) return "-"
  return typeof value === "string" ? value : value.name
}

function RekapPerUser({ data }: { data: LaporanKinerjaItem[] }) {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth())
  const [year, setYear] = useState(now.getFullYear())
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

  // group by programmer id
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

  const [monthOpen, setMonthOpen] = useState(false)
  const [yearOpen, setYearOpen] = useState(false)
  const toggle = (id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] }))

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              onFocus={() => setMonthOpen(true)}
              onBlur={() => setMonthOpen(false)}
              className="appearance-none rounded-xl border border-gray-200 bg-white pl-4 pr-8 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            >
              {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
            <ChevronDown className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 transition-transform duration-200 ${monthOpen ? "rotate-180" : "rotate-0"}`} />
          </div>
          <div className="relative">
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              onFocus={() => setYearOpen(true)}
              onBlur={() => setYearOpen(false)}
              className="appearance-none rounded-xl border border-gray-200 bg-white pl-4 pr-8 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            >
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <ChevronDown className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 transition-transform duration-200 ${yearOpen ? "rotate-180" : "rotate-0"}`} />
          </div>
        </div>
        <span className="text-xs text-[#202224]/60 font-semibold bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200/50">
          {filtered.length} Laporan · {groups.length} Programmer
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
              <div key={key} className="rounded-2xl bg-white border border-gray-200 shadow-[6px_6px_54px_rgba(0,0,0,0.05)] overflow-hidden">
                {/* User header row */}
                <button
                  onClick={() => toggle(key)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold flex items-center justify-center shrink-0">
                      {initials}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-[#202224]">{name}</p>
                      <p className="text-xs text-[#202224]/50">{programmer?.username ?? "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 text-xs font-semibold text-[#202224]/60">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                        {items.length} task
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00B69B] inline-block" />
                        {selesai} selesai
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFA756] inline-block" />
                        {items.length - selesai} pending
                      </span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-[#202224]/40 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`} />
                  </div>
                </button>

                {/* Task list */}
                <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <div className="border-t border-gray-200">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase font-semibold text-left">
                            <th className="px-3 py-3 w-10 text-center">No.</th>
                            <th className="px-4 py-3">Pemda</th>
                            <th className="px-4 py-3">Aplikasi</th>
                            <th className="px-4 py-3">Menu</th>
                            <th className="px-4 py-3">Progress</th>
                            <th className="px-4 py-3">Deadline</th>
                            <th className="px-4 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, i) => {
                            const s = STATUS_CFG[item.status?.toLowerCase() ?? ""] ?? STATUS_CFG.putih
                            const limitDate = item.permintaan?.tanggal_deadline ? new Date(item.permintaan.tanggal_deadline) : null;
                            const deadline = limitDate ? limitDate.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-";
                            const isOverdue = limitDate && limitDate < new Date();
                            const deadlineClass = isOverdue ? "text-red-600" : "text-[#202224]";
                            return (
                              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                <td className="px-3 py-4 text-center text-[#202224]/50 text-xs">{i + 1}</td>
                                <td className="px-4 py-4">
                                  <span className="font-semibold text-[#202224] text-xs">{entityLabel(item.permintaan?.pemda)}</span>
                                </td>
                                <td className="px-4 py-4 text-xs text-[#797A7C]">{entityLabel(item.permintaan?.aplikasi)}</td>
                                <td className="px-4 py-4 text-xs text-[#797A7C] max-w-[140px] truncate">{item.permintaan?.menu ?? "-"}</td>
                                <td className="px-4 py-4 text-xs text-[#202224]/70 max-w-[180px] truncate">{item.laporan_progress}</td>
                                <td className={`px-4 py-4 text-xs font-semibold ${deadlineClass}`}>{deadline}</td>
                                <td className="px-4 py-4">
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
                  </div>
                </div>
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
        const pemda = item.permintaan?.pemda
        const aplikasi = item.permintaan?.aplikasi
        const pemdaName = typeof pemda === "object" ? pemda?.name : pemda
        const aplikasiName = typeof aplikasi === "object" ? aplikasi?.name : aplikasi
        const pemdaLogo = typeof pemda === "object" ? pemda?.logo : undefined
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
      const unique = Array.from(new Map(mapped.map((m) => [m.id, m])).values())
      setData(unique)
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
    } catch { }
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
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${tab === "semua" ? "border-blue-600 text-blue-600" : "border-transparent text-[#202224]/50 hover:text-[#202224]"
              }`}
          >
            <Table2 className="size-4" />
            Semua Laporan
          </button>
          <button
            onClick={() => setTab("rekap")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${tab === "rekap" ? "border-blue-600 text-blue-600" : "border-transparent text-[#202224]/50 hover:text-[#202224]"
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
