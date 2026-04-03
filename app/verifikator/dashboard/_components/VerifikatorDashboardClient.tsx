"use client"

import { Fragment, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { BadgeCheck, ClipboardList, Clock3, FileSearch, ListFilter, MessageSquareText } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { getVerifikasi } from "@/app/super-admin/verifikasi/_services"
import type { VerifikasiResponse } from "@/app/super-admin/verifikasi/_types"

type DashboardStatus = "menunggu" | "revisi" | "terverifikasi"
type StatusFilter = "all" | DashboardStatus

interface DashboardVerifikasiItem {
  id: string
  status: DashboardStatus
  laporanId: string
  laporanStatus: string
  progress: string
  komentar: string
  verifikator: string
  programmer: string
  diajukanPada: string
  diperbaruiPada: string
}

function mapStatus(item: VerifikasiResponse): DashboardStatus {
  if (item.status_verified === "approved") return "terverifikasi"
  if (item.status_verified === "revision") return "revisi"
  if (item.status_verified === "pending" && item.komentar) return "revisi"
  return "menunggu"
}

function getProgrammerLabel(item: VerifikasiResponse) {
  const programmer = item.laporan?.programmer

  if (programmer?.full_name?.trim()) return programmer.full_name
  if (programmer?.username?.trim()) return programmer.username
  if (programmer?.id?.trim()) return `Programmer ${programmer.id.slice(0, 8)}`

  return "Belum ada programmer"
}

function formatDate(value?: string) {
  if (!value) return "-"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "-"

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

function formatDateTime(value?: string) {
  if (!value) return "-"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "-"

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function statusBadge(status: DashboardStatus) {
  if (status === "menunggu") {
    return <span className="inline-flex rounded-full bg-[#E4EBFA] px-3 py-1 text-xs font-bold text-[#123F84]">Menunggu</span>
  }

  if (status === "revisi") {
    return <span className="inline-flex rounded-full bg-[#FDEDF5] px-3 py-1 text-xs font-bold text-[#E14C8E]">Revisi</span>
  }

  return <span className="inline-flex rounded-full bg-[#CCF0EB] px-3 py-1 text-xs font-bold text-[#00B69B]">Terverifikasi</span>
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-[20px] border border-dashed border-[#D5D5D5] bg-white text-sm text-[#202224]/50">
      {label}
    </div>
  )
}

export default function VerifikatorDashboardClient() {
  const [items, setItems] = useState<DashboardVerifikasiItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const rowsPerPage = 5

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const response = await getVerifikasi()
        if (response.status !== 200) {
          throw new Error(response.data?.message || "Gagal memuat data verifikasi")
        }

        const rawItems = response.data?.data ?? []
        const mappedItems = rawItems.map((item) => {
          return {
            id: item.id,
            status: mapStatus(item),
            laporanId: item.laporan?.id ?? "-",
            laporanStatus: item.laporan?.status ?? "-",
            progress: item.laporan?.laporan_progress ?? "-",
            komentar: item.komentar ?? "",
            verifikator: item.verifikator?.full_name ?? "-",
            programmer: getProgrammerLabel(item),
            diajukanPada: item.created_at,
            diperbaruiPada: item.updated_at,
          }
        })

        mappedItems.sort((a, b) => new Date(b.diajukanPada).getTime() - new Date(a.diajukanPada).getTime())
        setItems(mappedItems)
      } catch (error: any) {
        toast.error(error?.message || "Gagal memuat dashboard verifikator")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [items.length, statusFilter])

  const summary = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.total += 1
        acc[item.status] += 1
        return acc
      },
      {
        total: 0,
        menunggu: 0,
        revisi: 0,
        terverifikasi: 0,
      }
    )
  }, [items])

  const filteredItems = useMemo(() => {
    if (statusFilter === "all") return items
    return items.filter((item) => item.status === statusFilter)
  }, [items, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / rowsPerPage))
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage
    return filteredItems.slice(startIndex, startIndex + rowsPerPage)
  }, [currentPage, filteredItems])

  const visiblePages = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, totalPages]
    }

    if (currentPage >= totalPages - 2) {
      return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }

    return [1, currentPage - 1, currentPage, currentPage + 1, totalPages]
  }, [currentPage, totalPages])

  const latestActivity = items
    .slice()
    .sort((a, b) => new Date(b.diperbaruiPada).getTime() - new Date(a.diperbaruiPada).getTime())
    .slice(0, 6)

  const filterTabs: Array<{
    value: StatusFilter
    label: string
    count: number
    icon: typeof ListFilter
  }> = [
    { value: "all", label: "Semua", count: items.length, icon: ListFilter },
    { value: "menunggu", label: "Menunggu", count: summary.menunggu, icon: ListFilter },
    { value: "revisi", label: "Revisi", count: summary.revisi, icon: ListFilter },
    { value: "terverifikasi", label: "Terverifikasi", count: summary.terverifikasi, icon: ListFilter },
  ]
  const activeTabIndex = Math.max(
    0,
    filterTabs.findIndex((tab) => tab.value === statusFilter)
  )

  return (
    <div className="space-y-6 px-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-[#202224]">Dashboard</h1>
        <p className="text-sm text-[#202224]/60">
          Ringkasan antrean verifikasi dan aktivitas terbaru dari endpoint <code>/verifikasi</code>.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-[20px] bg-white p-6 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <p className="text-base font-semibold text-[#202224]/70">Menunggu Verifikasi</p>
                  <p className="mt-3 text-4xl font-bold text-[#202224]">{summary.menunggu}</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E4EBFA]">
                  <ClipboardList className="h-7 w-7 text-[#5065F6]" />
                </div>
              </div>
              <p className="text-sm font-semibold text-[#FD5454]">
                {summary.menunggu > 0 ? "Perlu ditindaklanjuti segera." : "Tidak ada antrean baru."}
              </p>
            </div>

            <div className="rounded-[20px] bg-white p-6 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <p className="text-base font-semibold text-[#202224]/70">Sedang Direvisi</p>
                  <p className="mt-3 text-4xl font-bold text-[#202224]">{summary.revisi}</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF1D8]">
                  <Clock3 className="h-7 w-7 text-[#FF9F43]" />
                </div>
              </div>
              <p className="text-sm font-semibold text-[#202224]/70">Menunggu perbaikan dari programmer.</p>
            </div>

            <div className="rounded-[20px] bg-white p-6 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <p className="text-base font-semibold text-[#202224]/70">Terverifikasi</p>
                  <p className="mt-3 text-4xl font-bold text-[#202224]">{summary.terverifikasi}</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D9F7E8]">
                  <BadgeCheck className="h-7 w-7 text-[#00B69B]" />
                </div>
              </div>
              <p className="text-sm font-semibold text-[#00B69B]">
                {summary.terverifikasi > 0 ? "Laporan yang sudah disetujui." : "Belum ada laporan selesai."}
              </p>
            </div>
          </div>

          <div className="rounded-[20px] bg-white p-6 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-[#202224]">Antrean Verifikasi</h2>
                <p className="text-sm text-[#202224]/55">Daftar pengajuan verifikasi dengan pagination shadcn.</p>
              </div>
              <div className="rounded-full bg-[#F5F6FA] px-3 py-1 text-sm font-bold text-[#202224]/70">
                Total {summary.total}
              </div>
            </div>

            <div className="mb-5 overflow-x-auto">
              <div className="relative inline-flex min-w-max rounded-[22px] bg-[#EDEFF5] p-1.5 shadow-inner">
                <div
                  aria-hidden="true"
                  className="absolute top-1.5 bottom-1.5 rounded-[18px] bg-white shadow-[0_4px_18px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out"
                  style={{
                    width: `calc((100% - 0.75rem) / ${filterTabs.length})`,
                    transform: `translateX(${activeTabIndex * 100}%)`,
                  }}
                />
              {filterTabs.map((tab) => {
                const Icon = tab.icon
                const isActive = statusFilter === tab.value

                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setStatusFilter(tab.value)}
                    className={[
                      "relative z-10 inline-flex flex-1 items-center justify-center gap-2 rounded-[18px] px-5 py-3 text-sm font-bold transition-colors duration-200",
                      isActive
                        ? "text-[#202224]"
                        : "text-[#202224]/70 hover:bg-white/60 hover:text-[#202224]",
                    ].join(" ")}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                    <span className="ml-1">({tab.count})</span>
                  </button>
                )
              })}
              </div>
            </div>

            {loading ? (
              <EmptyState label="Memuat data antrean..." />
            ) : paginatedItems.length === 0 ? (
              <EmptyState label="Belum ada data verifikasi untuk filter ini." />
            ) : (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-0 bg-[#F5F6FA] hover:bg-[#F5F6FA]">
                      <TableHead className="h-12 px-5 text-sm font-bold text-[#202224]">Status</TableHead>
                      <TableHead className="h-12 px-5 text-sm font-bold text-[#202224]">Programmer</TableHead>
                      <TableHead className="h-12 px-5 text-sm font-bold text-[#202224]">Status Laporan</TableHead>
                      <TableHead className="h-12 px-5 text-sm font-bold text-[#202224]">Ringkasan Progress</TableHead>
                      <TableHead className="h-12 px-5 text-sm font-bold text-[#202224]">Diajukan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedItems.map((item) => (
                      <TableRow key={item.id} className="border-[#F0F1F5] hover:bg-[#FAFBFD]">
                        <TableCell className="px-5 py-4">{statusBadge(item.status)}</TableCell>
                        <TableCell className="px-5 py-4 font-semibold text-[#202224]">{item.programmer}</TableCell>
                        <TableCell className="px-5 py-4 text-[#202224]/75">{item.laporanStatus}</TableCell>
                        <TableCell className="max-w-[320px] px-5 py-4 whitespace-normal text-[#202224]/75">
                          {item.progress}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-[#202224]/60">{formatDate(item.diajukanPada)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex flex-col gap-3 border-t border-[#F0F1F5] pt-4 md:flex-row md:items-center md:justify-between">
                  <p className="text-sm text-[#202224]/60">
                    Menampilkan {(currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, filteredItems.length)} dari {filteredItems.length} data
                  </p>

                  <Pagination className="mx-0 w-auto justify-start md:justify-end">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(event) => {
                            event.preventDefault()
                            if (currentPage > 1) setCurrentPage(currentPage - 1)
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>

                      {visiblePages.map((page, index) => {
                        const previousPage = visiblePages[index - 1]
                        const showEllipsis = previousPage && page - previousPage > 1

                        return (
                          <Fragment key={page}>
                            {showEllipsis ? (
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                            ) : null}
                            <PaginationItem>
                              <PaginationLink
                                href="#"
                                isActive={currentPage === page}
                                onClick={(event) => {
                                  event.preventDefault()
                                  setCurrentPage(page)
                                }}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          </Fragment>
                        )
                      })}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(event) => {
                            event.preventDefault()
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                          }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[20px] bg-white p-6 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF3FF]">
              <FileSearch className="h-6 w-6 text-[#5065F6]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#202224]">Aktivitas Terbaru</h2>
              <p className="text-sm text-[#202224]/55">Perubahan status terbaru dari data verifikasi.</p>
            </div>
          </div>

          {loading ? (
            <EmptyState label="Memuat aktivitas..." />
          ) : latestActivity.length === 0 ? (
            <EmptyState label="Belum ada aktivitas verifikasi." />
          ) : (
            <div className="space-y-4">
              {latestActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3 rounded-2xl border border-[#F0F1F5] p-4">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5F6FA]">
                    <MessageSquareText className="h-5 w-5 text-[#202224]/70" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-6 text-[#202224]">
                      Laporan {item.laporanId}
                    </p>
                    <p className="text-sm text-[#202224]/65">
                      {item.status === "terverifikasi"
                        ? "Laporan sudah diverifikasi."
                        : item.status === "revisi"
                          ? "Laporan dikembalikan untuk revisi."
                          : "Laporan masih menunggu proses verifikasi."}
                    </p>
                    <p className="mt-1 text-sm text-[#202224]/65">
                      Programmer: {item.programmer} • Verifikator: {item.verifikator}
                    </p>
                    {item.komentar ? (
                      <p className="mt-1 line-clamp-2 text-sm italic text-[#5065F6]">"{item.komentar}"</p>
                    ) : null}
                    <p className="mt-2 text-xs text-[#202224]/45">{formatDateTime(item.diperbaruiPada)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
