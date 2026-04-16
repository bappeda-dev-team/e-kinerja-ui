"use client"

import * as React from "react"
import { useEffect, useState, useMemo } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Search, Plus, SendHorizonal, CheckCircle2, ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import AddLaporanKinerja from "./modals/AddLaporanKinerja"
import EditLaporanKinerja from "./modals/EditLaporanKinerja"
import LaporanSlideOver from "./LaporanSlideOver"

import { getLaporan, createLaporan, updateLaporan, deleteLaporan, ajukanVerifikasi } from "../services"
import { getPermintaan } from "@/app/super-admin/distribusi/services"
import { LaporanKinerjaItem, LaporanResponse } from "../types"
import { PermintaanResponse } from "@/app/super-admin/distribusi/types"

type SessionUser = {
  id?: string
  user_id?: string
  full_name?: string
  name?: string
  username?: string
}

function entityLabel(value?: string | { name: string }) {
  if (!value) return "-"
  return typeof value === "string" ? value : value.name
}

function mapStatusToProgress(status?: string): number {
  if (status === "hijau") return 100
  if (status === "kuning") return 55
  if (status === "merah") return 20
  return 80
}

type ReportStatus = "semua" | "menunggu" | "revisi" | "terverifikasi"

const REPORT_TABS: { id: ReportStatus; label: string }[] = [
  { id: "semua", label: "Semua" },
  { id: "menunggu", label: "Menunggu" },
  { id: "revisi", label: "Revisi" },
  { id: "terverifikasi", label: "Terverifikasi" },
]

function mapReportStatus(status?: string): Exclude<ReportStatus, "semua"> {
  const norm = status?.toLowerCase()
  if (norm === "hijau" || norm === "terverifikasi") return "terverifikasi"
  if (norm === "kuning" || norm === "merah" || norm === "revisi") return "revisi"
  return "menunggu"
}

// Compact Table Row Height = ~48px
// Format Date for Table
function formatDateTbl(iso?: string) {
  if (!iso) return "-"
  return new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
}

const HybridLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p className="text-sm font-medium text-gray-500">Memuat laporan...</p>
    </div>
  )
}

export default function LaporanKinerjaClient() {
  const { data: session } = useSession()
  const [data, setData] = useState<LaporanKinerjaItem[]>([])
  const [permintaanList, setPermintaanList] = useState<{ id: string; pemda: string; menu: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [submittingId, setSubmittingId] = useState<string | null>(null)
  
  // Modals
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState<LaporanKinerjaItem | null>(null)
  const [selectedSlideItem, setSelectedSlideItem] = useState<LaporanKinerjaItem | null>(null)

  // Filters
  const [statusFilter, setStatusFilter] = useState<ReportStatus>("semua")
  const [searchQuery, setSearchQuery] = useState("")

  // Pagination
  const ITEMS_PER_PAGE = 10
  const [currentPage, setCurrentPage] = useState(1)

  const currentProgrammer = useMemo(() => {
    const user = session?.user as SessionUser | undefined
    const programmerId = user?.user_id ?? user?.id ?? ""
    const programmerName = user?.full_name ?? user?.name ?? user?.username ?? "Programmer"
    return programmerId ? [{ id: programmerId, nama_pegawai: programmerName, jabatan: "Programmer" }] : []
  }, [session])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [resLaporan, resPermintaan] = await Promise.all([getLaporan(), getPermintaan()])
      if (resLaporan.status !== 200) throw new Error(resLaporan.data?.message || "Gagal memuat data")

      const rawPermintaan: PermintaanResponse[] = resPermintaan.data?.data || []
      setPermintaanList(
        rawPermintaan.map((p) => ({
          id: p.id,
          pemda: typeof p.pemda === "object" ? p.pemda.name : p.pemda ?? "",
          menu: p.menu ?? "",
        }))
      )

      const rawData = resLaporan.data?.data || []
      const mapped: LaporanKinerjaItem[] = rawData.map((item: LaporanResponse) => {
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
          is_submitted_to_verified: item.is_submitted_to_verified ?? false,
          created_at: item.created_at,
          updated_at: item.updated_at,
          logo_pemda: pemdaLogo || "",
        }
      })
      const unique = Array.from(new Map(mapped.map((m) => [m.id, m])).values())
      
      // Sort: terbaru di atas
      unique.sort((a, b) => new Date(b.updated_at ?? 0).getTime() - new Date(a.updated_at ?? 0).getTime())
      
      setData(unique)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan sistem")
    } finally {
      setTimeout(() => setLoading(false), 300)
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
    const verifikasiObj = Array.isArray(item.verifikasi) ? item.verifikasi[0] : item.verifikasi
    const res = await updateLaporan(item.id, {
      laporan_progress: item.laporan_progress,
      permintaan_id: item.permintaan.id,
      status: item.status,
      verifikasi_id: verifikasiObj?.id,
      status_verified: verifikasiObj?.status_verified,
      is_submitted_to_verified: item.is_submitted_to_verified,
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
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan sistem")
    }
  }

  const handleSubmitVerifikasi = async (item: LaporanKinerjaItem) => {
    if (item.is_submitted_to_verified === true) {
      toast.error("Laporan ini sudah diajukan untuk verifikasi")
      return
    }

    try {
      setSubmittingId(item.id)
      const res = await ajukanVerifikasi(item.id)
      if (res.status < 200 || res.status >= 300) throw new Error(res.data?.message || "Gagal mengajukan verifikasi")
      await fetchData()
      toast.success("Berhasil diajukan untuk verifikasi!")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan sistem")
    } finally {
      setSubmittingId(null)
    }
  }

  const summary = useMemo(() => {
    return data.reduce(
      (acc, item) => {
        acc.semua += 1
        acc[mapReportStatus(item.status)] += 1
        return acc
      },
      { semua: 0, menunggu: 0, revisi: 0, terverifikasi: 0 }
    )
  }, [data])

  const filteredItems = useMemo(() => {
    return data.filter(item => {
      const matchStatus = statusFilter === "semua" || mapReportStatus(item.status) === statusFilter
      const lbl = entityLabel(item.permintaan?.pemda).toLowerCase()
      const matchSearch = lbl.includes(searchQuery.toLowerCase())
      return matchStatus && matchSearch
    })
  }, [data, statusFilter, searchQuery])

  // Reset to page 1 whenever filter/search changes
  useEffect(() => { setCurrentPage(1) }, [statusFilter, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE))
  const paginatedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const activeTabIndex = REPORT_TABS.findIndex((tab) => tab.id === statusFilter)

  return (
    <div className="space-y-6">
      
      {/* Header & Fitur Atas */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        
        {/* Filter Tabs */}
        <div className="relative grid w-full max-w-[680px] grid-cols-4 rounded-[28px] border border-gray-200 bg-[#f6f7fb] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
          <div
            className="pointer-events-none absolute top-2 bottom-2 left-2 w-[calc((100%-1rem)/4)] rounded-[20px] border border-gray-200 bg-white shadow-[0_10px_25px_rgba(15,23,42,0.08)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(calc(${activeTabIndex} * 100%))` }}
          />
          {REPORT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as ReportStatus)}
              className={`relative z-10 flex items-center justify-center gap-2 rounded-[20px] px-4 py-3 text-sm font-semibold transition-colors ${
                statusFilter === tab.id
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              <span className={`rounded-xl px-2 py-0.5 text-[10px] font-bold transition-colors ${
                statusFilter === tab.id ? "border border-gray-200 bg-gray-100 text-gray-700" : "bg-transparent text-gray-400"
              }`}>
                {tab.id === "semua"
                  ? summary.semua
                  : tab.id === "menunggu"
                    ? summary.menunggu
                    : tab.id === "revisi"
                      ? summary.revisi
                      : summary.terverifikasi}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Cari nama pemda..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white border-gray-200 focus-visible:ring-blue-500 rounded-xl"
            />
          </div>
          <Button onClick={() => setShowAdd(true)} className="rounded-xl font-bold gap-2 shrink-0">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Tambah Laporan</span>
          </Button>
        </div>

      </div>

      {/* Main Table Area */}
      {loading ? (
        <HybridLoader />
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-4 text-left font-semibold text-gray-500 w-[300px]">Pemda / Kategori</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-500 w-[150px]">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-500 w-[200px]">Progress</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-500 w-[150px]">Deadline</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-500 w-[120px]">File</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-500 w-[80px]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      Tidak ada laporan ditemukan.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item) => {
                    const statusType = mapReportStatus(item.status)
                    const progressVal = mapStatusToProgress(item.status)

                    let statusBadgeClass = "bg-amber-50 text-amber-700 ring-amber-600/20"
                    let statusLabel = "Menunggu"
                    if (statusType === "terverifikasi") {
                      statusBadgeClass = "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                      statusLabel = "Terverifikasi"
                    } else if (statusType === "revisi") {
                      statusBadgeClass = "bg-red-50 text-red-700 ring-red-600/10"
                      statusLabel = "Perlu Revisi"
                    }

                    const progressColor = statusType === "terverifikasi" ? "bg-emerald-500" : statusType === "revisi" ? "bg-red-500" : "bg-amber-500"
                    const isNearDeadline = item.permintaan?.tanggal_deadline && new Date(item.permintaan.tanggal_deadline).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000 ? true : false

                    const isAlreadySubmitted = item.is_submitted_to_verified === true
                    const isDisabled = submittingId === item.id || isAlreadySubmitted

                    return (
                      <tr 
                        key={item.id} 
                        className="group cursor-pointer hover:bg-gray-50/50 transition-colors"
                        onClick={() => setSelectedSlideItem(item)} // Open slide over
                      >
                        <td className="px-6 h-14 w-10">
                          <div className="flex flex-col justify-center h-full">
                            <span className="font-bold text-gray-900 truncate block">
                              {entityLabel(item.permintaan?.pemda)}
                            </span>
                            <span className="text-xs text-gray-500 font-medium truncate block">
                              {entityLabel(item.permintaan?.aplikasi)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 h-14">
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${statusBadgeClass}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="px-6 h-14">
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-1.5 rounded-full bg-gray-100 overflow-hidden shrink-0">
                              <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${progressVal}%` }} />
                            </div>
                            <span className="text-xs font-bold text-gray-700">{progressVal}%</span>
                          </div>
                        </td>
                        <td className="px-6 h-14">
                          <span className={`text-sm font-semibold ${isNearDeadline && statusType !== 'terverifikasi' ? 'text-red-600' : 'text-gray-900'}`}>
                            {formatDateTbl(item.permintaan?.tanggal_deadline)}
                          </span>
                        </td>
                        <td className="px-6 h-14">
                          <span 
                            className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()} // Prevent slideover just for link
                          >
                            2 file
                          </span>
                        </td>
                        <td className="px-6 h-14 text-center">
                          <div className="flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className={`h-8 w-8 p-0 rounded-lg ${isAlreadySubmitted ? 'border-emerald-200 text-emerald-600 bg-emerald-50 cursor-default hover:bg-emerald-50 hover:text-emerald-600' : ''}`}
                              disabled={isDisabled}
                              onClick={() => handleSubmitVerifikasi(item)}
                              title={isAlreadySubmitted ? "Sudah Diajukan" : "Ajukan Verifikasi"}
                            >
                              {submittingId === item.id ? "..." : isAlreadySubmitted ? <CheckCircle2 className="h-4 w-4" /> : <SendHorizonal className="h-4 w-4" />}
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 rounded-lg"
                              onClick={() => setEditItem(item)}
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 rounded-lg border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                              onClick={() => handleDelete(item.id)}
                              title="Hapus"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/30">
              <p className="text-xs text-gray-500">
                Menampilkan {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)} dari {filteredItems.length} laporan
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 w-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                      page === currentPage
                        ? "bg-gray-900 text-white"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Slide-Over Panel */}
      <LaporanSlideOver 
        isOpen={!!selectedSlideItem} 
        onClose={() => setSelectedSlideItem(null)} 
        item={selectedSlideItem} 
      />

      {/* Modals */}
      <AddLaporanKinerja open={showAdd} onClose={() => setShowAdd(false)} onSave={handleAdd} permintaanList={permintaanList} masterPegawai={currentProgrammer} />
      <EditLaporanKinerja open={!!editItem} data={editItem} onClose={() => setEditItem(null)} onSave={handleEdit} permintaanList={permintaanList} masterPegawai={currentProgrammer} />
    </div>
  )
}
