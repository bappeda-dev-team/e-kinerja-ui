"use client"

import { useEffect, useMemo, useState, Fragment } from "react"
import { toast } from "sonner"
import { Send, Loader2, ClipboardList, Plus } from "lucide-react"
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"

import DistribusiModal from "./modals/DistribusiModal"
import AddPermintaan from "@/app/super-admin/permintaan/_components/modals/AddPermintaan"
import {
  getPermintaan,
  getDistribusi,
  createDistribusi,
  updateDistribusi,
  createPermintaan,
  updatePermintaan,
  deletePermintaan,
  uploadPermintaanAttachment,
  getMasterPemda,
} from "../services"
import type { PermintaanResponse, DistribusiResponse } from "@/app/super-admin/distribusi/types"
import type { PermintaanRequest, PermintaanResponse as PermintaanResponseFull } from "@/app/super-admin/permintaan/types"
import { NetworkError } from "@/components/network-error"

function formatTgl(dateStr?: string) {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
  })
}

function PemdaAvatar({ nama, logo }: { nama: string; logo?: string }) {
  if (logo) {
    return (
      <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
        <img src={logo} alt={nama} className="w-full h-full object-contain p-0.5" />
      </div>
    )
  }
  const initials = nama?.slice(0, 2).toUpperCase() ?? "PE"
  return (
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center shrink-0 shadow-sm">
      <span className="text-[10px] font-bold text-white">{initials}</span>
    </div>
  )
}

function StatusBadge({ sudahDistribusi }: { sudahDistribusi: boolean }) {
  if (sudahDistribusi) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Sudah Didistribusikan
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      Belum Didistribusikan
    </span>
  )
}

interface PermintaanRow {
  id: string
  nama_pemda: string
  logo_pemda?: string
  aplikasi: string
  menu: string
  kondisi_awal: string
  kondisi_diharapkan: string
  deadline: string
  sudahDistribusi: boolean
  distribusiId?: string
  raw: PermintaanResponseFull
}

export default function AdminPermintaanClient() {
  const [rows, setRows] = useState<PermintaanRow[]>([])
  const [loading, setLoading] = useState(true)
  const [networkError, setNetworkError] = useState(false)
  const [fetchKey, setFetchKey] = useState(0)
  const [distribusiTarget, setDistribusiTarget] = useState<PermintaanRow | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState<PermintaanResponseFull | null>(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  const fetchAll = async () => {
    try {
      setLoading(true)
      setNetworkError(false)
      const [permRes, distRes] = await Promise.all([getPermintaan(), getDistribusi()])
      if (permRes.status === 0 || distRes.status === 0) {
        setNetworkError(true)
        return
      }

      const distribusiMap = new Map<string, string>()
      ;(distRes.data?.data ?? []).forEach((d: DistribusiResponse) => {
        if (d.permintaan?.id) distribusiMap.set(d.permintaan.id, d.id)
      })

      const mapped: PermintaanRow[] = (permRes.data?.data ?? []).map((p: PermintaanResponse) => ({
        id: p.id,
        nama_pemda: typeof p.pemda === "object" ? p.pemda?.name ?? "-" : (p.pemda as any) ?? "-",
        logo_pemda: typeof p.pemda === "object" ? p.pemda?.logo : undefined,
        aplikasi: typeof p.aplikasi === "object" ? p.aplikasi?.name ?? "-" : (p.aplikasi as any) ?? "-",
        menu: p.menu ?? "-",
        kondisi_awal: p.kondisi_awal ?? "-",
        kondisi_diharapkan: p.kondisi_diharapkan ?? "-",
        deadline: p.tanggal_deadline ?? "",
        sudahDistribusi: distribusiMap.has(p.id),
        distribusiId: distribusiMap.get(p.id),
        raw: p as unknown as PermintaanResponseFull,
      }))

      mapped.sort((a, b) => {
        if (a.sudahDistribusi !== b.sudahDistribusi) return a.sudahDistribusi ? 1 : -1
        return 0
      })

      setRows(mapped)
    } catch {
      toast.error("Gagal memuat data permintaan")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [fetchKey])

  const handleAddPermintaan = async (val: PermintaanRequest, files: File[]) => {
    try {
      setSubmitLoading(true)
      const res = await createPermintaan(val)
      if (res.status === 200 || res.status === 201) {
        const newId = res.data?.data?.id
        if (files.length > 0 && newId) {
          try { await uploadPermintaanAttachment(newId, files) } catch { toast.error("Lampiran gagal diunggah") }
        }
        toast.success("Permintaan berhasil ditambahkan")
        setShowAdd(false)
        fetchAll()
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal menambah permintaan")
    } finally { setSubmitLoading(false) }
  }

  const handleEditPermintaan = async (val: PermintaanRequest, files: File[], id?: string) => {
    if (!id) return
    try {
      setSubmitLoading(true)
      const res = await updatePermintaan(id, val)
      if (res.status === 200) {
        if (files.length > 0) {
          try { await uploadPermintaanAttachment(id, files) } catch { toast.error("Lampiran gagal diperbarui") }
        }
        toast.success("Permintaan berhasil diperbarui")
        setEditItem(null)
        fetchAll()
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui permintaan")
    } finally { setSubmitLoading(false) }
  }

  const handleDeletePermintaan = async (id: string) => {
    try {
      await deletePermintaan(id)
      toast.success("Permintaan berhasil dihapus")
      fetchAll()
    } catch { toast.error("Gagal menghapus permintaan") }
  }

  const handleDistribusi = async (val: { programmer_ids: string[]; komentar: string }) => {
    if (!distribusiTarget) return
    try {
      setSubmitLoading(true)
      const payload = {
        permintaan_id: distribusiTarget.id,
        komentar: val.komentar,
        programmer_ids: val.programmer_ids,
      }

      let res
      if (distribusiTarget.distribusiId) {
        res = await updateDistribusi(distribusiTarget.distribusiId, payload)
      } else {
        res = await createDistribusi(payload)
      }

      if (res.status === 200 || res.status === 201) {
        toast.success(
          distribusiTarget.distribusiId
            ? "Distribusi berhasil diperbarui"
            : "Distribusi pekerjaan berhasil dibuat"
        )
        setDistribusiTarget(null)
        fetchAll()
      } else {
        throw new Error("Gagal menyimpan distribusi")
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan distribusi")
    } finally {
      setSubmitLoading(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage))

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return rows.slice(start, start + rowsPerPage)
  }, [rows, currentPage])

  const visiblePages = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage <= 3) return [1, 2, 3, 4, totalPages]
    if (currentPage >= totalPages - 2) return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, currentPage - 1, currentPage, currentPage + 1, totalPages]
  }, [currentPage, totalPages])

  if (networkError) {
    return <NetworkError onRetry={() => setFetchKey((k) => k + 1)} />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-nunito text-[2.1rem] leading-tight font-bold text-[#202224] sm:text-3xl">
            Permintaan Klien
          </h2>
          <p className="text-sm text-[#797A7C]">Daftar semua permintaan dan status pendistribusiannya.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4880FF] px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_0_rgba(72,128,255,0.39)] transition hover:bg-blue-600 active:scale-95 shrink-0"
        >
          <Plus className="size-4" /> Tambah Permintaan
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-[6px_6px_54px_rgba(0,0,0,0.05)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="size-8 animate-spin text-[#4880FF]" />
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-sm text-[#202224]/40">
            <ClipboardList className="size-10 text-gray-200 mb-3" />
            Belum ada data permintaan.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-xs uppercase font-semibold text-gray-500 w-8">No.</th>
                    <th className="text-left px-4 py-3 text-xs uppercase font-semibold text-gray-500">Pemda</th>
                    <th className="text-left px-4 py-3 text-xs uppercase font-semibold text-gray-500">Aplikasi</th>
                    <th className="text-left px-4 py-3 text-xs uppercase font-semibold text-gray-500">Menu</th>
                    <th className="text-left px-4 py-3 text-xs uppercase font-semibold text-gray-500">Deadline</th>
                    <th className="text-center px-4 py-3 text-xs uppercase font-semibold text-gray-500">Status</th>
                    <th className="text-center px-4 py-3 text-xs uppercase font-semibold text-gray-500 w-[220px]">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.map((row, i) => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 py-3.5 text-xs text-[#202224]/40">
                        {(currentPage - 1) * rowsPerPage + i + 1}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <PemdaAvatar nama={row.nama_pemda} logo={row.logo_pemda} />
                          <span className="font-semibold text-xs text-[#202224]">{row.nama_pemda}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-[#797A7C]">{row.aplikasi}</td>
                      <td className="px-4 py-3.5 text-xs text-[#797A7C] max-w-[200px]">
                        <span className="line-clamp-2">{row.menu}</span>
                      </td>
                      <td className="px-4 py-3.5 text-xs font-semibold text-red-500">
                        {formatTgl(row.deadline)}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <StatusBadge sudahDistribusi={row.sudahDistribusi} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setEditItem(row.raw)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 bg-white border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePermintaan(row.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 bg-white border border-red-100 text-red-500 hover:bg-red-50"
                          >
                            Hapus
                          </button>
                          <button
                            onClick={() => setDistribusiTarget(row)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 bg-[#4880FF] text-white hover:bg-blue-600 shadow-[0_2px_8px_rgba(72,128,255,0.3)]"
                          >
                            <Send className="size-3" />
                            {row.sudahDistribusi ? "Edit Distribusi" : "Distribusikan"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-[#202224]/60">
                Menampilkan {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, rows.length)} dari {rows.length} data
              </p>
              <Pagination className="mx-0 w-auto justify-start md:justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage - 1) }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {visiblePages.map((page, index) => {
                    const prev = visiblePages[index - 1]
                    return (
                      <Fragment key={page}>
                        {prev && page - prev > 1 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === page}
                            onClick={(e) => { e.preventDefault(); setCurrentPage(page) }}
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
                      onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(currentPage + 1) }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </div>

      {distribusiTarget && (
        <DistribusiModal
          item={distribusiTarget}
          onClose={() => setDistribusiTarget(null)}
          onSave={handleDistribusi}
          loading={submitLoading}
        />
      )}

      {(showAdd || editItem) && (
        <AddPermintaan
          initialData={editItem || undefined}
          onClose={() => { setShowAdd(false); setEditItem(null) }}
          onSave={editItem ? handleEditPermintaan : handleAddPermintaan}
        />
      )}
    </div>
  )
}
