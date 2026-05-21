"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { getVerifikasi, updateVerifikasi } from "@/services/verifikasi.service"
import { updateLaporan } from "@/services/laporan.service"
import type { VerifikasiRequest } from "../types"
import {
  formatDateLabel,
  getStatusMeta,
  isNearDeadline,
  mapVerifikasiItem,
  type VerifikasiListItem,
  type VerifikasiStatus,
} from "../utils"
import VerifikasiModal from "./VerifikasiModal"

type FilterStatus = "semua" | VerifikasiStatus

const FILTER_TABS: { id: FilterStatus; label: string }[] = [
  { id: "semua", label: "Semua" },
  { id: "menunggu", label: "Menunggu" },
  { id: "revisi", label: "Revisi" },
  { id: "terverifikasi", label: "Terverifikasi" },
]

const ITEMS_PER_PAGE = 10

function mapStatusToProgress(status: VerifikasiStatus) {
  if (status === "terverifikasi") return 100
  if (status === "revisi") return 45
  return 75
}

function HybridLoader() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-24">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
      <p className="text-sm font-medium text-gray-500">Memuat data verifikasi...</p>
    </div>
  )
}

export default function VerifikasiClient() {
  const [data, setData] = useState<VerifikasiListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("semua")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItem, setSelectedItem] = useState<VerifikasiListItem | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await getVerifikasi()
      if (response.status !== 200) {
        throw new Error(response.data?.message || "Gagal memuat data verifikasi")
      }

      const mappedItems = (response.data?.data ?? [])
        .map(mapVerifikasiItem)
        .sort((a, b) => new Date(b.diperbaruiPada).getTime() - new Date(a.diperbaruiPada).getTime())

      setData(mappedItems)
    } catch (error: any) {
      toast.error(error?.message || "Terjadi kesalahan sistem")
    } finally {
      setTimeout(() => setLoading(false), 300)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter])

  const summary = useMemo(() => {
    return data.reduce(
      (acc, item) => {
        acc.semua += 1
        acc[item.status] += 1
        return acc
      },
      { semua: 0, menunggu: 0, revisi: 0, terverifikasi: 0 }
    )
  }, [data])

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase()

    return data.filter((item) => {
      const matchesStatus = statusFilter === "semua" || item.status === statusFilter
      const searchableText = [item.pemdaName, item.aplikasiName, item.menu, item.programmer, item.progress]
        .join(" ")
        .toLowerCase()
      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch)

      return matchesStatus && matchesSearch
    })
  }, [data, searchQuery, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE))
  const paginatedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const activeTabIndex = FILTER_TABS.findIndex((tab) => tab.id === statusFilter)

  const handleSave = async (item: VerifikasiListItem) => {
    try {
      setSaving(true)

      let apiStatus = "pending"
      if (item.status === "revisi") apiStatus = "revision"
      if (item.status === "terverifikasi") apiStatus = "approved"

      const payload: VerifikasiRequest = {
        laporan_id: item.laporanId,
        status_verified: apiStatus,
        komentar: item.komentar ?? "",
      }

      const response = await updateVerifikasi(item.id, payload)
      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.data?.message || "Gagal memperbarui verifikasi")
      }

      // Jika verifikator set "revisi", reset is_submitted_to_verified supaya programmer bisa kirim ulang
      if (item.status === "revisi") {
        await updateLaporan(item.laporanId, {
          laporan_progress: item.progress,
          permintaan_id: item.permintaanId,
          is_submitted_to_verified: false,
        })
      }

      await fetchData()
      setSelectedItem(null)
      toast.success("Verifikasi berhasil diperbarui")
    } catch (error: any) {
      toast.error(error?.message || "Gagal menyimpan perubahan")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-[#202224]">Verifikasi</h1>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative grid w-full max-w-[680px] grid-cols-4 rounded-[28px] border border-gray-200 bg-[#f6f7fb] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
          <div
            className="pointer-events-none absolute bottom-2 top-2 left-2 w-[calc((100%-1rem)/4)] rounded-[20px] border border-gray-200 bg-white shadow-[0_10px_25px_rgba(15,23,42,0.08)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(calc(${activeTabIndex} * 100%))` }}
          />
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`relative z-10 flex items-center justify-center gap-2 rounded-[20px] px-4 py-3 text-sm font-semibold transition-colors ${
                statusFilter === tab.id ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-xl px-2 py-0.5 text-[10px] font-bold transition-colors ${
                  statusFilter === tab.id ? "border border-gray-200 bg-gray-100 text-gray-700" : "bg-transparent text-gray-400"
                }`}
              >
                {summary[tab.id]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Cari pemda, aplikasi, atau programmer..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="rounded-xl border-gray-200 bg-white pl-9 focus-visible:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <HybridLoader />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="w-[300px] px-6 py-4 text-left font-semibold text-gray-500">Pemda / Kategori</th>
                  <th className="w-[180px] px-6 py-4 text-left font-semibold text-gray-500">Programmer</th>
                  <th className="w-[150px] px-6 py-4 text-left font-semibold text-gray-500">Status</th>
                  <th className="w-[240px] px-6 py-4 text-left font-semibold text-gray-500">Progress</th>
                  <th className="w-[150px] px-6 py-4 text-left font-semibold text-gray-500">Deadline</th>
                  <th className="w-[120px] px-6 py-4 text-right font-semibold text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      Tidak ada data verifikasi ditemukan.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item) => {
                    const statusMeta = getStatusMeta(item.status)
                    const progressValue = mapStatusToProgress(item.status)

                    return (
                      <tr
                        key={item.id}
                        className="group cursor-pointer transition-colors hover:bg-gray-50/50"
                        onClick={() => setSelectedItem(item)}
                      >
                        <td className="h-14 px-6">
                          <div className="flex items-center gap-3">
                            {item.pemdaLogo ? (
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-white p-1">
                                <img src={item.pemdaLogo} alt={item.pemdaName} className="h-full w-full object-contain" />
                              </div>
                            ) : (
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                                {item.pemdaName.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div className="flex min-w-0 flex-col justify-center">
                              <span className="block truncate font-bold text-gray-900">{item.pemdaName}</span>
                              <span className="block truncate text-xs font-medium text-gray-500">
                                {item.aplikasiName}
                                {item.menu ? ` · ${item.menu}` : ""}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="h-14 px-6">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">{item.programmer}</span>
                            <span className="text-xs text-gray-500">Diajukan {formatDateLabel(item.diajukanPada)}</span>
                          </div>
                        </td>
                        <td className="h-14 px-6">
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${statusMeta.badgeClass}`}>
                            {statusMeta.label}
                          </span>
                        </td>
                        <td className="h-14 px-6">
                          <div className="flex items-center gap-3">
                            <div className="h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-gray-100">
                              <div
                                className={`h-full rounded-full ${
                                  item.status === "terverifikasi"
                                    ? "bg-emerald-500"
                                    : item.status === "revisi"
                                      ? "bg-red-500"
                                      : "bg-amber-500"
                                }`}
                                style={{ width: `${progressValue}%` }}
                              />
                            </div>
                            <span className="max-w-[150px] truncate text-xs font-semibold text-gray-700">
                              {item.progress || "-"}
                            </span>
                          </div>
                        </td>
                        <td className="h-14 px-6">
                          <span className={`text-sm font-semibold ${isNearDeadline(item.tanggalDeadline) && item.status !== "terverifikasi" ? "text-red-600" : "text-gray-900"}`}>
                            {formatDateLabel(item.tanggalDeadline)}
                          </span>
                        </td>
                        <td className="h-14 px-6 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg"
                            onClick={(event) => {
                              event.stopPropagation()
                              setSelectedItem(item)
                            }}
                          >
                            Tinjau
                          </Button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/30 px-6 py-3">
              <p className="text-xs text-gray-500">
                Menampilkan {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)} dari {filteredItems.length} verifikasi
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                      page === currentPage ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedItem ? (
        <VerifikasiModal
          open={!!selectedItem}
          data={selectedItem}
          saving={saving}
          onClose={() => setSelectedItem(null)}
          onSave={handleSave}
        />
      ) : null}
    </div>
  )
}
