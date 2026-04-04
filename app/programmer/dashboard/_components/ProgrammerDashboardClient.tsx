// app/programmer/dashboard/_components/ProgrammerDashboardClient.tsx

"use client"

import { Fragment, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import {
  AlertTriangle,
  BadgeCheck,
  ClipboardList,
  Clock3,
  FileText,
  ListFilter,
  MessageSquareText,
} from "lucide-react"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { getLaporan } from "@/app/super-admin/laporan/services"
import type { LaporanResponse } from "@/app/super-admin/laporan/types"

type ReportStatus = "semua" | "menunggu" | "revisi" | "terverifikasi"

interface ProgrammerTaskItem {
  id: string
  pemda: string
  aplikasi: string
  menu: string
  kondisiAwal: string
  kondisiDiharapkan: string
  progress: string
  programmer: string
  status: string
  statusLabel: Exclude<ReportStatus, "semua">
  deadline: string
  createdAt: string
  updatedAt: string
}

function mapReportStatus(status?: string): Exclude<ReportStatus, "semua"> {
  const normalized = status?.toLowerCase()
  if (normalized === "hijau") return "terverifikasi"
  if (normalized === "kuning" || normalized === "merah") return "revisi"
  return "menunggu"
}

function formatDate(value?: string) {
  if (!value) return "-"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "-"

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
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

function getProgrammerName(item: LaporanResponse) {
  if (item.programmer?.full_name?.trim()) return item.programmer.full_name
  if (item.programmer?.username?.trim()) return item.programmer.username
  if (item.programmer?.id?.trim()) return `Programmer ${item.programmer.id.slice(0, 8)}`
  return "Belum ada programmer"
}

function getStatusBadge(status: Exclude<ReportStatus, "semua">) {
  if (status === "terverifikasi") {
    return <span className="inline-flex shrink-0 rounded-full bg-[#CCF0EB] px-2 py-1 text-[10px] font-bold text-[#00B69B]">Terverifikasi</span>
  }

  if (status === "revisi") {
    return <span className="inline-flex shrink-0 rounded-full bg-[#FDEDF5] px-2 py-1 text-[10px] font-bold text-[#E14C8E]">Perlu Revisi</span>
  }

  return <span className="inline-flex shrink-0 rounded-full bg-[#E4EBFA] px-2 py-1 text-[10px] font-bold text-[#123F84]">Menunggu Verifikasi</span>
}

function getProgressValue(status: Exclude<ReportStatus, "semua">) {
  if (status === "terverifikasi") return 100
  if (status === "revisi") return 55
  return 80
}

function getProgressColor(status: Exclude<ReportStatus, "semua">) {
  if (status === "terverifikasi") return "bg-[#00B69B]"
  if (status === "revisi") return "bg-[#FD5454]"
  return "bg-[#4F7DF3]"
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center rounded-[20px] border border-dashed border-[#D5D5D5] bg-white text-sm text-[#202224]/50">
      {label}
    </div>
  )
}

export default function ProgrammerDashboardClient() {
  const [items, setItems] = useState<ProgrammerTaskItem[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<ReportStatus>("semua")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await getLaporan()

        if (response.status !== 200) {
          throw new Error(response.data?.message || "Gagal memuat data laporan")
        }

        const mappedItems = (response.data?.data ?? []).map((item) => ({
          id: item.id,
          pemda: typeof item.permintaan?.pemda === "object" ? (item.permintaan.pemda as any)?.name ?? "-" : (item.permintaan?.pemda as any) ?? "-",
          aplikasi: typeof item.permintaan?.aplikasi === "object" ? (item.permintaan.aplikasi as any)?.name ?? "-" : (item.permintaan?.aplikasi as any) ?? "-",
          menu: item.permintaan?.menu ?? "-",
          kondisiAwal: item.permintaan?.kondisi_awal ?? "-",
          kondisiDiharapkan: item.permintaan?.kondisi_diharapkan ?? "-",
          progress: item.laporan_progress ?? "-",
          programmer: getProgrammerName(item),
          status: item.status ?? "putih",
          statusLabel: mapReportStatus(item.status),
          deadline: item.permintaan?.tanggal_deadline ?? "",
          createdAt: item.created_at ?? "",
          updatedAt: item.updated_at ?? "",
        }))

        mappedItems.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        setItems(mappedItems)
      } catch (error: any) {
        toast.error(error?.message || "Gagal memuat dashboard programmer")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, items.length])

  const summary = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.total += 1
        acc[item.statusLabel] += 1
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
    if (statusFilter === "semua") return items
    return items.filter((item) => item.statusLabel === statusFilter)
  }, [items, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage))
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredItems.slice(startIndex, startIndex + itemsPerPage)
  }, [currentPage, filteredItems])

  const visiblePages = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    if (currentPage <= 3) return [1, 2, 3, 4, totalPages]
    if (currentPage >= totalPages - 2) return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, currentPage - 1, currentPage, currentPage + 1, totalPages]
  }, [currentPage, totalPages])

  const latestActivity = items.slice(0, 6)
  const filterTabs: Array<{
    value: ReportStatus
    label: string
    count: number
    icon: typeof ListFilter
  }> = [
    { value: "semua", label: "Semua", count: items.length, icon: ListFilter },
    { value: "menunggu", label: "Menunggu", count: summary.menunggu, icon: ListFilter },
    { value: "revisi", label: "Revisi", count: summary.revisi, icon: ListFilter },
    { value: "terverifikasi", label: "Terverifikasi", count: summary.terverifikasi, icon: ListFilter },
  ]
  const activeTabIndex = Math.max(0, filterTabs.findIndex((tab) => tab.value === statusFilter))

  return (
    <div className="space-y-6 px-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-[#202224]">Dashboard</h1>
        <p className="text-sm text-[#202224]/60">
          Ringkasan pekerjaan programmer dari endpoint <code>/laporan</code>.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-4">
        <div className="rounded-[20px] bg-white p-6 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <p className="text-base font-semibold text-[#202224]/70">Total Laporan</p>
              <p className="mt-3 text-4xl font-bold text-[#202224]">{summary.total}</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E6E7FF]">
              <FileText className="h-7 w-7 text-[#6A63FF]" />
            </div>
          </div>
          <p className="text-sm font-semibold text-[#00B69B]">Semua laporan progres yang sudah dibuat.</p>
        </div>

        <div className="rounded-[20px] bg-white p-6 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <p className="text-base font-semibold text-[#202224]/70">Menunggu Verifikasi</p>
              <p className="mt-3 text-4xl font-bold text-[#202224]">{summary.menunggu}</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF1D8]">
              <Clock3 className="h-7 w-7 text-[#FF9F43]" />
            </div>
          </div>
          <p className="text-sm font-semibold text-[#202224]/70">Laporan aktif yang sedang menunggu pengecekan.</p>
        </div>

        <div className="rounded-[20px] bg-white p-6 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <p className="text-base font-semibold text-[#202224]/70">Perlu Revisi</p>
              <p className="mt-3 text-4xl font-bold text-[#202224]">{summary.revisi}</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFE5E5]">
              <AlertTriangle className="h-7 w-7 text-[#FD5454]" />
            </div>
          </div>
          <p className="text-sm font-semibold text-[#FD5454]">Perlu update lanjutan dari sisi programmer.</p>
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
          <p className="text-sm font-semibold text-[#00B69B]">Laporan yang sudah dinyatakan selesai.</p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <div className="rounded-[20px] bg-white p-6 shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-[#202224]">Tugas Aktif Saya</h2>
                <p className="text-sm text-[#202224]/55">Daftar laporan dari endpoint /laporan dengan filter status.</p>
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
                        isActive ? "text-[#202224]" : "text-[#202224]/70 hover:bg-white/60 hover:text-[#202224]",
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
              <EmptyState label="Memuat data laporan..." />
            ) : paginatedItems.length === 0 ? (
              <EmptyState label="Belum ada laporan untuk filter ini." />
            ) : (
              <div className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {paginatedItems.map((item, index) => {
                    const progressValue = getProgressValue(item.statusLabel)
                    const progressColor = getProgressColor(item.statusLabel)

                    return (
                      <div key={`${item.id}-${item.updatedAt}-${index}`} className="rounded-lg border border-[#EEF0F5] bg-white p-4 shadow-[0px_2px_8px_rgba(0,0,0,0.06)]">
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <div className="flex min-w-0 items-center gap-2">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F5F6FA] text-xs font-bold text-[#202224]">
                              {item.pemda.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-[#202224]">{item.pemda}</p>
                              <p className="truncate text-xs text-[#202224]/60">
                                {item.aplikasi.slice(0, 4)}...
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(item.statusLabel)}
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-[#FD5454]">
                            Deadline: {formatDate(item.deadline)}
                          </p>
                          <p className="line-clamp-2 text-xs text-[#202224]/70">{item.progress}</p>
                        </div>

                        <div className="mt-3">
                          <div className="h-2 overflow-hidden rounded-full bg-[#D9D9D9]">
                            <div
                              className={`h-full rounded-full ${progressColor} transition-all duration-300`}
                              style={{ width: `${progressValue}%` }}
                            />
                          </div>
                          <p className="mt-1 text-xs font-semibold text-[#202224]/60">
                            {progressValue}% progress
                          </p>
                        </div>

                        <div className="mt-3 space-y-0.5 text-xs text-[#202224]/65">
                          <p>
                            <span className="font-semibold text-[#202224]/80">Dibuat:</span> {formatDate(item.createdAt)}
                          </p>
                          <p>
                            <span className="font-semibold text-[#202224]/80">Diperbarui:</span> {formatDate(item.updatedAt)}
                          </p>
                          <p className="truncate">
                            <span className="font-semibold text-[#202224]/80">Programmer:</span> {item.programmer}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex flex-col gap-3 border-t border-[#F0F1F5] pt-4 md:flex-row md:items-center md:justify-between">
                  <p className="text-sm text-[#202224]/60">
                    Menampilkan {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredItems.length)} dari {filteredItems.length} data
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
              <ClipboardList className="h-6 w-6 text-[#5065F6]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#202224]">Aktivitas Terbaru</h2>
              <p className="text-sm text-[#202224]/55">Update laporan terbaru dari programmer.</p>
            </div>
          </div>

          {loading ? (
            <EmptyState label="Memuat aktivitas..." />
          ) : latestActivity.length === 0 ? (
            <EmptyState label="Belum ada aktivitas laporan." />
          ) : (
            <div className="space-y-4">
              {latestActivity.map((item, index) => (
                <div key={`${item.id}-${item.updatedAt}-activity-${index}`} className="flex items-start gap-3 rounded-2xl border border-[#F0F1F5] p-4">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5F6FA]">
                    <MessageSquareText className="h-5 w-5 text-[#202224]/70" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-6 text-[#202224]">
                      {item.pemda} - {item.menu}
                    </p>
                    <p className="text-sm text-[#202224]/65">
                      {item.statusLabel === "terverifikasi"
                        ? "Laporan sudah diverifikasi."
                        : item.statusLabel === "revisi"
                          ? "Laporan dikembalikan untuk revisi."
                          : "Laporan sedang menunggu proses verifikasi."}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm italic text-[#5065F6]">"{item.progress}"</p>
                    <p className="mt-1 text-sm text-[#202224]/65">
                      Programmer: {item.programmer}
                    </p>
                    <p className="mt-2 text-xs text-[#202224]/45">{formatDateTime(item.updatedAt)}</p>
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
