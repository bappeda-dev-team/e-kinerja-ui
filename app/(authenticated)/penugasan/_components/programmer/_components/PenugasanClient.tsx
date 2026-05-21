"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { Search, ChevronLeft, ChevronRight, BriefcaseBusiness, ArrowRight, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { NetworkError } from "@/components/network-error"
import { PENUGASAN_ALL_READ_EVENT } from "@/hooks/use-penugasan-badge"
import { getLaporan } from "@/services/laporan.service"
import { mapStatusToProgress } from "@/app/(authenticated)/laporan/_components/programmer/utils"

import { getPenugasan, markAllPenugasanAsRead } from "@/services/penugasan.service"
import { PenugasanItem, PenugasanResponse } from "../types"
import PenugasanDetailModal from "./modals/PenugasanDetailModal"
import { MockLaporan, MOCK_DEADLINE_FALLBACK } from "@/app/(authenticated)/laporan/_components/programmer/data"
import type { LaporanResponse } from "@/types/laporan"

type AssignmentFilter = "semua" | "ada-catatan" | "tanpa-catatan"

const FILTER_TABS: { id: AssignmentFilter; label: string }[] = [
  { id: "semua", label: "Semua" },
  { id: "ada-catatan", label: "Ada Catatan" },
  { id: "tanpa-catatan", label: "Tanpa Catatan" },
]

function entityLabel(value?: string | { name?: string }) {
  if (!value) return "-"
  return typeof value === "string" ? value : value.name || "-"
}

function entityLogo(value?: string | { logo?: string }) {
  if (!value || typeof value === "string") return ""
  return value.logo || ""
}

function formatDateTbl(iso?: string) {
  if (!iso) return "-"
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

const ITEMS_PER_PAGE = 10
const SLIDE_TRANSITION_MS = 300

const HybridLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-24">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      <p className="text-sm font-medium text-gray-500">Memuat penugasan...</p>
    </div>
  )
}

export default function PenugasanClient() {
  const { data: session } = useSession()

  const [data, setData] = useState<PenugasanItem[]>([])
  const [loading, setLoading] = useState(true)
  const [networkError, setNetworkError] = useState(false)
  const [fetchKey, setFetchKey] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<AssignmentFilter>("semua")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItem, setSelectedItem] = useState<PenugasanItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mockLaporan, setMockLaporan] = useState<MockLaporan[]>([])
  const openFrameRef = useRef<number | null>(null)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentUserId = useMemo(() => {
    const user = session?.user as { user_id?: string; id?: string } | undefined
    return user?.user_id ?? user?.id ?? ""
  }, [session])

  const mapVerifikasiStatus = (laporan: LaporanResponse): MockLaporan["status"] => {
    const verifikasi = Array.isArray(laporan.verifikasi)
      ? laporan.verifikasi[0]
      : laporan.verifikasi

    const verificationStatus = verifikasi?.status_verified?.toLowerCase()
    if (verificationStatus === "approved") return "approved"
    if (verificationStatus === "revision") return "revision"
    return "pending"
  }

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setNetworkError(false)

      const [res, laporanRes] = await Promise.all([getPenugasan(), getLaporan()])

      if (res.status === 0) {
        setNetworkError(true)
        return
      }

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Gagal memuat data penugasan")
      }

      const rawData = res.data?.data ?? []
      const filteredByUser = currentUserId
        ? rawData.filter((item: PenugasanResponse) => {
            const programmerId = item.programmer?.id ?? ""
            return programmerId ? programmerId === currentUserId : true
          })
        : rawData

      const mapped = filteredByUser.map((item: PenugasanResponse) => ({
        id: item.id,
        distribusi_id: item.distribusi?.id ?? "",
        permintaan_id: item.distribusi?.permintaan_id ?? item.distribusi?.permintaan?.id ?? "",
        nama_pemda: entityLabel(item.distribusi?.pemda),
        aplikasi: entityLabel(item.distribusi?.aplikasi),
        logo_pemda: entityLogo(item.distribusi?.pemda),
        komentar: item.distribusi?.komentar?.trim() ?? "",
        tanggal_deadline: item.distribusi?.permintaan?.tanggal_deadline ?? MOCK_DEADLINE_FALLBACK,
        programmer_nama: item.programmer?.full_name ?? item.programmer?.username ?? "Programmer",
        programmer_username: item.programmer?.username ? `@${item.programmer.username}` : "-",
        is_read: item.is_read,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }))

      mapped.sort((a, b) => {
        const aTime = new Date(a.updated_at ?? a.created_at ?? 0).getTime()
        const bTime = new Date(b.updated_at ?? b.created_at ?? 0).getTime()
        return bTime - aTime
      })

      setData(mapped)

      if (laporanRes.status === 200) {
        const penugasanByPermintaanId = new Map(
          mapped
            .filter((assignment) => assignment.permintaan_id)
            .map((assignment) => [assignment.permintaan_id, assignment])
        )

        const mappedLaporan: MockLaporan[] = (laporanRes.data?.data ?? [])
          .filter((laporan: LaporanResponse) => {
            const programmerId = laporan.programmer?.id ?? ""
            return currentUserId ? programmerId === currentUserId : true
          })
          .map((laporan: LaporanResponse): MockLaporan | null => {
            const permintaanId = laporan.permintaan?.id ?? ""
            const matchedPenugasan = penugasanByPermintaanId.get(permintaanId)
            if (!matchedPenugasan) return null

            const verifikasi = Array.isArray(laporan.verifikasi)
              ? laporan.verifikasi[0]
              : laporan.verifikasi

            const catatanRevisor =
              verifikasi?.status_verified === "revision" && verifikasi?.komentar
                ? verifikasi.komentar
                : undefined

            return {
              id: laporan.id,
              penugasan_id: matchedPenugasan.id,
              permintaan_id: permintaanId,
              laporan_progress: laporan.laporan_progress,
              status_progress: mapStatusToProgress(laporan.status),
              status: mapVerifikasiStatus(laporan),
              is_sent: laporan.is_submitted_to_verified ?? false,
              created_at: laporan.created_at ?? new Date().toISOString(),
              updated_at: laporan.updated_at ?? laporan.created_at ?? new Date().toISOString(),
              ...(catatanRevisor ? { catatan_revisor: catatanRevisor } : {}),
            }
          })
          .filter((laporan): laporan is MockLaporan => laporan !== null)
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

        setMockLaporan(mappedLaporan)
      } else {
        setMockLaporan([])
      }

      markAllPenugasanAsRead().catch(() => {})
      window.dispatchEvent(new CustomEvent(PENUGASAN_ALL_READ_EVENT))
    } catch (error) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem"
      toast.error(message)
    } finally {
      setTimeout(() => setLoading(false), 300)
    }
  }, [currentUserId])

  useEffect(() => {
    fetchData()
  }, [fetchData, fetchKey])

  const summary = useMemo(() => {
    return data.reduce(
      (acc, item) => {
        acc.semua += 1
        if (item.komentar) acc["ada-catatan"] += 1
        else acc["tanpa-catatan"] += 1
        return acc
      },
      { semua: 0, "ada-catatan": 0, "tanpa-catatan": 0 }
    )
  }, [data])

  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase()

    return data.filter((item) => {
      const matchesFilter =
        filter === "semua" ||
        (filter === "ada-catatan" && Boolean(item.komentar)) ||
        (filter === "tanpa-catatan" && !item.komentar)

      const haystack = `${item.nama_pemda} ${item.aplikasi} ${item.komentar}`.toLowerCase()
      return matchesFilter && haystack.includes(query)
    })
  }, [data, filter, searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [filter, searchQuery])

  useEffect(() => {
    return () => {
      if (openFrameRef.current !== null) {
        window.cancelAnimationFrame(openFrameRef.current)
      }
      if (closeTimeoutRef.current !== null) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  const revisionInfoByPenugasan = useMemo(() => {
    const revisionMap = new Map<string, { count: number; latestUpdatedAt: string }>()

    for (const laporan of mockLaporan) {
      if (laporan.status !== "revision") continue

      const current = revisionMap.get(laporan.penugasan_id)
      if (!current) {
        revisionMap.set(laporan.penugasan_id, {
          count: 1,
          latestUpdatedAt: laporan.updated_at,
        })
        continue
      }

      revisionMap.set(laporan.penugasan_id, {
        count: current.count + 1,
        latestUpdatedAt:
          new Date(laporan.updated_at).getTime() > new Date(current.latestUpdatedAt).getTime()
            ? laporan.updated_at
            : current.latestUpdatedAt,
      })
    }

    return revisionMap
  }, [mockLaporan])

  const openDetail = (item: PenugasanItem) => {
    if (closeTimeoutRef.current !== null) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    if (openFrameRef.current !== null) {
      window.cancelAnimationFrame(openFrameRef.current)
    }

    setSelectedItem(item)
    setIsModalOpen(true)
    openFrameRef.current = null
  }

  const closeDetail = () => {
    setIsModalOpen(false)
    if (closeTimeoutRef.current !== null) {
      clearTimeout(closeTimeoutRef.current)
    }
    closeTimeoutRef.current = setTimeout(() => {
      setSelectedItem(null)
      closeTimeoutRef.current = null
    }, SLIDE_TRANSITION_MS)
  }

  const handleAddLaporan = (laporan: MockLaporan) => {
    setMockLaporan((prev) => [laporan, ...prev])
  }

  const handleUpdateLaporan = (updated: MockLaporan) => {
    setMockLaporan((prev) => prev.map((l) => (l.id === updated.id ? updated : l)))
  }

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE))
  const paginatedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const activeFilterIndex = FILTER_TABS.findIndex((tab) => tab.id === filter)

  if (networkError) {
    return <NetworkError onRetry={() => setFetchKey((prev) => prev + 1)} />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative grid w-full max-w-[480px] grid-cols-3 rounded-xl border border-gray-200 bg-gray-100 p-1">
          <div
            className="pointer-events-none absolute top-1 bottom-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-[9px] bg-white shadow-sm transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(calc(${activeFilterIndex} * 100%))` }}
          />
          {FILTER_TABS.map((tab) => {
            const count = tab.id === "semua" ? summary.semua : tab.id === "ada-catatan" ? summary["ada-catatan"] : summary["tanpa-catatan"]
            const isActive = filter === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as AssignmentFilter)}
                className={`relative z-10 flex items-center justify-center gap-2 rounded-[9px] px-3 py-2 text-[13px] font-semibold transition-colors ${
                  isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold transition-colors ${isActive ? "bg-gray-100 text-gray-700" : "text-gray-400"}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Cari pemda, aplikasi, catatan..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="rounded-xl border-gray-200 bg-white pl-9 focus-visible:ring-blue-500"
            />
          </div>

          <div className="hidden items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 sm:inline-flex">
            <BriefcaseBusiness className="h-4 w-4" />
            {summary.semua} tugas
          </div>
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
                  <th className="w-[48px] px-6 py-4 text-left font-semibold text-gray-500">No.</th>
                  <th className="w-[280px] px-6 py-4 text-left font-semibold text-gray-500">Pemda / Aplikasi</th>
                  <th className="w-[360px] px-6 py-4 text-left font-semibold text-gray-500">Catatan Atasan</th>
                  <th className="w-[170px] px-6 py-4 text-left font-semibold text-gray-500">Programmer</th>
                  <th className="w-[150px] px-6 py-4 text-left font-semibold text-gray-500">Ditugaskan</th>
                  <th className="w-[140px] px-6 py-4 text-left font-semibold text-gray-500">Deadline</th>
                  <th className="w-[120px] px-6 py-4 text-right font-semibold text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      Belum ada penugasan yang cocok dengan filter saat ini.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item, index) => {
                    const hasKomentar = Boolean(item.komentar)
                    const rowNumber = (currentPage - 1) * ITEMS_PER_PAGE + index + 1
                    const revisionInfo = revisionInfoByPenugasan.get(item.id)
                    const hasRevision = Boolean(revisionInfo)

                    return (
                      <tr
                        key={item.id}
                        className={`group cursor-pointer transition-colors ${hasRevision ? "bg-red-50/20 hover:bg-red-50/40" : "hover:bg-gray-50/50"}`}
                        onClick={() => openDetail(item)}
                      >
                        <td className="h-16 px-6">
                          <span className="text-sm font-semibold text-gray-400">{rowNumber}</span>
                        </td>

                        <td className="h-16 px-6">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-blue-50 text-sm font-bold text-blue-700">
                              {item.logo_pemda ? (
                                <div
                                  aria-label={item.nama_pemda}
                                  className="h-full w-full bg-cover bg-center"
                                  style={{ backgroundImage: `url(${item.logo_pemda})` }}
                                />
                              ) : (
                                item.nama_pemda.slice(0, 2).toUpperCase()
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="block truncate font-bold text-gray-900">{item.nama_pemda}</span>
                              <div className="mt-0.5 flex items-center gap-2">
                                <span className="block truncate text-xs font-medium text-gray-500">{item.aplikasi}</span>
                                {hasRevision ? (
                                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
                                    <AlertTriangle className="h-3 w-3" />
                                    {revisionInfo?.count && revisionInfo.count > 1 ? `Perlu revisi (${revisionInfo.count})` : "Perlu revisi"}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="h-16 px-6">
                          {hasKomentar ? (
                            <p className="max-w-[360px] truncate text-sm text-gray-600">{item.komentar}</p>
                          ) : hasRevision ? (
                            <span className="inline-flex rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                              Ada revisi dari verifikator
                            </span>
                          ) : (
                            <span className="inline-flex rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-500">
                              Tidak ada catatan
                            </span>
                          )}
                        </td>

                        <td className="h-16 px-6">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">{item.programmer_nama}</span>
                            <span className="text-xs text-gray-500">{item.programmer_username}</span>
                          </div>
                        </td>

                        <td className="h-16 px-6">
                          <span className="text-sm font-semibold text-gray-900">{formatDateTbl(item.created_at)}</span>
                        </td>

                        <td className="h-16 px-6">
                          {item.tanggal_deadline ? (() => {
                            const diff = new Date(item.tanggal_deadline).getTime() - Date.now()
                            const isOverdue = diff < 0
                            const isNear = diff >= 0 && diff < 3 * 24 * 60 * 60 * 1000
                            return (
                              <span className={`text-sm font-semibold ${isOverdue ? "text-red-600" : isNear ? "text-amber-600" : "text-gray-900"}`}>
                                {formatDateTbl(item.tanggal_deadline)}
                              </span>
                            )
                          })() : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>

                        <td className="h-16 px-6 text-right">
                          <div onClick={(event) => event.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`rounded-lg font-semibold ${hasRevision ? "text-red-600 hover:bg-red-50 hover:text-red-700" : "text-blue-600 hover:bg-blue-50 hover:text-blue-700"}`}
                              onClick={() => openDetail(item)}
                            >
                              {hasRevision ? "Tinjau Revisi" : "Detail"}
                              <ArrowRight className="h-4 w-4" />
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

          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/30 px-6 py-3">
            <p className="text-xs text-gray-500">
              Menampilkan {filteredItems.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)} dari {filteredItems.length} penugasan
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
        </div>
      )}

      <PenugasanDetailModal
        open={isModalOpen}
        onClose={closeDetail}
        item={selectedItem}
        mockLaporan={mockLaporan}
        onAddLaporan={handleAddLaporan}
        onUpdateLaporan={handleUpdateLaporan}
      />
    </div>
  )
}
